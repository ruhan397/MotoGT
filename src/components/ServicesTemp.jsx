
import { useEffect, useState } from "react";
import "../styles/Services.css";
import accessoriesImage from "../assets/CPARTS.jpeg";
import paintImage from "../assets/DPAINT2.jpeg";

const sentences = [
  "“WE BELIEVE EVERY DETAIL DESERVES PERFECTION”",
  "“MADE TO KEEP YOUR CAR LOOKING ITS BEST.”"
];

function Services() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hideTimer;
    let nextTimer;
  
    const showSentence = () => {
      setVisible(true);
  
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 4000);
  
      nextTimer = setTimeout(() => {
        setSentenceIndex((current) => (current + 1) % sentences.length);
        showSentence();
      }, 5200);
    };
  
    const firstTimer = setTimeout(showSentence, 0);
  
    return () => {
      clearTimeout(firstTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, []);

  return (
    <>
      <section className="intro-strip" id="about">
      <div className="intro-quote-frame">
  <p className={`intro-label ${visible ? "is-visible" : "is-hidden"}`}>
    {sentences[sentenceIndex]}
  </p>
</div>
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
          <span className="card-number">
   <span className="number-dot"></span> ACCESSORIES
</span>
            <img
  src={accessoriesImage}
  alt="Car accessories at MotoGT"
  className="service-image"
/>
            <h3>Car Accessories</h3>
            <p>
              Find the finishing touches that make your car feel like yours.
            </p>
            <a href="#contact">Explore accessories ↗</a>
          </article>

          <article className="service-card paint-card" id="dent-paint">
          <span className="card-number">
  <span className="number-dot"></span> BODYWORK
</span>
            <img
  src={paintImage}
  alt="Car spray painting service at MotoGT"
  className="service-image"
/>
            <h3>Dent &amp; Paint</h3>
            <p>
              Bring back a cleaner look with careful dent repair and paintwork.
            </p>
            <a href="#contact">Discuss your car ↗</a>
          </article>
        </div>
      </section>
    </>
  );
}

export default Services;
