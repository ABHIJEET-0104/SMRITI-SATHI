/**
 * Server API for Smriti Sathi. Every function runs as the signed-in user,
 * so row-level security decides whether a caregiver may read or write a
 * given elderly person's data.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  calculateTrend,
  recommendDifficulty,
  type SessionMeasurement,
} from "./performance";

type Ctx = { supabase: any; userId: string };

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/* ---------------------------------------------------------------- profile */

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as Ctx;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    fail(error);

    let people: any[] = [];
    if (profile?.role === "caregiver") {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("caregiver_id", userId)
        .order("created_at");
      people = data ?? [];
    } else if (profile?.caregiver_id) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", profile.caregiver_id)
        .maybeSingle();
      profile.caregiver = data ?? null;
    }
    return { profile, people };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { full_name?: string; age?: number | null; language?: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as Ctx;
    const patch: Record<string, unknown> = {};
    if (typeof data.full_name === "string") patch["full_name"] = data.full_name.trim();
    if (data.age === null || typeof data.age === "number") patch["age"] = data.age;
    if (data.language && ["en", "hi", "mr", "as", "bn", "lus"].includes(data.language))
      patch["language"] = data.language;
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .maybeSingle();
    fail(error);
    return profile;
  });

export const linkElderly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string }) => {
    if (!input?.code || input.code.trim().length < 4) throw new Error("Enter a valid care code");
    return { code: input.code.trim() };
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { data: id, error } = await supabase.rpc("link_elderly_by_code", { _code: data.code });
    fail(error);
    return { user_id: id as string };
  });

/* ---------------------------------------------------------------- family */

export const listFamily = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { data: rows, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("user_id", data.user_id)
      .order("created_at");
    fail(error);
    if (rows && rows.length > 0) return rows;

    // Fallback: If user_id is a caregiver, try to fetch family for their linked elder
    const { data: elderProfiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("caregiver_id", data.user_id)
      .limit(1);

    if (elderProfiles && elderProfiles.length > 0) {
      const { data: elderRows } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", elderProfiles[0].id)
        .order("created_at");
      if (elderRows && elderRows.length > 0) return elderRows;
    }

    // Fallback: If user_id is an elder with a caregiver_id, also check if any family members were uploaded under caregiver_id
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("caregiver_id")
      .eq("id", data.user_id)
      .maybeSingle();

    if (myProfile?.caregiver_id) {
      const { data: caregiverRows } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", myProfile.caregiver_id)
        .order("created_at");
      if (caregiverRows && caregiverRows.length > 0) return caregiverRows;
    }

    return [];
  });

export const saveFamilyMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id?: string;
      user_id: string;
      name: string;
      relationship: string;
      photo_url?: string | null;
    }) => {
      if (!input.name?.trim()) throw new Error("Name is required");
      if (!input.relationship?.trim()) throw new Error("Relationship is required");
      return input;
    },
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const row = {
      user_id: data.user_id,
      name: data.name.trim(),
      relationship: data.relationship.trim(),
      photo_url: data.photo_url ?? null,
    };
    const query = data.id
      ? supabase.from("family_members").update(row).eq("id", data.id).select().maybeSingle()
      : supabase.from("family_members").insert(row).select().maybeSingle();
    const { data: saved, error } = await query;
    fail(error);
    return saved;
  });

export const deleteFamilyMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { error } = await supabase.from("family_members").delete().eq("id", data.id);
    fail(error);
    return { ok: true };
  });

/* ---------------------------------------------------- game results & sync */

const SESSION_FIELDS = [
  "session_id",
  "user_id",
  "game_id",
  "difficulty",
  "score",
  "accuracy",
  "mistakes",
  "response_time_ms",
  "total_questions",
  "correct_answers",
  "played_at",
] as const;

function normalizeSession(raw: any) {
  const row: Record<string, unknown> = {};
  for (const key of SESSION_FIELDS) row[key] = raw?.[key];
  if (!row["session_id"]) throw new Error("session_id is required");
  if (!row["user_id"]) throw new Error("user_id is required");
  row["played_at"] = row["played_at"] ?? new Date().toISOString();
  return row;
}

/**
 * Idempotent result sync. A session_id that already exists is reported as
 * `already_synced` and never inserted twice, so retries after a flaky
 * network cannot duplicate scores.
 */
export const syncGameResults = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { sessions: any[] }) => {
    if (!Array.isArray(input?.sessions)) throw new Error("sessions must be an array");
    return { sessions: input.sessions.map(normalizeSession) };
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const results: { session_id: string; status: "synced" | "already_synced" }[] = [];

    const ids = data.sessions.map((s) => s["session_id"] as string);
    const { data: existing } = await supabase
      .from("game_sessions")
      .select("session_id")
      .in("session_id", ids);
    const known = new Set((existing ?? []).map((r: any) => r.session_id));

    const toInsert = data.sessions.filter((s) => !known.has(s["session_id"]));
    if (toInsert.length > 0) {
      const { error } = await supabase
        .from("game_sessions")
        .upsert(toInsert, { onConflict: "session_id", ignoreDuplicates: true });
      fail(error);
    }
    for (const session of data.sessions) {
      results.push({
        session_id: session["session_id"] as string,
        status: known.has(session["session_id"]) ? "already_synced" : "synced",
      });
    }
    return { results };
  });

export const listGameResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string; limit?: number }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { data: rows, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("user_id", data.user_id)
      .order("played_at", { ascending: false })
      .limit(data.limit ?? 40);
    fail(error);
    return (rows ?? []) as SessionMeasurement[];
  });

/* -------------------------------------------- adaptive difficulty & trend */

export const recommendNextDifficulty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string; game_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { data: rows } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("user_id", data.user_id)
      .eq("game_id", data.game_id)
      .order("played_at", { ascending: false })
      .limit(5);
    const recommendation = recommendDifficulty((rows ?? []) as SessionMeasurement[], data.game_id);
    await supabase.from("difficulty_recommendations").insert({
      user_id: data.user_id,
      game_id: data.game_id,
      recommended_difficulty: recommendation.recommended_difficulty,
      reason: recommendation.reason,
      confidence: recommendation.confidence,
    });
    return recommendation;
  });

export const getPerformanceTrend = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { data: rows, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("user_id", data.user_id)
      .order("played_at", { ascending: false })
      .limit(30);
    fail(error);
    return calculateTrend((rows ?? []) as SessionMeasurement[]);
  });

/* ------------------------------------------------------------- reminders */

export const listReminders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const [{ data: reminders, error }, { data: logs }] = await Promise.all([
      supabase
        .from("reminders")
        .select("*")
        .eq("user_id", data.user_id)
        .order("scheduled_time"),
      supabase
        .from("reminder_logs")
        .select("*")
        .eq("user_id", data.user_id)
        .order("log_date", { ascending: false })
        .limit(60),
    ]);
    fail(error);
    return { reminders: reminders ?? [], logs: logs ?? [] };
  });

export const saveReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id?: string;
      user_id: string;
      title: string;
      category: string;
      scheduled_time: string;
      active?: boolean;
    }) => {
      if (!input.title?.trim()) throw new Error("Title is required");
      return input;
    },
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const row = {
      user_id: data.user_id,
      title: data.title.trim(),
      category: data.category || "custom",
      scheduled_time: data.scheduled_time || "09:00",
      active: data.active ?? true,
    };
    const query = data.id
      ? supabase.from("reminders").update(row).eq("id", data.id).select().maybeSingle()
      : supabase.from("reminders").insert(row).select().maybeSingle();
    const { data: saved, error } = await query;
    fail(error);
    return saved;
  });

export const deleteReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { error } = await supabase.from("reminders").delete().eq("id", data.id);
    fail(error);
    return { ok: true };
  });

export const acknowledgeReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const { error } = await supabase.from("reminder_logs").upsert(
      {
        reminder_id: data.id,
        user_id: data.user_id,
        status: "acknowledged",
        log_date: new Date().toISOString().slice(0, 10),
      },
      { onConflict: "reminder_id,log_date" },
    );
    fail(error);
    return { ok: true };
  });

/* ---------------------------------------------------------------- notes */

/** Informational notes for the caregiver, derived from games and reminders. */
export const listNotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const today = new Date().toISOString().slice(0, 10);
    const notes: { message: string; kind: string }[] = [];

    const [{ data: reminders }, { data: logs }, { data: sessions }] = await Promise.all([
      supabase.from("reminders").select("id").eq("user_id", data.user_id).eq("active", true),
      supabase
        .from("reminder_logs")
        .select("reminder_id, status")
        .eq("user_id", data.user_id)
        .eq("log_date", today),
      supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", data.user_id)
        .order("played_at", { ascending: false })
        .limit(30),
    ]);

    const acknowledged = new Set(
      (logs ?? []).filter((l: any) => l.status === "acknowledged").map((l: any) => l.reminder_id),
    );
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const missed = (reminders ?? []).filter((r: any) => !acknowledged.has(r.id)).length;
    if (missed > 0 && nowMinutes > 20 * 60) {
      notes.push({
        message: `${missed} reminder${missed === 1 ? " was" : "s were"} not marked done today.`,
        kind: "reminder",
      });
    }

    const trend = calculateTrend((sessions ?? []) as SessionMeasurement[]);
    if (trend.games_completed >= 4 && trend.trend !== "stable") {
      notes.push({
        message:
          trend.trend === "improving"
            ? "Game performance improved compared with recent sessions."
            : "Game performance changed compared with recent sessions.",
        kind: "performance",
      });
    }
    if (trend.games_completed === 0) {
      notes.push({ message: "No games have been played yet.", kind: "info" });
    }

    const { data: stored } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", data.user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    return { notes, stored: stored ?? [] };
  });

/* ------------------------------------------------------------ demo data */

export const seedDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context as Ctx;
    const userId = data.user_id;

    const { data: existingFamily } = await supabase
      .from("family_members")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (!existingFamily || existingFamily.length === 0) {
      await supabase.from("family_members").insert([
        { user_id: userId, name: "Rahul", relationship: "Son", photo_url: "/images/demo/rahul.jpg" },
        { user_id: userId, name: "Priya", relationship: "Daughter", photo_url: "/images/demo/priya.jpg" },
        {
          user_id: userId,
          name: "Anita",
          relationship: "Daughter-in-law",
          photo_url: "/images/demo/anita.jpg",
        },
        { user_id: userId, name: "Bikash", relationship: "Grandson", photo_url: "/images/demo/bikash.jpg" },
      ]);
    }

    const { data: existingReminders } = await supabase
      .from("reminders")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (!existingReminders || existingReminders.length === 0) {
      await supabase.from("reminders").insert([
        { user_id: userId, title: "Morning medication", category: "medication", scheduled_time: "07:30" },
        { user_id: userId, title: "Drink a glass of water", category: "water", scheduled_time: "11:00" },
        { user_id: userId, title: "Gentle walk, 15 minutes", category: "exercise", scheduled_time: "16:00" },
        { user_id: userId, title: "Doctor's appointment", category: "appointment", scheduled_time: "18:00" },
      ]);
    }

    const { data: existingSessions } = await supabase
      .from("game_sessions")
      .select("session_id")
      .eq("user_id", userId)
      .limit(1);

    if (!existingSessions || existingSessions.length === 0) {
      const history = [
        { acc: 0.6, mis: 4, rt: 6200, diff: "easy", game: "family_memory_match" },
        { acc: 0.62, mis: 3, rt: 5900, diff: "easy", game: "sequence_memory" },
        { acc: 0.7, mis: 3, rt: 5200, diff: "easy", game: "family_memory_match" },
        { acc: 0.72, mis: 2, rt: 4800, diff: "medium", game: "sequence_memory" },
        { acc: 0.8, mis: 2, rt: 4100, diff: "medium", game: "family_memory_match" },
        { acc: 0.85, mis: 1, rt: 3700, diff: "medium", game: "sequence_memory" },
        { acc: 0.75, mis: 2, rt: 4300, diff: "easy", game: "routine_sequencing" },
        { acc: 0.88, mis: 1, rt: 3400, diff: "medium", game: "family_memory_match" },
        { acc: 0.82, mis: 1, rt: 3600, diff: "easy", game: "card_flip_pairs" },
        { acc: 0.86, mis: 1, rt: 3200, diff: "medium", game: "routine_sequencing" },
        { acc: 0.9, mis: 1, rt: 2900, diff: "medium", game: "card_flip_pairs" },
      ];
      const rows = history.map((h, index) => {
        const total = 8;
        const correct = Math.round(h.acc * total);
        return {
          session_id: crypto.randomUUID(),
          user_id: userId,
          game_id: h.game,
          difficulty: h.diff,
          score: Math.round(h.acc * 100),
          accuracy: h.acc,
          mistakes: h.mis,
          response_time_ms: h.rt,
          total_questions: total,
          correct_answers: correct,
          played_at: new Date(Date.now() - (history.length - index) * 86400000).toISOString(),
        };
      });
      await supabase.from("game_sessions").insert(rows);
    }
    return { ok: true };
  });
