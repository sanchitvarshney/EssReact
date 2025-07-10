// src/services/baseApi.ts


import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";


const baseUrl = import.meta.env.VITE_BASE_URL;


// Custom base query with 401 handling
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Read token from localStorage
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);


  // Check for 401 Unauthorized response
  if (result.error && result.error.status === 401) {
    // Clear all auth data
    localStorage.removeItem("user");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/sign-in";
  }

  return result;
};

export const baseApiInstance = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
