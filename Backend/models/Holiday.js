import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    holidayName: String,

    holidayDate: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Holiday",
  holidaySchema
);