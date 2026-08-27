import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import LocationPicker from "../components/LocationPicker";

const LostReport = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    color: "",
    lostDate: "",
    lostLocation: "",
    latitude: null,
    longitude: null,
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLocationChange = (location) => {
    setForm((previous) => ({
      ...previous,
      lostLocation: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      setPreview("");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.itemName.trim()) {
      setError("Please enter the item name.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.color.trim()) {
      setError("Please enter the color.");
      return;
    }

    if (!form.lostDate) {
      setError("Please select the lost date.");
      return;
    }

    if (!form.lostLocation.trim()) {
      setError("Please select or enter the lost location.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "itemName",
        form.itemName.trim()
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "color",
        form.color.trim()
      );

      formData.append(
        "lostDate",
        form.lostDate
      );

      formData.append(
        "lostLocation",
        form.lostLocation.trim()
      );

      if (form.latitude !== null) {
        formData.append(
          "latitude",
          form.latitude
        );
      }

      if (form.longitude !== null) {
        formData.append(
          "longitude",
          form.longitude
        );
      }

      formData.append(
        "description",
        form.description.trim()
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await API.post(
        "/lost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Lost report created successfully."
        );

        setTimeout(() => {
          navigate("/my-lost-reports");
        }, 1200);
      } else {
        setError(
          response.data.message ||
            "Failed to create lost report."
        );
      }
    } catch (err) {
      console.error(
        "Create lost report error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create lost report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-12 col-lg-8">

            <div className="mb-4">

              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  background: "#ffe4ed",
                  color: "#d6336c",
                }}
              >
                🔍 LOST ITEM
              </span>

              <h1 className="fw-bold">
                Report a Lost Item
              </h1>

              <p className="text-muted">
                Provide accurate details so
                Spider-Link can identify possible
                matches.
              </p>

            </div>

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                {error && (
                  <div className="alert alert-danger rounded-3">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success rounded-3">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* ITEM NAME */}

                  <div className="mb-4">

                    <label
                      htmlFor="itemName"
                      className="form-label fw-semibold"
                    >
                      Item Name
                    </label>

                    <input
                      id="itemName"
                      type="text"
                      name="itemName"
                      className="form-control form-control-lg"
                      placeholder="Example: Pink Watch"
                      value={form.itemName}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                  {/* CATEGORY */}

                  <div className="mb-4">

                    <label
                      htmlFor="category"
                      className="form-label fw-semibold"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      className="form-select form-select-lg"
                      value={form.category}
                      onChange={handleChange}
                      disabled={loading}
                    >

                      <option value="">
                        Select category
                      </option>

                      <option value="Electronics">
                        Electronics
                      </option>

                      <option value="Documents">
                        Documents
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>

                      <option value="Clothing">
                        Clothing
                      </option>

                      <option value="Books">
                        Books
                      </option>

                      <option value="Keys">
                        Keys
                      </option>

                      <option value="Wallet">
                        Wallet
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* COLOR */}

                  <div className="mb-4">

                    <label
                      htmlFor="color"
                      className="form-label fw-semibold"
                    >
                      Color
                    </label>

                    <input
                      id="color"
                      type="text"
                      name="color"
                      className="form-control form-control-lg"
                      placeholder="Example: Pink"
                      value={form.color}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                  {/* LOST DATE */}

                  <div className="mb-4">

                    <label
                      htmlFor="lostDate"
                      className="form-label fw-semibold"
                    >
                      Lost Date
                    </label>

                    <input
                      id="lostDate"
                      type="date"
                      name="lostDate"
                      className="form-control form-control-lg"
                      value={form.lostDate}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                  {/* LOCATION */}

                  <div className="mb-4">

                    <LocationPicker
                      value={form.lostLocation}
                      onChange={handleLocationChange}
                      placeholder="Search where you lost the item..."
                    />

                  </div>

                  {/* COORDINATES DISPLAY */}

                  {form.latitude !== null &&
                    form.longitude !== null && (
                      <div
                        className="alert rounded-3 mb-4"
                        style={{
                          background: "#f8f0ff",
                          border: "1px solid #eadcff",
                        }}
                      >
                        <div className="fw-semibold">
                          📍 Location coordinates detected
                        </div>

                        <div className="small text-muted mt-1">
                          Latitude:{" "}
                          {form.latitude}
                        </div>

                        <div className="small text-muted">
                          Longitude:{" "}
                          {form.longitude}
                        </div>
                      </div>
                    )}

                  {/* DESCRIPTION */}

                  <div className="mb-4">

                    <label
                      htmlFor="description"
                      className="form-label fw-semibold"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows="5"
                      placeholder="Describe the item in detail. Include brand, model, identifying marks, etc."
                      value={form.description}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                  {/* IMAGE */}

                  <div className="mb-4">

                    <label
                      htmlFor="image"
                      className="form-label fw-semibold"
                    >
                      Item Image
                    </label>

                    <input
                      id="image"
                      type="file"
                      className="form-control form-control-lg"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />

                    <div className="form-text">
                      Upload a clear image of the lost
                      item.
                    </div>

                  </div>

                  {/* IMAGE PREVIEW */}

                  {preview && (
                    <div className="mb-4">

                      <p className="fw-semibold mb-2">
                        Image Preview
                      </p>

                      <img
                        src={preview}
                        alt="Lost item preview"
                        className="img-fluid rounded-4"
                        style={{
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                      />

                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="btn btn-spider btn-lg w-100 rounded-pill fw-semibold"
                    disabled={loading}
                  >

                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Submitting Report...
                      </>
                    ) : (
                      "🕷️ Submit Lost Report"
                    )}

                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LostReport;