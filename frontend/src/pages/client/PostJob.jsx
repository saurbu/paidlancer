import { Link, useNavigate } from "react-router-dom";
import { useCreateJobMutation } from "../../services/api";
import JobForm from "../../components/client/JobForm";

export default function PostJob() {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleSubmit = async (jobData) => {
    await createJob(jobData).unwrap();
    navigate("/client/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-8 text-stone-900 sm:px-7 sm:py-12 dark:bg-[#141713] dark:text-stone-100">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/client/dashboard"
          className="text-sm font-medium text-stone-500 transition hover:text-emerald-800 dark:hover:text-emerald-300"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
            NEW PROJECT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us what you need
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500 dark:text-stone-400">
            Add your project details and budget to start finding the right
            freelancer.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-8 dark:border-white/10 dark:bg-[#191d19]">
          <JobForm onSubmit={handleSubmit} isSubmitting={isLoading} />
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-stone-500 dark:text-stone-400">
          Review your project details before publishing.
        </p>
      </div>
    </main>
  );
}
