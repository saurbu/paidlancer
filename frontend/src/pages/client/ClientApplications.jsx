
import { useState } from "react";
import {
  useGetMyJobsQuery,
  useGetJobApplicationsQuery,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} from "../../services/api";

export default function ClientApplications() {
  const [selectedJobId, setSelectedJobId] = useState("");

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useGetMyJobsQuery();

  const jobs =
    jobsData?.jobs ||
    jobsData?.data?.jobs ||
    [];

  const activeJobId = selectedJobId || jobs[0]?._id;

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useGetJobApplicationsQuery(activeJobId, {
    skip: !activeJobId,
  });

  const applications =
    applicationsData?.applications ||
    applicationsData?.appliedJobs ||
    applicationsData?.data?.applications ||
    applicationsData?.data?.appliedJobs ||
    [];

  const [acceptApplication, { isLoading: accepting }] =
    useAcceptApplicationMutation();

  const [rejectApplication, { isLoading: rejecting }] =
    useRejectApplicationMutation();

  const handleAccept = async (id) => {
    try {
      await acceptApplication(id).unwrap();
    } catch (error) {
      alert(error?.data?.message || "Could not accept application.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id).unwrap();
    } catch (error) {
      alert(error?.data?.message || "Could not reject application.");
    }
  };

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center text-stone-500">
        Loading your jobs...
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center text-red-500">
        Failed to load your jobs.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 px-4 py-8 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600 mb-2">
            CLIENT WORKSPACE
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Applications
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2">
            Manage applicants for the jobs you've posted.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
            <h2 className="text-xl font-semibold">No jobs posted yet</h2>
            <p className="text-stone-500 mt-2">
              Post a job to start receiving applications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posted jobs */}
            <aside className="lg:col-span-1">
              <h2 className="font-semibold text-lg mb-4">
                Your posted jobs ({jobs.length})
              </h2>

              <div className="space-y-3">
                {jobs.map((job) => {
                  const selected = activeJobId === job._id;

                  return (
                    <button
                      key={job._id}
                      onClick={() => setSelectedJobId(job._id)}
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-400"
                      }`}
                    >
                      <h3 className="font-semibold">
                        {job.title}
                      </h3>
                      <p className="text-sm text-stone-500 mt-2">
                        ₹{Number(job.budget || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        {job.status || "Open"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Applicants */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">
                  Applicants
                </h2>
                <span className="text-sm text-stone-500">
                  {applications.length} received
                </span>
              </div>

              {applicationsLoading ? (
                <div className="p-8 text-center text-stone-500">
                  Loading applications...
                </div>
              ) : applicationsError ? (
                <div className="p-8 text-center text-red-500">
                  Failed to load applications.
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
                  <h3 className="font-semibold text-lg">
                    No applications yet
                  </h3>
                  <p className="text-stone-500 mt-2">
                    Applicants will appear here when freelancers apply.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const applicant =
                      application.freelancer ||
                      application.applicant ||
                      application.user ||
                      {};

                    const applicationId =
                      application._id || application.id;

                    const status = (
                      application.status || "pending"
                    ).toLowerCase();

                    const isPending = [
                      "pending",
                      "applied",
                    ].includes(status);

                    return (
                      <article
                        key={applicationId}
                        className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                applicant.profileImg ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name || "Freelancer")}`
                              }
                              alt={applicant.name || "Freelancer"}
                              className="w-12 h-12 rounded-full object-cover"
                            />

                            <div>
                              <h3 className="font-semibold">
                                {applicant.name || "Freelancer"}
                              </h3>
                              <p className="text-sm text-stone-500">
                                {applicant.email || "Applicant"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${
                              status === "accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-5">
                          <p className="text-sm font-medium mb-2">
                            Cover letter / Proposal
                          </p>
                          <p className="text-sm text-stone-600 dark:text-stone-400 whitespace-pre-wrap">
                            {application.coverLetter ||
                              application.proposal ||
                              application.message ||
                              "No proposal provided."}
                          </p>
                        </div>

                        {application.bidAmount != null && (
                          <p className="mt-4 text-sm">
                            Proposed budget:{" "}
                            <strong>
                              ₹{Number(application.bidAmount).toLocaleString("en-IN")}
                            </strong>
                          </p>
                        )}

                        {isPending && (
                          <div className="flex flex-wrap gap-3 mt-5">
                            <button
                              onClick={() => handleAccept(applicationId)}
                              disabled={accepting || rejecting}
                              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50"
                            >
                              {accepting ? "Please wait..." : "Accept"}
                            </button>

                            <button
                              onClick={() => handleReject(applicationId)}
                              disabled={accepting || rejecting}
                              className="px-5 py-2.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-semibold disabled:opacity-50"
                            >
                              {rejecting ? "Please wait..." : "Reject"}
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
