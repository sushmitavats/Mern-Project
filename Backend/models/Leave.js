import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee_code: {
      type: String,
      required: true,
      index: true,
    },
    name: String,
    applicantEmail: String,
    appliedByEmployeeCode: String,
    appliedByName: String,
    appliedByEmail: String,
    days: {
      type: Number,
      default: 0,
    },
    earnUsed: {
      type: Number,
      default: 0,
    },
    floatingUsed: {
      type: Number,
      default: 0,
    },
    leaveType: {
      type: String,
      enum: ["Earn Leave", "Floating Leave"],
      required: true,
    },
    leaveDates: [
      {
        date: {
          type: String,
          required: true,
        },
        dayType: {
          type: String,
          enum: [
            "Full Day",
            "1st Half Day",
            "2nd Half Day",
          ],
          required: true,
        },
      },
    ],
    deductedFrom: {
      type: String,
      enum: ["Earn Leave", "Floating Leave"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    leaveSource: {
      type: String,
      enum: ["Earn Leave", "Floating Leave"],
    },
    description: {
      type: String,
      required: true,
    },
    approvedBy: String,
    rejectedReason: String,
    calendarLabel: String,
  },
  {
    timestamps: true,
  }
);
LeaveSchema.index({
  employee_code: 1,
  createdAt: -1,
});
LeaveSchema.index({
  status: 1,
});
export default mongoose.model("Leave", LeaveSchema);















// import mongoose from "mongoose";

// const LeaveSchema = new mongoose.Schema(
//   {
//     employee_code: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     name: {
//       type: String,
//     },
//     applicantEmail: {
//       type: String,
//     },
//     appliedByEmployeeCode: {
//       type: String,
//     },
//     appliedByName: {
//       type: String,
//     },
//     appliedByEmail: {
//       type: String,
//     },
//     days: {
//       type: Number,
//     },
//     earnUsed: {
//       type: Number,
//       default: 0,
//     },
//     floatingUsed: {
//       type: Number,
//       default: 0,
//     },
//     leaveType: {
//       type: String,
//     },
//     leaveDates: [
//       {
//         date: {
//           type: String,
//           required: true,
//         },
//         dayType: {
//           type: String,
//           enum: [
//             "Full Day",
//             "1st Half Day",
//             "2nd Half Day",
//           ],
//           required: true,
//         },
//       },
//     ],
//     deductedFrom: {
//       type: String,
//       enum: [
//         "Earn Leave",
//         "Floating Leave",
//         "Both",
//       ],
//     },
//     status: {
//       type: String,
//       default: "Pending",
//     },
//     leaveSource: {
//       type: String,
//       enum: [
//         "Earn Leave",
//         "Floating Leave",
//         "Both",
//       ],
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     calendarLabel: {
//       type: String,
//     },
//     approvedBy: String,

//     rejectedReason: String,
//   },

//   { timestamps: true }
// );

// // ADD INDEXES

// LeaveSchema.index({
//   employee_code: 1,
//   createdAt: -1,
// });

// LeaveSchema.index({
//   status: 1,
// });


// const Leave = mongoose.model("Leave", LeaveSchema);

// export default Leave;