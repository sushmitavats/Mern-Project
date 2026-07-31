import express from "express";
import ItAssertsDetail from "../models/ItAssertsDetail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();
// GET IT Asset Details
router.get(
  "/:employee_code",
  authMiddleware,
  checkPermission("Employee_view"),
  async (req, res) => {
    try {
      const data = await ItAssertsDetail.findOne({
        employee_code: req.params.employee_code,
      });

      if (!data) {
        return res.json({
          employee_code: req.params.employee_code,
          username: "",
          officialEmail: "",
          laptop: "",
          assetId: "",
          systemAccess: "",
        });
      }

      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
// SAVE / UPDATE IT Asset Details
router.post(
  "/save",
  authMiddleware,
  checkPermission("Employee_edit"),
  async (req, res) => {
    try {
      const {
        employee_code,
        username,
        officialEmail,
        laptop,
        assetId,
        systemAccess,
      } = req.body;

      if (!employee_code) {
        return res.status(400).json({
          message: "Employee Code is required",
        });
      }

      if (!username) {
        return res.status(400).json({
          message: "Username is required",
        });
      }
      if (!officialEmail) {
        return res.status(400).json({
          message: "Official Email is required",
        });
      }
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(officialEmail)) {
        return res.status(400).json({
          message: "Invalid Official Email",
        });
      }
      const asset = await ItAssertsDetail.findOneAndUpdate(
        {employee_code,},
        {employee_code,
          username,
          officialEmail,
          laptop,
          assetId,
          systemAccess,
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
      return res.json(asset);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

// DELETE IT Asset Details
// (Optional)
router.delete(
  "/:employee_code",
  authMiddleware,
  checkPermission("Employee_delete"),
  async (req, res) => {
    try {
      await ItAssertsDetail.findOneAndDelete({
        employee_code: req.params.employee_code,
      });

      res.json({
        success: true,
        message: "IT Asset Details deleted successfully.",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;