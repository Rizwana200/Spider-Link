import express from "express";

import {
  createLostReport,
  getMyLostReports,
} from "../controllers/lostController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createLostReport
);

router.get(
  "/my",
  authMiddleware,
  getMyLostReports
);

export default router;