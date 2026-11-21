
import { useEffect, useState } from "react";
import "../styles/DentPaint.css";
import paintImage from "../assets/DPAINT2.jpeg";
import { apiFetch } from "../utils/api";

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
  const [activeTab, setActiveTab] = useState("services");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    vehicleModel: "",
    service: "",
    preferredStartDate: "",
    problemDescription: "",
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("motogtToken");

  // Load available dates for both guests and logged-in customers
  useEffect(() => {
    const loadAvailableDates = async () => {
      try {
        const response = await apiFetch("appointments/available-dates");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load available dates."
          );
        }

        const dates = Array.isArray(data)
          ? data
          : data.availableDates || data.dates || [];

        setAvailableDates(
          dates
            .map((item) =>
              typeof item === "string" ? item : item.date
            )
            .filter(Boolean)
        );
      } catch (error) {
        setMessage(error.message || "Unable to load available dates.");
        setMessageType("error");
      } finally {
        setLoadingDates(false);
      }
    };

    loadAvailableDates();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!availableDates.includes(formData.preferredStartDate)) {
      setMessage("Please select an available appointment date.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch("appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your appointment request."
        );
      }

      setMessage(
        "Your appointment request has been submitted successfully. Your request is now Pending and will be reviewed by the MotoGT team."
      );
      setMessageType("success");

      setFormData({
        customerName: "",
        email: "",
        phone: "",
        vehicleModel: "",
        service: "",
        preferredStartDate: "",
        problemDescription: "",
      });
    } catch (error) {
      setMessage(
        error.message || "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
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
        <div
          className="dp-tabs"
          role="tablist"
          aria-label="Dent and Paint information"
        >
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
      </section>

      {/* Appointment Booking */}
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
          <p className="dp-form-note">
            {token
              ? "Your name and email will be taken from your MotoGT account."
              : "Please provide your name and email so our team can contact you."}
          </p>

          <div className="dp-form-grid">
            {!token && (
              <>
                <label>
                  Full Name
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                  />
                </label>
              </>
            )}

            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />
            </label>

            <label>
              Vehicle Model
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="e.g. Toyota Axio"
                required
              />
            </label>

            <label>
              Required Service
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="Dent Repair">Dent Repair</option>
                <option value="Scratch Removal">Scratch Removal</option>
                <option value="Body Painting">Body Painting</option>
              </select>
            </label>

            <label>
              Preferred Date
              <select
                name="preferredStartDate"
                value={formData.preferredStartDate}
                onChange={handleChange}
                required
                disabled={loadingDates || availableDates.length === 0}
              >
                <option value="">
                  {loadingDates
                    ? "Loading available dates..."
                    : availableDates.length === 0
                      ? "No dates currently available"
                      : "Select an available date"}
                </option>

                {availableDates.map((date) => (
                  <option value={date} key={date}>
                    {new Date(`${date}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </option>
                ))}
              </select>
            </label>

            <label className="dp-full-width">
              Describe the Problem
              <textarea
                name="problemDescription"
                rows="4"
                value={formData.problemDescription}
                onChange={handleChange}
                placeholder="Tell us about your vehicle and the work required..."
              />
            </label>
          </div>

          <button
            type="submit"
            className="dp-button"
            disabled={submitting || loadingDates || availableDates.length === 0}
          >
            {submitting
              ? "Submitting Request..."
              : "Submit Appointment Request ↗"}
          </button>

          {message && (
            <p
              className="dp-preview-message"
              role="status"
              style={{
                color: messageType === "success" ? "#4caf80" : "#d97777",
              }}
            >
              {message}
            </p>
          )}

          <p className="dp-form-note">
            Your appointment will remain Pending until reviewed by the MotoGT admin.
            Final approval depends on workshop capacity and the required work duration.
          </p>
        </form>
      </section>
    </main>
  );
}

export default DentPaint;
