import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
    },

    applicantEmail: {
      type: String,
    },

    appliedByEmployeeCode: {
      type: String,
    },

    appliedByName: {
      type: String,
    },

    appliedByEmail: {
      type: String,
    },

    fromDate: {
      type: String,
    },

    toDate: {
      type: String,
    },

    days: {
      type: Number,
    },

    leaveType: {
      type: String,
    },

    dayType: {
      type: String,
    },

    deductedFrom: {
      type: String,
      enum: [
        "Earn Leave",
        "Floating Leave",
        "Negative Leave",
      ],
    },

    status: {
      type: String,
      default: "Pending",
    },
    approvedBy: String,

    rejectedReason: String,
  },

  { timestamps: true }
);

const Leave = mongoose.model("Leave", LeaveSchema);

export default Leave;