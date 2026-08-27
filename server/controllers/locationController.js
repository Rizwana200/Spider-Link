const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

export const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        locations: [],
      });
    }

    const query = q.trim();

    const url = new URL(NOMINATIM_URL);

    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "10");
    url.searchParams.set("countrycodes", "in");
    url.searchParams.set("dedupe", "1");
    url.searchParams.set("extratags", "1");

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Spider-Link/1.0 (location search)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Location service returned ${response.status}`
      );
    }

    const data = await response.json();

    const locations = data
      .map((item) => {
        const address = item.address || {};

        return {
          displayName: item.display_name,

          shortName:
            item.name ||
            address.amenity ||
            address.shop ||
            address.tourism ||
            address.road ||
            item.display_name,

          latitude: Number(item.lat),
          longitude: Number(item.lon),

          type: item.type,
          category: item.category,

          importance:
            Number(item.importance) || 0,
        };
      })
      .filter(
        (location) =>
          Number.isFinite(location.latitude) &&
          Number.isFinite(location.longitude)
      );

    /*
     * Prioritize specific places over broad
     * administrative areas.
     */
    const priorityTypes = [
      "station",
      "bridge",
      "school",
      "college",
      "university",
      "hospital",
      "mall",
      "market",
      "restaurant",
      "hotel",
      "bus_station",
      "railway",
      "airport",
      "shop",
      "building",
      "attraction",
      "monument",
      "memorial",
      "place_of_worship",
      "bank",
      "fuel",
      "parking",
      "park",
      "stadium",
      "museum",
      "theatre",
    ];

    locations.sort((a, b) => {
      const aPriority =
        priorityTypes.includes(a.type)
          ? 1
          : 0;

      const bPriority =
        priorityTypes.includes(b.type)
          ? 1
          : 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return b.importance - a.importance;
    });

    return res.json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error(
      "Location search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to search locations",
      error: error.message,
    });
  }
};