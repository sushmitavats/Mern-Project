import express from "express";
import Employee from "../models/EmployeeTable.js";
import Leave from "../models/Leave.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalEmployees =
      await Employee.countDocuments();
    const newEmployees =
      await Employee.countDocuments({
        createdAt: {
          $gte: new Date(
            new Date().setDate(
              new Date().getDate() - 30
            )
          ),
        },
      });
    const onLeave =
      await Leave.countDocuments({
        status: "Approved",
      });
    const departmentWise =
      await Employee.aggregate([
        {
          $group: {
            _id: "$department",
            count: {
              $sum: 1,
            },
          },
        },
      ]);
    const departmentData =
      departmentWise.map(
        (d) => d.count
      );
    res.json({
      stats: {
        totalEmployees,
        newEmployees,
        onLeave,
      },
      departmentData,
      payData: {
        salary: 50000,
        bonus: 10000,
        tax: 5000,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
export default router;













// import express from "express";
// import Employee from "../models/EmployeeTable.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/",authMiddleware, async (req, res) => {
//   try {
   
//     const totalEmployees = await Employee.countDocuments();

    
//     const newEmployees = await Employee.countDocuments({
//       createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//     });


//     const onLeave = await Employee.countDocuments({ status: "leave" });

    
//     const departments = ["IT", "HR", "Finance", "Design"];

//     const departmentData = await Promise.all(
//       departments.map(async (dept) => {
//         const count = await Employee.countDocuments({ department: dept });
//         return count;
//       })
//     );

//     const payData = {
//       salary: 60,
//       bonus: 25,
//       tax: 15,
//     };

//     res.json({
//       stats: {
//         totalEmployees,
//         newEmployees,
//         onLeave,
//       },
//       departmentData,
//       payData,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;