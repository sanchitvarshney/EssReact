// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getVibe: builder.query<any, any>({
      query: (credentials) => ({
        url:`/vibe?limit=${credentials?.limit}&last_id=${credentials?.last_id}&tmln_type=${credentials?.tmln_type}`,
        method: "GET",
      
      }),
    }),
  
  }),
  overrideExisting: false,
});

export const { useLazyGetVibeQuery  } = extendedAuthApi;
