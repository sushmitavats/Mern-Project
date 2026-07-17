import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    designationCode: {
      type: String
    },
    designationName: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Designation",
  designationSchema
);