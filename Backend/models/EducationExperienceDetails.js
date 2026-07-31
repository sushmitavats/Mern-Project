import mongoose from "mongoose";
//    Education Schema
const EducationSchema = new mongoose.Schema(
  {
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    educationYear: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);
//    Experience Schema
const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
    },
    experienceDesignation: {
      type: String,
      trim: true,
    },
    experienceStartDate: {
      type: Date,
    },
    experienceEndDate: {
      type: Date,
      default: null,
    },
    lastCtc: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);
//    Main Schema
const EducationExperienceDetailsSchema =
  new mongoose.Schema(
    {
      employee_code: {
        type: String,
        required: true,
        unique: true,
      },
      education: {
        type: [EducationSchema],
        default: [],
      },
      experience: {
        type: [ExperienceSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model("EducationExperienceDetails",EducationExperienceDetailsSchema);