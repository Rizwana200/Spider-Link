import Match from "../models/Match.js";
import LostReport from "../models/LostReport.js";
import FoundReport from "../models/FoundReport.js";
import Notification from "../models/Notification.js";

// ======================================================
// GET MATCH BY ID
// ======================================================

export const getMatchById = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { id } = req.params;

    const match = await Match.findByPk(id, {
      include: [
        {
          model: LostReport,
        },
        {
          model: FoundReport,
        },
      ],
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const isLostOwner =
      Number(match.LostReport?.userId) === userId;

    const isFoundOwner =
      Number(match.FoundReport?.userId) === userId;

    if (!isLostOwner && !isFoundOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this match",
      });
    }

    const result = match.toJSON();

    // ==================================================
    // CONTACT IS ONLY REVEALED AFTER BOTH ACCEPT
    // ==================================================

    const bothAccepted =
      match.lostUserAccepted === true &&
      match.foundUserAccepted === true;

    if (bothAccepted) {
      result.contactRevealed = true;
    } else {
      result.contactRevealed = false;

      if (result.FoundReport) {
        result.FoundReport.contactName = null;
        result.FoundReport.contactPhone = null;
        result.FoundReport.contactEmail = null;
      }
    }

    // ==================================================
    // RETURN USER-SPECIFIC ACCEPTANCE STATE
    // ==================================================

    result.currentUserAccepted = isLostOwner
      ? match.lostUserAccepted
      : match.foundUserAccepted;

    result.isLostOwner = isLostOwner;
    result.isFoundOwner = isFoundOwner;

    return res.json({
      success: true,
      match: result,
    });
  } catch (error) {
    console.error("Get match error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get match",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY MATCHES
// ======================================================

export const getMyMatches = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const matches = await Match.findAll({
      include: [
        {
          model: LostReport,
        },
        {
          model: FoundReport,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const myMatches = matches.filter((match) => {
      return (
        Number(match.LostReport?.userId) === userId ||
        Number(match.FoundReport?.userId) === userId
      );
    });

    return res.json({
      success: true,
      count: myMatches.length,
      matches: myMatches,
    });
  } catch (error) {
    console.error("Get my matches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get matches",
      error: error.message,
    });
  }
};

// ======================================================
// ACCEPT MATCH
// ======================================================

export const acceptMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { id } = req.params;

    const match = await Match.findByPk(id, {
      include: [
        {
          model: LostReport,
        },
        {
          model: FoundReport,
        },
      ],
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const isLostOwner =
      Number(match.LostReport?.userId) === userId;

    const isFoundOwner =
      Number(match.FoundReport?.userId) === userId;

    // ==================================================
    // AUTHORIZATION
    // ==================================================

    if (!isLostOwner && !isFoundOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this match",
      });
    }

    // ==================================================
    // ALREADY ACCEPTED
    // ==================================================

    if (
      isLostOwner &&
      match.lostUserAccepted === true
    ) {
      const bothAccepted =
        match.lostUserAccepted &&
        match.foundUserAccepted;

      return res.json({
        success: true,
        alreadyAccepted: true,
        message: bothAccepted
          ? "You already accepted this match. Contact details are available."
          : "You already accepted this match. Waiting for the found user.",
        status: match.status,
        lostUserAccepted:
          match.lostUserAccepted,
        foundUserAccepted:
          match.foundUserAccepted,
        contactRevealed:
          match.contactRevealed,
      });
    }

    if (
      isFoundOwner &&
      match.foundUserAccepted === true
    ) {
      const bothAccepted =
        match.lostUserAccepted &&
        match.foundUserAccepted;

      return res.json({
        success: true,
        alreadyAccepted: true,
        message: bothAccepted
          ? "You already accepted this match. Contact details are available."
          : "You already accepted this match.",
        status: match.status,
        lostUserAccepted:
          match.lostUserAccepted,
        foundUserAccepted:
          match.foundUserAccepted,
        contactRevealed:
          match.contactRevealed,
      });
    }

    // ==================================================
    // LOST USER ACCEPTS
    // ==================================================

    if (isLostOwner) {
      await match.update({
        lostUserAccepted: true,
      });
    }

    // ==================================================
    // FOUND USER ACCEPTS
    // ==================================================

    if (isFoundOwner) {
      await match.update({
        foundUserAccepted: true,
      });
    }

    // Reload from database
    await match.reload();

    // ==================================================
    // BOTH USERS ACCEPTED
    // ==================================================

    const bothAccepted =
      match.lostUserAccepted === true &&
      match.foundUserAccepted === true;

    if (bothAccepted) {
      await match.update({
        status: "ACCEPTED",
        contactRevealed: true,
      });

      await match.LostReport.update({
        status: "MATCHED",
      });

      await match.FoundReport.update({
        status: "MATCHED",
      });

      // ==================================================
      // REMOVE OLD ACCEPT REQUEST NOTIFICATIONS
      // ==================================================

      await Notification.destroy({
        where: {
          matchId: match.id,
          type: "MATCH_ACCEPT_REQUEST",
        },
      });

      // ==================================================
      // CREATE ONE CONFIRMED NOTIFICATION FOR LOST USER
      // ==================================================

      await Notification.create({
        userId: match.LostReport.userId,
        type: "ACCEPTED",
        title: "Match Confirmed! 🎉",
        message:
          "Both users accepted the match. The found person's contact details are now available.",
        matchId: match.id,
        isRead: false,
      });

      // ==================================================
      // CREATE ONE CONFIRMED NOTIFICATION FOR FOUND USER
      // ==================================================

      await Notification.create({
        userId: match.FoundReport.userId,
        type: "ACCEPTED",
        title: "Match Confirmed! 🎉",
        message:
          "Both users accepted the match. You can now coordinate the item return.",
        matchId: match.id,
        isRead: false,
      });

      return res.json({
        success: true,

        message:
          "Both users accepted the match. Contact details are now available.",

        status: "ACCEPTED",

        alreadyAccepted: false,

        lostUserAccepted:
          match.lostUserAccepted,

        foundUserAccepted:
          match.foundUserAccepted,

        contactRevealed: true,

        contact: {
          name:
            match.FoundReport.contactName,

          phone:
            match.FoundReport.contactPhone,

          email:
            match.FoundReport.contactEmail,
        },
      });
    }

    // ==================================================
    // ONLY ONE USER ACCEPTED
    // ==================================================

    const otherUserId = isLostOwner
      ? match.FoundReport.userId
      : match.LostReport.userId;

    // ==================================================
    // IMPORTANT:
    // CREATE ACCEPT REQUEST ONLY IF IT DOES NOT ALREADY
    // EXIST.
    // ==================================================

    const existingRequest =
      await Notification.findOne({
        where: {
          userId: otherUserId,
          matchId: match.id,
          type: "MATCH_ACCEPT_REQUEST",
        },
      });

    if (!existingRequest) {
      await Notification.create({
        userId: otherUserId,

        type: "MATCH_ACCEPT_REQUEST",

        title: "Accept Match Request 🔔",

        message:
          isLostOwner
            ? "The owner of the lost item accepted this possible match. Please review the match and accept it to confirm the recovery."
            : "The person who found the item accepted this possible match. Please review the match and accept it to confirm the recovery.",

        matchId: match.id,

        isRead: false,
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.json({
      success: true,

      alreadyAccepted: false,

      message:
        isLostOwner
          ? "You accepted the match. Waiting for the found user to accept."
          : "You accepted the match. Waiting for the lost user.",

      status: match.status,

      lostUserAccepted:
        match.lostUserAccepted,

      foundUserAccepted:
        match.foundUserAccepted,

      contactRevealed:
        match.contactRevealed,
    });
  } catch (error) {
    console.error("Accept match error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept match",
      error: error.message,
    });
  }
};

// ======================================================
// REJECT MATCH
// ======================================================

export const rejectMatch = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { id } = req.params;

    const match = await Match.findByPk(id, {
      include: [
        {
          model: LostReport,
        },
        {
          model: FoundReport,
        },
      ],
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const isLostOwner =
      Number(match.LostReport?.userId) === userId;

    const isFoundOwner =
      Number(match.FoundReport?.userId) === userId;

    if (!isLostOwner && !isFoundOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to reject this match",
      });
    }

    await match.update({
      status: "REJECTED",
      lostUserAccepted: false,
      foundUserAccepted: false,
      contactRevealed: false,
    });

    await match.LostReport.update({
      status: "SEARCHING",
    });

    await match.FoundReport.update({
      status: "SEARCHING",
    });

    // ==================================================
    // REMOVE OLD ACCEPT REQUESTS
    // ==================================================

    await Notification.destroy({
      where: {
        matchId: match.id,
        type: "MATCH_ACCEPT_REQUEST",
      },
    });

    // ==================================================
    // NOTIFY OTHER USER
    // ==================================================

    const otherUserId = isLostOwner
      ? match.FoundReport.userId
      : match.LostReport.userId;

    await Notification.create({
      userId: otherUserId,

      type: "REJECTED",

      title: "Match Rejected",

      message:
        "A possible match was rejected. The item will continue searching for another match.",

      matchId: match.id,

      isRead: false,
    });

    return res.json({
      success: true,

      message:
        "Match rejected. Both reports will continue searching.",

      status: "REJECTED",
    });
  } catch (error) {
    console.error("Reject match error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject match",
      error: error.message,
    });
  }
};