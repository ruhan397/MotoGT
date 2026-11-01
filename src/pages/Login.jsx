import logo from "../assets/MotoGT-logo-clean.png";
import "../styles/Auth.css";

function Login() {
  return (
    <section className="auth-section">
      <div className="auth-card">
      <img src={logo} alt="MotoGT Logo" className="auth-logo" />
        <p className="auth-label">WELCOME BACK</p>

        <h1>Login to Your <span>Account.</span></h1>

        <p className="auth-description">
          Sign in to continue your journey with us.
        </p>

        <form className="auth-form">
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <button type="button">Login</button>
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
