import "../styles/Hero.css";
import logo from '../assets/GTM.jpeg'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">YOUR VISION. OUR CRAFT.</p>

        <h1>
          Make every<br />
          drive <em>distinct.</em>
        </h1>

        <p className="hero-copy">
          “Driven by faith, guided by honesty. Quality service and care for
          every journey.”
        </p>
      </div>

      <div className="hero-visual">
        <img
          className="hero-logo"
          src={logo}
          alt="MotoGT logo"
        />
        <div className="visual-caption">
         <span>CAR ACCESSORIES</span>
         <span>DENT &amp; PAINT</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
