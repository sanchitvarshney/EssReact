// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login/login",
        method: "POST",
        body: credentials,
      }),
      // transformResponse: (response: any) => {
      //   if (response.status === "error") {
      //     return response.message;
      //   } else {
      //     return response;
      //   }
      // },
    }),

    getuserdata: builder.mutation({
      query: (credentials) => ({
        url: "/profile/view",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetuserdataMutation } = extendedAuthApi;
