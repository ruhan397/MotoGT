
import "../styles/Auth.css";

function Register() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <p className="auth-label">JOIN MOTOGT</p>

        <h1>Create <span>Account.</span></h1>

        <p className="auth-description">
          Create your account and get started with MotoGT.
        </p>

        <form className="auth-form">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Create a password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" />

          <button type="button">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </section>
  );
}

export default Register;
