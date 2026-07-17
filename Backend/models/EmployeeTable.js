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
        //change done.
        // Employment detail
        employeeType: String,
        // department: String,
        // designation: String,
        // maritalStatus:String,
        // bloodGroup:String,
        // nationality:String,
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
        employmentStatus: {
            type: String,
            default: "Active"
        },
        shift: String,
        probationPeriod: String,
        confirmationDate: Date,
        noticePeriod: String,
        costCenter: String,
        // Identity
        // aadhaar: String,
        // pan: String,
        // passport: String,
        // drivingLicense: String,
        // uan: String,
        // pfNumber: String,
        // esic: String,
        // Address Details
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
        pincode: {
            type: String,
            trim: true,
            default: ""
        },
        // Bank
        // accountHolder: String,
        // bankName: String,
        // accountNumber: String,
        // ifsc: String,
        // branch: String,
        // upi: String,
        //Payroll
        // ctc: Number,
        // payrollGroup: String,
        // salaryEffectiveDate: Date,
        // allowances: String,
        //Education
        // qualification: String,
        // institution: String,
        // educationYear: String,
        // cgpa: String,
        // // Experience
        // company: String,
        // experienceDesignation: String,
        // experienceStartDate: Date,
        // experienceEndDate: Date,
        // lastCtc: Number,


        // // Emergency

        // emergencyName: String,
        // relationship: String,
        // emergencyPhone: String,
        // emergencyAddress: String,


        // // Documents

        // documents: [

        //     {
        //         documentName: String,
        //         fileUrl: String
        //     }

        // ],
        // // IT & Assets
        // username: String,
        // laptop: String,
        // assetId: String,
        // systemAccess: String,
        // // Leave
        // leavePolicy: String,
        // attendancePolicy: String,
        // holidayCalendar: String,
        // weeklyOff: String,
        // // Exit
        // resignationDate: Date,
        // lwd: Date,
        // exitReason: String,
        // fnf: String,
        // // Additional
        // skills: [String],
        // certifications: [String],
        // languages: [String],
        // linkedIn: String,
        // notes: String,
        // draft: {
        //     type: Boolean,
        //     default: true
        // }
    },
    { timestamps: true }
);
export default mongoose.model("Employee", employeeSchema);

