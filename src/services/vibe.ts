// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getVibe: builder.query<any, any>({
      query: (credentials) => ({
        url: `/vibe?limit=${credentials?.limit}&last_id=${credentials?.last_id}&tmln_type=${credentials?.tmln_type}&offset=${credentials?.offset}`,
        method: "GET",
      }),
    }),
    sendComment: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `/vibe/comment`,
        method: "POST",
        body: credentials,
      }),
    }),
    sendLike: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `/vibe/like`,
        method: "POST",
        body: credentials,
      }),
    }),
    createPost: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `/vibe/create`,
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    eventsPost: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `/vibe/create`,
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetVibeQuery,
  useSendCommentMutation,
  useSendLikeMutation,
  useCreatePostMutation,
} = extendedAuthApi;
