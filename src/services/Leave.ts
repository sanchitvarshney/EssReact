// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveStatus: builder.mutation({
      query: (credentials) => ({
        url: "/leave/getEmpLeaveList",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetLeaveStatusMutation } = extendedAuthApi;
