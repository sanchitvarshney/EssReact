// src/services/auth/authApi.ts

import { baseApiInstance } from "./baseApiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getHierarchyChat: builder.query<any, void>({
      query: () => ({
        url: "/hierarchy/orgchart/children/view",
        method: "GET",
      }),
      transformResponse: (response: any) => response.children,
    }),
  }),
  overrideExisting: false,
});

export const { useGetHierarchyChatQuery } = extendedAuthApi;
