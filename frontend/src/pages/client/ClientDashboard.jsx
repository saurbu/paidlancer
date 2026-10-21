
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetMeQuery,
  useGetJobsQuery,
  useLogoutMutation,
} from "../../services/api";
import ClientSidebar from "../../components/client/ClientSidebar";

function Icon({ name, size = 20 }) {
  const paths = {
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    briefcase: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 5V3h8v2M3 11h18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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
    close: <path d="m18 6-12 12M6 6l12 12" />,
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

function StatCard({ icon, label, value, caption }) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#191d19]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
          <Icon name={icon} size={20} />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-stone-500 dark:text-stone-400">
        {caption}
      </p>
    </div>
  );
}

function ProjectRow({ job }) {
  const skills = Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : [];

  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:border-emerald-300 sm:p-6 dark:border-white/10 dark:bg-[#191d19] dark:hover:border-emerald-700">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold sm:text-lg">
              {job.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                job.status === "open"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300"
              }`}
            >
              {job.status || "Open"}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
            {job.description || "No project description provided."}
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

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="briefcase" size={15} />
              {job.budgetType === "hourly" ? "Hourly budget" : "Fixed price"}
            </span>

            {job.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={15} />
                Due {new Date(job.deadline).toLocaleDateString()}
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
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-semibold transition hover:border-emerald-700 hover:text-emerald-800 dark:border-white/10 dark:hover:text-emerald-300"
          >
            View project <Icon name="arrow" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ClientDashboard() {
  const navigate = useNavigate();

  const { data: userData } = useGetMeQuery();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetJobsQuery();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user =
    userData?.user ||
    userData?.data?.user ||
    userData?.currentUser ||
    null;

  const jobs = Array.isArray(data)
    ? data
    : data?.jobs || data?.data?.jobs || data?.data || [];

  const myJobs = useMemo(() => {
    if (!Array.isArray(jobs) || !user?._id) return [];

    return jobs.filter((job) => {
      const clientId = job.client?._id || job.client;
      return clientId?.toString() === user._id.toString();
    });
  }, [jobs, user?._id]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return myJobs;

    return myJobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.requiredSkills?.some((skill) =>
          skill.toLowerCase().includes(query)
        )
      );
    });
  }, [myJobs, search]);

  const openJobs = myJobs.filter(
    (job) => job.status === "open"
  ).length;

  const upcomingDeadlines = myJobs.filter((job) => {
    if (!job.deadline) return false;

    const deadline = new Date(job.deadline);
    const now = new Date();
    const nextWeek = new Date();

    nextWeek.setDate(now.getDate() + 7);

    return deadline >= now && deadline <= nextWeek;
  }).length;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-stone-900 dark:bg-[#141713] dark:text-stone-100">
      {/* Mobile sidebar drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex h-full w-[min(300px,85vw)] flex-col bg-white shadow-2xl dark:bg-[#191d19]">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 px-4 dark:border-white/10">
              <span className="text-sm font-semibold">
                Your workspace
              </span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ClientSidebar
                user={user}
                onLogout={handleLogout}
                onNavigate={() => setMobileMenuOpen(false)}
                isLoggingOut={isLoggingOut}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard row: the sidebar is constrained to this row */}
      <div className="flex items-stretch">
        <aside className="hidden w-64 shrink-0 self-stretch lg:block">
          <div className="sticky top-[72px] h-[calc(100vh-72px)]">
            <ClientSidebar
              user={user}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </aside>

        <main className="min-h-screen min-w-0 flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium dark:border-white/10 dark:bg-[#191d19]"
              >
                <Icon name="menu" size={18} />
                Menu
              </button>
            </div>

            {/* Welcome section */}
            <section className="relative overflow-hidden rounded-3xl bg-[#eaf1e7] p-6 sm:p-9 lg:p-11 dark:bg-[#202d23]">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/30 dark:border-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-28 right-36 h-64 w-64 rounded-full border-[35px] border-emerald-900/[0.05]" />

              <div className="relative max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-900/65 dark:text-emerald-300">
                  CLIENT WORKSPACE
                </p>

                <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Let&apos;s make something great happen
                  {user?.name
                    ? `, ${user.name.split(" ")[0]}`
                    : ""}
                  .
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
                  Manage your projects, find the right talent, and keep
                  every milestone moving forward from one place.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/client/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c]"
                  >
                    <Icon name="plus" size={17} />
                    Post a new project
                  </Link>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-300/80 bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Explore marketplace
                    <Icon name="arrow" size={16} />
                  </Link>
                </div>
              </div>
            </section>

            {/* Overview statistics */}
            <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                icon="briefcase"
                label="Total projects"
                value={myJobs.length}
                caption="Projects posted from your client account"
              />

              <StatCard
                icon="arrow"
                label="Currently hiring"
                value={openJobs}
                caption="Projects that are currently open to freelancers"
              />

              <StatCard
                icon="clock"
                label="Upcoming deadlines"
                value={upcomingDeadlines}
                caption="Projects with a deadline in the next seven days"
              />
            </section>

            {/* Projects */}
            <section id="projects" className="mt-10 scroll-mt-24">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-800 dark:text-emerald-300">
                    PROJECT MANAGEMENT
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Your projects
                  </h2>

                  <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                    Keep track of the work you have posted.
                  </p>
                </div>

                <Link
                  to="/client/post-job"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#183f2c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c] sm:self-auto"
                >
                  <Icon name="plus" size={17} />
                  Post project
                </Link>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <Icon name="search" size={18} />
                  </span>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects, descriptions, or skills..."
                    className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 dark:border-white/10 dark:bg-[#191d19] dark:focus:border-emerald-500"
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

              <div className="mt-5">
                {isLoading ? (
                  <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#191d19] dark:text-stone-400">
                    Loading your projects...
                  </div>
                ) : isError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-400/20 dark:bg-red-400/5">
                    <p className="font-semibold text-red-800 dark:text-red-300">
                      Could not load your projects.
                    </p>

                    <p className="mt-2 text-sm text-red-700/80 dark:text-red-300/80">
                      Check your connection and try again.
                    </p>

                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center dark:border-white/15 dark:bg-[#191d19]">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                      <Icon name="briefcase" size={22} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                      {search
                        ? "No matching projects"
                        : "Your first project starts here"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
                      {search
                        ? "Try a different search term or clear your search."
                        : "Post a project to describe what you need and start finding the right freelancer."}
                    </p>

                    {search ? (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-5 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        Clear search
                      </button>
                    ) : (
                      <Link
                        to="/client/post-job"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183f2c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563c]"
                      >
                        <Icon name="plus" size={17} />
                        Post your first project
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <ProjectRow key={job._id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer is outside the sidebar/content row, so it spans the page */}
      <footer className="border-t border-stone-200 px-4 py-6 text-xs text-stone-500 dark:border-white/10 dark:text-stone-400 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PaidLancer</span>
          <span>Your workspace, all in one place.</span>
        </div>
      </footer>
    </div>
  );
}
