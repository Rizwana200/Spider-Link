import { useEffect, useState } from "react";
import axios from "axios";

const API = "";

function MyFoundReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/found/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.reports || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = (image) => {
    if (!image) return null;

    return image.startsWith("http")
      ? image
      : `${API}${image}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" />
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="mb-4">
        <span className="badge bg-success-subtle text-success">
          MY REPORTS
        </span>

        <h2 className="fw-bold mt-2">
          My Found Items
        </h2>
      </div>

      {reports.length === 0 ? (
        <div className="alert alert-light border">
          You have not reported any found items yet.
        </div>
      ) : (
        <div className="row g-4">

          {reports.map((report) => (
            <div
              className="col-md-6 col-lg-4"
              key={report.id}
            >
              <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">

                {report.image && (
                  <img
                    src={imageUrl(report.image)}
                    className="card-img-top"
                    alt={report.itemName}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">

                  <div className="d-flex justify-content-between">

                    <h5 className="fw-bold">
                      {report.itemName}
                    </h5>

                    <span
                      className={`badge ${
                        report.status === "MATCHED"
                          ? "bg-warning text-dark"
                          : report.status === "RETURNED"
                          ? "bg-success"
                          : "bg-success"
                      }`}
                    >
                      {report.status}
                    </span>

                  </div>

                  <p className="text-muted">
                    {report.category} • {report.color}
                  </p>

                  <p>
                    {report.description}
                  </p>

                  <div className="small text-muted">
                    📍 {report.foundLocation}
                  </div>

                  <div className="small text-muted mt-1">
                    📅{" "}
                    {new Date(
                      report.foundDate
                    ).toLocaleDateString()}
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default MyFoundReports;
