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
const bankSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      unique: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      default: "",
    },
    upi: {
      type: String,
      default: "",
    },
    // Multiple documents (Maximum 6)
    cancelledCheque: {
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

export default mongoose.model("BankDetails", bankSchema);
