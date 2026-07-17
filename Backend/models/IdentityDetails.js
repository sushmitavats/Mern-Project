import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
  }
);

const identitySchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      unique: true,
    },

    aadhaar: {
      type: String,
      default: "",
    },

    pan: {
      type: String,
      default: "",
    },

    passport: {
      type: String,
      default: "",
    },

    drivingLicense: {
      type: String,
      default: "",
    },

    uan: {
      type: String,
      default: "",
    },

    pfNumber: {
      type: String,
      default: "",
    },

    esic: {
      type: String,
      default: "",
    },

    documents: {
      type: [documentSchema],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 6;
        },
        message: "Maximum 6 documents allowed.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("IdentityDetails", identitySchema);