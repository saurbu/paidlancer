
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_URL ||
      "https://paidlancer-goif.onrender.com/api",
    credentials: "include",
  }),

  tagTypes: ["Auth", "Jobs"],

  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getJobs: builder.query({
      query: () => "/jobs",
      providesTags: ["Jobs"],
    }),

    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetJobsQuery,
  useCreateJobMutation,
} = api;
