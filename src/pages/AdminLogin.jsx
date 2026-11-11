
import React, { useState } from "react";
import logo from "../assets/MotoGT-logo-clean.png";
import { apiFetch } from "../utils/api";
import "../styles/Auth.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
        const response = await apiFetch("/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server response is not valid JSON. HTTP Status: ${response.status}. Response: ${responseText.slice(0, 200)}`
        );
      }

if (!response.ok) {
  throw new Error(data.message || "Admin login failed.");
}
      console.log("Admin Login Check:", {
        tokenReceived: Boolean(data.token),
        userRole: data.user?.role,
        response: data,
      });
      if (!data.token || data.user?.role !== "admin") {
        setMessage(
          `Verification failed! Token: ${Boolean(data.token)}, Role: ${data.user?.role || "Missing"}`
        );
        return;
      }

      localStorage.setItem("motogtAdminToken", data.token);
      localStorage.setItem(
        "motogtAdminUser",
        JSON.stringify(data.user)
      );

      window.location.href = "/admin";
    } catch (error) {
      setMessage(error.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <img src={logo} alt="MotoGT Logo" className="auth-logo" />

        <p className="auth-label">ADMINISTRATOR ACCESS</p>

        <h1>
          Admin <span>Login.</span>
        </h1>

        <p className="auth-description">
          Sign in to access your MotoGT Admin Dashboard.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && <p>{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Admin Login"}
          </button>
        </form>

        <p className="auth-switch">
          <a href="/">Back to Website</a>
        </p>
      </div>
    </section>
  );
}

export default AdminLogin;
