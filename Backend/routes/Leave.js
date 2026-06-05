import express from "express";
import Leave from "../models/Leave.js";
import Login from "../models/Login.js";
import Holiday from "../models/Holiday.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
import sendMail from "../utils/sendMail.js";

const router = express.Router();
// GET LEAVES
router.get(
  "/",
  authMiddleware,
  checkPermission("LEAVE_VIEW"),

  async (req, res) => {
    try {

      // HR / ADMIN CAN SEE ALL LEAVES

      if (
        req.user.role === "HR" ||
        req.user.role === "ADMIN"
      ) {

        const leaves = await Leave.find()
          .sort({ createdAt: -1 });

        return res.json(leaves);
      }

      // EMPLOYEE CAN SEE OWN LEAVES

      const leaves = await Leave.find({
        employee_code:
          req.user.employee_code,
      }).sort({
        createdAt: -1,
      });

      res.json(leaves);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// APPLY LEAVE

// can delete apply
router.post(
  "/",

  authMiddleware,

  checkPermission("LEAVE_CREATE"),

  async (req, res) => {

    try {

      const {
  employee_code,
  leaveType,
  leaveSource,
  description,
  leaveDates
} = req.body;

console.log(req.body);
      // EMPLOYEE CHECK


      const employee =
        await Login.findOne({
          employee_code,
        });

      if (!employee) {

        return res.status(404).json({
          msg: "Employee not found",
        });
      }
// holiday

const holidays =
  await Holiday.find({
    status: "Active",
  });

const holidayDates =
  holidays.map(
    (h) => h.holidayDate
  );

const leaveDateStrings =
  leaveDates.map(
    (item) => item.date
  );

const holidayFound =
  leaveDateStrings.some(
    (date) =>
      holidayDates.includes(date)
  );

if (holidayFound) {

  return res.status(400).json({
    msg:
      "Leave cannot be applied on holiday",
  });

}









let days = 0;                                                                

leaveDates.forEach((item) => {
  if (
    item.dayType === "1st Half Day" ||
    item.dayType === "2nd Half Day"
  ) {
    days += 0.5;
  } else {
    days += 1;
  }
});


// if (
//   leaveSource === "Earn Leave" &&
//   employee.earnLeave < days
// ) {
//   return res.status(400).json({
//     msg: "Insufficient Earn Leave",
//   });
// }

// SOME UNIQUE DATE


const uniqueDates =
  new Set(
    leaveDates.map(
      (d) => d.date
    )
  );

if (
  uniqueDates.size !==
  leaveDates.length
) {
  return res.status(400).json({
    msg: "Duplicate leave dates"
  });
}

//       let days = 0;                                                                

// leaveDates.forEach((item) => {
//   if (
//     item.dayType === "1st Half Day" ||
//     item.dayType === "2nd Half Day"
//   ) {
//     days += 0.5;
//   } else {
//     days += 1;
//   }
// });
      // MINIMUM LEAVE CHECK
      // const totalAvailable =
      //   employee.earnLeave +
      //   employee.floatingLeave;

      // if (
      //   totalAvailable < 0.5
      // ) {

      //   return res.status(400).json({
      //     msg:
      //       "Minimum 0.5 leave required",
      //   });
      // }
      // LEAVE DEDUCTION PRIORITY
      let deductedFrom = "";
      // 1. EARN LEAVE
     if (leaveSource === "Earn Leave") {
  employee.earnLeave -= days;
}

else if (leaveSource === "Floating Leave") {
  employee.floatingLeave -= days;
}

else if (leaveSource === "Both") {

 let remaining = days;

  const earnUsed = Math.min(
    Math.max(employee.earnLeave, 0),
    remaining
  );

  employee.earnLeave -= earnUsed;
  remaining -= earnUsed;

  const floatingUsed = Math.min(
    Math.max(employee.floatingLeave, 0),
    remaining
  );

  employee.floatingLeave -= floatingUsed;
  remaining -= floatingUsed;

  if (remaining > 0) {
    employee.floatingLeave -= remaining;
  }
} 
      // SAVE EMPLOYEE 
      await employee.save();     
      // CREATE LEAVE
      console.log("REQ BODY", req.body);
      console.log("DEDUCTED FROM", deductedFrom);
  

  const leave =
  await Leave.create({
  employee_code,
  name: employee.name,
  applicantEmail: employee.email,

  appliedByEmployeeCode:
    req.user.employee_code,

  appliedByName:
    req.user.name,

  appliedByEmail:
    req.user.email,

  leaveType,
  leaveSource,
  description,

  leaveDates,

  days,

  // deductedFrom,
    deductedFrom:
    deductedFrom || leaveType,

  status: "Pending",
});

      // SEND MAIL IF APPLYING
      // ON BEHALF OF EMPLOYEE
    
      if (
        employee.employee_code !==
        req.user.employee_code
      ) {

        await sendMail(

          employee.email,

          "Leave Applied On Your Behalf",

          "Leave Applied",

          `
            <h2>Leave Applied</h2>

            <p>
              A leave has been applied on your behalf.
            </p>

            <p>
              <b>Applied By:</b>
              ${req.user.name}
            </p>

            <p>
              <b>Employee Code:</b>
              ${req.user.employee_code}
            </p>

            <p>
              <b>Leave Type:</b>
              ${leaveType}
            </p>
            <p>
              <b>Total Days:</b>
              ${days}
            </p>
          `
        );
      }

      res.json({
        success: true,
        leave,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// APPROVE / REJECT LEAVE
router.put(
  "/:id",

  authMiddleware,

  checkPermission("LEAVE_APPROVE"),

  async (req, res) => {

    try {

      if (
        req.user.role !== "HR" &&
        req.user.role !== "ADMIN"
      ) {

        return res.status(403).json({
          msg: "Only HR/Admin allowed",
        });
      }

      const leave =
        await Leave.findById(
          req.params.id
        );

      if (!leave) {

        return res.status(404).json({
          msg: "Leave not found",
        });
      }

      leave.status =
        req.body.status;

      leave.approvedBy =
        req.user.employee_code;

      await leave.save();

      res.json({
        success: true,
        leave,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// SEARCH EMPLOYEE

// //no search employee(can delete)
// router.get(
//   "/search-employee/:keyword",

//   authMiddleware,

//   async (req, res) => {

//     try {

//       const keyword =
//         req.params.keyword;

//       const employees =
//         await Login.find({

//           $or: [

//             {
//               name: {
//                 $regex: keyword,
//                 $options: "i",
//               },
//             },

//             {
//               employee_code: {
//                 $regex: keyword,
//                 $options: "i",
//               },
//             },
//           ],
//         });

//       res.json(employees);

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

// // ADD FLOATING LEAVE

// // can delete(using in leave management)
// router.put(
//   "/add-floating/:id",

//   authMiddleware,

//   async (req, res) => {

//     try {

//       const employee =
//         await Login.findById(
//           req.params.id
//         );

//       if (!employee) {

//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }

//       const today =
//         new Date();

//       // CHECK LAST FLOATING DATE

//       if (
//         employee.lastFloatingLeaveDate
//       ) {

//         const lastDate =
//           new Date(
//             employee.lastFloatingLeaveDate
//           );

//         const diffMonths =
//           (
//             today.getFullYear() -
//             lastDate.getFullYear()
//           ) * 12 +

//           (
//             today.getMonth() -
//             lastDate.getMonth()
//           );

//         if (diffMonths < 6) {

//           return res.status(400).json({
//             msg:
//               "Floating leave already added for this period",
//           });
//         }
//       }

//       employee.floatingLeave += 3;

//       employee.lastFloatingLeaveDate =
//         today;

//       await employee.save();

//       res.json({
//         success: true,
//         msg:
//           "Floating leave added successfully",
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

// // ADD EARN LEAVE

// // can delete(can delete)
// router.put(
//   "/add-earn/:id",

//   authMiddleware,

//   async (req, res) => {

//     try {

//       const employee =
//         await Login.findById(
//           req.params.id
//         );

//       if (!employee) {

//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }

//       const joining =
//         new Date(
//           employee.joiningDate
//         );

//       const today =
//         new Date();

//       const months =
//         (
//           today.getFullYear() -
//           joining.getFullYear()
//         ) * 12 +

//         (
//           today.getMonth() -
//           joining.getMonth()
//         );

//       // FIRST 6 MONTHS

//       if (months < 6) {

//         employee.earnLeave += 0.83;
//       }

//       // AFTER 6 MONTHS

//       else {

//         employee.earnLeave += 1.23;
//       }

//       await employee.save();

//       res.json({
//         success: true,
//         msg:
//           "Earn leave added successfully",
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // GET LEAVE BALANCE

// //can delete()
// router.get(
//   "/balance/:employee_code",

//   authMiddleware,

//   async (req, res) => {

//     try {

//       const employee =
//         await Login.findOne({
//           employee_code:
//             req.params.employee_code,
//         });

//       if (!employee) {

//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }

//       res.json({

//         earnLeave:
//           employee.earnLeave,

//         floatingLeave:
//           employee.floatingLeave,

//         negativeLeave:
//           employee.negativeLeave,
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

export default router;




















// import express from "express";
// import Leave from "../models/Leave.js";
// import Employee from "../models/EmployeeTable.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { checkPermission } from "../middleware/checkPermission.js";
// import sendMail from "../utils/sendMail.js";
// import Holiday from "../models/Holiday.js";
// import Login from "../models/Login.js";


// const router = express.Router();

// router.get("/",  authMiddleware, checkPermission("LEAVE_VIEW"),async (req, res) => {
//   try {

//     if (req.user.role === "HR" ||  req.user.role === "ADMIN") {
     

//       const data = await Leave.aggregate([
//         {
//           $lookup: {
//             from: "employees",
//             localField: "employee_code",
//             foreignField: "employee_code",
//             as: "employee",
//           },
//         },
//         { $unwind: "$employee" },
//       ]);

//       return res.json(data);
//     }

//     const data = await Leave.find({
//       employee_code: req.user.employee_code,
//     });

//     res.json(data);

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.post(
//   "/",
//   authMiddleware,
//   checkPermission("LEAVE_CREATE"),

//   async (req, res) => {

//     try {

//       const employee =
//         await Employee.findOne({
//           employee_code:
//             req.body.employee_code,
//         });

//       if (!employee) {

//         return res.status(404).json({
//           message: "Employee not found",
//         });
//       }

//       const leave = new Leave({

//         employee_code:
//           employee.employee_code,

//         name:
//           employee.name,

//         fromDate:
//           req.body.fromDate,

//         toDate:
//           req.body.toDate,

//         days:
//           req.body.days,

//         leaveType:
//           req.body.leaveType,

//         dayType:
//           req.body.dayType,

//         appliedByEmail:
//           req.user.email,

//         appliedByName:
//           req.user.name,

//         appliedByEmployeeCode:
//           req.user.employee_code,
//       });

//       await leave.save();

//       // MAIL ONLY WHEN APPLYING
//       // ON BEHALF OF OTHER EMPLOYEE

//       if (
//         employee.employee_code !==
//         req.user.employee_code
//       ) {

//         await sendMail(

//   employee.email,

//   "Leave Applied On Your Behalf",

//   "Leave Applied",

//   `
//     <h2>Leave Created</h2>

//     <p>
//       A leave has been applied on your behalf.
//     </p>

//     <p>
//       <b>Applied By Name:</b>
//       ${req.user.name}
//     </p>

//     <p>
//       <b>Applied By Employee Code:</b>
//       ${req.user.employee_code}
//     </p>

//     <p>
//       <b>Leave Type:</b>
//       ${req.body.leaveType}
//     </p>

//     <p>
//       <b>From Date:</b>
//       ${req.body.fromDate}
//     </p>

//     <p>
//       <b>To Date:</b>
//       ${req.body.toDate}
//     </p>

//     <p>
//       <b>Total Days:</b>
//       ${req.body.days}
//     </p>
//   `
// );
//       }
//      console.log(employee);
//       res.json(leave);

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({
//         message: err.message,
//       });
//     }
//   }
// );


// router.put("/:id", authMiddleware, checkPermission("LEAVE_APPROVE"), async (req, res) => {
//   try {
//     if (req.user.role !== "HR") {
//       return res.status(403).json({ msg: "Only HR allowed" });
//     }

//     const updated = await Leave.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//      { returnDocument: "after" }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // new leaves

// router.post(
//   "/apply",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const {
//         employee_code,
//         fromDate,
//         toDate,
//         leaveType,
//         dayType,
//       } = req.body;

//       const employee =
//         await Login.findOne({
//           employee_code,
//         });

//       if (!employee) {
//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }

//       const holidays =
//         await Holiday.find();

//       const holidayDates =
//         holidays.map(
//           (h) => h.holidayDate
//         );

//       if (
//         holidayDates.includes(fromDate)
//       ) {
//         return res.status(400).json({
//           msg: "Holiday selected",
//         });
//       }

//       let days = 1;

//       if (
//         dayType === "1st Half Day" ||
//         dayType === "2nd Half Day"
//       ) {
//         days = 0.5;
//       } else {
//         const start = new Date(
//           fromDate
//         );

//         const end = new Date(
//           toDate
//         );

//         days =
//           Math.ceil(
//             (end - start) /
//               (1000 *
//                 60 *
//                 60 *
//                 24)
//           ) + 1;
//       }

//       let deductedFrom = "";

//       if (
//         employee.earnLeave >= days
//       ) {
//         employee.earnLeave -= days;

//         deductedFrom =
//           "Earn Leave";
//       }

//       else if (
//         employee.floatingLeave >=
//         days
//       ) {
//         employee.floatingLeave -=
//           days;

//         deductedFrom =
//           "Floating Leave";
//       }

//       else {
//         employee.negativeLeave -=
//           days;

//         deductedFrom =
//           "Negative Leave";
//       }

//       await employee.save();

//       const leave =
//         await Leave.create({
//           employee_code,
//           name: employee.name,
//           fromDate,
//           toDate,
//           days,
//           leaveType,
//           dayType,
//           deductedFrom,
//         });

//       res.json({
//         success: true,
//         leave,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // ================= GET LEAVES =================

// router.get(
//   "/all",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const leaves =
//         await Leave.find().sort({
//           createdAt: -1,
//         });

//       res.json(leaves);
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // ================= UPDATE STATUS =================

// router.put(
//   "/status/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const leave =
//         await Leave.findById(
//           req.params.id
//         );

//       leave.status =
//         req.body.status;

//       leave.approvedBy =
//         req.user.employee_code;

//       await leave.save();

//       res.json({
//         success: true,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // ================= SEARCH EMPLOYEE =================

// router.get(
//   "/search-employee/:keyword",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const keyword =
//         req.params.keyword;

//       const employees =
//         await Login.find({
//           $or: [
//             {
//               name: {
//                 $regex: keyword,
//                 $options: "i",
//               },
//             },

//             {
//               employee_code: {
//                 $regex: keyword,
//                 $options: "i",
//               },
//             },
//           ],
//         });

//       res.json(employees);
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // ================= ADD FLOATING LEAVE =================

// router.put(
//   "/add-floating/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee =
//         await Login.findById(
//           req.params.id
//         );

//       const today =
//         new Date();

//       if (
//         employee.lastFloatingLeaveDate
//       ) {
//         const lastDate =
//           new Date(
//             employee.lastFloatingLeaveDate
//           );

//         const diffMonths =
//           (today.getFullYear() -
//             lastDate.getFullYear()) *
//             12 +
//           (today.getMonth() -
//             lastDate.getMonth());

//         if (diffMonths < 6) {
//           return res
//             .status(400)
//             .json({
//               msg:
//                 "Floating leave already added",
//             });
//         }
//       }

//       employee.floatingLeave += 3;

//       employee.lastFloatingLeaveDate =
//         today;

//       await employee.save();

//       res.json({
//         success: true,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// //  ADD EARN LEAVE 

// router.put(
//   "/add-earn/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee =
//         await Login.findById(
//           req.params.id
//         );

//       const joining =
//         new Date(
//           employee.joiningDate
//         );

//       const today =
//         new Date();

//       const months =
//         (today.getFullYear() -
//           joining.getFullYear()) *
//           12 +
//         (today.getMonth() -
//           joining.getMonth());

//       if (months < 6) {
//         employee.earnLeave += 0.83;
//       } else {
//         employee.earnLeave += 1.23;
//       }

//       await employee.save();

//       res.json({
//         success: true,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );


// // ================= LEAVE BALANCE =================

// router.get(
//   "/balance/:employee_code",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee =
//         await Login.findOne({
//           employee_code:
//             req.params.employee_code,
//         });

//       res.json({
//         earnLeave:
//           employee.earnLeave,

//         floatingLeave:
//           employee.floatingLeave,

//         negativeLeave:
//           employee.negativeLeave,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

// export default router;
