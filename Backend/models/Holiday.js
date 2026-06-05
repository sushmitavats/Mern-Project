import mongoose from "mongoose";
const holidaySchema = new mongoose.Schema(
  {
    holidayName: {
      type: String,
      required: true,
      trim: true,
    },

    holidayDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    holidayType: {
      type: String,
      enum: [
        "National",
        "Festival",
        "Company",
        "Optional",
      ],
      default: "Company",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    createdBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Holiday",
  holidaySchema
);