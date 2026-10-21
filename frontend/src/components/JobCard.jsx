
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
    return (
        <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500/60">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-7">
                    {job.title}
                </h3>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs capitalize text-emerald-400">
                    {job.status}
                </span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                {job.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill) => (
                    <span
                        key={skill}
                        className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <div className="mt-auto">
                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                    <div>
                        <p className="text-xs text-slate-500">Budget</p>
                        <p className="mt-1 font-semibold text-emerald-400">
                            ₹{Number(job.budget).toLocaleString("en-IN")}
                        </p>
                    </div>
                    <span className="text-sm capitalize text-slate-400">
                        {job.experience}
                    </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                    Posted by {job.client?.name || "Client"}
                </p>

                <Link
                    to={`/jobs/${job._id}`}
                    className="mt-5 block rounded-xl border border-slate-700 py-3 text-center text-sm font-semibold transition hover:border-indigo-400 hover:bg-indigo-500/10"
                >
                    View Details
                </Link>
            </div>
        </article>
    );
}
