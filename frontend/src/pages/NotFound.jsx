
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="state-panel mx-auto my-16 max-w-xl">
      <p className="section-kicker">404 · PAGE NOT FOUND</p>
      <h1 className="mt-4 text-4xl font-bold">Lost your way?</h1>
      <p className="muted mt-3 text-sm leading-6">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link to="/" className="button button-primary mt-6">
        Back to homepage →
      </Link>
    </main>
  );
}
