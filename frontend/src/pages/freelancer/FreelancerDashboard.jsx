
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetJobsQuery,
  useGetMyApplicationsQuery,
} from "../../services/api";

function StatCard({ label, value, description }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#191d19]">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-4 text-xs leading-5 text-stone-500 dark:text-stone-400">
        {description}
      </p>
    </article>
  );
}

function JobCard({ job }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:border-emerald-300 sm:p-6 dark:border-white/10 dark:bg-[#191d19] dark:hover:border-emerald-700">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold sm:text-lg">
              {job.title}
            </h3>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
              {job.status || "open"}
            </span>
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-500 dark:text-stone-400">
            {job.description || "No description provided."}
          </p>

          {Array.isArray(job.requiredSkills) &&
            job.requiredSkills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.requiredSkills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:bg-white/[0.06] dark:text-stone-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500 dark:text-stone-400">
            {job.experience && (
              <span>Experience: {job.experience}</span>
            )}

            {job.deadline && (
              <span>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {job.client?.name && (
            <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">
              Posted by {job.client.name}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-lg font-semibold">
            ₹{Number(job.budget || 0).toLocaleString("en-IN")}
          </p>

          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-semibold transition hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:hover:text-emerald-300"
          >
            View job <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function getApplicationStatus(application) {
  return String(application?.status || "pending").toLowerCase();
}

export default function FreelancerDashboard() {
  const [search, setSearch] = useState("");

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch: refetchJobs,
    isFetching: jobsFetching,
  } = useGetJobsQuery();

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
    refetch: refetchApplications,
  } = useGetMyApplicationsQuery();

  const allJobs = Array.isArray(jobsData?.jobs)
    ? jobsData.jobs
    : Array.isArray(jobsData?.data?.jobs)
      ? jobsData.data.jobs
      : Array.isArray(jobsData)
        ? jobsData
        : [];

  const applications =
    applicationsData?.applied ??
    applicationsData?.applications ??
    applicationsData?.appliedJobs ??
    applicationsData?.data?.applied ??
    applicationsData?.data?.applications ??
    applicationsData?.data?.appliedJobs ??
    [];

  const myApplications = Array.isArray(applications)
    ? applications
    : [];

  const openJobs = useMemo(
    () => allJobs.filter((job) => job.status === "open"),
    [allJobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return openJobs;

    return openJobs.filter((job) => {
      const matchesTitle = job.title?.toLowerCase().includes(query);

      const matchesDescription = job.description
        ?.toLowerCase()
        .includes(query);

      const matchesSkills = job.requiredSkills?.some((skill) =>
        skill.toLowerCase().includes(query)
      );

      return matchesTitle || matchesDescription || matchesSkills;
    });
  }, [openJobs, search]);

  const pendingCount = myApplications.filter((application) =>
    ["pending", "applied"].includes(
      getApplicationStatus(application)
    )
  ).length;

  const acceptedCount = myApplications.filter(
    (application) =>
      getApplicationStatus(application) === "accepted"
  ).length;

  return (
    <div className="min-h-screen w-full bg-[#f8f8f5] text-stone-900 dark:bg-[#141713] dark:text-stone-100">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10">

        {/* Welcome section */}
        <section className="relative overflow-hidden rounded-3xl bg-[#eaf1e7] p-6 sm:p-9 lg:p-11 dark:bg-[#bc6847]">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/30 dark:border-white/[0.04]" />

          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-900/65 dark:text-emerald-300">
              FREELANCER WORKSPACE
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Find work that moves you forward.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
              Explore available projects, find opportunities
              that match your skills, and keep track of your
              applications from one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#discover-jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
              >
                Explore jobs <span aria-hidden="true">↗</span>
              </a>

              <Link
                to="/freelancer/applications"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300/80 bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                My applications
              </Link>
            </div>
          </div>
        </section>

        {/* Overview statistics */}
        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Available jobs"
            value={jobsLoading ? "—" : openJobs.length}
            description="Open projects you can explore"
          />

          <StatCard
            label="My applications"
            value={applicationsLoading ? "—" : myApplications.length}
            description="Applications submitted from your account"
          />

          <StatCard
            label="Awaiting response"
            value={applicationsLoading ? "—" : pendingCount}
            description="Applications awaiting a decision"
          />
        </section>

        {/* Discover jobs */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-800 dark:text-emerald-300">
                OPPORTUNITIES
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Discover jobs
              </h2>

              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                Find projects that match your skills.
              </p>
            </div>

            <Link
              to="/freelancer/applications"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold transition hover:border-emerald-700 dark:border-white/10 dark:bg-[#191d19] dark:hover:text-emerald-300 sm:self-auto"
            >
              Track applications <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, descriptions, or skills..."
              aria-label="Search available jobs"
              className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 dark:border-white/10 dark:bg-[#191d19] dark:focus:border-emerald-500"
            />

            <button
              type="button"
              onClick={() => refetchJobs()}
              disabled={jobsFetching}
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-stone-50 disabled:opacity-60 dark:border-white/10 dark:bg-[#191d19] dark:hover:bg-white/5"
            >
              {jobsFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div id="discover-jobs" className="mt-5 space-y-4">
            {jobsLoading ? (
              <p className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#191d19]">
                Loading available jobs...
              </p>
            ) : jobsError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-400/20 dark:bg-red-400/5">
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Could not load available jobs.
                </p>

                <button
                  type="button"
                  onClick={() => refetchJobs()}
                  className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center dark:border-white/15 dark:bg-[#191d19]">
                <h3 className="text-base font-semibold">
                  {search
                    ? "No matching jobs"
                    : "No open jobs available"}
                </h3>

                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  {search
                    ? "Try searching for a different skill or title."
                    : "Check back later for new opportunities."}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-4 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold dark:border-white/10"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            )}
          </div>
        </section>

        {/* Application progress */}
        <section className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#191d19]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Application progress
              </h2>

              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Keep up with responses to your proposals.
              </p>
            </div>

            <Link
              to="/freelancer/applications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
            >
              View applications <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {applicationsLoading ? (
            <p className="mt-5 text-sm text-stone-500">
              Loading application progress...
            </p>
          ) : applicationsError ? (
            <div className="mt-5 text-sm text-stone-500">
              <p>Could not load application progress.</p>

              <button
                type="button"
                onClick={() => refetchApplications()}
                className="mt-2 font-semibold text-emerald-800 dark:text-emerald-300"
              >
                Try again
              </button>
            </div>
          ) : myApplications.length === 0 ? (
            <p className="mt-5 text-sm leading-6 text-stone-500 dark:text-stone-400">
              You haven't applied to any jobs yet. Explore the
              available jobs above to get started.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-stone-50 p-4 dark:bg-white/[0.04]">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Awaiting response
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-4 dark:bg-white/[0.04]">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Accepted
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {acceptedCount}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
