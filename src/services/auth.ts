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
      transformResponse: (response: any) => response,
    }),

    getuserdata: builder.mutation({
      query: (credentials) => ({
        url: "/profile/view",
        method: "POST",
        body: credentials,
      }),
    }),
      changePasswordInfo: builder.mutation<any, void>({
      query: () => ({
        url: "/profile/passwordinfo",
        method: "GET",
     
      }),
      transformResponse: (response: any) => response,
    }),
        changePassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/profile/changepassword",
        method: "POST",
        body: credentials,
     
      }),
      transformResponse: (response: any) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetuserdataMutation,useChangePasswordInfoMutation,useChangePasswordMutation } = extendedAuthApi;
