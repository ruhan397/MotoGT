import { useState } from "react";
import "../styles/Navbar.css";

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
      <div className="nav-links">
        <a href="/" className={window.location.pathname === "/" ? "active" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v12h14V9M9 21v-7h6v7" />
          </svg>
          <span>Home</span>
        </a>

        <a href="/accessories" className={window.location.pathname === "/accessories" ? "active" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Accessories</span>
        </a>

        <a href="/dent-paint" className={window.location.pathname === "/dent-paint" ? "active" : ""}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M7 7h10v13H7z" />
  <path d="M9 7V4h6v3M10 11h4M12 20v2" />
  <path d="M17 10h2l2 2v3h-4" />
</svg>
          <span>Dent &amp; Paint</span>
        </a>

        <a href="#about">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          <span>About Us</span>
        </a>
      </div>

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