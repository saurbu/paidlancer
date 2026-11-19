
import { useState } from "react";
import {
  useGetMyJobsQuery,
  useGetJobApplicationsQuery,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
  useCreateContractMutation,
} from "../../services/api";

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function ClientApplications() {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);

  const [contractForm, setContractForm] = useState({
    dealAmount: "",
    startDate: getToday(),
    endDate: "",
  });

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
    refetch: refetchApplications,
  } = useGetJobApplicationsQuery(activeJobId, {
    skip: !activeJobId,
  });

  const applications =
    applicationsData?.applications ||
    applicationsData?.applied ||
    applicationsData?.appliedJobs ||
    applicationsData?.data?.applications ||
    applicationsData?.data?.applied ||
    applicationsData?.data?.appliedJobs ||
    [];

  const [acceptApplication, { isLoading: accepting }] =
    useAcceptApplicationMutation();

  const [rejectApplication, { isLoading: rejecting }] =
    useRejectApplicationMutation();

  const [createContract, { isLoading: creatingContract }] =
    useCreateContractMutation();

  const selectedJob = jobs.find(
    (job) => String(job._id) === String(activeJobId)
  );

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const openApplicantDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicantDetails = () => {
    setSelectedApplication(null);
  };

  const openContractModal = () => {
    if (!selectedApplication) return;

    setContractForm({
      dealAmount: String(selectedApplication.bidAmount || ""),
      startDate: getToday(),
      endDate: selectedJob?.deadline
        ? new Date(selectedJob.deadline).toISOString().split("T")[0]
        : "",
    });

    setShowContractModal(true);
  };

  const closeContractModal = () => {
    if (creatingContract || accepting) return;
    setShowContractModal(false);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();

    if (!selectedApplication) return;

    if (
      !contractForm.dealAmount ||
      Number(contractForm.dealAmount) <= 0 ||
      !contractForm.startDate ||
      !contractForm.endDate
    ) {
      alert("Please fill all contract details.");
      return;
    }

    if (
      new Date(contractForm.endDate) <=
      new Date(contractForm.startDate)
    ) {
      alert("End date must be after start date.");
      return;
    }

    const applicationId = selectedApplication._id;

    try {
      // First accept the selected application.
      await acceptApplication(applicationId).unwrap();

      // Then create its contract.
      await createContract({
        applyId: applicationId,
        dealAmount: Number(contractForm.dealAmount),
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
      }).unwrap();

      alert("Application accepted and contract created successfully!");

      setShowContractModal(false);
      setSelectedApplication(null);

      await refetchApplications();
    } catch (error) {
      alert(
        error?.data?.message ||
          "Something went wrong while creating the contract."
      );

      // Refresh because the application may already have been accepted.
      await refetchApplications();
    }
  };

  const handleReject = async (application) => {
    const confirmed = window.confirm(
      `Are you sure you want to reject ${application.freelancer?.name || "this"} application?`
    );

    if (!confirmed) return;

    try {
      await rejectApplication(application._id).unwrap();

      alert("Application rejected successfully.");

      setSelectedApplication(null);
      await refetchApplications();
    } catch (error) {
      alert(
        error?.data?.message || "Could not reject application."
      );
    }
  };

  const handleMessage = (applicant) => {
    if (!applicant?.email) {
      alert("This freelancer has not provided an email address.");
      return;
    }

    const subject = encodeURIComponent(
      `Regarding your application for ${selectedJob?.title || "our job"}`
    );

    const body = encodeURIComponent(
      `Hi ${applicant.name || "there"},\n\nI would like to discuss your application for ${selectedJob?.title || "the job"}.\n\nRegards`
    );

    window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
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

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wider text-emerald-600 mb-2">
            CLIENT WORKSPACE
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Applications
          </h1>

          <p className="text-stone-500 dark:text-stone-400 mt-2">
            Review freelancers, compare proposals and hire the right person.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No jobs posted yet
            </h2>

            <p className="text-stone-500 mt-2">
              Post a job to start receiving applications.
            </p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Total Applicants",
                  value: applications.length,
                  color: "text-stone-900 dark:text-white",
                },
                {
                  label: "Pending",
                  value: pendingCount,
                  color: "text-amber-600",
                },
                {
                  label: "Accepted",
                  value: acceptedCount,
                  color: "text-emerald-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
                >
                  <p className="text-sm text-stone-500">
                    {stat.label}
                  </p>

                  <h2 className={`text-3xl font-bold mt-2 ${stat.color}`}>
                    {stat.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Posted jobs */}
              <aside className="lg:col-span-1">
                <h2 className="font-bold text-lg mb-4">
                  Your Posted Jobs
                </h2>

                <div className="space-y-3">
                  {jobs.map((job) => {
                    const selected =
                      String(activeJobId) === String(job._id);

                    return (
                      <button
                        key={job._id}
                        onClick={() => {
                          setSelectedJobId(job._id);
                          setSelectedApplication(null);
                        }}
                        className={`w-full text-left rounded-xl border p-4 transition ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                            : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex justify-between gap-2">
                          <h3 className="font-semibold">
                            {job.title}
                          </h3>

                          <span className="text-xs text-emerald-600 capitalize">
                            {job.status || "Open"}
                          </span>
                        </div>

                        <p className="text-sm text-stone-500 mt-3">
                          Budget: ₹{formatMoney(job.budget)}
                        </p>

                        <p className="text-xs text-stone-400 mt-2">
                          Deadline: {formatDate(job.deadline)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Applicant list */}
              <section className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-lg">
                      Applicants
                    </h2>

                    <p className="text-sm text-stone-500 mt-1">
                      {selectedJob?.title}
                    </p>
                  </div>

                  <span className="text-sm text-stone-500">
                    {applications.length} received
                  </span>
                </div>

                {applicationsLoading ? (
                  <div className="p-10 text-center text-stone-500">
                    Loading applications...
                  </div>
                ) : applicationsError ? (
                  <div className="p-10 text-center text-red-500">
                    Failed to load applications.
                  </div>
                ) : applications.length === 0 ? (
                  <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
                    <div className="text-4xl mb-3">👥</div>

                    <h3 className="font-semibold text-lg">
                      No applications yet
                    </h3>

                    <p className="text-stone-500 mt-2">
                      Freelancers who apply for this job will appear here.
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

                      const status = (
                        application.status || "pending"
                      ).toLowerCase();

                      return (
                        <article
                          key={application._id}
                          className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                                  {applicant.email || "No email provided"}
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

                          <div className="grid grid-cols-2 gap-3 mt-5">
                            <div className="rounded-xl bg-stone-50 dark:bg-stone-800/70 p-3">
                              <p className="text-xs text-stone-500">
                                Proposed Budget
                              </p>

                              <p className="font-bold mt-1">
                                ₹{formatMoney(application.bidAmount)}
                              </p>
                            </div>

                            <div className="rounded-xl bg-stone-50 dark:bg-stone-800/70 p-3">
                              <p className="text-xs text-stone-500">
                                Estimated Time
                              </p>

                              <p className="font-bold mt-1">
                                {application.estimatedDays || "—"} days
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-5">
                            <button
                              onClick={() => openApplicantDetails(application)}
                              className="px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-semibold hover:opacity-90"
                            >
                              View Details
                            </button>

                            <button
                              onClick={() => handleMessage(applicant)}
                              className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              Send Message
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>

      {/* Applicant Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={closeApplicantDetails}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const applicant =
                selectedApplication.freelancer ||
                selectedApplication.applicant ||
                selectedApplication.user ||
                {};

              const status = (
                selectedApplication.status || "pending"
              ).toLowerCase();

              const isPending = status === "pending";

              return (
                <>
                  <div className="p-6 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            applicant.profileImg ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name || "Freelancer")}`
                          }
                          alt={applicant.name || "Freelancer"}
                          className="w-16 h-16 rounded-full object-cover"
                        />

                        <div>
                          <h2 className="text-xl font-bold">
                            {applicant.name || "Freelancer"}
                          </h2>

                          <p className="text-sm text-stone-500 mt-1">
                            {applicant.email}
                          </p>

                          <span className={`inline-block mt-2 text-xs font-semibold capitalize px-3 py-1 rounded-full ${
                            status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={closeApplicantDetails}
                        className="text-stone-400 hover:text-stone-900 dark:hover:text-white text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Profile */}
                    <section>
                      <h3 className="font-bold mb-2">
                        About Freelancer
                      </h3>

                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-6">
                        {applicant.bio || "No bio provided."}
                      </p>
                    </section>

                    {/* Skills */}
                    <section>
                      <h3 className="font-bold mb-3">
                        Skills
                      </h3>

                      {applicant.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-stone-500">
                          No skills added.
                        </p>
                      )}
                    </section>

                    {/* Proposal */}
                    <section>
                      <h3 className="font-bold mb-2">
                        Cover Letter / Proposal
                      </h3>

                      <div className="rounded-xl bg-stone-50 dark:bg-stone-800/70 p-4">
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-7 whitespace-pre-wrap">
                          {selectedApplication.coverLetter ||
                            "No proposal provided."}
                        </p>
                      </div>
                    </section>

                    {/* Bid details */}
                    <section>
                      <h3 className="font-bold mb-3">
                        Application Details
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-stone-200 dark:border-stone-700 p-4">
                          <p className="text-xs text-stone-500">
                            Proposed Amount
                          </p>

                          <p className="text-xl font-bold mt-1">
                            ₹{formatMoney(selectedApplication.bidAmount)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-stone-200 dark:border-stone-700 p-4">
                          <p className="text-xs text-stone-500">
                            Estimated Completion
                          </p>

                          <p className="text-xl font-bold mt-1">
                            {selectedApplication.estimatedDays || "—"} days
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 mt-3">
                        Applied on: {formatDate(selectedApplication.createdAt)}
                      </p>
                    </section>

                    {/* Contact */}
                    <section className="flex flex-wrap gap-3">
                      {applicant.email && (
                        <p className="text-sm text-stone-500">
                          Email: {applicant.email}
                        </p>
                      )}

                      {applicant.mobile && (
                        <p className="text-sm text-stone-500">
                          Mobile: {applicant.mobile}
                        </p>
                      )}
                    </section>
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-3">
                    {isPending && (
                      <>
                        <button
                          onClick={openContractModal}
                          className="flex-1 min-w-[130px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Accept & Hire
                        </button>

                        <button
                          onClick={() => handleReject(selectedApplication)}
                          disabled={rejecting}
                          className="px-5 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold disabled:opacity-50"
                        >
                          {rejecting ? "Rejecting..." : "Reject"}
                        </button>
                      </>
                    )}

                    {status === "accepted" && (
                      <div className="text-sm font-semibold text-emerald-600">
                        This application has been accepted.
                      </div>
                    )}

                    {status === "rejected" && (
                      <div className="text-sm font-semibold text-red-500">
                        This application has been rejected.
                      </div>
                    )}

                    <button
                      onClick={() => handleMessage(applicant)}
                      className="px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Send Message
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {showContractModal && selectedApplication && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateContract}
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-stone-900 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Create Contract
                  </h2>

                  <p className="text-sm text-stone-500 mt-1">
                    Finalize your agreement with the freelancer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeContractModal}
                  disabled={creatingContract || accepting}
                  className="text-2xl text-stone-400"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Freelancer
                </p>

                <p className="font-bold mt-1">
                  {selectedApplication.freelancer?.name ||
                    "Selected Freelancer"}
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  {selectedJob?.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Final Deal Amount (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={contractForm.dealAmount}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      dealAmount: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-transparent px-4 py-3 outline-none focus:border-emerald-500"
                />

                <p className="text-xs text-stone-500 mt-1">
                  Freelancer's proposed bid is pre-filled. You can adjust it.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Contract Start Date
                </label>

                <input
                  type="date"
                  required
                  min={getToday()}
                  value={contractForm.startDate}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-transparent px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Contract End Date
                </label>

                <input
                  type="date"
                  required
                  min={contractForm.startDate || getToday()}
                  value={contractForm.endDate}
                  onChange={(e) =>
                    setContractForm({
                      ...contractForm,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-transparent px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <p className="text-xs text-stone-500">
                Creating this contract will accept this application and
                reject other pending applications for the same job.
              </p>
            </div>

            <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex gap-3">
              <button
                type="button"
                onClick={closeContractModal}
                disabled={creatingContract || accepting}
                className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-3 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creatingContract || accepting}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold disabled:opacity-50"
              >
                {accepting
                  ? "Accepting..."
                  : creatingContract
                  ? "Creating..."
                  : "Accept & Create Contract"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
