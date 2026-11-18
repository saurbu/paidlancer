
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetJobByIdQuery,
  useGetMeQuery,
  useApplyForJobMutation,
  useGetMyApplicationsQuery,
} from "../../services/api";

export default function JobDetails() {
  const { id } = useParams();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: jobData,
    isLoading,
    isError,
  } = useGetJobByIdQuery(id);

  const { data: userData } = useGetMeQuery();

  const job = jobData?.job || jobData?.data?.job || jobData?.data || null;
  const user =
    userData?.user ||
    userData?.data?.user ||
    userData?.data ||
    userData;

  const isFreelancer = user?.role === "freelancer";
  const isOwnJob =
    job?.client?._id &&
    user?._id &&
    String(job.client._id) === String(user._id);

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
  } = useGetMyApplicationsQuery(undefined, {
    skip: !isFreelancer,
  });

  const myApplications =
    applicationsData?.applied ||
    applicationsData?.applications ||
    applicationsData?.appliedJobs ||
    applicationsData?.data?.applied ||
    applicationsData?.data?.applications ||
    [];

  const hasApplied = myApplications.some((application) => {
    const appliedJob = application.job || application.jobId;
    const appliedJobId =
      typeof appliedJob === "object"
        ? appliedJob?._id || appliedJob?.id
        : appliedJob;

    return String(appliedJobId) === String(job?._id || id);
  });

  const [
    applyForJob,
    { isLoading: isApplying },
  ] = useApplyForJobMutation();

  const handleApply = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (coverLetter.trim().length < 20) {
      setFormError("Cover letter must contain at least 20 characters.");
      return;
    }

    if (coverLetter.trim().length > 2000) {
      setFormError("Cover letter cannot exceed 2000 characters.");
      return;
    }

    if (!bidAmount || Number(bidAmount) < 1) {
      setFormError("Please enter a valid bid amount.");
      return;
    }

    if (!estimatedDays || Number(estimatedDays) < 1) {
      setFormError("Please enter a valid estimated delivery time.");
      return;
    }

    try {
      await applyForJob({
        jobId: job._id,
        coverLetter: coverLetter.trim(),
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
      }).unwrap();

      setSuccessMessage("Your application has been submitted successfully!");
      setShowApplyModal(false);
      setCoverLetter("");
      setBidAmount("");
      setEstimatedDays("");
    } catch (error) {
      setFormError(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to submit your application. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center text-stone-500">
        Loading job details...
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4 text-stone-700 dark:text-stone-200">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <Link
          to="/freelancer/dashboard"
          className="text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Back to Discover Jobs
        </Link>
      </div>
    );
  }

  const client =
    typeof job.client === "object" ? job.client : null;

  const budget = job.budget;
  const isOpen = (job.status || "").toLowerCase() === "open";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/freelancer/dashboard"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-600 mb-7"
        >
          <span>←</span> Back to Discover
        </Link>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        {formError && !showApplyModal && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    isOpen
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  {job.status || "Open"}
                </span>

                {job.budgetType && (
                  <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300 capitalize">
                    {job.budgetType}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm text-stone-500 dark:text-stone-400">
                <span>
                  Posted by {client?.name || "Client"}
                </span>

                {job.createdAt && (
                  <span>
                    Posted on{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="border-t border-stone-200 dark:border-stone-800 my-7" />

              <h2 className="text-lg font-semibold mb-3">
                Job Description
              </h2>

              <p className="text-stone-600 dark:text-stone-300 leading-7 whitespace-pre-wrap">
                {job.description || "No description provided."}
              </p>

              {job.requiredSkills?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">
                    Required Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-2 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-5">
                Job Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-stone-500">Experience</p>
                  <p className="font-semibold mt-1">
                    {job.experience || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">Deadline</p>
                  <p className="font-semibold mt-1">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">Budget</p>
                  <p className="font-semibold mt-1">
                    {budget != null
                      ? `₹${Number(budget).toLocaleString("en-IN")}`
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">Job Type</p>
                  <p className="font-semibold mt-1 capitalize">
                    {job.budgetType || "Not specified"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sticky top-6">
              <p className="text-sm text-stone-500">
                Client's Budget
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {budget != null
                  ? `₹${Number(budget).toLocaleString("en-IN")}`
                  : "Not specified"}
              </h2>

              <div className="border-t border-stone-200 dark:border-stone-800 my-6" />

              <h3 className="font-semibold text-lg">
                About the Client
              </h3>

              <p className="mt-3 font-medium">
                {client?.name || "Client"}
              </p>

              {client?.email && (
                <p className="text-sm text-stone-500 mt-1 break-all">
                  {client.email}
                </p>
              )}

              <div className="mt-7">
                {!user ? (
                  <Link
                    to="/login"
                    className="block w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold py-3 transition"
                  >
                    Login to Apply
                  </Link>
                ) : isFreelancer ? (
                  isOwnJob ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 py-3 font-semibold cursor-not-allowed"
                    >
                      Your Own Job
                    </button>
                  ) : !isOpen ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 py-3 font-semibold cursor-not-allowed"
                    >
                      Applications Closed
                    </button>
                  ) : applicationsLoading ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 py-3 font-semibold cursor-wait"
                    >
                      Checking Application...
                    </button>
                  ) : hasApplied ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 py-3 font-semibold cursor-not-allowed"
                    >
                      ✓ Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setFormError("");
                        setShowApplyModal(true);
                      }}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold transition"
                    >
                      Apply Now
                    </button>
                  )
                ) : user?.role === "client" ? (
                  isOwnJob ? (
                    <Link
                      to={`/client/applications?jobId=${job._id}`}
                      className="block w-full rounded-xl bg-[#183f2c] hover:bg-[#24563c] text-white text-center font-semibold py-3 transition"
                    >
                      View Applicants
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 py-3 font-semibold cursor-not-allowed"
                    >
                      Client Account
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="block w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold py-3 transition"
                  >
                    Login to Apply
                  </Link>
                )}
              </div>

              {isFreelancer && hasApplied && (
                <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-3">
                  You have already submitted an application for this job.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowApplyModal(false);
              setFormError("");
            }
          }}
        >
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Apply for this Job
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Submit your proposal to the client.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowApplyModal(false);
                  setFormError("");
                }}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-white text-2xl leading-none"
                aria-label="Close application form"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Letter
                </label>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a good fit for this job..."
                  minLength={20}
                  maxLength={2000}
                  rows={6}
                  required
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />

                <p className="text-xs text-stone-500 mt-1">
                  Minimum 20 characters. {coverLetter.length}/2000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Bid Amount (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid"
                  required
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Delivery (Days)
                </label>

                <input
                  type="number"
                  min="1"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  placeholder="How many days will you need?"
                  required
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyModal(false);
                    setFormError("");
                  }}
                  className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-3 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isApplying}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 font-semibold transition"
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
