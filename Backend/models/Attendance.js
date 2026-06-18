import mongoose from "mongoose";

const attendanceSchema =
  new mongoose.Schema({

    employee_code: {
      type: String,
      required: true,
    },

    inTime: {
      type: String,
      default: "",
    },

    outTime: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

  }, {
    timestamps: true,
  });

export default mongoose.model(
  "Attendance",
  attendanceSchema
);




