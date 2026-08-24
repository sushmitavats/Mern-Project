import express from "express";
import Leave from "../models/Leave.js";
import Login from "../models/Login.js";
import Holiday from "../models/Holiday.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
import sendMail from "../utils/sendMail.js";
const router = express.Router();

// Check weekend
const isWeekend = (dateString) => {
  const d = new Date(dateString);
  const day = d.getDay();
  return day === 0 || day === 6;
};
// Check active holiday
const isHoliday = async (dateString) => {
  const holiday = await Holiday.findOne({
    holidayDate: dateString,
    status: "Active",
  });
  return !!holiday;
};
// GET LEAVES
router.get("/", authMiddleware, checkPermission("Leave_view"),
  async (req, res) => {
    try {
      if (req.user.role === "HR" || req.user.role === "ADMIN") {
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
// checkPermission("Leave_create")
router.post("/", authMiddleware, checkPermission("Leave_create"),
  async (req, res) => {
    try {
      const { employee_code, leaveType, description, leaveDates,
        reportingManagerEmployeeCode,
      } = req.body;
      // BASIC VALIDATION
      console.log(
        "Received employee_code:",
        employee_code
      );
      if (!employee_code || !leaveType || !description || !leaveDates || leaveDates.length === 0) {
        return res.status(400).json({
          msg: "All required fields are mandatory.",
        });
      }
      // FIND EMPLOYEE
      const employee = await Login.findOne({
        employee_code,
        status: "Active",
      });
      if (!employee) {
        return res.status(404).json({
          msg: "Employee not found.",
        });
      }
      // FIND REPORTING MANAGER
      if (!reportingManagerEmployeeCode) {
        return res.status(400).json({
          msg: "Reporting manager is required.",
        });
      }

      const reportingManager = await Login.findOne({
        employee_code: reportingManagerEmployeeCode,
        status: "Active",
      });

      if (!reportingManager) {
        return res.status(404).json({
          msg: "Reporting manager not found or inactive.",
        });
      }
      // CHECK DUPLICATE DATES
      const uniqueDates = new Set(
        leaveDates.map((d) => d.date)
      );

      if (uniqueDates.size !== leaveDates.length) {
        return res.status(400).json({
          msg: "Duplicate dates selected.",
        });
      }
      // CHECK WEEKEND / HOLIDAY / ALREADY APPLIED
      const existingLeaves = await Leave.find({
        employee_code,
        status: {
          $in: [
            "Pending",
            "Approved",
          ],
        },
      });
      for (const item of leaveDates) {
        // Weekend
        if (isWeekend(item.date)) {
          return res.status(400).json({
            msg: `${item.date} is a weekend.`,
          });
        }
        // Holiday
        if (await isHoliday(item.date)) {
          return res.status(400).json({
            msg: `${item.date} is a holiday.`,
          });
        }
        // Already applied 
        const alreadyApplied =
          existingLeaves.some((leave) =>
            leave.leaveDates?.some((d) =>
              d.date === item.date
            ));
        if (alreadyApplied) {
          return res.status(400).json({
            msg: `Leave already applied on ${item.date}.`,
          });
        }
      }
      // CALCULATE TOTAL DAYS
      let days = 0;
      for (const item of leaveDates) {
        if (item.dayType === "1st Half Day" || item.dayType === "2nd Half Day") {
          days += 0.5;
        } else {
          days += 1;
        }
      }
      // LEAVE BALANCE
      let earnUsed = 0;
      let floatingUsed = 0;
      if (leaveType === "Earn Leave") {
        employee.earnLeave = Number(
          (Number(employee.earnLeave || 0) - days).toFixed(2));
        earnUsed = days;
      }
      if (leaveType === "Floating Leave") {
        if (Number(employee.floatingLeave || 0) < days) {
          return res.status(400).json({
            msg: "Insufficient Floating Leave balance.",
          });
        }
        if (leaveType === "No Leave") {
          if (Number(employee.floatingLeave || 0) < days) {
            return res.status(400).json({
              msg: "Can't apply leave on this date",
            })
          }
        }
        employee.floatingLeave = Number(
          (Number(employee.floatingLeave || 0) - days).toFixed(2)
        );
        floatingUsed = days;
      }
      await employee.save();
      // CREATE LEAVE
      const leave = await Leave.create({
        employee_code: employee.employee_code,
        name: employee.name,
        applicantEmail: employee.email,
        appliedByEmployeeCode:
          req.user.employee_code,
        appliedByName:
          req.user.name,
        appliedByEmail:
          req.user.email,
        days,
        earnUsed,
        floatingUsed,
        leaveType,
        leaveSource: leaveType,
        deductedFrom: leaveType,
        description,
        leaveDates,
        status: "Pending",
        // REPORTING MANAGER
        reportingManagerEmployeeCode:
          reportingManager.employee_code,
        reportingManagerName:
          reportingManager.name,
        reportingManagerEmail:
          reportingManager.email,
      });
      // CHECK SELF / ON BEHALF
      const isSelfApplication =
        req.user.employee_code ===
        employee.employee_code;
      // EMAIL
      if (isSelfApplication) {
        await sendMail(
          employee.email,
          "Leave Applied Successfully",
          `<h2>Leave Applied Successfully</h2>
                    <p>Hello ${employee.name},</p>
                    <p>
                        Your leave has been successfully applied.
                    </p>
                    <p>
                        <b>Leave Type:</b>
                        ${leaveType}
                    </p>
                    <p>
                        <b>Total Days:</b>
                        ${days}
                    </p>
                    <p>
                       <b>Leave Dates:</b>
                    </p>
                    <ul>
                        ${leaveDates.map((item) =>
            `<li>${item.date} - ${item.dayType} </li>`).join("")}
                    </ul>
                    <p>
                        <b>Status:</b> Pending
                    </p>
                    <p>
                        This is an automatic notification from HRMS.
                    </p>
                    `
        );
      } else {
        await sendMail(
          employee.email,
          "Leave Applied On Your Behalf",
          `         <h2>Leave Applied On Your Behalf</h2>
                    <p>Hello ${employee.name},</p>
                    <p>
                        A leave has been applied on your behalf.
                    </p>
                    <p>
                        <b>Applied By:</b>
                        ${req.user.name}
                    </p>
                    <p>
                        <b>Applied By Employee Code:</b>
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
                    <p>
                        <b>Leave Dates:</b>
                    </p>
                    <ul>
                        ${leaveDates.map(
            (item) =>
              `<li>${item.date} - ${item.dayType} </li>`
          ).join("")}
                    </ul>
                    <p>
                        <b>Status:</b> Pending
                    </p>
                    <p>
                        This is an automatic notification from HRMS.
                    </p>
                    `
        );
      }
      // REPORTING MANAGER EMAIL
      try {
        if (reportingManager.email) {
          const appliedByText =
            isSelfApplication
              ? "Self"
              : `${req.user.name} (${req.user.employee_code})`;

          await sendMail(
            reportingManager.email,
            "Leave Request Notification",
            `
        <div style="
          font-family: Arial, Helvetica, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          color: #333;
          line-height: 1.6;
        ">

          <h2 style="
            color: #0d6efd;
            margin-bottom: 20px;
          ">
            Leave Request Notification
          </h2>

          <p>
            Hello <b>${reportingManager.name}</b>,
          </p>

          <p>
            A leave request has been submitted and
            you have been selected as the Reporting Manager
            for this leave request.
          </p>

          <table style="
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          ">

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Employee Code</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${employee.employee_code}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Employee Name</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${employee.name}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Applied By</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${appliedByText}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Leave Type</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${leaveType}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Total Days</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                ${days}
              </td>
            </tr>
            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                background: #f5f5f5;
              ">
                <b>Status</b>
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
                color: #f59e0b;
              ">
                Pending
              </td>
            </tr>
          </table>
          <h3 style="
            margin-top: 25px;
            margin-bottom: 10px;
          ">
            Leave Dates
          </h3>
          <table style="
            width: 100%;
            border-collapse: collapse;
          ">
            <thead>
              <tr>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  background: #f5f5f5;
                  text-align: left;
                ">
                  Date
                </th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  background: #f5f5f5;
                  text-align: left;
                ">
                  Day Type
                </th>
              </tr>
            </thead>
            <tbody>
              ${leaveDates
              .map(
                (item) => `
                    <tr>
                      <td style="
                        padding: 10px;
                        border: 1px solid #ddd;
                      ">
                        ${item.date}
                      </td>

                      <td style="
                        padding: 10px;
                        border: 1px solid #ddd;
                      ">
                        ${item.dayType}
                      </td>

                    </tr>
                  `
              )
              .join("")}
            </tbody>
          </table>
          <p style="
            margin-top: 25px;
            color: #777;
            font-size: 13px;
          ">
            This is an automatic notification from HRMS.
            Please do not reply to this email.
          </p>

        </div>
      `
          );
        }

      } catch (managerMailError) {
        // Leave should still be successfully created
        console.error(
          "Leave created but reporting manager email failed:",
          managerMailError
        );
      }
      // RESPONSE
      return res.json({
        success: true,
        msg: "Leave applied successfully.",
        leave,
      });
    } catch (error) {
      console.error(
        "Leave Apply Error:",
        error
      );
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);
//leave edit
router.put("/:id", authMiddleware, checkPermission("Leave_edit"),
  async (req, res) => {
    try {
      const { status, rejectedReason } = req.body;

      if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          msg: "Invalid leave status.",
        });
      }
      const leave = await Leave.findById(req.params.id);
      if (!leave) {
        return res.status(404).json({
          success: false,
          msg: "Leave not found.",
        });
      }
      const oldStatus = leave.status;
      const newStatus = status;
      // Nothing to change
      if (oldStatus === newStatus) {
        return res.json({
          success: true,
          msg: `Leave is already ${newStatus}.`,
          leave,
        });
      }
      const employee = await Login.findOne({
        employee_code: leave.employee_code,
      });
      if (!employee) {
        return res.status(404).json({
          success: false,
          msg: "Employee not found.",
        });
      }
      const leaveAmount =
        leave.deductedFrom === "Earn Leave"
          ? Number(leave.earnUsed || leave.days || 0)
          : Number(leave.floatingUsed || leave.days || 0);
      // REJECTED STATUS
      if (newStatus === "Rejected" && oldStatus !== "Rejected") {
        if (leave.deductedFrom === "Earn Leave") {
          employee.earnLeave = Number((Number(employee.earnLeave || 0) + leaveAmount).toFixed(2));
        }
        if (leave.deductedFrom === "Floating Leave") {
          employee.floatingLeave = Number((Number(employee.floatingLeave || 0) + leaveAmount).toFixed(2));
        }
        await employee.save();
      }
      // REJECTED -> PENDING / APPROVED
      // DEDUCT AGAIN
      if (oldStatus === "Rejected" && (newStatus === "Pending" || newStatus === "Approved")) {
        if (leave.deductedFrom === "Earn Leave") {
          employee.earnLeave = Number((Number(employee.earnLeave || 0) - leaveAmount).toFixed(2));
        }
        if (leave.deductedFrom === "Floating Leave") {
          const currentFloatingLeave = Number(
            employee.floatingLeave || 0
          );
          if (currentFloatingLeave < leaveAmount) {
            return res.status(400).json({
              success: false,
              msg: "Insufficient Floating Leave balance.",
            });
          }
          employee.floatingLeave = Number(
            (currentFloatingLeave - leaveAmount).toFixed(2));
        }
        await employee.save();
      }
      // UPDATE LEAVE
      leave.status = newStatus;
      leave.approvedBy =
        req.user.employee_code;

      if (newStatus === "Rejected") {
        leave.rejectedReason =
          rejectedReason || "Leave rejected by HR/Admin.";
      } else {
        leave.rejectedReason = "";
      }
      await leave.save();
      // SEND EMAIL
      try {
        const employeeEmail =
          employee.email ||
          leave.applicantEmail;

        if (employeeEmail) {
          let subject = "";
          let heading = "";
          let headingColor = "#0d6efd";
          let message = "";

          if (newStatus === "Approved") {
            subject = "Leave Approved";
            heading = "Leave Approved";
            headingColor = "#198754";
            message = `Your leave request has been approved by HR/Admin.`;
          }
          if (newStatus === "Rejected") {
            subject = "Leave Rejected";
            heading = "Leave Rejected";
            headingColor = "#dc3545";
            message = `
              Your leave request has been rejected
              by HR/Admin.
            `;
          }
          if (newStatus === "Pending") {
            subject = "Leave Status Changed to Pending";
            heading = "Leave Status Updated";
            headingColor = "#ffc107";
            message = `
              Your leave request has been moved back
              to Pending status.
            `;
          }
          await sendMail(
            employeeEmail,
            subject,
            `
              <div style="
                font-family: Arial, Helvetica, sans-serif;
                max-width: 650px;
                margin: 0 auto;
                color: #333;
                line-height: 1.6;
              ">
                <h2 style="
                  color: ${headingColor};
                  margin-bottom: 20px;
                ">
                  ${heading}
                </h2>
                <p>
                  Hello <b>${employee.name}</b>,
                </p>
                <p>
                  ${message}
                </p>
                <table style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                ">
                  <tr>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                      background: #f5f5f5;
                    ">
                      <b>Employee Code</b>
                    </td>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                    ">
                      ${leave.employee_code}
                    </td>
                  </tr>
                  <tr>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                      background: #f5f5f5;
                    ">
                      <b>Leave Type</b>
                    </td>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                    ">
                      ${leave.leaveType}
                    </td>
                  </tr>
                  <tr>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                      background: #f5f5f5;
                    ">
                      <b>Total Days</b>
                    </td>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                    ">
                      ${leave.days}
                    </td>
                  </tr>
                  <tr>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                      background: #f5f5f5;
                    ">
                      <b>Status</b>
                    </td>
                    <td style="
                      padding: 10px;
                      border: 1px solid #ddd;
                      font-weight: bold;
                    ">
                      ${newStatus}
                    </td>
                  </tr>
                  ${newStatus === "Rejected"
              ? `
                        <tr>
                          <td style="
                            padding: 10px;
                            border: 1px solid #ddd;
                            background: #f5f5f5;
                          ">
                            <b>Reason</b>
                          </td>

                          <td style="
                            padding: 10px;
                            border: 1px solid #ddd;
                          ">
                            ${leave.rejectedReason}
                          </td>
                        </tr>
                      `
              : ""
            }
                </table>
                <h3 style="margin-top: 25px;">
                  Leave Dates
                </h3>
                <table style="
                  width: 100%;
                  border-collapse: collapse;
                ">
                  <thead>
                    <tr>
                      <th style="
                        padding: 10px;
                        border: 1px solid #ddd;
                        background: #f5f5f5;
                        text-align: left;
                      ">
                        Date
                      </th>

                      <th style="
                        padding: 10px;
                        border: 1px solid #ddd;
                        background: #f5f5f5;
                        text-align: left;
                      ">
                        Day Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${leave.leaveDates
              .map(
                (item) => `
                          <tr>
                            <td style="
                              padding: 10px;
                              border: 1px solid #ddd;
                            ">
                              ${item.date}
                            </td>

                            <td style="
                              padding: 10px;
                              border: 1px solid #ddd;
                            ">
                              ${item.dayType}
                            </td>
                          </tr>
                        `
              )
              .join("")}
                  </tbody>
                </table>
                <p style="
                  margin-top: 25px;
                  color: #777;
                  font-size: 13px;
                ">
                  This is an automatic notification
                  from HRMS. Please do not reply to
                  this email.
                </p>
              </div>
            `
          );
        }
      } catch (mailError) {
        // IMPORTANT:
        // Do not fail the leave update if email fails.
        console.error(
          "Leave status updated but email failed:",
          mailError
        );
      }
      // RESPONSE
      return res.json({
        success: true,
        msg: `Leave status changed from ${oldStatus} to ${newStatus}.`,
        leave,
      });
    } catch (error) {
      console.error(
        "Leave Status Update Error:",
        error
      );
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

//reporting manager
router.get(
  "/reporting-manager/:employee_code",
  authMiddleware,
  async (req, res) => {
    try {
      const { employee_code } = req.params;

      // Find selected employee
      const employee = await Login.findOne({
        employee_code,
        status: "Active",
      }).select(
        "employee_code name email reportingManagerEmployeeCode"
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          msg: "Active employee not found.",
        });
      }

      // Employee has no reporting manager
      if (!employee.reportingManagerEmployeeCode) {
        return res.json({
          success: true,
          employee: {
            employee_code: employee.employee_code,
            name: employee.name,
            email: employee.email,
          },
          reportingManager: null,
          msg: "Reporting manager is not assigned.",
        });
      }

      // Find reporting manager
      const reportingManager = await Login.findOne({
        employee_code:
          employee.reportingManagerEmployeeCode,
        status: "Active",
      }).select(
        "employee_code name email role"
      );

      if (!reportingManager) {
        return res.status(404).json({
          success: false,
          msg: "Reporting manager not found or inactive.",
        });
      }

      return res.json({
        success: true,

        employee: {
          employee_code: employee.employee_code,
          name: employee.name,
          email: employee.email,
        },

        reportingManager: {
          employee_code:
            reportingManager.employee_code,
          name: reportingManager.name,
          email: reportingManager.email,
          role: reportingManager.role,
        },
      });

    } catch (error) {
      console.error(
        "Reporting Manager Error:",
        error
      );

      return res.status(500).json({
        success: false,
        msg: "Failed to fetch reporting manager.",
      });
    }
  }
);

//reporting mnager
// SEARCH REPORTING MANAGER
// Any active employee can be selected.
// No role check is applied.
router.get(
  "/reporting-manager/search",
  authMiddleware,
  async (req, res) => {
    try {
      const keyword = req.query.search?.trim();

      if (!keyword) {
        return res.json([]);
      }

      const employees = await Login.find({
        status: "Active",
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
      })
        .select("employee_code name email role")
        .limit(10);

      return res.json(employees);

    } catch (error) {
      console.error(
        "Reporting Manager Search Error:",
        error
      );

      return res.status(500).json({
        success: false,
        msg: "Failed to search reporting manager.",
      });
    }
  }
);
// SEARCH EMPLOYEE / HR / ADMIN
router.get("/search-employee", authMiddleware, async (req, res) => {
  try {
    const keyword = req.query.search?.trim();
    if (!keyword) {
      return res.json([]);
    }
    const employees = await Login.find({
      status: "Active",
      // role: {
      //   $in: ["EMPLOYEE", "HR", "ADMIN"],
      // },
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
    })
      .select("employee_code name email role")
      .limit(10);
    res.json(employees);
  } catch (error) {
    console.error("Search Employee Error:", error);
    res.status(500).json({
      msg: "Failed to search employees.",
    });
  }
});
// GET LIVE LEAVE BALANCE
router.get("/leave-balance/:employee_code", async (req, res) => {
  try {
    const { employee_code } = req.params;
    const employee = await Login.findOne({ employee_code });
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }
    const earnLeave = Number(employee.earnLeave || 0);
    const floatingLeave = Number(employee.floatingLeave || 0)
    // Negative EL should not reduce Total Leave
    const usableEarnLeave = Math.max(earnLeave, 0);
    const totalLeave = Number((usableEarnLeave + floatingLeave).toFixed(2));
    res.json({
      success: true,
      data: {
        earnLeave: Number(earnLeave.toFixed(2)),
        floatingLeave: Number(floatingLeave.toFixed(2)),
        totalLeave,
      },
    });

  } catch (err) {
  console.error(err);
  res.status(500).json({ msg: "Server error" });
}
});

// GET CALENDAR LEAVES FOR SELECTED EMPLOYEE
router.get("/calendar/:employee_code", authMiddleware,
  async (req, res) => {
    try {
      const { employee_code } = req.params;

      const employee = await Login.findOne({
        employee_code,
        status: "Active",
      }).select(
        "employee_code name email status"
      );
      if (!employee) {
        return res.status(404).json({
          msg: "Active employee not found.",
        });
      }
      const leaves = await Leave.find({
        employee_code,
        status: {
          $in: [
            "Pending",
            "Approved",
            "Rejected",
          ],
        },
      }).sort({
        createdAt: -1,
      });
      return res.json(leaves);
    } catch (error) {
      console.error(
        "Employee Calendar Error:",
        error
      );
      return res.status(500).json({
        msg: "Failed to load employee calendar.",
      });
    }
  }
);
// GET REPORTING MANAGER OF SELECTED EMPLOYEE
router.get("/reporting-manager/:employee_code",authMiddleware,
  async (req, res) => {
    try {
      const { employee_code } = req.params;
      // Find selected employee
      const employee = await Login.findOne({
        employee_code,
        status: "Active",
      }).select(
        "employee_code name email reportingManagerEmployeeCode"
      );
      if (!employee) {
        return res.status(404).json({
          success: false,
          msg: "Active employee not found.",
        });
      }
      // Employee has no reporting manager
      if (!employee.reportingManagerEmployeeCode) {
        return res.json({
          success: true,
          employee: {
            employee_code: employee.employee_code,
            name: employee.name,
            email: employee.email,
          },
          reportingManager: null,
          msg: "Reporting manager is not assigned.",
        });
      }
      // Find reporting manager
      const reportingManager = await Login.findOne({
        employee_code:
          employee.reportingManagerEmployeeCode,
        status: "Active",
      }).select(
        "employee_code name email role"
      );
      if (!reportingManager) {
        return res.status(404).json({
          success: false,
          msg: "Reporting manager not found or inactive.",
        });
      }
      return res.json({
        success: true,
        employee: {
          employee_code: employee.employee_code,
          name: employee.name,
          email: employee.email,
        },
        reportingManager: {
          employee_code:
            reportingManager.employee_code,
          name: reportingManager.name,
          email: reportingManager.email,
          role: reportingManager.role,
        },
      });
    } catch (error) {
      console.error(
        "Reporting Manager Error:",
        error
      );
      return res.status(500).json({
        success: false,
        msg: "Failed to fetch reporting manager.",
      });
    }
  }
);

export default router;















