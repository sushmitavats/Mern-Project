import express from "express";
import Login from "../models/Login.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// MONTHLY EARN LEAVE (0.83)
// Runs only on the LAST DAY of the month
router.put("/monthly-earn-leave", authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    // Allow only on the last day of the month
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,0).getDate();
    if (today.getDate() !== lastDay) {
      return res.status(400).json({
        msg: "Earn Leave can only be credited on the last day of the month.",
      });
    }
    const employees = await Login.find({
      role: { $in: ["EMPLOYEE", "HR"] },
    });
    for (const emp of employees) {
      const doj = new Date(emp.joiningDate);
      // Employee is eligible in joining month only if DOJ is on/before 15
      const eligibleThisMonth =
        doj.getFullYear() === today.getFullYear() &&
          doj.getMonth() === today.getMonth()
          ? doj.getDate() <= 15
          : true;
      if (!eligibleThisMonth) {
        continue;
      }
      // Prevent duplicate credit in the same month
      if (emp.lastEarnLeaveCreditDate && emp.lastEarnLeaveCreditDate.getMonth() === today.getMonth() && emp.lastEarnLeaveCreditDate.getFullYear() === today.getFullYear()) {
        continue;
      }
      emp.earnLeave = Number((emp.earnLeave + 0.83).toFixed(2));
      emp.lastEarnLeaveCreditDate = today;
      await emp.save();
    }
    res.json({
      success: true,
      msg: "Monthly Earn Leave credited successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
//for fl
router.put("/grant-floating-leave", authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const employees = await Login.find({
      role: { $in: ["EMPLOYEE", "HR"] },
    });
    for (const emp of employees) {
      const cycleStart = new Date(emp.floatingLeaveIssuedDate);
      // Months completed since cycle start
      const months =
        (today.getFullYear() - cycleStart.getFullYear()) * 12 +
        (today.getMonth() - cycleStart.getMonth());
      // Every completed 6-month cycle
      if (months >= 6) {
        // Reset remaining FL
        emp.floatingLeave = 0;
        // Credit fresh 3 FL
        emp.floatingLeave = 3;
        // Start next 6-month cycle from current month
        emp.floatingLeaveIssuedDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        emp.lastFloatingLeaveDate = today;
        await emp.save();
      }
    }
    res.json({
      success: true,
      msg: "Floating Leave cycle updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;












