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
  }),
  overrideExisting: false,
});

export const { useGetDocumentsMutation } = extendedAuthApi;
