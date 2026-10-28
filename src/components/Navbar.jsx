import "../styles/Navbar.css";
function Navbar() {
    return (
      <nav className="navbar">
        <div className="nav-links">
          <a href="#accessories">Accessories</a>
          <a href="#dent-paint">Dent &amp; Paint</a>
          <a href="#about">About Us</a>
        </div>
  
        <a className="nav-cta" href="#contact">
          Contact Us ⟫
        </a>
      </nav>
    )
  }
  
  export default Navbar
  