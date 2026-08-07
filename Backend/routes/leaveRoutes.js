import express from "express";
import Leave from "../models/Leave.js";
import Login from "../models/Login.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
import sendMail from "../utils/sendMail.js";
import { isFixedHoliday } from "../utils/fixedHolidays.js";

const router = express.Router();
// Helper: Check weekend
const isWeekend = (dateString) => {
  const d = new Date(dateString);
  const day = d.getDay(); // 0 Sunday, 6 Saturday
  return day === 0 || day === 6;
};
// GET LEAVES
router.get("/", authMiddleware, checkPermission("Leave_view"), async (req, res) => {
  try {
    if (req.user.role === "HR" || req.user.role === "ADMIN") {
      const leaves = await Leave.find().sort({ createdAt: -1 });
      return res.json(leaves);
    }
    const leaves = await Leave.find({
      employee_code: req.user.employee_code,
    }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
);
// APPLY LEAVE
router.post("/", authMiddleware, checkPermission("Leave_create"), async (req, res) => {
  try {
    const {
      employee_code,
      leaveType,
      leaveSource,
      description,
      leaveDates,
    } = req.body;
    // VALIDATION
    if (!leaveType) {
      return res.status(400).json({
        msg: "Leave type is required",
      });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({
        msg: "Reason is required",
      });
    }
    if (!leaveDates || leaveDates.length === 0) {
      return res.status(400).json({
        msg: "Select leave date",
      });
    }
    const employee = await Login.findOne({
      employee_code,
    });
    if (!employee) {
      return res.status(404).json({
        msg: "Employee not found",
      });
    }
    // DUPLICATE DATE CHECK
    const uniqueDates = new Set(
      leaveDates.map((d) => d.date)
    );
    if (uniqueDates.size !== leaveDates.length) {
      return res.status(400).json({
        msg: "Duplicate leave dates are not allowed",
      });
    }
    // WEEKEND + HOLIDAY VALIDATION
    for (const item of leaveDates) {
      if (isWeekend(item.date)) {
        return res.status(400).json({
          msg: `${item.date} is Saturday/Sunday. Leave cannot be applied.`,
        });
      }
      if (isFixedHoliday(item.date)) {
        return res.status(400).json({
          msg: `${item.date} is a company holiday. Leave cannot be applied.`,
        });
      }
    }
    // CALCULATE DAYS
    let days = 0;
    for (const item of leaveDates) {
      if (
        item.dayType === "1st Half Day" ||
        item.dayType === "2nd Half Day"
      ) {
        days += 0.5;
      } else {
        days += 1;
      }
    }
    // BALANCE DEDUCTION
    let deductedFrom = leaveType;
    let earnUsed = 0;
    let floatingUsed = 0;
    if (leaveType === "Earn Leave") {
      // Earn Leave can go negative
      employee.earnLeave -= days;
      earnUsed = days;
    }
    if (leaveType === "Floating Leave") {
      if (employee.floatingLeave < 0.5) {
        return res.status(400).json({
          msg: "Floating Leave balance is less than 0.5 day",
        });
      }
      if (employee.floatingLeave < days) {
        return res.status(400).json({
          msg: "Insufficient Floating Leave balance",
        });
      }
      employee.floatingLeave -= days;
      floatingUsed = days;
    }
    await employee.save();
    // CREATE LEAVE
    const leave = await Leave.create({
      employee_code,
      name: employee.name,
      applicantEmail: employee.email,
      appliedByEmployeeCode:
        req.user.employee_code,
      appliedByName: req.user.name,
      appliedByEmail: req.user.email,
      earnUsed,
      floatingUsed,
      leaveType,
      leaveSource,
      description,
      leaveDates,
      days,
      deductedFrom,
      status: "Pending",
    });
    // EMAIL IF APPLYING ON BEHALF
    if (employee.employee_code !== req.user.employee_code) {
      await sendMail(
        employee.email,
        "Leave Applied On Your Behalf",
        "Leave Applied",
        `
            <h2>Leave Applied</h2>
            <p>A leave has been applied on your behalf.</p>

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
  checkPermission("Leave_edit"),
  async (req, res) => {
    try {
      const leave = await Leave.findById(
        req.params.id
      );
      if (!leave) {
        return res.status(404).json({
          msg: "Leave not found",
        });
      }
      const oldStatus = leave.status;
      const newStatus = req.body.status;
      // Restore leave if rejected
      if (oldStatus === "Pending" && newStatus === "Rejected") {
        const employee =
          await Login.findOne({
            employee_code:
              leave.employee_code,
          });

        if (employee) {
          if (leave.deductedFrom === "Earn Leave") {
            employee.earnLeave +=
              leave.earnUsed || leave.days;
          }
          if (leave.deductedFrom ==="Floating Leave") {
            employee.floatingLeave +=
              leave.floatingUsed || leave.days;
          }

          await employee.save();
        }
      }

      leave.status = newStatus;
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
router.get(
  "/search-employee",
  authMiddleware,
  async (req, res) => {
    const keyword =
      req.query.search || "";

    const employees =
      await Login.find({
        $and: [
          {
            employee_code: {
              $ne:
                req.user.employee_code,
            },
          },
          {
            $or: [
              {
                employee_code: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                name: {
                  $regex: keyword,
                  $options: "i",
                },
              },
            ],
          },
        ],
      });

    res.json(employees);
  }
);

export default router;









































// import express from "express";
// import Login from "../models/Login.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();
// // ADD EARN LEAVE
// router.put("/add-earn-leave/:id",authMiddleware, async (req, res) => {
//     try {
//       const employee = await Login.findById(
//         req.params.id
//       );
//       if (!employee) {
//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }
//       const joiningDate = new Date(
//         employee.joiningDate
//       );
//       const today = new Date();
//       const diffMonths =
//         (today.getFullYear() -
//           joiningDate.getFullYear()) *
//         12 +
//         (today.getMonth() -
//           joiningDate.getMonth());
//       const leaveToAdd =
//       diffMonths < 6 ? 0.83 : 1;
//       employee.earnLeave += leaveToAdd; // add monthly leave
//       if (employee.earnLeave < 0) {
//         employee.earnLeave = 0;
//       }
//       await employee.save();
//       res.json({
//         success: true,
//         msg: "Earn Leave Added",
//         data: employee,
//       });

//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

// // ADD FLOATING LEAVE
// router.put(
//   "/add-floating-leave/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee = await Login.findById(
//         req.params.id
//       );
//       if (!employee) {
//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }
//       const today = new Date();
//       // Check last floating leave
//       if (employee.lastFloatingLeaveDate) {
//         const lastDate = new Date(
//           employee.lastFloatingLeaveDate
//         );
//         const diffMonths =
//           (today.getFullYear() -
//             lastDate.getFullYear()) *
//           12 +
//           (today.getMonth() -
//             lastDate.getMonth());

//         if (diffMonths < 6) {
//           return res.status(400).json({
//             msg:
//               "Floating Leave already granted within last 6 months",
//           });
//         }
//       }
//       employee.floatingLeave += 3;
//       employee.lastFloatingLeaveDate =
//         today;
//       await employee.save();

//       res.json({
//         success: true,
//         msg: "Floating Leave Added",
//         data: employee,
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );
// // GET EMPLOYEE LEAVE BALANCE
// router.get("/leave-balance/:employee_code",authMiddleware,async (req, res) => {
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
//         success: true,
//         earnLeave:
//           employee.earnLeave || 0,
//         floatingLeave:
//           employee.floatingLeave || 0,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );
// export default router;

















