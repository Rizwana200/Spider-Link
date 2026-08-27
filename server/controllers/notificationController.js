import Notification from "../models/Notification.js";
import Match from "../models/Match.js";
import LostReport from "../models/LostReport.js";
import FoundReport from "../models/FoundReport.js";

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const notifications =
      await Notification.findAll({
        where: {
          userId,
        },

        include: [
          {
            model: Match,

            include: [
              {
                model: LostReport,
              },
              {
                model: FoundReport,
              },
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    const formattedNotifications =
      notifications.map((notification) => {
        const data =
          notification.toJSON();

        if (data.Match) {
          const match =
            data.Match;

          const isLostOwner =
            Number(match.LostReport?.userId) ===
            userId;

          const isFoundOwner =
            Number(match.FoundReport?.userId) ===
            userId;

          // ==================================================
          // CONTACT ONLY AFTER BOTH ACCEPT
          // ==================================================

          const contactRevealed =
            match.lostUserAccepted === true &&
            match.foundUserAccepted === true;

          if (
            match.FoundReport &&
            !contactRevealed
          ) {
            match.FoundReport.contactName = null;
            match.FoundReport.contactPhone = null;
            match.FoundReport.contactEmail = null;
          }

          // ==================================================
          // MATCH DETAILS
          // ==================================================

          data.matchDetails = {
            id: match.id,

            score:
              match.score,

            categoryScore:
              match.categoryScore,

            colorScore:
              match.colorScore,

            locationScore:
              match.locationScore,

            descriptionScore:
              match.descriptionScore,

            status:
              match.status,

            lostUserAccepted:
              match.lostUserAccepted,

            foundUserAccepted:
              match.foundUserAccepted,

            contactRevealed,

            isLostOwner,

            isFoundOwner,

            currentUserAccepted:
              isLostOwner
                ? match.lostUserAccepted
                : isFoundOwner
                ? match.foundUserAccepted
                : false,
          };

          // ==================================================
          // FOUND ITEM
          // ==================================================

          if (match.FoundReport) {
            data.foundItem = {
              id:
                match.FoundReport.id,

              itemName:
                match.FoundReport.itemName,

              category:
                match.FoundReport.category,

              color:
                match.FoundReport.color,

              description:
                match.FoundReport.description,

              foundLocation:
                match.FoundReport.foundLocation,

              latitude:
                match.FoundReport.latitude,

              longitude:
                match.FoundReport.longitude,

              foundDate:
                match.FoundReport.foundDate,

              image:
                match.FoundReport.image,

              contactName:
                contactRevealed
                  ? match.FoundReport.contactName
                  : null,

              contactPhone:
                contactRevealed
                  ? match.FoundReport.contactPhone
                  : null,

              contactEmail:
                contactRevealed
                  ? match.FoundReport.contactEmail
                  : null,
            };
          }
        }

        return data;
      });

    return res.json({
      success: true,

      count:
        formattedNotifications.length,

      notifications:
        formattedNotifications,
    });
  } catch (error) {
    console.error(
      "❌ Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get notifications",

      error:
        error.message,
    });
  }
};

// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================

export const markAsRead = async (
  req,
  res
) => {
  try {
    const userId =
      Number(req.user.id);

    const { id } =
      req.params;

    const notification =
      await Notification.findOne({
        where: {
          id,
          userId,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,

        message:
          "Notification not found",
      });
    }

    await notification.update({
      isRead: true,
    });

    return res.json({
      success: true,

      message:
        "Notification marked as read",

      notification,
    });
  } catch (error) {
    console.error(
      "❌ Mark notification error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update notification",

      error:
        error.message,
    });
  }
};

// ======================================================
// GET UNREAD COUNT
// ======================================================

export const getUnreadCount =
  async (req, res) => {
    try {
      const userId =
        Number(req.user.id);

      const count =
        await Notification.count({
          where: {
            userId,

            isRead: false,
          },
        });

      return res.json({
        success: true,

        unreadCount:
          count,
      });
    } catch (error) {
      console.error(
        "❌ Unread count error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to get unread count",

        error:
          error.message,
      });
    }
  };