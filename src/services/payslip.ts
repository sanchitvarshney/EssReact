// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getPaySlip: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/empPayslip/view",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response.status === "error") {
          return response;
        } else {
          return response.data;
        }
      },
    }),
    downloadPaySlip: builder.mutation<any, any>({
      query: (payload) => ({
        url: "empPayslip/print",
        method: "POST",
        body: payload,
        
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPaySlipMutation, useDownloadPaySlipMutation } = extendedAuthApi;
