// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getVibe: builder.query<any, any>({
      query: (credentials) => ({
        url: `/vibe?limit=${credentials?.limit}&last_id=${credentials?.last_id}&tmln_type=${credentials?.tmln_type}`,
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
  }),
  overrideExisting: false,
});

export const { useLazyGetVibeQuery,useSendCommentMutation,useSendLikeMutation } = extendedAuthApi;
