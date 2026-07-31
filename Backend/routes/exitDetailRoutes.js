import express from "express";
import ExitDetail from "../models/ExitDetail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();
// GET Exit Details
router.get("/:employee_code",authMiddleware,checkPermission("Employee_view"),
  async (req, res) => {
    try {
      const exitDetail = await ExitDetail.findOne({
        employee_code: req.params.employee_code,
      });
      if (!exitDetail) {
        return res.json({
          employee_code: req.params.employee_code,
          resignationDate: "",
          lwd: "",
          exitReason: "",
          fnf: "",
        });
      }
      res.json(exitDetail);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
// SAVE / UPDATE Exit Details
router.post("/save",authMiddleware,checkPermission("Employee_edit"),async (req, res) => {
    try {
      const {employee_code,resignationDate,lwd,exitReason,fnf,} = req.body;
      if (!employee_code) {
        return res.status(400).json({
          message: "Employee Code is required",
        });
      }
      // Validation only when resignation process starts
      if (resignationDate) {
        if (!lwd) {
          return res.status(400).json({
            message: "Last Working Day is required",
          });
        }
        if (!exitReason) {
          return res.status(400).json({
            message: "Exit Reason is required",
          });
        }
        if (!fnf) {
          return res.status(400).json({
            message: "F & F Status is required",
          });
        }
      }
      const exitDetail = await ExitDetail.findOneAndUpdate(
        {employee_code,},
        {employee_code,
          resignationDate,
          lwd,
          exitReason,
          fnf,
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
      return res.json(exitDetail);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;