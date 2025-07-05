// src/services/auth/authApi.ts

import { baseApiInstance } from './baseApiInstance';

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        
        url: '/login/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation } = extendedAuthApi;
