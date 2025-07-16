import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    cliamReimbursement: builder.mutation({
      query: (credentials) => ({
        url: "/reimbursement/submitReimbursement",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    statusReimbursement: builder.mutation<any, void>({
      query: () => ({
        url: "/reimbursement/getReimbursement",
        method: "GET",
      }),
      transformResponse: (response: any) => response,
    }),
    cancelReimbursement: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/reimbursement/withdrawReimbursement",
        method: "PUT",
        body:credentials
      }),
      transformResponse: (response: any) => response,
    }),
  }),

  overrideExisting: false,
});

export const { useCliamReimbursementMutation, useStatusReimbursementMutation, useCancelReimbursementMutation } =
  extendedAuthApi;
