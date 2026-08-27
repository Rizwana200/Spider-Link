import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    lost: 0,
    found: 0,
    notifications: 0,
  });

  const [recentLost, setRecentLost] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          lostResponse,
          foundResponse,
          notificationResponse,
        ] = await Promise.all([
          API.get("/lost/my"),
          API.get("/found/my"),
          API.get("/notifications/unread-count"),
        ]);

        const lostReports =
          lostResponse.data.reports || [];

        setStats({
          lost: lostReports.length,
          found:
            foundResponse.data.reports?.length || 0,
          notifications:
            notificationResponse.data
              .unreadCount || 0,
        });

        // Show latest 3 lost reports
        setRecentLost(
          lostReports.slice(0, 3)
        );

      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getStatus = (status) => {
    if (status === "MATCHED") {
      return {
        text: "Match Found",
        icon: "🟠",
        className:
          "bg-warning-subtle text-warning-emphasis",
      };
    }

    if (status === "RECOVERED") {
      return {
        text: "Recovered",
        icon: "✅",
        className:
          "bg-success-subtle text-success",
      };
    }

    return {
      text: "Searching",
      icon: "🔍",
      className:
        "bg-danger-subtle text-danger",
    };
  };

  return (
    <div className="dashboard-page">

      {/* ================= HERO ================= */}

      <section className="py-5">

        <div className="container">

          <div className="row align-items-center g-4">

            <div className="col-lg-7">

              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  background: "#ffe4ed",
                  color: "#d6336c",
                }}
              >
                🕷️ SPIDER-LINK RECOVERY NETWORK
              </span>

              <h1 className="display-5 fw-bold mb-3">

                Welcome back,{" "}

                <span className="spider-gradient-text">
                  {user.name || "User"}
                </span>

                !

              </h1>

              <p className="lead text-muted mb-4">
                Lost something? Found something?
                Spider-Link helps connect the right
                people and bring belongings back home.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/report-lost"
                  className="btn btn-spider btn-lg rounded-pill px-4"
                >
                  🔍 Report Lost Item
                </Link>

                <Link
                  to="/report-found"
                  className="btn btn-outline-dark btn-lg rounded-pill px-4"
                >
                  📦 Report Found Item
                </Link>

              </div>

            </div>

            <div className="col-lg-5">

              <div
                className="rounded-4 p-5 text-center shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #fff0f5, #f8e8ff)",
                }}
              >

                <div
                  style={{
                    fontSize: "7rem",
                  }}
                >
                  🕷️
                </div>

                <h4 className="fw-bold mt-3">
                  Your Recovery Network
                </h4>

                <p className="text-muted mb-0">
                  Every report increases the chance
                  of finding what you lost.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="pb-5">

        <div className="container">

          <div className="row g-4">

            {/* LOST */}

            <div className="col-md-4">

              <Link
                to="/my-lost-reports"
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        background: "#ffe5ee",
                        fontSize: "1.5rem",
                      }}
                    >
                      🔍
                    </div>

                    <h3 className="fw-bold text-dark">
                      {loading
                        ? "..."
                        : stats.lost}
                    </h3>

                    <p className="text-muted mb-2">
                      Lost Reports
                    </p>

                    <span
                      className="fw-semibold"
                      style={{
                        color: "#d6336c",
                      }}
                    >
                      View My Reports →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

            {/* FOUND */}

            <div className="col-md-4">

              <Link
                to="/my-found-reports"
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        background: "#eee4ff",
                        fontSize: "1.5rem",
                      }}
                    >
                      📦
                    </div>

                    <h3 className="fw-bold text-dark">
                      {loading
                        ? "..."
                        : stats.found}
                    </h3>

                    <p className="text-muted mb-2">
                      Found Reports
                    </p>

                    <span
                      className="fw-semibold"
                      style={{
                        color: "#8e44ad",
                      }}
                    >
                      View My Reports →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

            {/* NOTIFICATIONS */}

            <div className="col-md-4">

              <Link
                to="/notifications"
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        background: "#fff0d9",
                        fontSize: "1.5rem",
                      }}
                    >
                      🔔
                    </div>

                    <h3 className="fw-bold text-dark">
                      {loading
                        ? "..."
                        : stats.notifications}
                    </h3>

                    <p className="text-muted mb-2">
                      Unread Notifications
                    </p>

                    <span
                      className="fw-semibold"
                      style={{
                        color: "#e67e22",
                      }}
                    >
                      View Notifications →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================= RECENT LOST ITEMS ================= */}

      {!loading &&
        recentLost.length > 0 && (

          <section className="pb-5">

            <div className="container">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                  <h3 className="fw-bold mb-1">
                    Your Lost Items
                  </h3>

                  <p className="text-muted mb-0">
                    Check the current status of your
                    recent reports.
                  </p>

                </div>

                <Link
                  to="/my-lost-reports"
                  className="fw-semibold text-decoration-none"
                  style={{
                    color: "#d6336c",
                  }}
                >
                  View All →
                </Link>

              </div>

              <div className="row g-4">

                {recentLost.map((report) => {

                  const status = getStatus(
                    report.status
                  );

                  return (
                    <div
                      className="col-md-6 col-lg-4"
                      key={report.id}
                    >

                      <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                          <div className="d-flex justify-content-between align-items-start gap-2">

                            <div>

                              <h5 className="fw-bold mb-1">
                                {report.itemName}
                              </h5>

                              <small className="text-muted">
                                {report.category}
                              </small>

                            </div>

                            <span
                              className={`badge rounded-pill px-3 py-2 ${status.className}`}
                            >
                              {status.icon}{" "}
                              {status.text}
                            </span>

                          </div>

                          <hr />

                          <div className="small text-muted mb-2">
                            📍 {report.lostLocation}
                          </div>

                          <div className="small text-muted">
                            📅{" "}
                            {new Date(
                              report.lostDate
                            ).toLocaleDateString()}
                          </div>

                          {report.status ===
                            "MATCHED" && (
                            <div className="alert alert-warning rounded-3 mt-3 mb-0 py-2 small">
                              🕷️ A possible match
                              was found.
                            </div>
                          )}

                          {report.status ===
                            "SEARCHING" && (
                            <div
                              className="small mt-3"
                              style={{
                                color: "#d6336c",
                              }}
                            >
                              🔍 Spider-Link is
                              searching...
                            </div>
                          )}

                          {report.status ===
                            "RECOVERED" && (
                            <div className="alert alert-success rounded-3 mt-3 mb-0 py-2 small">
                              ✅ Item recovered
                              successfully.
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>
        )}

      {/* ================= QUICK ACTIONS ================= */}

      <section className="pb-5">

        <div className="container">

          <h3 className="fw-bold mb-4">
            What would you like to do?
          </h3>

          <div className="row g-4">

            <div className="col-md-6">

              <Link
                to="/report-lost"
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-1 mb-3">
                      🔎
                    </div>

                    <h4 className="fw-bold text-dark">
                      I Lost Something
                    </h4>

                    <p className="text-muted">
                      Create a detailed lost-item
                      report with location,
                      description, color and image.
                    </p>

                    <span
                      className="fw-semibold"
                      style={{
                        color: "#d6336c",
                      }}
                    >
                      Create Lost Report →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

            <div className="col-md-6">

              <Link
                to="/report-found"
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-1 mb-3">
                      🤝
                    </div>

                    <h4 className="fw-bold text-dark">
                      I Found Something
                    </h4>

                    <p className="text-muted">
                      Report a found item and let
                      Spider-Link automatically
                      search for its owner.
                    </p>

                    <span
                      className="fw-semibold"
                      style={{
                        color: "#d6336c",
                      }}
                    >
                      Create Found Report →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;