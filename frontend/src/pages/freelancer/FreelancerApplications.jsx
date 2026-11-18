
import { Link } from "react-router-dom";
import { useGetMyApplicationsQuery } from "../../services/api";

function StatCard({ label, value, color = "text-stone-900 dark:text-stone-100" }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#191d19]">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {label}
      </p>

      <p className={`mt-3 text-3xl font-semibold tracking-tight ${color}`}>
        {value}
      </p>

      <p className="mt-4 text-xs leading-5 text-stone-500 dark:text-stone-400">
        Your application overview
      </p>
    </article>
  );
}

function getStatus(application) {
  return String(application?.status || "pending").toLowerCase();
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FreelancerApplications() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetMyApplicationsQuery();

  const rawApplications =
    data?.applied ??
    data?.applications ??
    data?.appliedJobs ??
    data?.data?.applied ??
    data?.data?.applications ??
    data?.data?.appliedJobs ??
    [];

  const applications = Array.isArray(rawApplications)
    ? rawApplications
    : [];

  const pendingCount = applications.filter((app) =>
    ["pending", "applied"].includes(getStatus(app))
  ).length;

  const acceptedCount = applications.filter(
    (app) => getStatus(app) === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (app) => getStatus(app) === "rejected"
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f8f8f5] px-4 py-10 text-stone-500 dark:bg-[#141713] dark:text-stone-400 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          Loading your applications...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full bg-[#f8f8f5] px-4 py-10 dark:bg-[#141713] sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-4">
          <p className="text-red-600 dark:text-red-400">
            Failed to load your applications.
          </p>

          <button
            type="button"
            onClick={refetch}
            className="rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f5] text-stone-900 dark:bg-[#141713] dark:text-stone-100">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10">

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-[#eaf1e7] p-6 sm:p-9 lg:p-11 dark:bg-[#202d23]">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/30 dark:border-white/[0.04]" />

          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-900/65 dark:text-emerald-300">
              FREELANCER WORKSPACE
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              My Applications
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
              Track the jobs you've applied for, monitor your proposals,
              and stay updated on every application decision.
            </p>

            <div className="mt-7">
              <Link
                to="/freelancer/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
              >
                Discover jobs <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total applications"
            value={applications.length}
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            color="text-amber-600 dark:text-amber-400"
          />

          <StatCard
            label="Accepted"
            value={acceptedCount}
            color="text-emerald-700 dark:text-emerald-400"
          />

          <StatCard
            label="Rejected"
            value={rejectedCount}
            color="text-red-600 dark:text-red-400"
          />
        </section>

        {/* Applications heading */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-800 dark:text-emerald-300">
              YOUR ACTIVITY
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Submitted applications
            </h2>

            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Review your proposals and check their current status.
            </p>
          </div>

          {/* Empty state */}
          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center dark:border-white/15 dark:bg-[#191d19]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1e7] dark:bg-emerald-400/10">
                <span className="text-3xl">📄</span>
              </div>

              <h3 className="text-lg font-semibold">
                You haven't applied to any jobs yet
              </h3>

              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                Explore available opportunities and submit your first proposal.
              </p>

              <Link
                to="/freelancer/dashboard"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
              >
                Explore jobs <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const rawJob =
                  application.job || application.jobId;

                const job =
                  rawJob && typeof rawJob === "object"
                    ? rawJob
                    : {};

                const jobId =
                  job._id ||
                  job.id ||
                  (typeof rawJob === "string" ? rawJob : null);

                const status = getStatus(application);

                const statusStyles = {
                  accepted:
                    "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300",
                  rejected:
                    "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300",
                  pending:
                    "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
                  applied:
                    "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
                };

                const statusClass =
                  statusStyles[status] || statusStyles.pending;

                const title =
                  job.title ||
                  application.jobTitle ||
                  "Job application";

                return (
                  <article
                    key={application._id || application.id}
                    className="rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:border-emerald-300 sm:p-6 dark:border-white/10 dark:bg-[#191d19] dark:hover:border-emerald-700"
                  >
                    {/* Job header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold sm:text-lg">
                          {title}
                        </h3>

                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                          {job.client?.name
                            ? `Posted by ${job.client.name}`
                            : "Client"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Application details */}
                    <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Job Budget
                        </p>

                        <p className="mt-1 font-semibold">
                          {job.budget != null
                            ? `₹${Number(job.budget).toLocaleString("en-IN")}`
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Your Bid
                        </p>

                        <p className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">
                          {application.bidAmount != null
                            ? `₹${Number(application.bidAmount).toLocaleString("en-IN")}`
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Estimated Delivery
                        </p>

                        <p className="mt-1 font-semibold">
                          {application.estimatedDays
                            ? `${application.estimatedDays} days`
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Applied On
                        </p>

                        <p className="mt-1 font-semibold">
                          {formatDate(application.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Job Deadline
                        </p>

                        <p className="mt-1 font-semibold">
                          {formatDate(job.deadline)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Application Status
                        </p>

                        <p className="mt-1 font-semibold capitalize">
                          {status}
                        </p>
                      </div>
                    </div>

                    {/* Proposal */}
                    {(application.coverLetter ||
                      application.proposal ||
                      application.message) && (
                      <div className="mt-6 border-t border-stone-100 pt-5 dark:border-white/10">
                        <p className="text-sm font-semibold">
                          Your Proposal
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-500 dark:text-stone-400">
                          {application.coverLetter ||
                            application.proposal ||
                            application.message}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex flex-col justify-between gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center dark:border-white/10">
                      <p className="break-all text-xs text-stone-400">
                        Application ID: {application._id || application.id || "N/A"}
                      </p>

                      {jobId && (
                        <Link
                          to={`/jobs/${jobId}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold transition hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:hover:text-emerald-300"
                        >
                          View job <span aria-hidden="true">↗</span>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
