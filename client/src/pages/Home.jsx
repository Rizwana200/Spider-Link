import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className="spider-hero">
        <div className="container py-5">

          <div className="row align-items-center g-5">

            <div className="col-lg-7">

              <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-4">
                🕷️ AI-POWERED LOST & FOUND NETWORK
              </span>

              <h1 className="display-3 fw-bold lh-1 mb-4">
                Lost something?
                <br />

                <span className="spider-gradient-text">
                  Let Spider-Link find it.
                </span>
              </h1>

              <p className="lead text-secondary mb-4">
                Connect lost items with the people who find them.
                Spider-Link analyzes item details, descriptions,
                colors and locations to discover possible matches.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/report-lost"
                  className="btn btn-spider btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-search me-2"></i>
                  Report Lost Item
                </Link>

                <Link
                  to="/report-found"
                  className="btn btn-outline-dark btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-box-arrow-in-up me-2"></i>
                  I Found Something
                </Link>

              </div>

            </div>


            <div className="col-lg-5">

              <div className="spider-card p-4">

                <div className="text-center mb-4">

                  <div className="spider-icon mx-auto mb-3">
                    <i className="bi bi-diagram-3 fs-3"></i>
                  </div>

                  <h3 className="fw-bold">
                    Spider Sense
                  </h3>

                  <p className="text-secondary mb-0">
                    Intelligent matching engine
                  </p>

                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                  <span>Category</span>
                  <strong>30%</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                  <span>Color</span>
                  <strong>20%</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                  <span>Item details</span>
                  <strong>30%</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center py-3">
                  <span>Location</span>
                  <strong>10%</strong>
                </div>

                <div className="alert alert-light border mt-3 mb-0">
                  <i className="bi bi-stars me-2"></i>
                  Multiple signals combine to identify possible matches.
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}

      <section
        className="spider-section"
        id="how-it-works"
      >
        <div className="container">

          <div className="text-center mb-5">

            <span className="text-uppercase fw-bold small text-secondary">
              How it works
            </span>

            <h2 className="display-5 fw-bold mt-2">
              From lost to{" "}
              <span className="spider-gradient-text">
                reunited
              </span>
            </h2>

            <p className="text-secondary">
              Three simple steps connect your item to the right person.
            </p>

          </div>


          <div className="row g-4">

            {[
              {
                number: "01",
                icon: "bi-pencil-square",
                title: "Report",
                text: "Describe what you lost or found and add important details."
              },
              {
                number: "02",
                icon: "bi-cpu",
                title: "Spider Sense",
                text: "Our matching engine compares reports and calculates possible matches."
              },
              {
                number: "03",
                icon: "bi-people",
                title: "Reconnect",
                text: "Review a possible match and securely reconnect with the other person."
              }
            ].map((step) => (
              <div className="col-md-4" key={step.number}>

                <div className="spider-card h-100 p-4">

                  <span className="badge bg-light text-dark border mb-4">
                    {step.number}
                  </span>

                  <div className="spider-icon mb-4">
                    <i className={`bi ${step.icon} fs-4`}></i>
                  </div>

                  <h4 className="fw-bold">
                    {step.title}
                  </h4>

                  <p className="text-secondary mb-0">
                    {step.text}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* PRIVACY */}

      <section
        className="spider-section"
        id="privacy"
      >
        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-7">

              <span className="text-uppercase fw-bold small text-secondary">
                Privacy first
              </span>

              <h2 className="display-5 fw-bold mt-2">
                Finding your item
                <br />
                shouldn't mean{" "}
                <span className="spider-gradient-text">
                  losing privacy.
                </span>
              </h2>

              <p className="text-secondary lead">
                Spider-Link protects contact information while
                allowing users to review possible matches.
              </p>

              <div className="row g-3 mt-3">

                <div className="col-md-4">
                  <div className="spider-card p-3 h-100">
                    <i className="bi bi-lock fs-3 text-danger"></i>
                    <h6 className="fw-bold mt-3">
                      Protected
                    </h6>
                    <p className="small text-secondary mb-0">
                      Contact details are protected.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="spider-card p-3 h-100">
                    <i className="bi bi-person-check fs-3 text-success"></i>
                    <h6 className="fw-bold mt-3">
                      User Controlled
                    </h6>
                    <p className="small text-secondary mb-0">
                      Users control match decisions.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="spider-card p-3 h-100">
                    <i className="bi bi-shield-check fs-3 text-warning"></i>
                    <h6 className="fw-bold mt-3">
                      Secure
                    </h6>
                    <p className="small text-secondary mb-0">
                      JWT protected accounts.
                    </p>
                  </div>
                </div>

              </div>

            </div>


            <div className="col-lg-5">

              <div className="spider-card p-4 text-center">

                <div className="display-1 mb-3">
                  🔐
                </div>

                <h4 className="fw-bold">
                  Contact Information Protected
                </h4>

                <p className="text-secondary">
                  Possible matches can be reviewed before
                  sensitive contact details are revealed.
                </p>

                <button
                  className="btn btn-light border rounded-pill"
                  disabled
                >
                  CONTACT DETAILS LOCKED
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CTA */}

      <section className="spider-section">
        <div className="container">

          <div className="spider-card text-center p-5">

            <div className="display-4 mb-3">
              🕷️
            </div>

            <h2 className="display-6 fw-bold">
              Ready to reconnect?
            </h2>

            <p className="text-secondary">
              Create an account and start your recovery journey.
            </p>

            <Link
              to="/register"
              className="btn btn-spider rounded-pill px-4 py-2"
            >
              Join Spider-Link
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>

          </div>

        </div>
      </section>


      {/* FOOTER */}

      <footer className="spider-footer py-5">

        <div className="container">

          <div className="row g-4">

            <div className="col-md-6">

              <h4 className="fw-bold">
                🕷️ SPIDER-LINK
              </h4>

              <p className="text-white-50 mb-0">
                An intelligent lost and found recovery network.
              </p>

            </div>

            <div className="col-md-3">

              <h6>Platform</h6>

              <Link
                to="/report-lost"
                className="d-block mb-2"
              >
                Report Lost
              </Link>

              <Link
                to="/report-found"
                className="d-block mb-2"
              >
                Report Found
              </Link>

              <Link
                to="/login"
                className="d-block"
              >
                Login
              </Link>

            </div>

            <div className="col-md-3">

              <h6>Technology</h6>

              <a
                href="#how-it-works"
                className="d-block mb-2"
              >
                How It Works
              </a>

              <a
                href="#privacy"
                className="d-block"
              >
                Privacy
              </a>

            </div>

          </div>

          <hr className="border-secondary my-4" />

          <div className="d-flex justify-content-between flex-wrap gap-2 text-white-50 small">
            <span>
              © 2026 Spider-Link
            </span>

            <span>
              AI-powered recovery network
            </span>
          </div>

        </div>

      </footer>
    </>
  );
};

export default Home;