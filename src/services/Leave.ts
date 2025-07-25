import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveStatus: builder.mutation({
      query: (credentials) => ({
        url: "/leave/getEmpLeaveList",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
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
    applySLLeave: builder.mutation({
      query: (credentials) => ({
        url: `/leave/${credentials.url}`,
        method: "POST",
        body: credentials.body,
      }),
      transformResponse: (response: any) => response,
    }),

    rejectLeave: builder.mutation({
      query: (credentials) => ({
        url: "/leave/LeaveEmpReject",
        method: "POST",
        body: credentials,
      }),
    }),
    fetchEmployee: builder.mutation({
      query: (credentials) => ({
        url: "/leave/fetchEMP",
        method: "POST",
        body: credentials,
      }),
    }),
    getLeaveBalance: builder.mutation({
      query: (credentials) => ({
        url: "/leave/getBalance",
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
    getLeaveCalculate: builder.mutation({
      query: (credentials) => ({
        url: "/leave/calculate",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    getLeaveList: builder.mutation<any, void>({
      query: () => ({
        url: "/leave/getLeaveList",
        method: "POST",
      }),
      transformResponse: (response: any) => response,
    }),
    getleaveGrantDetails: builder.mutation({
      query: (credentials) => ({
        url: "/leave/getLeaveDetail",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    approvalGrantLeave: builder.mutation({
      query: (credentials) => ({
        url: `/leave/${credentials.url}`,
        method: "POST",
        body: credentials.body,
      }),
      transformResponse: (response: any) => response,
    }),
    leaveList: builder.mutation<any, void>({
      query: () => ({
        url: "/dashboard/leave/leavelist",
        method: "POST",
      }),
    }),
    attendanceStatistics: builder.query<any, void>({
      query: () => ({
        url: "/dashboard/attendance-statistics",
        method: "GET",
      }),
      transformResponse: (response: any) => response,
    }),
    updateElLeave: builder.mutation<any, void>({
      query: () => ({
        url: "dashboard/updateLeave/EL",
        method: "POST",
        body:{}
      }),
    }),
    updateSlLeave: builder.mutation<any, void>({
      query: () => ({
        url: "dashboard/updateLeave/SL",
        method: "POST",
        body:{}
      }),
    }),
    updateWfhLeave: builder.mutation<any, void>({
      query: () => ({
        url: "dashboard/updateLeave/WFH",
        method: "POST",
        body:{}
      }),
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
  useGetPendingRequestMutation,
  useApplySLLeaveMutation,
  useRejectLeaveMutation,
  useFetchEmployeeMutation,
  useGetLeaveBalanceMutation,
  useGetLeaveCalculateMutation,
  useGetLeaveListMutation,
  useApprovalGrantLeaveMutation,
  useGetleaveGrantDetailsMutation,
  useLeaveListMutation,
  useAttendanceStatisticsQuery,
  useUpdateElLeaveMutation,
  useUpdateSlLeaveMutation,
  useUpdateWfhLeaveMutation,
} = extendedAuthApi;
