import { baseApiInstance } from "./baseApiInstance";

// The current reimbursement flow (approval chain, categories, S3 receipts). The older
// services/reimbursement.ts talks to the legacy /reimbursement router and is no longer used.
const reimbClaimsApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getClaimCategories: builder.mutation<any, void>({
      query: () => ({ url: "/reimb/categories", method: "GET" }),
    }),
    submitClaim: builder.mutation<any, FormData>({
      query: (body) => ({ url: "/reimb/submit", method: "POST", body }),
    }),
    getMyClaims: builder.mutation<any, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/reimb/claims", method: "GET", params: params || {} }),
    }),
    withdrawClaim: builder.mutation<any, string>({
      query: (claimRefId) => ({ url: `/reimb/withdraw/${claimRefId}`, method: "DELETE" }),
    }),
    getClaimReceipt: builder.mutation<any, { id: number; index: number }>({
      query: ({ id, index }) => ({ url: `/reimb/${id}/attachments/${index}`, method: "GET" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClaimCategoriesMutation,
  useSubmitClaimMutation,
  useGetMyClaimsMutation,
  useWithdrawClaimMutation,
  useGetClaimReceiptMutation,
} = reimbClaimsApi;
