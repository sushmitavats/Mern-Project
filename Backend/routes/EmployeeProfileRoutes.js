import express from "express";
import Employee from "../models/EmployeeTable.js";
import IdentityDetails from "../models/IdentityDetails.js";
import BankDetails from "../models/BankDetails.js";
import PayrollDetails from "../models/PayrollDetails.js";
import EducationExperienceDetails from "../models/EducationExperienceDetails.js";
import ITAssetsDetails from "../models/ItAssertsDetail.js";
import ExitDetail from "../models/ExitDetail.js";
import AdditionalDetail from "../models/AdditionalDetail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadProfile.js";

const router = express.Router();

router.get("/:employee_code", authMiddleware, async (req, res) => {
  try {
    const requestedCode = req.params.employee_code;
    // const role = req.user.role;
    const loggedEmployeeCode = req.user.employee_code;
    if (!loggedEmployeeCode) {
      return res.status(403).json({
        success: false,
        message: "Profile page is only for employees",
      });
    }
    if (requestedCode !== loggedEmployeeCode) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const employee = await Employee.findOne({
      employee_code: requestedCode,
    })
      .populate("department")
      .populate("designation");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const [identity, bank, payroll, educationExperience, itAssets, exitDetails, additional,] = await Promise.all([
      IdentityDetails.findOne({ employee_code: requestedCode }),
      BankDetails.findOne({ employee_code: requestedCode }),
      PayrollDetails.findOne({ employee_code: requestedCode }),
      EducationExperienceDetails.findOne({ employee_code: requestedCode }),
      ITAssetsDetails.findOne({ employee_code: requestedCode }),
      ExitDetail.findOne({ employee_code: requestedCode }),
      AdditionalDetail.findOne({ employee_code: requestedCode }),
    ]);

    const BASE_URL = `${req.protocol}://${req.get("host")}`;
    const profile = {
      basic: employee.toObject(),
      identity: identity ? identity.toObject() : {},
      bank: bank ? bank.toObject() : {},
      payroll: payroll ? payroll.toObject() : {},
      education: educationExperience?.education || [],
      experience: educationExperience?.experience || [],
      itAssets: itAssets ? itAssets.toObject() : {},
      exit: exitDetails ? exitDetails.toObject() : {},
      additional: additional ? additional.toObject() : {},
    };
    if (profile.basic.profilePhoto) {
      profile.basic.profilePhoto =
        `${BASE_URL}${profile.basic.profilePhoto}`;
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

router.put("/:employee_code", authMiddleware, upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const requestedCode = req.params.employee_code;
      const role = req.user.role;
      const loggedEmployeeCode = req.user.employee_code;
      // Employee can update only own profile
      if (!loggedEmployeeCode) {
        return res.status(403).json({
          success: false,
          message: "Profile page is only for employees",
        });
      }
      if (requestedCode !== loggedEmployeeCode) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }
      const updateData = {};
      // Update phone number
      if (req.body.alternateMobile) {
        updateData.alternateMobile = req.body.alternateMobile;
      }
      if (req.body.alternateMobile) {
        const mobile = req.body.alternateMobile.trim();
        // Validate alternate mobile number
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
          return res.status(400).json({
            success: false,
            message:
              "Alternate mobile number must be a valid 10-digit number starting with 6-9",
          });
        }
        updateData.alternateMobile = mobile;
      }
      // Update profile photo
      if (req.file) {
        updateData.profilePhoto = `/uploads/profile/${req.file.filename}`;
      }
      const updatedEmployee = await Employee.findOneAndUpdate(
        { employee_code: requestedCode },
        { $set: updateData },
        { new: true }
      );
      if (!updatedEmployee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedEmployee,
      });
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Server Error",
      });
    }
  }
);
export default router;
