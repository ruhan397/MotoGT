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
        <a href="/accessories">Accessories</a>
        <a href="/dent-paint">Dent &amp; Paint</a>
        <a href="#about">About Us</a>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-login">
              Hello, {user.fullName}
            </span>

            <a
              className="nav-cta"
              href="/"
              onClick={handleLogout}
            >
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