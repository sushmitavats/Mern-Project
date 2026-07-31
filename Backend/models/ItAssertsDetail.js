import mongoose from "mongoose";

const ItAssertsDetailSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      default: "",
      trim: true,
    },
    officialEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    laptop: {
      type: String,
      default: "",
      trim: true,
    },
    assetId: {
      type: String,
      default: "",
      trim: true,
    },

    systemAccess: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ItAssertsDetail",
  ItAssertsDetailSchema
);