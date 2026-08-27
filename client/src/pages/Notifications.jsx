import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // FETCH NOTIFICATIONS
  // ======================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // MARK AS READ
  // ======================================================

  const markRead = async (
    notification
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.patch(
        `${API}/api/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchNotifications();
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // ======================================================
  // OPEN NOTIFICATION
  // ======================================================

  const openNotification = async (
    notification
  ) => {
    await markRead(notification);

    if (notification.matchId) {
      navigate(
        `/matches/${notification.matchId}`
      );
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
  // PAGE
  // ======================================================

  return (
    <div className="container py-5">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-4">

        <span className="badge bg-warning-subtle text-warning-emphasis">
          SPIDER SENSE
        </span>

        <h2 className="fw-bold mt-2">
          Notifications
        </h2>

        <p className="text-muted">
          Stay updated about matches and recovery activity.
        </p>

      </div>

      {/* ==================================================
          EMPTY
      ================================================== */}

      {notifications.length === 0 ? (

        <div className="text-center py-5">

          <div
            style={{
              fontSize: "60px",
            }}
          >
            🔔
          </div>

          <h4 className="fw-bold mt-3">
            No notifications
          </h4>

          <p className="text-muted">
            You're all caught up.
          </p>

        </div>

      ) : (

        <div className="row">

          <div className="col-lg-8">

            {notifications.map(
              (notification) => {

                const isAcceptRequest =
                  notification.type ===
                  "MATCH_ACCEPT_REQUEST";

                const isAccepted =
                  notification.type ===
                  "ACCEPTED";

                const isRejected =
                  notification.type ===
                  "REJECTED";

                return (
                  <div
                    key={notification.id}
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                    className={`card mb-3 rounded-4 shadow-sm ${
                      notification.isRead
                        ? "border-0"
                        : "border-start border-danger border-4"
                    }`}
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <div className="card-body">

                      {/* ==================================================
                          TITLE
                      ================================================== */}

                      <div className="d-flex justify-content-between align-items-start">

                        <h5 className="fw-bold mb-2">

                          {isAcceptRequest
                            ? "🔔 Accept Match Request"
                            : isAccepted
                            ? "🎉 Match Confirmed"
                            : isRejected
                            ? "❌ Match Rejected"
                            : notification.title}

                        </h5>

                        {!notification.isRead && (
                          <span className="badge bg-danger">
                            NEW
                          </span>
                        )}

                      </div>

                      {/* ==================================================
                          MESSAGE
                      ================================================== */}

                      <p className="text-muted mb-2">
                        {notification.message}
                      </p>

                      {/* ==================================================
                          ACCEPT REQUEST
                      ================================================== */}

                      {isAcceptRequest && (
                        <div className="alert alert-warning mb-2">

                          <strong>
                            Action required:
                          </strong>

                          <br />

                          Open this notification
                          to review and accept
                          the match.

                        </div>
                      )}

                      {/* ==================================================
                          ACCEPTED
                      ================================================== */}

                      {isAccepted && (
                        <div className="alert alert-success mb-2">

                          ✓ Both users have accepted.
                          Contact information is now
                          available.

                        </div>
                      )}

                      {/* ==================================================
                          REJECTED
                      ================================================== */}

                      {isRejected && (
                        <div className="alert alert-danger mb-2">

                          This match was rejected.

                        </div>
                      )}

                      {/* ==================================================
                          MATCH STATUS
                      ================================================== */}

                      {notification.matchDetails && (
                        <div className="small text-muted mb-2">

                          Match confidence:{" "}
                          <strong>
                            {notification.matchDetails.score}%
                          </strong>

                          <br />

                          Lost user:{" "}
                          {notification.matchDetails
                            .lostUserAccepted ? (
                            <span className="text-success">
                              ✓ Accepted
                            </span>
                          ) : (
                            <span>
                              ⏳ Waiting
                            </span>
                          )}

                          {" • "}

                          Found user:{" "}
                          {notification.matchDetails
                            .foundUserAccepted ? (
                            <span className="text-success">
                              ✓ Accepted
                            </span>
                          ) : (
                            <span>
                              ⏳ Waiting
                            </span>
                          )}

                        </div>
                      )}

                      {/* ==================================================
                          DATE
                      ================================================== */}

                      <small className="text-muted">

                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}

                      </small>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Notifications;