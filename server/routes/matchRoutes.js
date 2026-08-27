import express from "express";

import {
  getMatchById,
  getMyMatches,
  acceptMatch,
  rejectMatch,
} from "../controllers/matchController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// ALL MATCH ROUTES REQUIRE LOGIN
// ======================================================

router.use(authMiddleware);

// ======================================================
// GET ALL MY MATCHES
// ======================================================

router.get(
  "/",
  getMyMatches
);

// ======================================================
// GET ONE MATCH
// ======================================================

router.get(
  "/:id",
  getMatchById
);

// ======================================================
// ACCEPT MATCH
// ======================================================

router.patch(
  "/:id/accept",
  acceptMatch
);

// ======================================================
// REJECT MATCH
// ======================================================

router.patch(
  "/:id/reject",
  rejectMatch
);

export default router;