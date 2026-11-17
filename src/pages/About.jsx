
import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

      {/* Hero Image */}
      <section className="about-hero"></section>

      {/* Hero Text */}
      <section className="about-hero-content">
        <span className="about-eyebrow">GET TO KNOW US</span>

        <h1>
          More Than Just
          <span> Automotive Care.</span>
        </h1>

        <p>
          Discover MotoGT — where your car's needs meet thoughtful
          service and a passion for automotive care.
        </p>
      </section>

      {/* Who We Are */}
      <section className="about-intro">
       

        <div className="about-intro-content">
          <h2>
            A Better Experience
            <span> for Every Drive.</span>
          </h2>

          <p>
            MotoGT brings automotive products and vehicle care services
            together in one place. Our goal is to make it easier for
            customers to find what their cars need through a convenient
            and customer-focused experience.
          </p>
        </div>
      </section>

      {/* Why Choose MotoGT */}
      <section className="about-why">
        <div className="about-section-heading">
          <span className="about-section-label">
            THE MOTOGT DIFFERENCE
          </span>

          <h2>
  Why Choose <span>MotoGT</span>?
</h2>

          <p>
            We believe automotive care should be convenient,
            thoughtful and customer-focused.
          </p>
        </div>

        
<div className="about-why-grid">

<article className="about-why-card">
  <span>01</span>
  <h3>Customer-Focused</h3>
  <p>
    We take time to understand your requirements and help you
    find the right products or services for your vehicle.
  </p>
</article>

<article className="about-why-card">
  <span>02</span>
  <h3>Attention to Detail</h3>
  <p>
    From selecting the right accessories to vehicle repair
    and painting, we focus on the details that make a difference.
  </p>
</article>

<article className="about-why-card">
  <span>03</span>
  <h3>Practical Solutions</h3>
  <p>
    Whether you need new car accessories or dent and paint
    services, we aim to provide solutions that suit your needs.
  </p>
</article>

<article className="about-why-card">
  <span>04</span>
  <h3>Clear Communication</h3>
  <p>
    From product enquiries to service appointments and order
    updates, we keep you informed throughout the process.
  </p>
</article>

</div>

      </section>

      {/* Our Commitment */}
      <section className="about-commitment">
        <span className="about-section-label">
          OUR COMMITMENT
        </span>

        <h2>
          Your Car Deserves
          <span> Thoughtful Care.</span>
        </h2>

        <p>
          At MotoGT, we are committed to creating a reliable and
          convenient experience for every customer — from choosing
          the right accessories to exploring vehicle care services.
        </p>
      </section>

    </div>
  );
}

export default About;
