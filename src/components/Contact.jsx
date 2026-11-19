
import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage('');
    setFormError(false);

    try {
      const response = await apiFetch('/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not submit your request.');
      }

      setFormMessage('Your enquiry has been submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormError(true);
      setFormMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <p className="eyebrow">LET'S TALK ABOUT YOUR CAR</p>

      <div className="contact-phone">
        <div className="phone-side-button phone-side-left"></div>
        <div className="phone-side-button phone-side-right"></div>

        <div className="phone-screen">
          <div className="phone-camera"></div>

          <div className="phone-screen-content">
            <h2>
              GOT A
              <br />
              PROJECT
              <br />
              IN <em>MIND?</em>
            </h2>

            <p>Let's make it happen.</p>
            <span className="phone-line"></span>
          </div>

          <div className="phone-whatsapp">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.5a10.5 10.5 0 0 1-5.3-1.4l-.4-.2-3.9 1 1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.5zm5.8-7.9c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4 2.4 3.7 5.8 5.1c.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z"
              />
            </svg>
          </div>
        </div>
      </div>

      <p>
        Contact MotoGT to ask about accessories or dent and paint work.
      </p>

      <a
        className="primary-btn nav-cta"
        href="https://wa.me/"
        target="_blank"
        rel="noreferrer"
      >
        Get in Touch ⟫
      </a>

      <div className="contact-form-wrapper">
        <div className="contact-form-heading">
          <p className="eyebrow">SEND AN ENQUIRY</p>
          <h2>How can we help?</h2>
          <p>
            Tell us what you need and our team will get back to you.
          </p>
        </div>

        <form className="contact-enquiry-form" onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="message"
            placeholder="Tell us about your requirements..."
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          />

          <button
            type="submit"
            className="contact-submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>

          {formMessage && (
            <p
              className={`contact-form-message ${
                formError ? 'error' : 'success'
              }`}
              role="status"
            >
              {formMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
