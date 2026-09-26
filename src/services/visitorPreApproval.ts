import { baseApiInstance } from "./baseApiInstance";

// A host pre-approving a visitor (ESS's own backend, session auth). Not to be confused with
// services/visitorInviteApi.ts / visitorSelfRegisterApi.ts, which are the visitor-facing public pages.
interface CreatePreApprovalPayload {
  visitorName: string;
  mobile: string;
  email?: string;
  company?: string;
  purpose: string;
  expectedDate: string; // YYYY-MM-DD
  expectedTime: string; // HH:mm
  remarks?: string;
}

const visitorPreApprovalApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    createPreApproval: builder.mutation<any, CreatePreApprovalPayload>({
      query: (body) => ({ url: "/visitor-preapproval/create", method: "POST", body }),
    }),
    getPreApprovalHistory: builder.mutation<any, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/visitor-preapproval/history", method: "GET", params: params || {} }),
    }),
    cancelPreApproval: builder.mutation<any, string>({
      query: (ref) => ({ url: `/visitor-preapproval/${ref}/cancel`, method: "POST" }),
    }),
    regeneratePreApproval: builder.mutation<any, string>({
      query: (ref) => ({ url: `/visitor-preapproval/${ref}/regenerate`, method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePreApprovalMutation,
  useGetPreApprovalHistoryMutation,
  useCancelPreApprovalMutation,
  useRegeneratePreApprovalMutation,
} = visitorPreApprovalApi;
