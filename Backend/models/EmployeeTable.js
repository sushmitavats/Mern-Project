import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {

    employee_code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    bankAccount: {
      type: String,
    },
    pfAccount: {
      type: String,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    relievingDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    address: String,
    gender: String,
    dob: Date,
    emergencyContact: String,
    aadhaar: String,
    pan: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
