import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "";

function FoundReport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    color: "",
    description: "",
    foundLocation: "",
    latitude: "",
    longitude: "",
    foundDate: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationError, setLocationError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationMessage("");
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
                zoom: 18,
                addressdetails: 1,
              },
            }
          );

          const locationName =
            response.data.display_name ||
            `${latitude}, ${longitude}`;

          setForm((previous) => ({
            ...previous,
            foundLocation: locationName,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));

          setLocationMessage(
            "✓ Current location selected"
          );
        } catch (error) {
          console.error(
            "Location lookup error:",
            error
          );

          setForm((previous) => ({
            ...previous,
            foundLocation: `${latitude}, ${longitude}`,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));

          setLocationMessage(
            "✓ Location coordinates selected"
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your current location could not be determined."
          );
        } else {
          setLocationError(
            "Location request timed out. Please try again."
          );
        }

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(
          "Please login before submitting a found report."
        );
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${API}/api/found`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(
        response.data.message ||
          "Found report submitted successfully."
      );

      setTimeout(() => {
        navigate("/my-found-reports");
      }, 1500);
    } catch (error) {
      console.error(
        "Found report error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to create found report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card border-0 shadow-lg rounded-4">

            <div className="card-body p-4 p-md-5">

              <div className="mb-4">

                <span className="badge bg-success-subtle text-success px-3 py-2">
                  FOUND ITEM
                </span>

                <h2 className="fw-bold mt-3">
                  Report a Found Item
                </h2>

                <p className="text-muted">
                  Provide accurate details so Spider-Link
                  can identify the owner.
                </p>

              </div>

              {message && (
                <div className="alert alert-info rounded-3">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Item Name
                    </label>

                    <input
                      type="text"
                      name="itemName"
                      className="form-control"
                      placeholder="Example: Black Wallet"
                      value={form.itemName}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Category
                    </label>

                    <select
                      name="category"
                      className="form-select"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select category
                      </option>

                      <option>Electronics</option>
                      <option>Documents</option>
                      <option>Accessories</option>
                      <option>Clothing</option>
                      <option>Books</option>
                      <option>Keys</option>
                      <option>Wallet</option>
                      <option>Other</option>

                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      className="form-control"
                      placeholder="Example: Black"
                      value={form.color}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Found Date
                    </label>

                    <input
                      type="date"
                      name="foundDate"
                      className="form-control"
                      value={form.foundDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      📍 Found Location
                    </label>

                    <div className="input-group">

                      <input
                        type="text"
                        name="foundLocation"
                        className="form-control"
                        placeholder="Where did you find the item?"
                        value={form.foundLocation}
                        onChange={handleChange}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-dark"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                      >
                        {locationLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Detecting...
                          </>
                        ) : (
                          "📍 Use Current Location"
                        )}
                      </button>

                    </div>

                    {locationMessage && (
                      <div className="alert alert-success mt-2 mb-0 py-2">
                        {locationMessage}
                      </div>
                    )}

                    {locationError && (
                      <div className="alert alert-danger mt-2 mb-0 py-2">
                        {locationError}
                      </div>
                    )}

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Latitude
                    </label>

                    <input
                      type="text"
                      className="form-control bg-light"
                      value={form.latitude}
                      readOnly
                      placeholder="Automatically detected"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Longitude
                    </label>

                    <input
                      type="text"
                      className="form-control bg-light"
                      value={form.longitude}
                      readOnly
                      placeholder="Automatically detected"
                    />

                  </div>

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows="4"
                      className="form-control"
                      placeholder="Describe the item you found..."
                      value={form.description}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Item Image
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(e.target.files[0])
                      }
                    />

                    <small className="text-muted">
                      Upload a clear image of the found item.
                    </small>

                  </div>

                  <div className="col-12 mt-4">

                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100 rounded-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Submitting...
                        </>
                      ) : (
                        "📦 Report Found Item"
                      )}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FoundReport;
