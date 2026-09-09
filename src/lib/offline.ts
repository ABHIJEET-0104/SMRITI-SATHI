/**
 * Offline-first game result storage.
 *
 *   game -> local storage -> sync queue -> (online) -> server -> database
 *
 * Every result carries a client-generated session_id, so replaying the
 * queue after a failed network attempt can never duplicate a score:
 * the server treats the id as the primary key.
 */

export interface PendingSession {
  session_id: string;
  user_id: string;
  game_id: string;
  difficulty: string;
  score: number;
  accuracy: number;
  mistakes: number;
  response_time_ms: number;
  total_questions: number;
  correct_answers: number;
  played_at: string;
}

const QUEUE_KEY = "smriti_sync_queue_v1";
const CACHE_KEY = "smriti_session_cache_v1";
const listeners = new Set<() => void>();

function read(key: string): PendingSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as PendingSession[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: PendingSession[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — keep the in-memory result */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function subscribeQueue(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getQueue(): PendingSession[] {
  return read(QUEUE_KEY);
}

/** Saves a finished game locally and queues it for sync. */
export function saveSessionLocally(session: PendingSession) {
  const queue = read(QUEUE_KEY).filter((s) => s.session_id !== session.session_id);
  queue.push(session);
  write(QUEUE_KEY, queue);

  const cache = read(CACHE_KEY).filter((s) => s.session_id !== session.session_id);
  cache.push(session);
  write(CACHE_KEY, cache.slice(-60));
  emit();
}

/** Removes sessions the server has confirmed (inserted or already present). */
export function clearSynced(sessionIds: string[]) {
  if (sessionIds.length === 0) return;
  const done = new Set(sessionIds);
  write(
    QUEUE_KEY,
    read(QUEUE_KEY).filter((s) => !done.has(s.session_id)),
  );
  emit();
}

/** Locally cached results, used to keep results visible while offline. */
export function getCachedSessions(userId?: string): PendingSession[] {
  const all = read(CACHE_KEY);
  return userId ? all.filter((s) => s.user_id === userId) : all;
}

export function mergeSessions<T extends { session_id: string; played_at: string }>(
  remote: T[],
  local: PendingSession[],
): (T | PendingSession)[] {
  const seen = new Set(remote.map((r) => r.session_id));
  return [...remote, ...local.filter((l) => !seen.has(l.session_id))].sort(
    (a, b) => +new Date(b.played_at) - +new Date(a.played_at),
  );
}
