-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'elderly' CHECK (role IN ('elderly','caregiver')),
  age INT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','hi','mr','as')),
  photo_url TEXT,
  care_code TEXT UNIQUE,
  caregiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access(_target UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _target = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = _target AND p.caregiver_id = auth.uid()
  );
$$;

CREATE POLICY "read accessible profiles" ON public.profiles FOR SELECT TO authenticated USING (public.can_access(id));
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r TEXT;
BEGIN
  r := COALESCE(NEW.raw_user_meta_data->>'role', 'elderly');
  IF r NOT IN ('elderly','caregiver') THEN r := 'elderly'; END IF;
  INSERT INTO public.profiles (id, full_name, role, age, language, care_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    r,
    NULLIF(NEW.raw_user_meta_data->>'age','')::INT,
    COALESCE(NEW.raw_user_meta_data->>'language','en'),
    CASE WHEN r = 'elderly' THEN upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 6)) ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- link caregiver by care code
CREATE OR REPLACE FUNCTION public.link_elderly_by_code(_code TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'caregiver') THEN
    RAISE EXCEPTION 'Only caregivers can link a care code';
  END IF;
  SELECT id INTO target FROM public.profiles WHERE care_code = upper(trim(_code)) AND role = 'elderly';
  IF target IS NULL THEN RAISE EXCEPTION 'No elderly profile found for that care code'; END IF;
  UPDATE public.profiles SET caregiver_id = auth.uid(), updated_at = now() WHERE id = target;
  RETURN target;
END;
$$;

-- family members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible family" ON public.family_members FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));

-- game sessions (session + result, idempotent by session_id)
CREATE TABLE public.game_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy',
  score INT NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,4) NOT NULL DEFAULT 0,
  mistakes INT NOT NULL DEFAULT 0,
  response_time_ms INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_sessions TO authenticated;
GRANT ALL ON public.game_sessions TO service_role;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible sessions" ON public.game_sessions FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));
CREATE INDEX game_sessions_user_played_idx ON public.game_sessions (user_id, played_at DESC);

-- difficulty recommendations
CREATE TABLE public.difficulty_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  recommended_difficulty TEXT NOT NULL,
  reason TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.difficulty_recommendations TO authenticated;
GRANT ALL ON public.difficulty_recommendations TO service_role;
ALTER TABLE public.difficulty_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible recommendations" ON public.difficulty_recommendations FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));

-- reminders
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  scheduled_time TIME NOT NULL DEFAULT '09:00',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible reminders" ON public.reminders FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));

CREATE TABLE public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT current_date,
  status TEXT NOT NULL DEFAULT 'acknowledged' CHECK (status IN ('acknowledged','missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reminder_id, log_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminder_logs TO authenticated;
GRANT ALL ON public.reminder_logs TO service_role;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible reminder logs" ON public.reminder_logs FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));

-- alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage accessible alerts" ON public.alerts FOR ALL TO authenticated
  USING (public.can_access(user_id)) WITH CHECK (public.can_access(user_id));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();