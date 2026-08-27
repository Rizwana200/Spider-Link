import express from "express";

import {
  createFoundReport,
  getMyFoundReports,
} from "../controllers/foundController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ======================================================
// CREATE FOUND REPORT
// ======================================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createFoundReport
);

// ======================================================
// GET MY FOUND REPORTS
// ======================================================

router.get(
  "/my",
  authMiddleware,
  getMyFoundReports
);

export default router;