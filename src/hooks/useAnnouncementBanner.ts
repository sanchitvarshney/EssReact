import { useEffect, useState } from "react";
import { useCheckWebAccessBlockQuery } from "../services/WebAccessBlock";

const POLL_MS = 60 * 60 * 1000; // re-check (and re-show, if dismissed) every 1h

/**
 * Dashboard-only pre-warning for the 12-10-2026 Web Access Block: a dismissible
 * popup (AnnouncementBannerModal) shown to an employee who already uses the ESS
 * Android app, before the block itself kicks in. Reopens on every fresh page
 * load/login and every hourly poll - dismissing it only hides it until the next
 * of those, never for good. Stops showing entirely once `blocked` flips true
 * (the dedicated /app-only page takes over then - see useWebAccessBlockGuard.ts).
 */
export function useAnnouncementBanner() {
  // RTK Query's structural sharing can hand back the exact same `data` object on
  // a poll that found no change, so `fulfilledTimeStamp` (which always changes)
  // is the effect's dependency, not `data` itself - otherwise a dismissed popup
  // would never reopen on an hour where the answer happened to be identical.
  const { data, fulfilledTimeStamp } = useCheckWebAccessBlockQuery(undefined, { pollingInterval: POLL_MS });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    setOpen(data.isAppUser && !data.blocked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fulfilledTimeStamp]);

  return { open, close: () => setOpen(false) };
}
