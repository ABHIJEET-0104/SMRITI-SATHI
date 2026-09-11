-- Update language check constraint on public.profiles to include Bengali ('bn') and Mizo ('lus')
DO $$
BEGIN
  -- Drop existing language check constraint if it exists
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_language_check;

  -- Add updated check constraint allowing all six languages
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_language_check
    CHECK (language IN ('en', 'hi', 'mr', 'as', 'bn', 'lus'));
END $$;
