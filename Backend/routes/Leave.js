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
  checkPermission("Leave_view"),

  async (req, res) => {
    try {
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
router.post("/",
  authMiddleware,
  checkPermission("Leave_create"),
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


      // LEAVE DEDUCTION PRIORITY
      let deductedFrom = "";
      let earnUsed = 0;
      let floatingUsed = 0;
      if (leaveSource === "Earn Leave") {

        // Earn Leave can become negative
        employee.earnLeave -= days;
        earnUsed = days;

        deductedFrom = "Earn Leave";
      }

      else if (leaveSource === "Floating Leave") {
        if (employee.floatingLeave < days) {
          return res.status(400).json({
            msg: "Floating Leave balance is less than required leave."
          });
        }

        if (employee.floatingLeave < 0.5) {
          return res.status(400).json({
            msg: "Floating Leave balance is less than half day (0.5)"
          });
        }
        employee.floatingLeave -= days;
        floatingUsed = days;
        deductedFrom = "Floating Leave";
      }
      else if (leaveSource === "Both") {
        deductedFrom = "Both";
        let remaining = days;

        // Floating Leave cannot go below zero
        floatingUsed = Math.min(
          employee.floatingLeave,
          remaining
        );
        employee.floatingLeave -= floatingUsed;
        remaining -= floatingUsed;
        // Remaining goes to Earn Leave
        if (remaining > 0) {
          earnUsed = remaining;
          employee.earnLeave -= remaining;
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
          earnUsed,
          floatingUsed,
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
  checkPermission("Leave_edit"),
  async (req, res) => {
    try {
      const leave =
        await Leave.findById(
          req.params.id
        );

      if (!leave) {

        return res.status(404).json({
          msg: "Leave not found",
        });
      }

      //approvl logic

      const oldStatus = leave.status;
      const newStatus = req.body.status;
      if (
        oldStatus === "Pending" &&
        newStatus === "Rejected"
      ) {

        const employee =
          await Login.findOne({
            employee_code:
              leave.employee_code,
          });

        if (employee) {

          if (
            leave.deductedFrom === "Earn Leave"
          ) {

            employee.earnLeave += leave.days;
          }

          else if (
            leave.deductedFrom === "Floating Leave"
          ) {

            employee.floatingLeave += leave.days;
          }

          else if (
            leave.deductedFrom === "Both"
          ) {
            // optional later
            employee.earnLeave +=
              leave.earnUsed || 0;

            employee.floatingLeave +=
              leave.floatingUsed || 0;
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


//search employee
router.get(
  "/search-employee",
  authMiddleware,
  async (req, res) => {

    const keyword =
      req.query.search;

    const employees =
      await Login.find({
        $and: [
          {
            employee_code: {
              $ne:
                req.user.employee_code
            }
          },
          {
            $or: [
              {
                employee_code: {
                  $regex: keyword,
                  $options: "i"
                }
              },
              {
                name: {
                  $regex: keyword,
                  $options: "i"
                }
              }
            ]
          }
        ]
      });

    res.json(employees);
  }
);

export default router;


