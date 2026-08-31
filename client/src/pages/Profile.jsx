import { useEffect, useState } from "react";
import axios from "axios";

const API = "";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        response.data.profile ||
        response.data.user ||
        {};

      setProfile({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API}/api/profile`,
        {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-7">

          <div className="card border-0 shadow-lg rounded-4">

            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">

                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "32px",
                  }}
                >
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <h2 className="fw-bold mt-3">
                  My Profile
                </h2>

                <p className="text-muted">
                  Manage your Spider-Link contact details.
                </p>

              </div>

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Name
                  </label>

                  <input
                    name="name"
                    className="form-control"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Phone
                  </label>

                  <input
                    name="phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={profile.phone}
                    onChange={handleChange}
                  />

                </div>

                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Address
                  </label>

                  <textarea
                    name="address"
                    rows="3"
                    className="form-control"
                    placeholder="Enter your address"
                    value={profile.address}
                    onChange={handleChange}
                  />

                </div>

                <button
                  className="btn btn-danger btn-lg w-100 rounded-3"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;
