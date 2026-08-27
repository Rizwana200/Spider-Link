import FoundReport from "../models/FoundReport.js";
import LostReport from "../models/LostReport.js";
import Match from "../models/Match.js";
import Notification from "../models/Notification.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ======================================================
// MATCH SCORE
// ======================================================

const calculateMatchScore = (lost, found) => {
  let categoryScore = 0;
  let colorScore = 0;
  let descriptionScore = 0;
  let locationScore = 0;

  // ====================================================
  // CATEGORY
  // ====================================================

  if (
    lost.category &&
    found.category &&
    lost.category.toLowerCase() ===
      found.category.toLowerCase()
  ) {
    categoryScore = 30;
  }

  // ====================================================
  // COLOR
  // ====================================================

  if (
    lost.color &&
    found.color &&
    lost.color.toLowerCase() ===
      found.color.toLowerCase()
  ) {
    colorScore = 20;
  }

  // ====================================================
  // ITEM NAME + DESCRIPTION
  // ====================================================

  const lostText =
    `${lost.itemName} ${lost.description}`.toLowerCase();

  const foundText =
    `${found.itemName} ${found.description}`.toLowerCase();

  const words = lostText
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const matchingWords = words.filter((word) =>
    foundText.includes(word)
  );

  descriptionScore = Math.min(
    matchingWords.length * 5,
    30
  );

  // ====================================================
  // LOCATION
  // ====================================================

  if (
    lost.latitude &&
    lost.longitude &&
    found.latitude &&
    found.longitude
  ) {
    const latDifference =
      Number(lost.latitude) -
      Number(found.latitude);

    const lonDifference =
      Number(lost.longitude) -
      Number(found.longitude);

    const distance = Math.sqrt(
      latDifference ** 2 +
        lonDifference ** 2
    );

    if (distance < 0.01) {
      locationScore = 20;
    } else if (distance < 0.05) {
      locationScore = 10;
    }
  } else if (
    lost.lostLocation &&
    found.foundLocation
  ) {
    const lostLocation =
      lost.lostLocation.toLowerCase();

    const foundLocation =
      found.foundLocation.toLowerCase();

    if (
      lostLocation.includes(foundLocation) ||
      foundLocation.includes(lostLocation)
    ) {
      locationScore = 10;
    }
  }

  // ====================================================
  // TOTAL SCORE
  // ====================================================

  const totalScore =
    categoryScore +
    colorScore +
    descriptionScore +
    locationScore;

  return {
    score: Math.min(totalScore, 100),
    categoryScore,
    colorScore,
    descriptionScore,
    locationScore,
  };
};

// ======================================================
// CREATE FOUND REPORT
// ======================================================

export const createFoundReport = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      itemName,
      category,
      color,
      description,
      foundLocation,
      latitude,
      longitude,
      foundDate,
      contactName,
      contactPhone,
      contactEmail,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !itemName ||
      !category ||
      !color ||
      !description ||
      !foundLocation ||
      !foundDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "itemName, category, color, description, foundLocation and foundDate are required",
      });
    }

    // ==================================================
    // GET USER
    // ==================================================

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==================================================
    // GET PROFILE
    // ==================================================

    const profile = await Profile.findOne({
      where: {
        userId,
      },
    });

    // ==================================================
    // CONTACT DETAILS
    // ==================================================

    const finalContactName =
      contactName ||
      user.name ||
      null;

    const finalContactPhone =
      contactPhone ||
      profile?.phone ||
      null;

    const finalContactEmail =
      contactEmail ||
      user.email ||
      null;

    // ==================================================
    // IMAGE
    // ==================================================

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // ==================================================
    // CREATE FOUND REPORT
    // ==================================================

    const foundReport =
      await FoundReport.create({
        userId,

        itemName,

        category,

        color,

        description,

        foundLocation,

        latitude:
          latitude || null,

        longitude:
          longitude || null,

        foundDate,

        image,

        contactName:
          finalContactName,

        contactPhone:
          finalContactPhone,

        contactEmail:
          finalContactEmail,

        status: "SEARCHING",
      });

    // ==================================================
    // FIND LOST REPORTS
    // ==================================================

    const lostReports =
      await LostReport.findAll({
        where: {
          category,
          status: "SEARCHING",
        },
      });

    let bestMatch = null;
    let bestScore = null;

    // ==================================================
    // CALCULATE MATCH
    // ==================================================

    for (const lostReport of lostReports) {
      const result =
        calculateMatchScore(
          lostReport,
          foundReport
        );

      if (
        result.score >= 50 &&
        (!bestScore ||
          result.score > bestScore.score)
      ) {
        bestMatch = lostReport;
        bestScore = result;
      }
    }

    // ==================================================
    // NO MATCH
    // ==================================================

    if (!bestMatch) {
      return res.status(201).json({
        success: true,

        message:
          "Found report submitted successfully. We will notify the owner if a matching lost item is found.",

        report: foundReport,

        matchFound: false,
      });
    }

    // ==================================================
    // CREATE MATCH
    // ==================================================

    const match = await Match.create({
      lostReportId:
        bestMatch.id,

      foundReportId:
        foundReport.id,

      score:
        bestScore.score,

      categoryScore:
        bestScore.categoryScore,

      colorScore:
        bestScore.colorScore,

      locationScore:
        bestScore.locationScore,

      descriptionScore:
        bestScore.descriptionScore,

      status: "PENDING",

      lostUserAccepted: false,

      foundUserAccepted: false,

      contactRevealed: false,
    });

    // ==================================================
    // UPDATE LOST REPORT
    // ==================================================

    await bestMatch.update({
      status: "MATCHED",
    });

    // ==================================================
    // UPDATE FOUND REPORT
    // ==================================================

    await foundReport.update({
      status: "MATCHED",
    });

    // ==================================================
    // NOTIFICATION
    // ==================================================

    await Notification.create({
      userId:
        bestMatch.userId,

      type: "MATCH",

      title:
        "Possible Match Found! 🎯",

      message:
        "Someone found an item that may match your lost item. Review the photo and details.",

      lostReportId:
        bestMatch.id,

      foundReportId:
        foundReport.id,

      matchId:
        match.id,

      score:
        bestScore.score,

      image:
        foundReport.image,

      isRead: false,
    });

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Found report submitted successfully. A possible match was found and the owner has been notified.",

      report: foundReport,

      matchFound: true,

      match: {
        id: match.id,

        score:
          bestScore.score,

        categoryScore:
          bestScore.categoryScore,

        colorScore:
          bestScore.colorScore,

        locationScore:
          bestScore.locationScore,

        descriptionScore:
          bestScore.descriptionScore,

        status:
          match.status,
      },
    });
  } catch (error) {
    console.error(
      "Create found report error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create found report",

      error:
        error.message,
    });
  }
};

// ======================================================
// GET MY FOUND REPORTS
// ======================================================

export const getMyFoundReports = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const reports =
      await FoundReport.findAll({
        where: {
          userId,
        },

        order: [
          ["createdAt", "DESC"],
        ],
      });

    return res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error(
      "Get my found reports error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get found reports",

      error:
        error.message,
    });
  }
};