import express from "express";
import Employee from "../models/EmployeeTable.js";
import Attendance from "../models/Attendance.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
const router = express.Router();

router.get("/", authMiddleware, checkPermission("Attendance_view"), async (req, res) => {
  try {
    //     : { employee_code: req.user.employee_code };
    const matchStage =
      req.user.role === "HR" || req.user.role === "ADMIN"
        ? {
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
          ],
        }
        : {
          employee_code: req.user.employee_code,
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
          ],
        };

    const data = await Employee.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "attendances",
          localField: "employee_code",
          foreignField: "employee_code",
          as: "attendance",
        },
      },
      {
        $unwind: {
          path: "$attendance",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $sort: {
          "attendance.date": -1,
        },
      },

      {
        $group: {
          _id: "$employee_code",
          employee_code: { $first: "$employee_code" },
          name: { $first: "$firstName" },
          inTime: { $first: "$attendance.inTime" },
          outTime: { $first: "$attendance.outTime" },
        },
      },
      {
        $project: {
          _id: 0,
          employee_code: 1,
          name: 1,
          inTime: { $ifNull: ["$inTime", ""] },
          outTime: { $ifNull: ["$outTime", ""] },
        },
      },
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/", authMiddleware, checkPermission("Attendance_edit"), async (req, res) => {
  try {
    const { employee_code, inTime, outTime } = req.body;

    const code =
      req.user.role === "HR" ||req.user.role === "ADMIN"
        ? employee_code
        : req.user.employee_code;

           const today =
        new Date().toISOString().split("T")[0];

    const record = await Attendance.findOneAndUpdate(
      // { employee_code: code },
      {
        employee_code: code,
         date: today,  
      },
      {employee_code: code,
        inTime,
        outTime,
        date: today,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
export default router;