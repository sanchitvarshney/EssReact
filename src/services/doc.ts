// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.mutation<any, void>({
      query: () => ({
        url: "/sop/view",
        method: "POST",
        // body: credentials,
      }),
    }),
      getPeripheral: builder.mutation<any, void>({
      query: (credentials) => ({
        url: "/assets",
        method: "POST",
        body: credentials,
      }),
       transformResponse: (response: any) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDocumentsMutation, useGetPeripheralMutation } = extendedAuthApi;
