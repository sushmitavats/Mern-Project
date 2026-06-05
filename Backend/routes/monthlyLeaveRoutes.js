import express from "express";
import Login from "../models/Login.js";
import { authMiddleware }
from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
  "/monthly-earn-leave",
  authMiddleware,
  async (req, res) => {

    const employees =
      await Login.find({
        role: {
          $in: ["EMPLOYEE", "HR"],
        },
      });

    const today = new Date();

    const lastDay =
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();

    if (
      today.getDate() !== lastDay
    ) {
      return res.status(400).json({
        msg:
          "Earn Leave can only be added on last day of month",
      });
    }

    for (const emp of employees) {

      const joining =
        new Date(
          emp.joiningDate
        );

      const months =
        (today.getFullYear() -
          joining.getFullYear()) *
          12 +
        (today.getMonth() -
          joining.getMonth());

      if (months < 6) {
        emp.earnLeave += 0.83;
      } else {
        emp.earnLeave += 1;
      }

      await emp.save();
    }

    res.json({
      success: true,
    });
  }
);

router.put(
  "/grant-floating-leave",
  authMiddleware,
  async (req, res) => {

    const employees =
      await Login.find({
        role: {
          $in: ["EMPLOYEE", "HR"],
        },
      });

    for (const emp of employees) {

      if (
        !emp.lastFloatingLeaveDate
      ) {

        emp.floatingLeave = 4;

        emp.lastFloatingLeaveDate =
          new Date();

      } else {

        emp.floatingLeave = 3;

        emp.lastFloatingLeaveDate =
          new Date();
      }

      await emp.save();
    }

    res.json({
      success: true,
    });
  }
);

export default router;