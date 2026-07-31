import mongoose from "mongoose";

const ExitDetailSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    resignationDate: {
      type: Date,
      default: null,
    },

    lwd: {
      type: Date,
      default: null,
    },

    exitReason: {
      type: String,
      default: "",
      trim: true,
    },

    fnf: {
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
  "ExitDetail",
  ExitDetailSchema
);