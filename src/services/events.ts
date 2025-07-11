// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getDOBList: builder.mutation({
      query: (credentials) => ({
        url: `/dashboard/eventBash/${credentials?.type}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getWAList: builder.mutation({
      query: (credentials) => ({
        url: `/dashboard/eventBash/${credentials?.type}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHireList: builder.query<void, void>({
      query: () => ({
        url: `/dashboard/hiresList`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDOBListMutation, useGetWAListMutation, useGetHireListQuery } = extendedAuthApi;
