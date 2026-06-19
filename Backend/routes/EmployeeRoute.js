import express from "express";
import Employee from "../models/EmployeeTable.js";
import Attendance from "../models/Attendance.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get("/", authMiddleware,  checkPermission("Employee_view"),
  async (req, res) => {
    try {
      const matchStage =
        req.user.role === "HR" ||
          req.user.role === "ADMIN"
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
        {
          $match: matchStage,
        },

        {
          $group: {
            _id: "$employee_code",
            employee_code: { $first: "$employee_code" },
            name: { $first: "$name" },
            email: { $first: "$email" },
            contact: { $first: "$contact" },
            department: { $first: "$department" },
            designation: { $first: "$designation" },
            bankAccount: { $first: "$bankAccount" },
            pfAccount: { $first: "$pfAccount" },
            address: { $first: "$address" },
            gender: { $first: "$gender" },
            dob: { $first: "$dob" },
            emergencyContact: {
              $first: "$emergencyContact",
            },
            aadhaar: { $first: "$aadhaar" },
            pan: { $first: "$pan" },
            joiningDate: {
              $first: "$joiningDate",
            },
            relievingDate: {
              $first: "$relievingDate",
            },

            status: { $first: "$status" },
          },
        },
        {
          $lookup: {
            from: "logins",

            localField: "employee_code",

            foreignField: "employee_code",

            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",

            preserveNullAndEmptyArrays: true,
          },
        },
        //designation and department
        {
          $lookup: {
            from: "departments",
            localField: "department",
            foreignField: "_id",
            as: "departmentData"
          }
        },
        {
          $unwind: {
            path: "$departmentData",
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: "designations",
            localField: "designation",
            foreignField: "_id",
            as: "designationData"
          }
        },
        {
          $unwind: {
            path: "$designationData",
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $project: {

            _id: 1,
            employee_code: 1,
            name: 1,
            email: 1,
            contact: 1,
            department: "$departmentData.departmentName",
            designation: "$designationData.designationName",
            bankAccount: 1,
            pfAccount: 1,
            address: 1,
            gender: 1,
            dob: 1,
            emergencyContact: 1,
            aadhaar: 1,
            pan: 1,
            joiningDate: 1,
            relievingDate: 1,
            status: 1,
            role: "$user.role",
          },
        },

        {
          $sort: {
            employee_code: 1,
          },
        },
      ]);

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);


router.get(
  "/search",
  authMiddleware,

  async (req, res) => {

    try {
      const search =
        req.query.search || "";
      const matchStage =
        req.user.role === "HR" ||
          req.user.role === "ADMIN"
          ? {
            $or: [
              {
                employee_code: {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                name: {
                  $regex: search,
                  $options: "i",
                },
              },
            ],

            $and: [
              {
                $or: [
                  { isDeleted: false },
                  {
                    isDeleted: {
                      $exists: false,
                    },
                  },
                ],
              },
            ],
          }

          : {
            employee_code:
              req.user.employee_code,

            $or: [

              {
                employee_code: {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                name: {
                  $regex: search,
                  $options: "i",
                },
              },
            ],

            $and: [
              {
                $or: [
                  { isDeleted: false },
                  {
                    isDeleted: {
                      $exists: false,
                    },
                  },
                ],
              },
            ],
          };

      const employees =
        await Employee.find(matchStage)

          .select("employee_code name")

          .limit(10);

      res.json(employees);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);


router.get("/next-code", async (req, res) => {
  try {
    // GET LAST EMPLOYEE CODE (same pattern as Login logic)
    const employees = await Employee.find({
      employee_code: {
        $regex: /^EMP\d+$/,
      },
    }).sort({
      createdAt: -1,
    });

    let employee_code = "EMP001";

    if (employees.length > 0) {
      const lastEmployee = employees[0];

      const lastCode = parseInt(
        lastEmployee.employee_code.replace("EMP", "")
      );

      employee_code = `EMP${String(lastCode + 1).padStart(3, "0")}`;
    }

    res.json({ code: employee_code });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// add empoyee
router.post("/", authMiddleware, checkPermission("Employee_create"), async (req, res) => {
  try {
    const exists = await Employee.findOne({
      employee_code: req.body.employee_code,
    });

    if (exists) {
      return res.status(400).json({ msg: "Employee already exists" });
    }

    const employee = new Employee(req.body);
    const saved = await employee.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put(
  "/code/:employee_code",
  authMiddleware,
  checkPermission("Employee_edit"),
  async (req, res) => {
    try {

      console.log("PARAMS:", req.params);
      console.log("BODY:", req.body);

      const updated = await Employee.findOneAndUpdate(
        { employee_code: req.params.employee_code },

        {
          $set: req.body,
        },

        {
          returnDocument: "after",
        }
      );

      if (!updated) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }
      res.json(updated);
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

//delete employee

router.delete(
  "/code/:employee_code",
  authMiddleware,
  checkPermission("Employee_delete"),
  async (req, res) => {

    try {

      const employeeCode = req.params.employee_code;

      const employee = await Employee.findOneAndUpdate(
        {
          employee_code: req.params.employee_code
        },
        {
          isDeleted: true
        },
        {
          returnDocument: "after",
        }
      );

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      await Attendance.deleteMany({
        employee_code: employeeCode,
      });

      res.json({
        success: true,
        message: "Employee and Attendance deleted successfully"
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

export default router;








// // READ ALL
// router.get("/", authMiddleware,async (req, res) => {
//   const employees = await Employee.find();
//   res.json(employees);
// });


// // //UPDATE
// // router.put("/:id", async (req, res) => {
// //   const updated = await Employee.findByIdAndUpdate(
// //     req.params.id,
// //     req.body,
// //     { new: true }
// //   );
// //   res.json(updated);
// // });


// // //DELETE
// // router.delete("/:id", async (req, res) => {
// //   await Employee.findByIdAndDelete(req.params.id);
// //   res.json({ message: "Employee Deleted" });
// // });













































// import express from "express";
// import Employee from "../models/EmployeeTable.js";
// import Counter from "../models/Counter.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();


// // ======================
// // GET EMPLOYEES
// // ======================
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const matchStage =
//       req.user.role === "HR"
//         ? {}
//         : { employee_code: req.user.employee_code };

//     const data = await Employee.aggregate([
//       { $match: matchStage },

//       {
//         $group: {
//           _id: "$employee_code",
//           employee_code: { $first: "$employee_code" },
//           name: { $first: "$name" },
//           email: { $first: "$email" },
//           contact: { $first: "$contact" },
//           department: { $first: "$department" },
//           designation: { $first: "$designation" },
//           bankAccount: { $first: "$bankAccount" },
//           pfAccount: { $first: "$pfAccount" },
//           joiningDate: { $first: "$joiningDate" },
//           relievingDate: { $first: "$relievingDate" },
//           status: { $first: "$status" },
//         },
//       },

//       {
//         $lookup: {
//           from: "logins",
//           localField: "employee_code",
//           foreignField: "employee_code",
//           as: "user",
//         },
//       },

//       {
//         $unwind: {
//           path: "$user",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       {
//         $project: {
//           _id: 0,
//           employee_code: 1,
//           name: 1,
//           email: 1,
//           contact: 1,
//           department: 1,
//           designation: 1,
//           bankAccount: 1,
//           pfAccount: 1,
//           joiningDate: { $ifNull: ["$joiningDate", null] },
//           relievingDate: { $ifNull: ["$relievingDate", null] },
//           status: 1,
//           role: "$user.role",
//         },
//       },

//       { $sort: { employee_code: 1 } },
//     ]);

//     res.json(data);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Failed to fetch employees",
//     });
//   }
// });


// // ======================
// // CREATE EMPLOYEE (SAFE AUTO-INCREMENT)
// // ======================
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     // 🔥 ATOMIC COUNTER (NO DUPLICATE EVER)
//     const counter = await Counter.findOneAndUpdate(
//       { name: "employee_code" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const nextCode =
//       "E" + String(counter.seq).padStart(3, "0");

//     req.body.employee_code = nextCode;

//     const employee = new Employee(req.body);
//     const saved = await employee.save();

//     res.status(201).json(saved);

//   } catch (err) {
//     console.error(err);

//     if (err.code === 11000) {
//       const field = Object.keys(err.keyPattern)[0];
//       return res.status(400).json({
//         message: `${field} already exists`,
//       });
//     }

//     res.status(400).json({
//       message: err.message,
//     });
//   }
// });

// export default router;