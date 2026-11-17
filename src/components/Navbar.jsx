
import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/MotoGT-logo-clean.png";

function Navbar() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("motogtUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("motogtToken");
    localStorage.removeItem("motogtUser");
    setUser(null);
  };

  return (
    <nav className="navbar">

      {/* MotoGT Logo - Home Link */}
      <a href="/" className="brand" aria-label="MotoGT Home">
        <img src={logo} alt="MotoGT logo" />
      </a>

      {/* Center Navigation */}
      <div className="nav-links">

        <a
          href="/accessories"
          className={window.location.pathname === "/accessories" ? "active" : ""}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Accessories</span>
        </a>

        <a
          href="/dent-paint"
          className={window.location.pathname === "/dent-paint" ? "active" : ""}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h10v13H7z" />
            <path d="M9 7V4h6v3M10 11h4M12 20v2" />
            <path d="M17 10h2l2 2v3h-4" />
          </svg>
          <span>Dent &amp; Paint</span>
        </a>

        <a
          href="/about"
          className={window.location.pathname === "/about" ? "active" : ""}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          <span>About Us</span>
        </a>

      </div>

      {/* Right Side Actions */}
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-login">Hello, {user.fullName}</span>
            <a className="nav-cta" href="/" onClick={handleLogout}>
              Logout ⟫
            </a>
          </>
        ) : (
          <>
            <a className="nav-login" href="/login">
              Sign In
            </a>
            <a className="nav-cta" href="/register">
              Claim Membership ⟫
            </a>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
