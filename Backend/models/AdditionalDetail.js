import mongoose from "mongoose";

const AdditionalDetailSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    skills: {
      type: String,
      default: "",
      trim: true,
    },
    certifications: {
      type: String,
      default: "",
      trim: true,
    },
    languages: {
      type: String,
      default: "",
      trim: true,
    },
    linkedIn: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
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
  "AdditionalDetail",
  AdditionalDetailSchema
);