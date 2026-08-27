import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ======================================================
// GET MY PROFILE
// ======================================================

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Profile,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE / UPDATE PROFILE
// ======================================================

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      phone,
      homeLocation,
      city,
      state,
      country,
    } = req.body;

    let profile = await Profile.findOne({
      where: { userId },
    });

    const profilePhoto = req.file
      ? `/uploads/${req.file.filename}`
      : profile?.profilePhoto || null;

    if (!profile) {
      profile = await Profile.create({
        userId,
        phone: phone || null,
        profilePhoto,
        homeLocation: homeLocation || null,
        city: city || null,
        state: state || null,
        country: country || null,
      });
    } else {
      await profile.update({
        phone:
          phone !== undefined
            ? phone
            : profile.phone,

        profilePhoto,

        homeLocation:
          homeLocation !== undefined
            ? homeLocation
            : profile.homeLocation,

        city:
          city !== undefined
            ? city
            : profile.city,

        state:
          state !== undefined
            ? state
            : profile.state,

        country:
          country !== undefined
            ? country
            : profile.country,
      });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        user,
        details: profile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};