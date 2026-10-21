
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetJobsQuery } from "../services/api";

const skills = ["React", "Node.js", "UI/UX Design", "MongoDB", "Python"];

export default function Home() {
  const { data, isLoading, isError, refetch } = useGetJobsQuery();
  const [search, setSearch] = useState("");

  const jobs = Array.isArray(data)
    ? data
    : data?.jobs || data?.data?.jobs || data?.data || [];

  const openJobs = useMemo(
    () => jobs.filter((job) => !job.status || job.status === "open"),
    [jobs]
  );

  const filteredJobs = openJobs.filter((job) => {
    const term = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.requiredSkills?.some((skill) => skill.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            YOUR NEXT OPPORTUNITY STARTS HERE
          </div>

          <h1>
            Great work starts
            <br />
            with the <span className="hero-highlight">right match.</span>
          </h1>

          <p className="hero-description">
            Find meaningful projects, connect with talented people, and build
            something worth being proud of.
          </p>

          <form
            className="hero-search"
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("jobs")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <span className="search-icon">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try “React developer” or “website design”"
              aria-label="Search jobs"
            />
            <button type="submit" className="button button-primary">
              Find work
            </button>
          </form>

          <div className="popular-skills">
            <span className="muted text-sm">Popular:</span>
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setSearch(skill);
                  document.getElementById("jobs")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="skill-chip"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-art">
            <div className="art-circle art-circle-one" />
            <div className="art-circle art-circle-two" />
            <div className="art-center">
              <span className="art-sparkle">✳</span>
              <p>Work that</p>
              <p className="art-emphasis">moves you.</p>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon">↗</span>
              <div>
                <strong>New opportunities</strong>
                <small>Find your next project</small>
              </div>
            </div>
            <div className="floating-note note-bottom">
              <span className="note-icon">✓</span>
              <div>
                <strong>Work on your terms</strong>
                <small>Your skills. Your future.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <p>BUILT FOR PEOPLE WHO MAKE THINGS HAPPEN</p>
        <div>
          <span>✳ Independent talent</span>
          <span>↗ Real opportunities</span>
          <span>◇ Flexible work</span>
        </div>
      </section>

      <section id="jobs" className="jobs-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">THE MARKETPLACE</p>
            <h2>Find your next project.</h2>
            <p className="muted mt-2 text-sm">
              Explore opportunities and turn your skills into meaningful work.
            </p>
          </div>
          <span className="job-count">{openJobs.length} opportunities</span>
        </div>

        {isLoading && (
          <div className="state-panel">Finding opportunities...</div>
        )}

        {isError && (
          <div className="state-panel">
            <p>We couldn't load jobs right now.</p>
            <button className="text-link mt-3" onClick={refetch}>
              Try again →
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredJobs.length === 0 && (
          <div className="state-panel">
            <h3 className="font-semibold">No matching jobs yet</h3>
            <p className="muted mt-2 text-sm">
              Try another keyword or check back for new opportunities.
            </p>
            {search && (
              <button
                className="text-link mt-3"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && filteredJobs.length > 0 && (
          <div className="job-list">
            {filteredJobs.map((job) => (
              <article key={job._id} className="market-job">
                <div className="company-avatar">
                  {(job.client?.name || job.companyName || "P")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="market-job-main">
                  <p className="job-company">
                    {job.client?.name || job.companyName || "PaidLancer client"}
                  </p>
                  <h3>{job.title}</h3>
                  <p className="market-job-description">{job.description}</p>

                  <div className="market-skills">
                    {(job.requiredSkills || []).slice(0, 5).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="market-job-aside">
                  <strong>
                    ₹{Number(job.budget || 0).toLocaleString("en-IN")}
                  </strong>
                  <span>
                    {job.budgetType === "hourly" ? "Hourly rate" : "Fixed price"}
                  </span>
                  <Link to={`/jobs/${job._id}`} className="text-link">
                    View details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bottom-cta">
          <div>
            <h3>Ready for your next chapter?</h3>
            <p>Join a community built around better work.</p>
          </div>
          <Link to="/register" className="button button-light">
            Create your account →
          </Link>
        </div>
      </section>
    </div>
  );
}
