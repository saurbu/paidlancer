
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_URL ||
      "https://paidlancer-goif.onrender.com/api",
    credentials: "include",
  }),

  tagTypes: ["Auth", "Jobs", "Applications"],

  endpoints: (builder) => ({
    // =========================
    // AUTH
    // =========================

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

    // =========================
    // JOBS
    // =========================

    // Public jobs feed — used by freelancers to discover jobs.
    getJobs: builder.query({
      query: () => "/jobs",
      providesTags: ["Jobs"],
    }),

    // Get one job by ID.
    getJobById: builder.query({
      query: (jobId) => `/jobs/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "Jobs", id: jobId },
      ],
    }),

    // Client creates a job.
    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // Client gets only their own posted jobs.
    getMyJobs: builder.query({
      query: () => "/jobs/my-jobs",
      providesTags: ["Jobs"],
    }),

    // Client deletes a job.
    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    // =========================
    // APPLICATIONS
    // =========================

    // Freelancer applies for a job.
    applyForJob: builder.mutation({
      query: (body) => ({
        url: "/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
    }),

    // Client views applications for a selected job.
    getJobApplications: builder.query({
      query: (jobId) => `/apply/applied/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "Applications", id: jobId },
      ],
    }),

    // Freelancer views their submitted applications.
    getMyApplications: builder.query({
      query: () => "/apply/myapplied",
      providesTags: ["Applications"],
    }),

    // Client accepts an applicant.
    acceptApplication: builder.mutation({
      query: (applyId) => ({
        url: `/apply/accept/${applyId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Applications", "Jobs"],
    }),

    // Client rejects an applicant.
    rejectApplication: builder.mutation({
      query: (applyId) => ({
        url: `/apply/reject/${applyId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  // Auth
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,

  // Jobs
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useGetMyJobsQuery,
  useDeleteJobMutation,

  // Applications
  useApplyForJobMutation,
  useGetJobApplicationsQuery,
  useGetMyApplicationsQuery,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} = api;
