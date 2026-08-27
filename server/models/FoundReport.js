import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FoundReport = sequelize.define(
  "FoundReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    foundLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    foundDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "SEARCHING",
        "MATCHED",
        "CLAIMED",
        "RETURNED"
      ),
      defaultValue: "SEARCHING",
    },
  },
  {
    tableName: "found_reports",
  }
);

export default FoundReport;