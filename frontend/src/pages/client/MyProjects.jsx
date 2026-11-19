
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyJobsQuery } from "../../services/api";

function Icon({ name, size = 20 }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 5V3h8v2M3 11h18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.6 9A7 7 0 0 1 17 6l3 6M4 12l3 6a7 7 0 0 0 11.4-3" />
      </>
    ),
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function ProjectCard({ job }) {
  const skills = Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : [];

  const statusStyles = {
    open: "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300",
    in_progress:
      "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    completed:
      "bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-300",
    closed:
      "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300",
  };

  const status = job.status || "open";

  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:border-emerald-300 sm:p-6 dark:border-white/10 dark:bg-[#191d19] dark:hover:border-emerald-700">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">
              {job.title}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                statusStyles[status] ||
                "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300"
              }`}
            >
              {status.replaceAll("_", " ")}
            </span>
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-500 dark:text-stone-400">
            {job.description || "No description provided."}
          </p>

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:bg-white/[0.06] dark:text-stone-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="briefcase" size={15} />
              {job.budgetType === "hourly" ? "Hourly" : "Fixed price"}
            </span>

            {job.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={15} />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-lg font-semibold">
            ₹{Number(job.budget || 0).toLocaleString("en-IN")}
            {job.budgetType === "hourly" && (
              <span className="text-xs font-normal text-stone-500">
                {" "}/ hr
              </span>
            )}
          </p>

          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold transition hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:hover:text-emerald-300"
          >
            View project
            <Icon name="arrow" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function MyProjects() {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetMyJobsQuery();

  const jobs = Array.isArray(data)
    ? data
    : data?.jobs || data?.data?.jobs || data?.data || [];

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return jobs;

    return jobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.status?.toLowerCase().includes(query) ||
        job.requiredSkills?.some((skill) =>
          skill.toLowerCase().includes(query)
        )
      );
    });
  }, [jobs, search]);

  const openJobs = jobs.filter((job) => job.status === "open").length;

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-stone-900 dark:bg-[#141713] dark:text-stone-100">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-800 dark:text-emerald-300">
              PROJECT MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Projects
            </h1>

            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Manage and track all the projects you have posted.
            </p>
          </div>

          <Link
            to="/client/post-job"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
          >
            <Icon name="plus" size={17} />
            Post a project
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-[#191d19]">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Total projects
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {jobs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-[#191d19]">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Open projects
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {openJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-[#191d19]">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Other projects
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {jobs.length - openJobs}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <Icon name="search" size={18} />
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your projects..."
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-700 dark:border-white/10 dark:bg-[#191d19] dark:focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-stone-50 disabled:opacity-60 dark:border-white/10 dark:bg-[#191d19] dark:hover:bg-white/5"
          >
            <span className={isFetching ? "animate-spin" : ""}>
              <Icon name="refresh" size={17} />
            </span>
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Project list */}
        <div className="mt-6">
          {isLoading ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#191d19]">
              Loading your projects...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-400/20 dark:bg-red-400/5">
              <p className="font-semibold text-red-800 dark:text-red-300">
                Unable to load your projects.
              </p>

              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                Please try again.
              </p>

              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center dark:border-white/15 dark:bg-[#191d19]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                <Icon name="briefcase" size={22} />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {search ? "No matching projects" : "No projects yet"}
              </h3>

              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                {search
                  ? "Try searching with another keyword."
                  : "Your posted projects will appear here."}
              </p>

              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold dark:border-white/10"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  to="/client/post-job"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-4 py-3 text-sm font-semibold text-white"
                >
                  <Icon name="plus" size={17} />
                  Post your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <ProjectCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
