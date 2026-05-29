import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: String,

    performedBy: String,

    employee_code: String,

    details: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AuditLog",
  auditSchema
);