import "../styles/Navbar.css";
function Navbar() {
    return (
      <nav className="navbar">
        <div className="nav-links">
          <a href="#accessories">Accessories</a>
          <a href="#dent-paint">Dent &amp; Paint</a>
          <a href="#about">About Us</a>
        </div>
  
        <div className="nav-actions">
          <a className="nav-login" href="/login">
            Login
          </a>

          <a className="nav-cta" href="#contact">
            Contact Us ⟫
          </a>
        </div>
      </nav>
    )
  }
  
  export default Navbar
  