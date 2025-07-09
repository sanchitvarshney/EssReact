import { baseApiInstance } from "./baseApiInstance";

const extendedShiftApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getShiftDetails: builder.mutation({
      query: (credentials) => ({
        url: `/attendance/view/shift/?start=${credentials.start}&end=${credentials.end}`,
        method: "POST",
      }),
      transformResponse: (response: any) => response.result,
    }),
      getShifts: builder.mutation({
      query: (credentials) => ({
        url: `/attendance/view/punch/?start=${credentials.start}&end=${credentials.end}`,
        method: "POST",
      }),
      transformResponse: (response: any) => response.result,
    }),
     downloadAttendance: builder.mutation({
      query: (credentials) => ({
        url: "attendance/download",
        method: "POST",
        body: credentials
      }),
     transformResponse: (response: any) => response.data,
    }),
  }),
  
  overrideExisting: false,
});

export const { useGetShiftDetailsMutation,useGetShiftsMutation, useDownloadAttendanceMutation } = extendedShiftApi;
