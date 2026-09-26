import { baseApiInstance } from "./baseApiInstance";

const loanApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getLoanPolicy: builder.mutation<any, void>({
      query: () => ({ url: "/loan/policy", method: "GET" }),
    }),
    previewLoan: builder.mutation<any, { loan_type: string; amount: number; tenure_months: number }>({
      query: (body) => ({ url: "/loan/preview", method: "POST", body }),
    }),
    applyLoan: builder.mutation<
      any,
      { loan_type: string; amount: number; tenure_months: number; purpose: string; remark?: string }
    >({
      query: (body) => ({ url: "/loan/apply", method: "POST", body }),
    }),
    getMyLoans: builder.mutation<any, { status?: string; type?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/loan/my", method: "GET", params: params || {} }),
    }),
    getLoanDetail: builder.mutation<any, number>({
      query: (id) => ({ url: `/loan/${id}`, method: "GET" }),
    }),
    withdrawLoan: builder.mutation<any, number>({
      query: (id) => ({ url: `/loan/${id}/withdraw`, method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLoanPolicyMutation,
  usePreviewLoanMutation,
  useApplyLoanMutation,
  useGetMyLoansMutation,
  useGetLoanDetailMutation,
  useWithdrawLoanMutation,
} = loanApi;
