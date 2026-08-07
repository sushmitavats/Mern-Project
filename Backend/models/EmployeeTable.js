import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Login"
        },
        employee_code: {
            type: String,
            required: true,
            unique: true
        },
        draft: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        profilePhoto: String,
        firstName: {
            type: String,
            default: ""
        },
        middleName: {
            type: String,
            default: ""
        },
        lastName: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        dob: Date,
        personalEmail: String,
        officialEmail: String,
        mobile: String,
        mobile: {
            type: String,
            // unique: true
        },
        alternateMobile: String,
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        },
        designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation"
        },
        joiningDate: Date,
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        employeeType: String,
        maritalStatus: {
            type: String,
            default: ""
        },
        bloodGroup: {
            type: String,
            default: ""
        },
        nationality: {
            type: String,
            default: ""
        },
        reportingManager: String,
        team: String,
        workLocation: String,
        officeBranch: String,
        joininDate: Date,
        // employmentStatus: {
        //     type: String,
        //     default: "Active"
        // },
        shift: String,
        probationPeriod: String,
        confirmationDate: Date,
        noticePeriod: String,
        costCenter: String,
        currentAddress: {
            type: String,
            trim: true,
            default: ""
        },
        permanentAddress: {
            type: String,
            trim: true,
            default: ""
        },
        currentPincode: {
            type: String,
            default: "",
            trim: true,
        },
        permanentPincode: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true }
);
export default mongoose.model("Employee", employeeSchema);

