import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API ="";

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ======================================================
  // FETCH MATCH
  // ======================================================

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/matches/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatch(response.data.match);

      setMessage("");
    } catch (error) {
      console.error(
        "Fetch match error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load match"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ACCEPT MATCH
  // ======================================================

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("token");

      const response = await axios.patch(
        `${API}/api/matches/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message
      );

      // IMPORTANT:
      // Fetch again so the button/status changes
      // immediately and stays correct.
      await fetchMatch();
    } catch (error) {
      console.error(
        "Accept match error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to accept match"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // REJECT MATCH
  // ======================================================

  const handleReject = async () => {
    try {
      setActionLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("token");

      const response = await axios.patch(
        `${API}/api/matches/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message
      );

      setTimeout(() => {
        navigate("/notifications");
      }, 1000);
    } catch (error) {
      console.error(
        "Reject match error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to reject match"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (!match) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {message || "Match not found"}
        </div>
      </div>
    );
  }

  const lost =
    match.LostReport;

  const found =
    match.FoundReport;

  // ======================================================
  // USER ACCEPTANCE STATES
  // ======================================================

  const lostAccepted =
    match.lostUserAccepted === true;

  const foundAccepted =
    match.foundUserAccepted === true;

  const currentUserAccepted =
    match.currentUserAccepted === true;

  const bothAccepted =
    lostAccepted &&
    foundAccepted;

  const contactRevealed =
    match.contactRevealed === true ||
    bothAccepted;

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-10">

          <div className="card border-0 shadow-lg rounded-4">

            <div className="card-body p-4 p-md-5">

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="text-center mb-4">

                <span className="badge bg-warning text-dark px-3 py-2">
                  POSSIBLE MATCH
                </span>

                <h2 className="fw-bold mt-3">
                  Spider-Link Match
                </h2>

                <p className="text-muted">
                  Our matching system found similarities
                  between these reports.
                </p>

                <div className="display-6 fw-bold text-danger">
                  {match.score}%
                </div>

                <small className="text-muted">
                  Match confidence
                </small>

              </div>

              {/* ==================================================
                  MESSAGE
              ================================================== */}

              {message && (
                <div className="alert alert-info">
                  {message}
                </div>
              )}

              {/* ==================================================
                  REPORTS
              ================================================== */}

              <div className="row g-4">

                {/* ==================================================
                    LOST ITEM
                ================================================== */}

                <div className="col-md-6">

                  <div className="card bg-danger-subtle border-0 rounded-4 h-100">

                    <div className="card-body">

                      <h5 className="fw-bold text-danger">
                        🔴 Lost Item
                      </h5>

                      <hr />

                      <h4>
                        {lost?.itemName}
                      </h4>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {lost?.category}
                      </p>

                      <p>
                        <strong>
                          Color:
                        </strong>{" "}
                        {lost?.color}
                      </p>

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {lost?.lostLocation}
                      </p>

                      <p>
                        {lost?.description}
                      </p>

                    </div>
                  </div>

                </div>

                {/* ==================================================
                    FOUND ITEM
                ================================================== */}

                <div className="col-md-6">

                  <div className="card bg-success-subtle border-0 rounded-4 h-100">

                    <div className="card-body">

                      <h5 className="fw-bold text-success">
                        🟢 Found Item
                      </h5>

                      <hr />

                      <h4>
                        {found?.itemName}
                      </h4>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {found?.category}
                      </p>

                      <p>
                        <strong>
                          Color:
                        </strong>{" "}
                        {found?.color}
                      </p>

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {found?.foundLocation}
                      </p>

                      <p>
                        {found?.description}
                      </p>

                    </div>
                  </div>

                </div>

              </div>

              {/* ==================================================
                  ACCEPTANCE STATUS
              ================================================== */}

              <div className="card mt-4 border-0 bg-light rounded-4">

                <div className="card-body">

                  <h5 className="fw-bold mb-3">
                    Match Acceptance Status
                  </h5>

                  <div className="mb-2">

                    <strong>
                      Lost user:
                    </strong>{" "}

                    {lostAccepted ? (
                      <span className="text-success fw-semibold">
                        ✓ Accepted
                      </span>
                    ) : (
                      <span className="text-warning">
                        ⏳ Waiting
                      </span>
                    )}

                  </div>

                  <div>

                    <strong>
                      Found user:
                    </strong>{" "}

                    {foundAccepted ? (
                      <span className="text-success fw-semibold">
                        ✓ Accepted
                      </span>
                    ) : (
                      <span className="text-warning">
                        ⏳ Waiting
                      </span>
                    )}

                  </div>

                </div>
              </div>

              {/* ==================================================
                  ACTION BUTTONS
              ================================================== */}

              <div className="mt-4 text-center">

                {/* ----------------------------------------------
                    CURRENT USER ALREADY ACCEPTED
                ---------------------------------------------- */}

                {currentUserAccepted && (
                  <div className="alert alert-success">

                    <strong>
                      ✓ You already accepted this match.
                    </strong>

                    <br />

                    {bothAccepted
                      ? "Both users have accepted. Contact details are available."
                      : "Waiting for the other user to accept."}

                  </div>
                )}

                {/* ----------------------------------------------
                    CURRENT USER HAS NOT ACCEPTED
                ---------------------------------------------- */}

                {!currentUserAccepted &&
                  match.status === "PENDING" && (
                    <>

                      <button
                        className="btn btn-success btn-lg me-2"
                        onClick={
                          handleAccept
                        }
                        disabled={
                          actionLoading
                        }
                      >
                        {actionLoading
                          ? "Processing..."
                          : "✓ Accept Match"}
                      </button>

                      <button
                        className="btn btn-outline-danger btn-lg"
                        onClick={
                          handleReject
                        }
                        disabled={
                          actionLoading
                        }
                      >
                        ✕ Reject
                      </button>

                    </>
                  )}

                {/* ----------------------------------------------
                    REJECTED
                ---------------------------------------------- */}

                {match.status ===
                  "REJECTED" && (
                  <div className="alert alert-danger">
                    This match was rejected.
                  </div>
                )}

              </div>

              {/* ==================================================
                  CONTACT DETAILS
              ================================================== */}

              {contactRevealed &&
                found && (
                  <div className="card mt-4 border-success">

                    <div className="card-body">

                      <h5 className="fw-bold text-success">
                        🎉 Contact Information
                      </h5>

                      <p className="text-muted">
                        Both users accepted this match.
                        You can now contact the person
                        who found the item.
                      </p>

                      <hr />

                      <p>
                        <strong>
                          Name:
                        </strong>{" "}
                        {found.contactName ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {found.contactPhone ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {found.contactEmail ||
                          "Not available"}
                      </p>

                    </div>
                  </div>
                )}

              {/* ==================================================
                  WAITING MESSAGE
              ================================================== */}

              {currentUserAccepted &&
                !bothAccepted && (
                  <div className="alert alert-warning mt-4">

                    ⏳ Your acceptance has been
                    recorded.

                    <br />

                    You cannot accept again.
                    Waiting for the other user.

                  </div>
                )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default MatchDetails;
