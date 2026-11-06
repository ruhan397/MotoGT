import { useState } from "react";
import logo from "../assets/MotoGT-logo-clean.png";
import "../styles/Auth.css";

function Login() {
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
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("motogtToken", data.token);
      localStorage.setItem("motogtUser", JSON.stringify(data.user));

      setMessage("Login successful!");

      window.location.href = "/";
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <img src={logo} alt="MotoGT Logo" className="auth-logo" />

        <p className="auth-label">WELCOME BACK</p>

        <h1>Login to Your <span>Account.</span></h1>

        <p className="auth-description">
          Sign in to continue your journey with us.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && <p>{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <a href="/register">Create Account</a>
        </p>

        <p className="guest-option">
          Or <a href="/">Continue as Guest</a>
        </p>
      </div>
    </section>
  );
}

export default Login;