import express from "express";

import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get profile
router.get(
  "/",
  authMiddleware,
  getMyProfile
);

// Update profile
router.put(
  "/",
  authMiddleware,
  upload.single("profilePhoto"),
  updateMyProfile
);

export default router;