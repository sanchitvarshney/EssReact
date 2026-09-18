import { baseApiInstance } from "./baseApiInstance";
import type {
  ApiEnvelope,
  RatingGetData,
  RatingWindow,
  SaveRatingPayload,
  TeamMember,
} from "../types/performance-types/kraRating";

const kraRatingApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getRatingWindow: builder.query<ApiEnvelope<RatingWindow>, void>({
      query: () => ({ url: "/hrms/kra/rating/window", method: "GET" }),
    }),
    getMyTeam: builder.query<ApiEnvelope<TeamMember[]>, { fy: string; month?: string }>({
      query: ({ fy, month }) => ({
        url: "/hrms/kra/rating/myTeam",
        method: "GET",
        params: month ? { fy, month } : { fy },
      }),
    }),
    getRating: builder.query<ApiEnvelope<RatingGetData>, { empId: string; fy: string }>({
      query: ({ empId, fy }) => ({
        url: "/hrms/kra/rating/get",
        method: "GET",
        params: { empId, fy },
      }),
    }),
    saveRating: builder.mutation<ApiEnvelope<{ month: string; role: string }>, SaveRatingPayload>({
      query: (body) => ({
        url: "/hrms/kra/rating/save",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRatingWindowQuery,
  useGetMyTeamQuery,
  useGetRatingQuery,
  useSaveRatingMutation,
} = kraRatingApi;
