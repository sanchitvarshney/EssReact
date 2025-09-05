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
    authentication: builder.mutation({
      query: (credentials) => ({
        url: "/login/verify",
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
    resetPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/login/reset",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    getEmployeeDetails: builder.query<any, any>({
      query: (credentials) => {
        const searchParams = new URLSearchParams();

        if (credentials?.empcode) {
          searchParams.set("empcode", credentials.empcode);
        }

        return {
          url: `/dashboard/emp/profile?${searchParams.toString()}`,
          method: "GET",
        };
      },

      transformResponse: (response: any) => {

        if (response.status === "error") {
          return { error: true, message: response.message };
        }
        return response.data;
      },

      transformErrorResponse: (errorResponse: any) => {
        return {
          error: true,
          status: errorResponse.status,
          message: errorResponse.data?.message || "Were Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency. while fetching user data.",
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useAuthenticationMutation,
  useGetuserdataMutation,
  useChangePasswordInfoMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useGetEmployeeDetailsQuery,
} = extendedAuthApi;
