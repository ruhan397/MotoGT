import "../styles/Services.css";
function Services() {
    return (
      <>
        <section className="intro-strip" id="about">
        <p className="intro-label">
  <span className="intro-dot"></span>
  BUILT AROUND YOUR CAR
</p>
          <p>Driven by faith, guided by honesty. Quality service and care for every journey.</p>
        </section>
  
        <section className="services" id="accessories">
          <div className="section-heading">
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              Two ways to make<br />
              your car <em>stand out.</em>
            </h2>
          </div>
  
          <div className="service-grid">
            <article className="service-card accessories-card">
              <span className="card-number">01 / ACCESSORIES</span>
              <div className="service-symbol">✳</div>
              <h3>Car Accessories</h3>
              <p>
                Find the finishing touches that make your car feel like yours.
              </p>
              <a href="#contact">Explore accessories ↗</a>
            </article>
  
            <article className="service-card paint-card" id="dent-paint">
              <span className="card-number">02 / BODYWORK</span>
              <div className="service-symbol">◈</div>
              <h3>Dent &amp; Paint</h3>
              <p>
                Bring back a cleaner look with careful dent repair and paintwork.
              </p>
              <a href="#contact">Discuss your car ↗</a>
            </article>
          </div>
        </section>
      </>
    )
  }
  
  export default Services
  