import express from "express";
import Holiday from "../models/Holiday.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Seed default company holidays (runs automatically)

const defaultHolidays = [
  { holidayName: "New Year", holidayDate: "2026-01-01" },
  { holidayName: "Republic Day", holidayDate: "2026-01-26" },
  { holidayName: "Independence Day", holidayDate: "2026-08-15" },
  { holidayName: "Gandhi Jayanti", holidayDate: "2026-10-02" },
];

// Insert default holidays if they do not exist
async function seedHolidays() {
  for (const h of defaultHolidays) {
    const exists = await Holiday.findOne({
      holidayDate: h.holidayDate,
    });

    if (!exists) {
      await Holiday.create({
        holidayName: h.holidayName,
        holidayDate: h.holidayDate,
        status: "Active",
      });
    }
  }
}
seedHolidays();
// GET ALL HOLIDAYS
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ holidayDate: 1 });
    res.json(holidays);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// ADD HOLIDAY
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { holidayName, holidayDate } = req.body;
    if (!holidayName || !holidayDate) {
      return res.status(400).json({
        msg: "Holiday name and date are required.",
      });
    }
    const exists = await Holiday.findOne({ holidayDate });
    if (exists) {
      return res.status(400).json({
        msg: "Holiday already exists for this date.",
      });
    }
    const holiday = await Holiday.create({
      holidayName,
      holidayDate,
      status: "Active",
    });
    res.json({
      success: true,
      holiday,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// UPDATE HOLIDAY STATUS
router.put("/status/:id", authMiddleware, async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        msg: "Holiday not found.",
      });
    }

    holiday.status =
      holiday.status === "Active" ? "Inactive" : "Active";
    await holiday.save();

    res.json({
      success: true,
      holiday,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE HOLIDAY
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      msg: "Holiday deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;