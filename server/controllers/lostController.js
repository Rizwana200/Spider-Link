import LostReport from "../models/LostReport.js";
import FoundReport from "../models/FoundReport.js";
import Match from "../models/Match.js";
import Notification from "../models/Notification.js";

const calculateScore = (lost, found) => {
  let score = 0;

  if (
    lost.category?.toLowerCase() ===
    found.category?.toLowerCase()
  ) {
    score += 40;
  }

  if (
    lost.color?.toLowerCase() ===
    found.color?.toLowerCase()
  ) {
    score += 30;
  }

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

  score += Math.min(
    matchingWords.length * 5,
    20
  );

  if (
    lost.latitude &&
    lost.longitude &&
    found.latitude &&
    found.longitude
  ) {
    const distance = Math.sqrt(
      Math.pow(
        Number(lost.latitude) -
          Number(found.latitude),
        2
      ) +
        Math.pow(
          Number(lost.longitude) -
            Number(found.longitude),
          2
        )
    );

    if (distance < 0.01) {
      score += 10;
    }
  }

  return Math.min(score, 100);
};

// ================= CREATE LOST =================

export const createLostReport = async (req, res) => {
  try {
    const {
      itemName,
      category,
      color,
      description,
      lostLocation,
      latitude,
      longitude,
      lostDate,
    } = req.body;

    if (
      !itemName ||
      !category ||
      !color ||
      !description ||
      !lostLocation ||
      !lostDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "itemName, category, color, description, lostLocation and lostDate are required",
      });
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const lostReport = await LostReport.create({
      userId: req.user.id,
      itemName,
      category,
      color,
      description,
      lostLocation,
      latitude: latitude || null,
      longitude: longitude || null,
      lostDate,
      image,
      status: "SEARCHING",
    });

    // Search existing found reports
    const foundReports = await FoundReport.findAll({
      where: {
        category,
        status: "SEARCHING",
      },
    });

    let bestMatch = null;
    let bestScore = 0;

    for (const found of foundReports) {
      const score = calculateScore(
        lostReport,
        found
      );

      if (score > bestScore) {
        bestScore = score;
        bestMatch = found;
      }
    }

    if (bestMatch && bestScore >= 50) {
      const match = await Match.create({
        lostReportId: lostReport.id,
        foundReportId: bestMatch.id,
        score: bestScore,
        status: "PENDING",
      });

      await LostReport.update(
        {
          status: "MATCHED",
        },
        {
          where: {
            id: lostReport.id,
          },
        }
      );

      await FoundReport.update(
        {
          status: "MATCHED",
        },
        {
          where: {
            id: bestMatch.id,
          },
        }
      );

      await Notification.create({
        userId: req.user.id,
        type: "MATCH_FOUND",
        title: "Possible match found!",
        message:
          "We found a possible match for your lost item. Check the details and photo.",
        matchId: match.id,
      });

      return res.status(201).json({
        success: true,
        message:
          "Lost report created. A possible match was found.",
        report: lostReport,
        matchFound: true,
        matchId: match.id,
        score: bestScore,
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Lost report created. We will notify you whenever a matching item is found.",
      report: lostReport,
      matchFound: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create lost report",
      error: error.message,
    });
  }
};

// ================= GET MY LOST REPORTS =================

export const getMyLostReports = async (req, res) => {
  try {
    const reports = await LostReport.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get lost reports",
      error: error.message,
    });
  }
};