
import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/MotoGT-logo-clean.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navigationLinks = (
    <div className="nav-links">
      <a
        href="/accessories"
        className={window.location.pathname === "/accessories" ? "active" : ""}
        onClick={closeMenu}
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
        onClick={closeMenu}
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
        onClick={closeMenu}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
        <span>About Us</span>
      </a>
    </div>
  );

  return (
    <nav className="navbar">
      {/* Logo */}
      <a href="/" className="brand" aria-label="MotoGT Home">
        <img src={logo} alt="MotoGT logo" />
      </a>

      {/* Desktop Navigation */}
      <div className="desktop-navigation">
        {navigationLinks}
      </div>

      {/* Right Side: Account Actions */}
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-login">
              Hello, {user.fullName}
            </span>

            <a className="nav-cta" href="/" onClick={handleLogout}>
              Logout ⟫
            </a>
          </>
        ) : (
          <>
            <a className="nav-login" href="/login" onClick={closeMenu}>
              Sign In
            </a>

            <a className="nav-cta" href="/register" onClick={closeMenu}>
              Claim Membership ⟫
            </a>
          </>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mobile-controls">
        <div className="mobile-account-actions">
          {user ? (
            <>
              <span className="nav-login">Hello, {user.fullName}</span>
              <a className="nav-cta" href="/" onClick={handleLogout}>
                Logout ⟫
              </a>
            </>
          ) : (
            <>
              <a className="nav-login" href="/login" onClick={closeMenu}>
                Sign In
              </a>
              <a className="nav-cta" href="/register" onClick={closeMenu}>
                Claim Membership ⟫
              </a>
            </>
          )}
        </div>

        <div className="menu-area">
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
            id="mobile-navigation"
          >
            {navigationLinks}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
