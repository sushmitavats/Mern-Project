import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ["ADMIN", "HR", "EMPLOYEE"],
      required: true,
      unique: true,
    },

    permissions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Permission", permissionSchema);
