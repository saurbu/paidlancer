
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_URL ||
      "https://paidlancer-goif.onrender.com/api",
    credentials: "include",
  }),

  tagTypes: ["Auth", "Jobs", "Applications", "Contracts"],

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

    getJobs: builder.query({
      query: () => "/jobs",
      providesTags: ["Jobs"],
    }),

    getJobById: builder.query({
      query: (jobId) => `/jobs/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "Jobs", id: jobId },
      ],
    }),

    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),

    getMyJobs: builder.query({
      query: () => "/jobs/my-jobs",
      providesTags: ["Jobs"],
    }),

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

    applyForJob: builder.mutation({
      query: (body) => ({
        url: "/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
    }),

    getJobApplications: builder.query({
      query: (jobId) => `/apply/applied/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "Applications", id: jobId },
      ],
    }),

    getMyApplications: builder.query({
      query: () => "/apply/myapplied",
      providesTags: ["Applications"],
    }),

    acceptApplication: builder.mutation({
      query: (applyId) => ({
        url: `/apply/accept/${applyId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Applications", "Jobs", "Contracts"],
    }),

    rejectApplication: builder.mutation({
      query: (applyId) => ({
        url: `/apply/reject/${applyId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Applications"],
    }),

    // =========================
    // CONTRACTS
    // =========================

    // Create a contract after accepting an application.
    createContract: builder.mutation({
      query: (body) => ({
        url: "/contracts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contracts", "Applications", "Jobs"],
    }),

    // Get contracts belonging to the logged-in user.
    getMyContracts: builder.query({
      query: () => "/contracts/my",
      providesTags: ["Contracts"],
    }),

    // Get a particular contract.
    getContractById: builder.query({
      query: (contractId) => `/contracts/${contractId}`,
      providesTags: (result, error, contractId) => [
        { type: "Contracts", id: contractId },
      ],
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

  // Contracts
  useCreateContractMutation,
  useGetMyContractsQuery,
  useGetContractByIdQuery,
} = api;
