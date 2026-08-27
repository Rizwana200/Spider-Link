import express from "express";

import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// GET NOTIFICATIONS
// ======================================================

router.get(
  "/",
  authMiddleware,
  getNotifications
);

// ======================================================
// GET UNREAD COUNT
// ======================================================

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadCount
);

// ======================================================
// MARK AS READ
// ======================================================

router.patch(
  "/:id/read",
  authMiddleware,
  markAsRead
);

export default router;