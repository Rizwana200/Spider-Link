import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 700);
      } else {
        setError(
          response.data.message || "Registration failed."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 register-page d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <div
                    className="mb-2"
                    style={{ fontSize: "3rem" }}
                  >
                    🕷️
                  </div>

                  <h2 className="fw-bold mb-2">
                    Join Spider-Link
                  </h2>

                  <p className="text-muted">
                    Create your account and reconnect
                    with your lost belongings.
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger rounded-3"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="alert alert-success rounded-3"
                    role="alert"
                  >
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fw-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="name"
                    />
                  </div>

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
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="new-password"
                    />

                    <small className="text-muted">
                      Minimum 6 characters
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-spider btn-lg w-100 rounded-pill fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?
                  </span>{" "}

                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none spider-gradient-text"
                  >
                    Login
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

export default Register;