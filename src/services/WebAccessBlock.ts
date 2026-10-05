import { baseApiInstance } from "./baseApiInstance";

export interface WebAccessBlockStatus {
  // true only from 12-10-2026 onward - redirects to the dedicated /app-only
  // page (useWebAccessBlockGuard.ts).
  blocked: boolean;
  // true whenever this employee already uses the ESS Android app, regardless
  // of date - before 12-10-2026 this alone drives the dismissible Dashboard
  // pre-warning (useAnnouncementBanner.ts); it never shows once `blocked`
  // flips true, since the dedicated page takes over instead.
  isAppUser: boolean;
}

const extendedApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    // "Web Access Block": from 12-10-2026 onward, an employee who already uses the
    // ESS Android app is blocked from the Web interface and redirected to a
    // full-screen "use the app" page instead (see useWebAccessBlockGuard.ts).
    // Before that date, the same isAppUser flag drives a dismissible pre-warning
    // on the Dashboard instead (see useAnnouncementBanner.ts). Fully automatic
    // server-side (hardcoded date + emp_device_registrations check) - no admin
    // config; the message text itself lives in the two frontend components.
    checkWebAccessBlock: builder.query<WebAccessBlockStatus, void>({
      query: () => ({
        url: "/web-access/check",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? { blocked: false, isAppUser: false },
    }),
  }),
  overrideExisting: false,
});

export const { useCheckWebAccessBlockQuery } = extendedApi;
