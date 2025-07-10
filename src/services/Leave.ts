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
    getEarnLeave: builder.mutation({
      query: (credentials) => ({
        url: `/dashboard/leave/${credentials?.type}`,
        method: "POST",
        body: {
          empcode: credentials?.empcode,
          currentDate: credentials?.currentDate,
        },
      }),
    }),
    getWorkFromHome: builder.mutation({
      query: (credentials) => ({
        url: `/dashboard/leave/${credentials?.type}`,
        method: "POST",
        body: {
          empcode: credentials?.empcode,
          currentDate: credentials?.currentDate,
        },
      }),
      transformResponse: (response: any) => response.data,
    }),
    getSickLeave: builder.mutation({
      query: (credentials) => ({
        url: `/dashboard/leave/${credentials?.type}`,
        method: "POST",
        body: {
          empcode: credentials?.empcode,
          currentDate: credentials?.currentDate,
        },
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHolidaysList: builder.mutation({
      query: (credentials) => ({
        url: `/event/?start=${credentials.start}&end=${credentials.end}`,
        method: "POST",
      }),
      transformResponse: (response: any) => response.data.events,
    }),
    getPendingRequest: builder.mutation({
      query: (credentials) => ({
        url: "/leave/getEmpLeaveList",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeaveStatusMutation,
  useGetEarnLeaveMutation,
  useGetSickLeaveMutation,
  useGetWorkFromHomeMutation,
  useGetHolidaysListMutation,
  useGetPendingRequestMutation
} = extendedAuthApi;
