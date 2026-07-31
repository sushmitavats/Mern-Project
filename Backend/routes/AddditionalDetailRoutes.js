import express from "express";
import AdditionalDetail from "../models/AdditionalDetail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();
// GET Additional Details
router.get(
  "/:employee_code",
  authMiddleware,
  checkPermission("Employee_view"),
  async (req, res) => {
    try {
      const additional = await AdditionalDetail.findOne({
        employee_code: req.params.employee_code,
      });

      if (!additional) {
        return res.json({
          employee_code: req.params.employee_code,
          skills: "",
          certifications: "",
          languages: "",
          linkedIn: "",
          notes: "",
        });
      }

      res.json(additional);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
// SAVE / UPDATE Additional Details
router.post(
  "/save",
  authMiddleware,
  checkPermission("Employee_edit"),
  async (req, res) => {
    try {
      const {
        employee_code,
        skills,
        certifications,
        languages,
        linkedIn,
        notes,
      } = req.body;

      if (!employee_code) {
        return res.status(400).json({
          message: "Employee Code is required",
        });
      }

      // LinkedIn Validation (Optional)
      if (
        linkedIn &&
        !/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(linkedIn)
      ) {
        return res.status(400).json({
          message: "Please enter a valid LinkedIn URL",
        });
      }

      const additional = await AdditionalDetail.findOneAndUpdate(
        {
          employee_code,
        },
        {
          employee_code,
          skills,
          certifications,
          languages,
          linkedIn,
          notes,
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );

      return res.json(additional);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;