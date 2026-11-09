
import { useState } from "react";
import "../styles/DentPaint.css";
import paintImage from "../assets/DPAINT2.jpeg";

const services = [
  {
    number: "01",
    name: "Dent Repair",
    description:
      "Restore your car's original body shape with professional dent repair.",
    features: [
      "Minor Dent Repair",
      "Panel Dent Repair",
      "Body Shape Restoration",
    ],
  },
  {
    number: "02",
    name: "Scratch Removal",
    description:
      "Improve your car's appearance by treating visible paint scratches.",
    features: [
      "Surface Scratch Treatment",
      "Paint Correction",
      "Polishing & Finishing",
    ],
  },
  {
    number: "03",
    name: "Body Painting",
    description:
      "Refresh individual panels or transform your vehicle with a complete paint job.",
    features: [
      "Single Panel Painting",
      "Multiple Panel Painting",
      "Full Body Painting",
    ],
  },
];

function DentPaint() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="dent-paint-page">
      <section className="dp-hero">
        <div className="dp-hero-content">
          <p className="dp-eyebrow">MOTOGT BODYWORK SERVICES</p>
          <h1>
            Restore the look.
            <br />
            <em>Refine every detail.</em>
          </h1>
          <p className="dp-hero-description">
            From minor dents to complete paintwork, bring back the
            appearance your car deserves with MotoGT.
          </p>
          <a href="#dp-services" className="dp-button">
            Explore Services ↗
          </a>
        </div>

        <div className="dp-hero-image">
          <img src={paintImage} alt="MotoGT dent and paint service" />
        </div>
      </section>

            {/* Dent & Paint Information Tabs */}
            <section className="dp-information" id="dp-services">
        <div className="dp-tabs" role="tablist" aria-label="Dent and Paint information">
          <button
            type="button"
            className={activeTab === "services" ? "dp-tab active" : "dp-tab"}
            onClick={() => setActiveTab("services")}
            role="tab"
            aria-selected={activeTab === "services"}
          >
            What We Offer
          </button>

          <button
            type="button"
            className={activeTab === "finishes" ? "dp-tab active" : "dp-tab"}
            onClick={() => setActiveTab("finishes")}
            role="tab"
            aria-selected={activeTab === "finishes"}
          >
            Paint & Finish
          </button>

          <button
            type="button"
            className={activeTab === "process" ? "dp-tab active" : "dp-tab"}
            onClick={() => setActiveTab("process")}
            role="tab"
            aria-selected={activeTab === "process"}
          >
            Our Work Process
          </button>

          <button
            type="button"
            className={activeTab === "why" ? "dp-tab active" : "dp-tab"}
            onClick={() => setActiveTab("why")}
            role="tab"
            aria-selected={activeTab === "why"}
          >
            Why Choose MotoGT
          </button>
        </div>

        {/* What We Offer */}
        {activeTab === "services" && (
          <section className="dp-services">
            <div className="dp-section-heading">
              <p className="dp-eyebrow">WHAT WE OFFER</p>
              <h2>
                Care for every
                <em> detail.</em>
              </h2>
              <p>
                Professional bodywork solutions designed to bring
                your vehicle back to its best.
              </p>
            </div>

            <div className="dp-service-banners">
              {services.map((service) => (
                <article className="dp-service-banner" key={service.number}>
                  <div className="dp-banner-dot"></div>

                  <div className="dp-banner-main">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>

                  <div className="dp-banner-details">
                    {service.features.map((feature) => (
                      <div className="dp-banner-feature" key={feature}>
                        <span>✦</span>
                        {feature}
                      </div>
                    ))}

                    <span className="dp-price">
                      Custom quote after inspection
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Paint & Finish Options */}
        {activeTab === "finishes" && (
          <section className="dp-finishes">
            <div className="dp-section-heading">
              <p className="dp-eyebrow">MAKE IT YOUR FINISH</p>
              <h2>
                Choose your
                <em> finish.</em>
              </h2>
              <p>
                Explore different paint finishes to give your
                vehicle the look and character you want.
              </p>
            </div>

            <div className="dp-finish-grid">
              <article className="dp-finish-card">
                <span className="dp-finish-number">01</span>
                <div className="dp-finish-swatch dp-gloss"></div>
                <h3>Gloss Finish</h3>
                <p>A smooth, reflective surface with a classic polished look.</p>
              </article>

              <article className="dp-finish-card">
                <span className="dp-finish-number">02</span>
                <div className="dp-finish-swatch dp-matte"></div>
                <h3>Matte Finish</h3>
                <p>A subtle, non-glossy appearance for a modern style.</p>
              </article>

              <article className="dp-finish-card">
                <span className="dp-finish-number">03</span>
                <div className="dp-finish-swatch dp-metallic"></div>
                <h3>Metallic Finish</h3>
                <p>A refined finish with a distinctive metallic shimmer.</p>
              </article>

              <article className="dp-finish-card">
                <span className="dp-finish-number">04</span>
                <div className="dp-finish-swatch dp-pearl"></div>
                <h3>Pearl Finish</h3>
                <p>A premium finish with a soft, changing reflective effect.</p>
              </article>
            </div>
          </section>
        )}

        {/* Our Work Process */}
        {activeTab === "process" && (
          <section className="dp-process">
            <div className="dp-section-heading">
              <p className="dp-eyebrow">HOW WE WORK</p>
              <h2>
                From inspection
                <em> to perfection.</em>
              </h2>
              <p>
                Every detail matters. Our process ensures
                professional care from start to finish.
              </p>
            </div>

            <div className="dp-process-grid">
              <article className="dp-process-card">
                <span className="dp-process-number">01</span>
                <div className="dp-process-icon">⌕</div>
                <h3>Vehicle Inspection</h3>
                <p>
                  We carefully inspect your vehicle to identify
                  the damage and understand the work required.
                </p>
              </article>

              <article className="dp-process-card">
                <span className="dp-process-number">02</span>
                <div className="dp-process-icon">✦</div>
                <h3>Repair & Painting</h3>
                <p>
                  Our service process focuses on restoring
                  your vehicle with careful repair and finishing.
                </p>
              </article>

              <article className="dp-process-card">
                <span className="dp-process-number">03</span>
                <div className="dp-process-icon">✓</div>
                <h3>Quality Check</h3>
                <p>
                  We review the completed work before preparing
                  your vehicle for delivery.
                </p>
              </article>
            </div>
          </section>
        )}

        {/* Why Choose MotoGT */}
        {activeTab === "why" && (
          <section className="dp-why-choose">
            <div className="dp-section-heading">
              <p className="dp-eyebrow">THE MOTOGT DIFFERENCE</p>
              <h2>
                Why choose
                <em> MotoGT?</em>
              </h2>
              <p>
                Your vehicle deserves attention, precision
                and care at every stage.
              </p>
            </div>

            <div className="dp-why-grid">
              <article className="dp-why-card">
                <span className="dp-why-icon">✦</span>
                <h3>Attention to Detail</h3>
                <p>
                  We focus on every visible detail to achieve a clean and refined finish.
                </p>
              </article>

              <article className="dp-why-card">
                <span className="dp-why-icon">◇</span>
                <h3>Professional Care</h3>
                <p>
                  Each vehicle receives careful inspection and a service approach suited to its needs.
                </p>
              </article>

              <article className="dp-why-card">
                <span className="dp-why-icon">◎</span>
                <h3>Quality Materials</h3>
                <p>
                  We aim to use suitable materials for dependable repair and finishing results.
                </p>
              </article>

              <article className="dp-why-card">
                <span className="dp-why-icon">✓</span>
                <h3>Customer Satisfaction</h3>
                <p>
                  We value clear communication and your satisfaction throughout the service.
                </p>
              </article>
            </div>
          </section>
        )}
      </section>

      <section className="dp-booking" id="dp-booking">
        <div className="dp-booking-heading">
          <p className="dp-eyebrow">LET'S GET STARTED</p>
          <h2>
            Book your
            <em> appointment.</em>
          </h2>
          <p>
            Tell us about your vehicle and the service you need.
          </p>
        </div>

        <form className="dp-booking-form" onSubmit={handleSubmit}>
          <div className="dp-form-grid">
            <label>
              Full Name
              <input type="text" placeholder="Your full name" required />
            </label>

            <label>
              Phone Number
              <input type="tel" placeholder="Your phone number" required />
            </label>

            <label>
              Vehicle Model
              <input type="text" placeholder="e.g. Toyota Axio" required />
            </label>

            <label>
              Required Service
              <select defaultValue="" required>
                <option value="" disabled>Select a service</option>
                <option>Dent Repair</option>
                <option>Scratch Removal</option>
                <option>Body Painting</option>
              </select>
            </label>

            <label>
              Preferred Date
              <input type="date" required />
            </label>

            <label className="dp-full-width">
              Describe the Problem
              <textarea
                rows="4"
                placeholder="Tell us about your vehicle and the work required..."
              />
            </label>
          </div>

          <button type="submit" className="dp-button">
            Preview Appointment Request ↗
          </button>

          {submitted && (
            <p className="dp-preview-message">
              Appointment form preview completed.
              Booking requests are not saved yet.
              The backend booking system will be connected in a later update.
            </p>
          )}

          <p className="dp-form-note">
            Appointment booking is currently a frontend preview.
          </p>
        </form>
      </section>
    </main>
  );
}

export default DentPaint;
