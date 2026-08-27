import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        navigate(from, {
          replace: true,
        });
      } else {
        setError(
          response.data.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 login-page d-flex align-items-center">

      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            <div className="card border-0 shadow-lg rounded-4">

              <div className="card-body p-4 p-md-5">

                {/* BRAND */}

                <div className="text-center mb-4">

                  <div
                    className="mb-2"
                    style={{ fontSize: "3rem" }}
                  >
                    🕷️
                  </div>

                  <h2 className="fw-bold mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-muted">
                    Sign in to continue to Spider-Link.
                  </p>

                </div>

                {/* ERROR */}

                {error && (
                  <div
                    className="alert alert-danger rounded-3"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* LOGIN FORM */}

                <form onSubmit={handleSubmit}>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="email"
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="mb-4">

                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="current-password"
                    />

                  </div>

                  {/* BUTTON */}

                 <button
  type="submit"
  className="btn btn-lg w-100 rounded-pill fw-semibold"
  style={{
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    boxShadow: "0 6px 15px rgba(37, 117, 252, 0.25)",
  }}
  disabled={loading}
>
  {loading ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        aria-hidden="true"
      />
      Signing In...
    </>
  ) : (
    "Sign In"
  )}
</button>

                </form>

                {/* REGISTER */}

                <div className="text-center mt-4">

                  <span className="text-muted">
                    Don't have an account?
                  </span>{" "}

                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none spider-gradient-text"
                  >
                    Create Account
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;