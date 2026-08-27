import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import sequelize from "./config/database.js";

dotenv.config();

import "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import lostRoutes from "./routes/lostRoutes.js";
import foundRoutes from "./routes/foundRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";


const app = express();

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================

app.use(
  "/uploads",
  express.static("uploads")
);

// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/lost", lostRoutes);

app.use("/api/found", foundRoutes);

app.use("/api/matches", matchRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/location",
  locationRoutes
);

// ================= HOME =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Spider-Link API is running 🚀",
    version: "1.0.0",
  });
});

// ================= HEALTH =================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Spider-Link server is healthy",
    database: "connected",
  });
});

// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// ================= ERROR =================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "✅ MySQL Connected Successfully"
    );

    await sequelize.sync();

    console.log(
      "✅ Database tables synchronized"
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Spider-Link server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Database connection failed:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

startServer();