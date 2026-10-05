import { baseApiInstance } from "./baseApiInstance";

export interface WebAccessBlockStatus {
  blocked: boolean;
}

const extendedApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    // "Web Access Block": from 12-10-2026 onward, an employee who already uses the
    // ESS Android app is blocked from the Web interface and redirected to a
    // full-screen "use the app" page instead (see useWebAccessBlockGuard.ts).
    // Fully automatic server-side (hardcoded date + emp_device_registrations
    // check) - no admin config, the message text itself lives in
    // WebAccessBlockedScreen.tsx.
    checkWebAccessBlock: builder.query<WebAccessBlockStatus, void>({
      query: () => ({
        url: "/web-access/check",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? { blocked: false },
    }),
  }),
  overrideExisting: false,
});

export const { useCheckWebAccessBlockQuery } = extendedApi;
