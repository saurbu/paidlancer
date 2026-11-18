
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse jobs", href: "/#jobs" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Explore talent", href: "/#talent" },
    ],
  },
  {
    title: "For clients",
    links: [
      { label: "Post a project", to: "/client/dashboard" },
      { label: "Manage projects", to: "/client/dashboard" },
      { label: "Review proposals", to: "/client/dashboard" },
    ],
  },
  {
    title: "For freelancers",
    links: [
      { label: "Find work", href: "/#jobs" },
      { label: "My proposals", to: "/freelancer/dashboard" },
      { label: "My workspace", to: "/freelancer/dashboard" },
    ],
  },
];

function FooterLink({ item }) {
  const className = "paid-footer-link";

  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  const logo = theme === "light" ? "/logo.png" : "/logo1.png";

  return (
    <footer className="site-footer paid-footer">
      <div className="paid-footer-inner">
        <div className="paid-footer-main">
          {/* Brand */}
          <div className="paid-footer-brand-column">
            <Link
              to="/"
              className="paid-footer-brand"
              aria-label="PaidLancer home"
            >
              <img
                src={logo}
                alt="PaidLancer"
                className="paid-footer-logo"
              />
            </Link>

            <p className="paid-footer-description">
              A better way to find work, build trusted relationships, and hire
              great talent. PaidLancer brings clients and freelancers together
              to make meaningful work happen.
            </p>

            <div className="paid-footer-trust">
              <span aria-hidden="true">✓</span>
              <span>Built for better collaboration</span>
            </div>
          </div>

          {/* Navigation columns */}
          {columns.map((column) => (
            <div className="paid-footer-column" key={column.title}>
              <h3>{column.title}</h3>

              <nav aria-label={column.title}>
                {column.links.map((item) => (
                  <FooterLink item={item} key={item.label} />
                ))}
              </nav>
            </div>
          ))}

          {/* Account */}
          <div className="paid-footer-column paid-footer-account">
            <h3>Your account</h3>

            <Link to="/login" className="paid-footer-link">
              Log in
            </Link>

            <Link to="/register" className="paid-footer-link">
              Create an account
            </Link>

            <p className="paid-footer-small-note">
              Ready for your next opportunity?
            </p>

            <Link to="/register" className="paid-footer-cta">
              Get started
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="paid-footer-bottom">
          <p>
            © {new Date().getFullYear()} PaidLancer. All rights reserved.
          </p>

          <p className="paid-footer-made">
            Made for people who make things happen.
          </p>

          <nav
            className="paid-footer-bottom-links"
            aria-label="Footer navigation"
          >
            <Link to="/" className="paid-footer-link">
              Home
            </Link>

            <Link to="/login" className="paid-footer-link">
              Sign in
            </Link>

            <Link to="/register" className="paid-footer-link">
              Join PaidLancer
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
