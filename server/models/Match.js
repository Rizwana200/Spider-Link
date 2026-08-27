import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    lostReportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    foundReportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    categoryScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    colorScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    locationScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    descriptionScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED"
      ),
      defaultValue: "PENDING",
    },

    // ==================================================
    // IMPORTANT: BOTH USER ACCEPTANCE STATES
    // ==================================================

    lostUserAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    foundUserAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // ==================================================
    // CONTACT REVEAL
    // ==================================================

    contactRevealed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "matches",
    timestamps: true,
  }
);

export default Match;