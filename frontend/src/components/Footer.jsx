
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const logo = theme === "light" ? "/logo.png" : "/logo1.png";

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link to="/" className="brand flex items-center">
          <img
            src={logo}
            alt="PaidLancer"
            className="h-10 w-30 object-contain"
          />
        </Link>

        <p className="muted text-sm">
          A better way to find work and hire talent.
        </p>

        <p className="muted text-xs">
          © {new Date().getFullYear()} PaidLancer
        </p>
      </div>
    </footer>
  );
}
