import { useEffect, useRef, useState } from "react";
import API from "../services/api";

const LocationPicker = ({
  value,
  onChange,
  placeholder = "Search location...",
}) => {
  const [search, setSearch] = useState(value || "");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState(false);

  const searchTimeout = useRef(null);

  /*
   * Update the input when the parent changes
   * the selected location.
   */
  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  /*
   * Search locations whenever the user types.
   */
  useEffect(() => {
    if (search.trim().length < 2) {
      setLocations([]);
      return;
    }

    /*
     * If the user has selected a location,
     * don't immediately search again.
     */
    if (selectedLocation) {
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchLocations(search.trim());
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search, selectedLocation]);

  const searchLocations = async (query) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/location/search?q=${encodeURIComponent(query)}`
      );

      if (response.data.success) {
        setLocations(
          response.data.locations || []
        );
      } else {
        setLocations([]);
      }
    } catch (err) {
      console.error(
        "Location search error:",
        err
      );

      setLocations([]);

      setError(
        "Unable to search locations."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * User selects a location from suggestions.
   */
  const selectLocation = (location) => {
    const locationData = {
      name: location.displayName,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setSearch(location.displayName);
    setLocations([]);
    setSelectedLocation(true);
    setError("");

    onChange(locationData);
  };

  /*
   * Detect current location using browser GPS.
   */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );

      return;
    }

    setLocationLoading(true);
    setError("");
    setLocations([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /*
           * Reverse search using coordinates
           * to get a readable location name.
           */
          const response = await API.get(
            `/location/search?q=${encodeURIComponent(
              `${latitude},${longitude}`
            )}`
          );

          let locationName =
            `${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`;

          if (
            response.data.success &&
            response.data.locations?.length > 0
          ) {
            locationName =
              response.data.locations[0]
                .displayName;
          }

          setSearch(locationName);
          setLocations([]);
          setSelectedLocation(true);

          onChange({
            name: locationName,
            latitude,
            longitude,
          });
        } catch (err) {
          console.error(
            "Reverse location error:",
            err
          );

          /*
           * Even if readable location lookup
           * fails, GPS coordinates are still valid.
           */
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const locationName =
            `${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`;

          setSearch(locationName);
          setLocations([]);
          setSelectedLocation(true);

          onChange({
            name: locationName,
            latitude,
            longitude,
          });
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          setError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setError(
            "Unable to determine your location."
          );
        } else if (error.code === 3) {
          setError(
            "Location request timed out."
          );
        } else {
          setError(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /*
   * Handle manual typing.
   */
  const handleInputChange = (e) => {
    const text = e.target.value;

    setSearch(text);
    setError("");

    /*
     * VERY IMPORTANT:
     * Once the user edits the selected location,
     * it is no longer considered selected.
     */
    setSelectedLocation(false);

    /*
     * Clear old coordinates immediately.
     * They should not remain attached to a
     * completely new location.
     */
    onChange({
      name: text,
      latitude: null,
      longitude: null,
    });

    /*
     * If the user completely clears the input,
     * clear suggestions too.
     */
    if (!text.trim()) {
      setLocations([]);
    }
  };

  return (
    <div className="position-relative">

      {/* LABEL */}

      <label className="form-label fw-semibold">
        📍 Location
      </label>

      {/* SEARCH INPUT */}

      <div className="input-group input-group-lg">

        <span className="input-group-text bg-white">
          📍
        </span>

        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={search}
          onChange={handleInputChange}
          autoComplete="off"
        />

      </div>

      {/* CURRENT LOCATION BUTTON */}

      <div className="mt-2">

        <button
          type="button"
          className="btn btn-outline-dark rounded-pill"
          onClick={getCurrentLocation}
          disabled={locationLoading}
        >

          {locationLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />

              Detecting Location...
            </>
          ) : (
            <>
              📍 Use Current Location
            </>
          )}

        </button>

      </div>

      {/* SEARCHING */}

      {loading && (
        <div className="small text-muted mt-2">
          🔎 Searching locations...
        </div>
      )}

      {/* LOCATION RESULTS */}

      {locations.length > 0 && (
        <div
          className="position-absolute bg-white border rounded-3 shadow w-100 mt-1"
          style={{
            zIndex: 1050,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >

          {locations.map(
            (location, index) => (
              <button
                type="button"
                key={`${location.latitude}-${location.longitude}-${index}`}
                className="btn btn-light w-100 text-start border-0 rounded-0 p-3"
                onClick={() =>
                  selectLocation(location)
                }
              >

                <div className="fw-semibold">
                  📍 {location.displayName}
                </div>

              </button>
            )
          )}

        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="text-danger small mt-2">
          ⚠️ {error}
        </div>
      )}

      {/* SELECTED */}

      {selectedLocation &&
        search.trim() && (
          <div className="text-success small mt-2">
            ✓ Location selected
          </div>
        )}

    </div>
  );
};

export default LocationPicker;