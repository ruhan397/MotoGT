
import { useState } from "react";
import "../styles/DentPaint.css";
import paintImage from "../assets/DPAINT2.jpeg";

const services = [
  {
    number: "01",
    name: "Dent Repair",
    description:
      "Repair dents and restore your vehicle's original body shape with careful workmanship.",
  },
  {
    number: "02",
    name: "Scratch Removal",
    description:
      "Improve scratched and damaged paint surfaces for a cleaner, smoother finish.",
  },
  {
    number: "03",
    name: "Body Painting",
    description:
      "Refresh individual panels or give your vehicle a complete paint transformation.",
  },
];

function DentPaint() {
  const [submitted, setSubmitted] = useState(false);

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

      <section className="dp-services" id="dp-services">
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

        <div className="dp-service-grid">
          {services.map((service) => (
            <article className="dp-service-card" key={service.number}>
              <span className="dp-number">{service.number}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="dp-price">Price after inspection</span>
            </article>
          ))}
        </div>
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
                <option>Full Body Painting</option>
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
