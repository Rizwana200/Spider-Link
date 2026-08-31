import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const MyLostReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/lost/my");

      if (response.data.success) {
        setReports(response.data.reports || []);
      } else {
        setError(
          response.data.message ||
            "Unable to load reports."
        );
      }
    } catch (err) {
      console.error(
        "My lost reports error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your lost reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const imageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `${image}`;
  };

  const getStatus = (status) => {
    switch (status) {
      case "MATCHED":
        return {
          label: "Match Found",
          icon: "🟠",
          className:
            "bg-warning-subtle text-warning-emphasis",
          description:
            "A possible matching item has been found.",
        };

      case "RECOVERED":
        return {
          label: "Recovered",
          icon: "✅",
          className:
            "bg-success-subtle text-success",
          description:
            "This item has been successfully recovered.",
        };

      case "SEARCHING":
      default:
        return {
          label: "Searching",
          icon: "🔍",
          className:
            "bg-danger-subtle text-danger",
          description:
            "Spider-Link is searching for a possible match.",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">

        <div className="text-center">

          <div
            className="spinner-border"
            style={{
              color: "#d6336c",
            }}
          />

          <p className="text-muted mt-3">
            Loading your lost reports...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5">

      <div className="container">

        {/* HEADER */}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">

          <div>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background: "#ffe4ed",
                color: "#d6336c",
              }}
            >
              🕷️ MY REPORTS
            </span>

            <h1 className="fw-bold mt-3 mb-2">
              My Lost Items
            </h1>

            <p className="text-muted mb-0">
              Track your lost items and monitor
              recovery progress.
            </p>

          </div>

          <Link
            to="/report-lost"
            className="btn btn-spider rounded-pill px-4"
          >
            + Report Lost Item
          </Link>

        </div>

        {/* ERROR */}

        {error && (
          <div className="alert alert-danger rounded-4">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && reports.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div
                style={{
                  fontSize: "4rem",
                }}
              >
                🔍
              </div>

              <h4 className="fw-bold mt-3">
                No lost reports yet
              </h4>

              <p className="text-muted">
                Report your lost item and let
                Spider-Link start searching.
              </p>

              <Link
                to="/report-lost"
                className="btn btn-spider rounded-pill px-4"
              >
                Report Lost Item
              </Link>

            </div>

          </div>
        )}

        {/* REPORTS */}

        {reports.length > 0 && (
          <div className="row g-4">

            {reports.map((report) => {
              const status = getStatus(
                report.status
              );

              return (
                <div
                  className="col-12 col-md-6 col-xl-4"
                  key={report.id}
                >

                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                    {/* IMAGE */}

                    {report.image ? (
                      <img
                        src={imageUrl(report.image)}
                        alt={report.itemName}
                        className="w-100"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          height: "220px",
                          background:
                            "linear-gradient(135deg, #fff0f5, #f8e8ff)",
                          fontSize: "5rem",
                        }}
                      >
                        🔍
                      </div>
                    )}

                    <div className="card-body p-4">

                      {/* TITLE */}

                      <div className="d-flex justify-content-between align-items-start gap-2">

                        <div>

                          <h4 className="fw-bold mb-1">
                            {report.itemName}
                          </h4>

                          <div className="small text-muted">
                            {report.category} •{" "}
                            {report.color}
                          </div>

                        </div>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${status.className}`}
                        >
                          {status.icon}{" "}
                          {status.label}
                        </span>

                      </div>

                      {/* STATUS CARD */}

                      <div
                        className="rounded-4 p-3 mt-4"
                        style={{
                          background:
                            report.status ===
                            "RECOVERED"
                              ? "#eaf8ef"
                              : report.status ===
                                "MATCHED"
                              ? "#fff8e6"
                              : "#fff0f5",
                        }}
                      >

                        <div className="fw-semibold">
                          {status.icon}{" "}
                          {status.label}
                        </div>

                        <div className="small text-muted mt-1">
                          {status.description}
                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-4">

                        <div className="mb-2">
                          <span className="fw-semibold">
                            📍 Location
                          </span>

                          <div className="small text-muted mt-1">
                            {report.lostLocation}
                          </div>
                        </div>

                        <div className="mb-2">
                          <span className="fw-semibold">
                            📅 Lost Date
                          </span>

                          <div className="small text-muted mt-1">
                            {new Date(
                              report.lostDate
                            ).toLocaleDateString()}
                          </div>
                        </div>

                        <div>
                          <span className="fw-semibold">
                            📝 Description
                          </span>

                          <div className="small text-muted mt-1">
                            {report.description}
                          </div>
                        </div>

                      </div>

                      {/* MATCH BUTTON */}

                      {report.status ===
                        "MATCHED" && (
                        <Link
                          to={`/matches/lost/${report.id}`}
                          className="btn btn-warning w-100 rounded-pill mt-4 fw-semibold"
                        >
                          🕷️ View Possible Match
                        </Link>
                      )}

                      {/* RECOVERED */}

                      {report.status ===
                        "RECOVERED" && (
                        <div className="alert alert-success rounded-4 mt-4 mb-0">
                          <strong>
                            ✅ Item Recovered
                          </strong>

                          <div className="small mt-1">
                            This lost-item report has
                            been successfully resolved.
                          </div>
                        </div>
                      )}

                      {/* SEARCHING */}

                      {report.status ===
                        "SEARCHING" && (
                        <div
                          className="small text-center mt-4"
                          style={{
                            color: "#d6336c",
                          }}
                        >
                          🕷️ Spider-Link is searching
                          for your item...
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default MyLostReports;
