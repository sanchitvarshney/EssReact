import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckWebAccessBlockQuery } from "../services/WebAccessBlock";

const COOKIE_NAME = "essWebAccessBlocked";
const BLOCKED_PAGE_PATH = "/app-only";
const POLL_MS = 60 * 60 * 1000; // re-check every 1h, in case HRMS admin resets this employee's device mid-session

function cacheInCookie(blocked: boolean) {
  try {
    // 1h lifetime matches the poll interval - just a fast local cache (e.g. so a
    // fresh tab doesn't flash the normal app for a split second), the API
    // response above is always the source of truth.
    document.cookie = `${COOKIE_NAME}=${blocked ? "1" : "0"}; max-age=${POLL_MS / 1000}; path=/`;
  } catch {
    // Cookies disabled/blocked - nothing to fall back to, the API call still works.
  }
}

/**
 * HRMS "ESS App > Users" reset-device / 12-10-2026 "use the app instead" block
 * (see HRMS - ESS's controller/ROUTES/menu/webAccessBlock.js). Mounted from both
 * MainLayout (redirects INTO the dedicated block page) and WebAccessBlockedPage
 * (redirects back OUT once no longer blocked) - RTK Query dedupes the underlying
 * request either way, so this never double-fetches.
 */
export function useWebAccessBlockGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useCheckWebAccessBlockQuery(undefined, { pollingInterval: POLL_MS });

  useEffect(() => {
    if (!data) return;
    cacheInCookie(data.blocked);
    if (data.blocked && location.pathname !== BLOCKED_PAGE_PATH) {
      navigate(BLOCKED_PAGE_PATH, { replace: true });
    } else if (!data.blocked && location.pathname === BLOCKED_PAGE_PATH) {
      navigate("/", { replace: true });
    }
  }, [data, location.pathname, navigate]);
}
