import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    employee_code: String,
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);