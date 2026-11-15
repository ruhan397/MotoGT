
import "../styles/Hero.css";
import logo from "../assets/MotoGT-logo-clean.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">

        <div className="hero-eyebrow">
          YOUR VISION. OUR CRAFT.
        </div>

        <div className="hero-logo-area">
          <div className="hero-logo-card">
            <span className="logo-card-line logo-card-line-top"></span>

            <img
              className="hero-logo"
              src={logo}
              alt="MotoGT logo"
            />

            <span className="logo-card-line logo-card-line-bottom"></span>
          </div>

          <div className="visual-caption">
            <span>CAR ACCESSORIES</span>
            <span className="caption-dot">•</span>
            <span>DENT &amp; PAINT</span>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            Make every drive
            <br />
            <em>distinct.</em>
          </h1>
        </div>

      </div>
    </section>
  );
}

export default Hero;
