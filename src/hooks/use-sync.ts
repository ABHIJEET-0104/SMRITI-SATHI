import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import { syncGameResults } from "@/lib/api.functions";
import { clearSynced, getQueue, subscribeQueue, type PendingSession } from "@/lib/offline";

export type SyncState = "idle" | "syncing" | "error";

/**
 * Watches the offline queue and pushes it to the server whenever the
 * browser is online. Sync is idempotent, so a retry after a failure can
 * never duplicate a game result.
 */
export function useSync() {
  const [pending, setPending] = useState<PendingSession[]>([]);
  const [online, setOnline] = useState(true);
  const [state, setState] = useState<SyncState>("idle");
  const [lastSyncedCount, setLastSyncedCount] = useState(0);
  const push = useServerFn(syncGameResults);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPending(getQueue());
    const unsubscribe = subscribeQueue(() => setPending(getQueue()));
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      unsubscribe();
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const sync = useCallback(async () => {
    const queue = getQueue();
    if (queue.length === 0 || !navigator.onLine) return { synced: 0 };
    setState("syncing");
    try {
      const response = await push({ data: { sessions: queue } });
      const ids = (response?.results ?? []).map((r) => r.session_id);
      clearSynced(ids);
      const inserted = (response?.results ?? []).filter((r) => r.status === "synced").length;
      setLastSyncedCount(ids.length);
      setState("idle");
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["trend"] });
      return { synced: ids.length, inserted };
    } catch {
      setState("error");
      return { synced: 0, error: true };
    }
  }, [push, queryClient]);

  useEffect(() => {
    if (online && pending.length > 0 && state !== "syncing") void sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, pending.length]);

  return { pending, pendingCount: pending.length, online, state, sync, lastSyncedCount };
}
