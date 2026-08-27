import User from "./User.js";
import Profile from "./Profile.js";
import LostReport from "./LostReport.js";
import FoundReport from "./FoundReport.js";
import Match from "./Match.js";
import Notification from "./Notification.js";

// ================= USER ↔ PROFILE =================

User.hasOne(Profile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Profile.belongsTo(User, {
  foreignKey: "userId",
});

// ================= USER ↔ LOST =================

User.hasMany(LostReport, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

LostReport.belongsTo(User, {
  foreignKey: "userId",
});

// ================= USER ↔ FOUND =================

User.hasMany(FoundReport, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

FoundReport.belongsTo(User, {
  foreignKey: "userId",
});

// ================= LOST ↔ MATCH =================

LostReport.hasMany(Match, {
  foreignKey: "lostReportId",
  onDelete: "CASCADE",
});

Match.belongsTo(LostReport, {
  foreignKey: "lostReportId",
});

// ================= FOUND ↔ MATCH =================

FoundReport.hasMany(Match, {
  foreignKey: "foundReportId",
  onDelete: "CASCADE",
});

Match.belongsTo(FoundReport, {
  foreignKey: "foundReportId",
});

// ================= USER ↔ NOTIFICATION =================

User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
});

// ================= MATCH ↔ NOTIFICATION =================

Match.hasMany(Notification, {
  foreignKey: "matchId",
  onDelete: "CASCADE",
});

Notification.belongsTo(Match, {
  foreignKey: "matchId",
});

export {
  User,
  Profile,
  LostReport,
  FoundReport,
  Match,
  Notification,
};