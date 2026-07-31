import express from "express";
import EducationExperienceDetails from "../models/EducationExperienceDetails.js";

const router = express.Router();
//    GET Education & Experience By Employee Code
router.get("/:employee_code", async (req, res) => {
  try {
    const data = await EducationExperienceDetails.findOne({
      employee_code: req.params.employee_code,
    });
    if (!data) {
      return res.json({
        employee_code: req.params.employee_code,
        education: [],
        experience: [],
      });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});
//    Save / Update Education & Experience
router.post("/save", async (req, res) => {
  try {
    const { employee_code, education, experience } = req.body;
    const saved =
      await EducationExperienceDetails.findOneAndUpdate(
        {employee_code,},
        {employee_code,education,experience,},
        {
          upsert: true,
          new: true,
        }
      );
    res.json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});
//    Delete One Education Row
router.delete(
  "/education/:employee_code/:educationId",
  async (req, res) => {
    try {
      const { employee_code, educationId } = req.params;
      const details =
        await EducationExperienceDetails.findOne({
          employee_code,
        });
      if (!details) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }
      details.education.pull(educationId);
      await details.save();
      res.json({
        success: true,
        education: details.education,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
// Delete One Experience Row
router.delete(
  "/experience/:employee_code/:experienceId",
  async (req, res) => {
    try {
      const { employee_code, experienceId } = req.params;
      const details =
        await EducationExperienceDetails.findOne({
          employee_code,
        });
      if (!details) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }
      details.experience.pull(experienceId);
      await details.save();
      res.json({
        success: true,
        experience: details.experience,
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