import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },

    department: {
      type: String,
    },


    joiningDate: {
      type: Date,
      required: true,
    },

    employee_code: {
      type: String,
      default: null,
    },


    earnLeave: {
      type: Number,
      default: 0,
    },

    floatingLeave: {
      type: Number,
      default: 4,
    },

    // negativeLeave: {
    //   type: Number,
    //   default: 0,
    // },

    floatingLeaveIssuedDate: {
      type: Date,
      default: Date.now,
    },

    // lastFloatingLeaveDate: {
    //   type: Date,
    //   default: null,
    // },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Login", loginSchema);










// import mongoose from "mongoose";

// const loginSchema =
//   new mongoose.Schema(
//     {
//       name: {
//         type: String,
//         required: true,
//       },

//       email: {
//         type: String,
//         required: true,
//         unique: true,
//       },

//       password: {
//         type: String,
//         required: true,
//       },

//       role: {
//         type: String,
//         enum: [
//           "ADMIN",
//            "HR",
//           "EMPLOYEE",
//         ],
//         default: "EMPLOYEE",
//       },

//       department: {
//         type: String,
//       },

//       employee_code: {
//         type: String,
//         default: null,
//       },

//       status: {
//         type: String,
//         enum: [
//           "Active",
//           "Inactive",
//         ],
//         default: "Active",
//       },

//       isFirstLogin: {
//         type: Boolean,
//         default: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export default mongoose.model(
//   "Login",
//   loginSchema
// );

