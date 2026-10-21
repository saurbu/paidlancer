import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  requiredSkills: "",
  budgetType: "fixed",
  budget: "",
  experience: "intermediate",
  deadline: "",
};

export default function JobForm({ onSubmit, isSubmitting = false }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const skills = form.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!skills.length) {
      setError("Enter at least one required skill.");
      return;
    }

    if (Number(form.budget) <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        requiredSkills: skills,
        budgetType: form.budgetType,
        budget: Number(form.budget),
        experience: form.experience,
        deadline: form.deadline,
      });
    } catch (submitError) {
      setError(
        submitError?.data?.message ||
          submitError?.message ||
          "Could not post the project. Please try again."
      );
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 dark:border-white/10 dark:bg-[#191d19] dark:focus:border-emerald-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="text-sm font-semibold">
          Project title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={updateField}
          required
          maxLength={120}
          placeholder="e.g. Build a MERN stack e-commerce website"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-semibold">
          Project description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={updateField}
          required
          rows={6}
          placeholder="Explain your project, requirements, and expected deliverables..."
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="requiredSkills" className="text-sm font-semibold">
          Required skills
        </label>
        <input
          id="requiredSkills"
          name="requiredSkills"
          value={form.requiredSkills}
          onChange={updateField}
          required
          placeholder="React, Node.js, Express, MongoDB"
          className={fieldClass}
        />
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          Separate each skill with a comma.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budgetType" className="text-sm font-semibold">
            Payment type
          </label>
          <select
            id="budgetType"
            name="budgetType"
            value={form.budgetType}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="fixed">Fixed price</option>
            <option value="hourly">Hourly rate</option>
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-semibold">
            {form.budgetType === "hourly" ? "Hourly rate (₹)" : "Budget (₹)"}
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="1"
            step="1"
            value={form.budget}
            onChange={updateField}
            required
            placeholder="25000"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="experience" className="text-sm font-semibold">
            Experience level
          </label>
          <select
            id="experience"
            name="experience"
            value={form.experience}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="text-sm font-semibold">
            Project deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={form.deadline}
            onChange={updateField}
            required
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/5 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end dark:border-white/10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold transition hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#183f2c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24563c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Posting project..." : "Publish project"}
        </button>
      </div>
    </form>
  );
}
