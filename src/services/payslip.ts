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
          return response.message;
        } else {
          return response.data;
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetPaySlipMutation } = extendedAuthApi;
