import mongoose from "mongoose";

const leaveHistorySchema = new mongoose.Schema(
  {
    employee_code: String,
    leaveType: String,
    action: String,
    previousBalance: Number,
    updatedBalance: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "LeaveHistory",
  leaveHistorySchema
);