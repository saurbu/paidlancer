import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetJobsQuery,
  useGetMeQuery,
} from "../services/api";
import "../style/home.css";

const categories = [
  {
    name: "Web Development",
    icon: "⌘",
    skills: ["React", "Node.js", "JavaScript", "HTML", "CSS"],
  },
  {
    name: "UI/UX Design",
    icon: "✳",
    skills: ["UI/UX Design", "Figma", "Design"],
  },
  {
    name: "AI & Automation",
    icon: "✦",
    skills: ["Python", "AI", "Automation"],
  },
  {
    name: "Mobile Apps",
    icon: "▣",
    skills: ["React Native", "Android", "Mobile"],
  },
  {
    name: "Backend & APIs",
    icon: "◇",
    skills: ["Node.js", "Express", "MongoDB", "API"],
  },
  {
    name: "Content & Writing",
    icon: "✎",
    skills: ["Writing", "Content", "SEO"],
  },
];

const steps = [
  {
    number: "01",
    title: "Find your opportunity",
    description:
      "Explore projects, search by skill, and discover work that fits your goals.",
    icon: "⌕",
  },
  {
    number: "02",
    title: "Connect and agree",
    description:
      "Discuss expectations, agree on deliverables, and organize the project.",
    icon: "◇",
  },
  {
    number: "03",
    title: "Build and deliver",
    description:
      "Submit your work and follow progress through project milestones.",
    icon: "↗",
  },
];

function getJobsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data?.jobs)) return data.data.jobs;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatBudget(budget) {
  return `₹${Number(budget || 0).toLocaleString("en-IN")}`;
}

export default function Home() {
  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch,
  } = useGetJobsQuery();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All projects");

  const user =
    userData?.user ||
    userData?.data?.user ||
    userData?.currentUser ||
    null;

  const dashboard =
    user?.role === "client"
      ? "/client/dashboard"
      : "/freelancer/dashboard";

  const jobs = useMemo(
    () => getJobsFromResponse(jobsData),
    [jobsData]
  );

  const openJobs = useMemo(
    () => jobs.filter((job) => !job.status || job.status === "open"),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return openJobs.filter((job) => {
      const searchableText = [
        job.title,
        job.description,
        job.client?.name,
        job.companyName,
        ...(job.requiredSkills || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !term || searchableText.includes(term);

      const category = categories.find(
        (item) => item.name === selectedCategory
      );

      const matchesCategory =
        selectedCategory === "All projects" ||
        !category ||
        category.skills.some((skill) =>
          searchableText.includes(skill.toLowerCase())
        );

      return matchesSearch && matchesCategory;
    });
  }, [openJobs, search, selectedCategory]);

  const featuredJobs = filteredJobs.slice(0, 4);

  const scrollToJobs = () => {
    document.getElementById("home-jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const chooseCategory = (category) => {
    setSelectedCategory(category);
    setSearch("");
    scrollToJobs();
  };

  return (
    <main className="home-page overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--hero-bg)] px-4 sm:px-6 lg:px-8 pb-12 pt-14 text-[var(--text)] sm:pt-20 lg:pb-16">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--green-soft)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[400px] w-[400px] rounded-full bg-[var(--green-soft)] blur-3xl" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-[var(--muted)] sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              A BETTER WAY TO WORK TOGETHER
            </div>

            <h1 className="mt-7 text-5xl font-extrabold leading-[1.04] tracking-[-0.065em] sm:text-6xl lg:text-7xl xl:text-[82px]">
              Good work.
              <br />
              <span className="text-[var(--green)]">
                Better connections.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--muted)] sm:text-base">
              Find projects that challenge you, work with people who value
              your skills, and turn your next idea into something real.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToJobs}
                className="inline-flex items-center gap-3 rounded-xl bg-[var(--green)] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--green-hover)]"
              >
                Explore projects <span>↗</span>
              </button>

              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-bold text-[var(--text)] transition hover:border-[var(--green)] hover:text-[var(--green)]"
              >
                Hire talent <span>→</span>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-[var(--muted)] sm:text-xs">
              <span className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--green-soft)] text-[var(--green)]">
                  ✓
                </span>
                Skill-based discovery
              </span>
              <span className="text-[var(--muted)]">·</span>
              <span>Flexible projects</span>
              <span className="text-[var(--muted)]">·</span>
              <span>Clear milestones</span>
            </div>
          </div>

          {/* ORIGINAL HERO VISUAL */}
          <div className="relative mx-auto flex min-h-[310px] w-full max-w-lg items-center justify-center sm:min-h-[370px]">
            <div className="absolute h-56 w-[85%] rotate-[-20deg] rounded-[50%] border border-[var(--green)] sm:h-64" />
            <div className="absolute h-64 w-[70%] rotate-[35deg] rounded-[50%] border border-[var(--border)] sm:h-80" />
            <div className="absolute h-48 w-48 rounded-full bg-[var(--green-soft)] blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-[30px] bg-[var(--green)] text-6xl font-black tracking-[-0.1em] text-white shadow-[var(--shadow)] sm:h-32 sm:w-32 sm:text-7xl">
                P
              </div>
              <span className="text-[9px] font-bold tracking-[0.22em] text-[var(--muted)]">
                MAKE YOUR NEXT MOVE
              </span>
            </div>

            <div className="absolute right-0 top-5 z-20 flex max-w-[245px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl sm:right-1">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--green-soft)] text-xl text-[var(--green)]">
                ⌘
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">
                  Find your next project
                </p>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  Work that fits your skills
                </p>
              </div>
            </div>

            <div className="absolute bottom-5 left-0 z-20 flex max-w-[255px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl sm:bottom-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--green-soft)] text-xl text-[var(--green)]">
                ✓
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">
                  Progress made visible
                </p>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  Follow work milestone by milestone
                </p>
              </div>
            </div>

            <span className="absolute bottom-0 right-0 text-[8px] font-bold tracking-[0.15em] text-[var(--muted)]">
              YOUR NEXT CHAPTER STARTS HERE ↗
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            scrollToJobs();
          }}
          className="relative z-20 mx-auto mt-10 flex max-w-5xl flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <span className="text-2xl text-[var(--muted)]">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="What kind of project are you looking for?"
              aria-label="Search projects by title or skill"
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:ring-0"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[var(--green)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--green-hover)]"
          >
            Search projects <span>→</span>
          </button>
        </form>
      </section>

      {/* BENEFITS */}
      <section className="grid gap-5 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 lg:px-8 py-7 dark:border-[var(--border)] dark:bg-[var(--surface)] sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {[
          {
            icon: "⌕",
            title: "Find your fit",
            description: "Explore projects by skills and interests.",
          },
          {
            icon: "◇",
            title: "Work with clarity",
            description: "Agree on expectations before work begins.",
          },
          {
            icon: "↗",
            title: "Track your progress",
            description: "Keep deliverables and milestones organized.",
          },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-2xl text-[var(--green)] dark:bg-[var(--green-soft)] dark:text-[var(--green-hover)]">
              {item.icon}
            </span>
            <div>
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="mt-1 text-xs leading-6 text-[var(--muted)] dark:text-[var(--muted)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--green)] dark:text-[var(--green-hover)]">
              FIND YOUR SPACE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              What do you do best?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
              Choose a category to discover projects that match your skills.
            </p>
          </div>

          <button
            type="button"
            onClick={() => chooseCategory("All projects")}
            className="self-start text-sm font-bold transition hover:text-[var(--green)] dark:hover:text-[var(--green)] sm:self-auto"
          >
            Browse all projects →
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => chooseCategory(category.name)}
              className={`group flex min-h-24 items-center gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:border-[var(--green)] ${
                selectedCategory === category.name
                  ? "border-[var(--green)] bg-[var(--green-soft)] dark:border-[var(--green)] dark:bg-[var(--green-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)] dark:border-[var(--border)] dark:bg-[var(--surface)]"
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-2xl text-[var(--green)] dark:bg-[var(--green-soft)] dark:text-[var(--green-hover)]">
                {category.icon}
              </span>
              <span className="flex-1 text-sm font-bold">
                {category.name}
              </span>
              <span className="text-lg text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--green)] dark:group-hover:text-[var(--green-hover)]">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="home-jobs"
        className="scroll-mt-20 bg-[var(--bg)] px-4 sm:px-6 lg:px-8 py-16 dark:bg-[var(--bg)] sm:py-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--green)] dark:text-[var(--green-hover)]">
              THE MARKETPLACE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Projects worth your time.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
              Explore available opportunities and find your next challenge.
            </p>
          </div>

          <span className="self-start rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold dark:border-[var(--border)] dark:bg-[var(--surface)] sm:self-auto">
            {openJobs.length} open{" "}
            {openJobs.length === 1 ? "project" : "projects"}
          </span>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {["All projects", ...categories.slice(0, 4).map((item) => item.name)].map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "border-[var(--green)] bg-[var(--green)] text-white dark:border-[var(--green)] dark:bg-[var(--green)] dark:text-white"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--green)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-[var(--muted)]"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        {jobsLoading && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-16 text-center text-sm text-[var(--muted)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-[var(--muted)]">
            <span className="mx-auto mb-4 block h-6 w-6 animate-spin rounded-full border-2 border-[var(--green)] border-t-transparent dark:border-[var(--green)] dark:border-t-transparent" />
            Finding projects for you...
          </div>
        )}

        {jobsError && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center dark:border-[var(--border)] dark:bg-[var(--surface)]">
            <h3 className="text-lg font-bold">We couldn't load projects.</h3>
            <p className="mt-2 text-sm text-[var(--muted)] dark:text-[var(--muted)]">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-5 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white"
            >
              Try again →
            </button>
          </div>
        )}

        {!jobsLoading && !jobsError && featuredJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-16 text-center dark:border-[var(--border)] dark:bg-[var(--surface)]">
            <span className="text-3xl">⌕</span>
            <h3 className="mt-4 text-lg font-bold">
              No matching projects yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
              Try a different keyword or category to explore other opportunities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All projects");
              }}
              className="mt-4 text-sm font-bold text-[var(--green)] hover:underline dark:text-[var(--green-hover)]"
            >
              Clear filters →
            </button>
          </div>
        )}

        {!jobsLoading && !jobsError && featuredJobs.length > 0 && (
          <div className="grid gap-4">
            {featuredJobs.map((job) => (
              <article
                key={job._id}
                className="grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--green)] dark:border-[var(--border)] dark:bg-[var(--surface)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_190px]"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-xl font-extrabold text-[var(--green)] dark:bg-[var(--green-soft)] dark:text-[var(--green-hover)]">
                    {(job.title || "P").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                      {job.client?.name ||
                        job.companyName ||
                        "PaidLancer client"}
                    </p>

                    <h3 className="mt-2 break-words text-lg font-bold tracking-tight">
                      {job.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
                      {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.requiredSkills || []).slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] dark:border-[var(--border)] dark:text-[var(--muted)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4 dark:border-[var(--border)] sm:items-end lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div className="lg:text-right">
                    <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] dark:text-[var(--muted)]">
                      {job.budgetType === "hourly"
                        ? "HOURLY RATE"
                        : "PROJECT BUDGET"}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight">
                      {formatBudget(job.budget)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                      {job.budgetType === "hourly"
                        ? "Per hour"
                        : "Fixed price"}
                    </p>
                  </div>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-xs font-bold text-white transition hover:bg-[var(--green-hover)] dark:bg-[var(--green)] dark:text-white dark:hover:bg-[var(--green-hover)]"
                  >
                    View project <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!jobsLoading && !jobsError && filteredJobs.length > 4 && (
          <p className="mt-6 text-center text-xs text-[var(--muted)] dark:text-[var(--muted)]">
            Showing {featuredJobs.length} of {filteredJobs.length} matching projects.
            Refine your search to find a specific project.
          </p>
        )}
      </section>

      {/* FOR CLIENTS */}
      <section className="grid gap-10 bg-[var(--green)] px-4 sm:px-6 lg:px-8 py-16 text-white sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--green)]">
            FOR CLIENTS
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your next great
            <br />
            collaboration starts here.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-8 text-[var(--muted)]">
            Bring your ideas to life by connecting with people who have the
            skills to make them happen.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[var(--green)] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--green-hover)]"
          >
            Start hiring <span>↗</span>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 sm:col-span-2">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--green)]">
              01 / DEFINE
            </p>
            <h3 className="mt-4 text-lg font-bold">Share your project</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              Set the scope, budget, and skills you need.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--green)]">
              02 / CONNECT
            </p>
            <h3 className="mt-4 text-base font-bold">Find your people</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              Review proposals and agree on the details.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--green)]">
              03 / BUILD
            </p>
            <h3 className="mt-4 text-base font-bold">Make progress</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              Organize work into clear deliverables.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--green)] dark:text-[var(--green-hover)]">
            A CLEARER WAY TO COLLABORATE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            From first hello to finished work.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
            A straightforward workflow for clients and freelancers.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)] sm:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-soft)] text-lg font-extrabold text-[var(--green)] dark:bg-[var(--green-soft)] dark:text-[var(--green-hover)]">
                {step.number}
              </div>
              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 dark:border-[var(--border)] dark:bg-[var(--surface)] sm:p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-xl text-[var(--green)] dark:bg-[var(--green-soft)] dark:text-[var(--green-hover)]">
            ◇
          </span>
          <div>
            <h3 className="text-sm font-bold">
              Keep project milestones clear.
            </h3>
            <p className="mt-2 text-xs leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
              PaidLancer supports work submissions and payment tracking.
              Payment protection depends on the payment flow and terms
              configured for the contract.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {!userLoading && (
        <section className="mx-4 sm:mx-6 lg:mx-8 mb-12 flex flex-col gap-7 rounded-3xl border border-[var(--border)] bg-[var(--green-soft)] px-6 py-9 dark:border-[var(--border)] dark:bg-[var(--green)] sm:mb-16 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--green)] dark:text-[var(--green-hover)]">
              YOUR NEXT MOVE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {user
                ? "Keep building something great."
                : "Ready to make something happen?"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] dark:text-[var(--muted)]">
              {user
                ? "Pick up where you left off and keep your work moving forward."
                : "Find a project, build a collaboration, and get started."}
            </p>
          </div>

          {user ? (
            <Link
              to={dashboard}
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[var(--green)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--green-hover)] dark:bg-[var(--green)] dark:text-white dark:hover:bg-[var(--green-hover)]"
            >
              Open your dashboard <span>↗</span>
            </Link>
          ) : (
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[var(--green)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--green-hover)] dark:bg-[var(--green)] dark:text-white dark:hover:bg-[var(--green-hover)]"
              >
                Join PaidLancer <span>↗</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-bold transition hover:border-[var(--green)] dark:border-[var(--border)] dark:hover:border-[var(--green-hover)]"
              >
                I have an account
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
