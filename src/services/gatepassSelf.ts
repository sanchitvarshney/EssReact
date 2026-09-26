import { baseApiInstance } from "./baseApiInstance";

// A signed-in employee raising their own gate pass. Goes to ESS's own backend (session auth) and lands in
// the Gate Pass module's Team Leader / Manager / HR approval chain. Not to be confused with services/gatepassApi.ts,
// which is the public employee-code + DOB form's client for the standalone gate pass backend.
const gatepassSelfApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getGatepassOptions: builder.mutation<any, void>({
      query: () => ({ url: "/gp-self/options", method: "GET" }),
    }),
    applyGatepass: builder.mutation<
      any,
      {
        tl_code: string;
        gatepass_subtype: "half_day" | "full_day";
        will_return: "yes" | "no";
        exit_date: string;
        exit_time: string;
        return_date?: string;
        return_time?: string;
        reason: string;
      }
    >({
      query: (body) => ({ url: "/gp-self/apply", method: "POST", body }),
    }),
    getMyGatepasses: builder.mutation<any, void>({
      query: () => ({ url: "/gp-self/my", method: "GET" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGatepassOptionsMutation,
  useApplyGatepassMutation,
  useGetMyGatepassesMutation,
} = gatepassSelfApi;
