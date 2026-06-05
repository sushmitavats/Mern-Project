import express from "express";
import Login from "../models/Login.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// ADD EARN LEAVE

router.put(
  "/add-earn-leave/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const employee = await Login.findById(
        req.params.id
      );

      if (!employee) {
        return res.status(404).json({
          msg: "Employee not found",
        });
      }

      const joiningDate = new Date(
        employee.joiningDate
      );

      const today = new Date();

      const diffMonths =
        (today.getFullYear() -
          joiningDate.getFullYear()) *
          12 +
        (today.getMonth() -
          joiningDate.getMonth());

      const leaveToAdd =
        diffMonths < 6 ? 0.83 : 1;

      employee.earnLeave += leaveToAdd;

      // Recover negative leave first

      if (employee.negativeLeave < 0) {
        employee.negativeLeave += leaveToAdd;

        if (employee.negativeLeave > 0) {
          employee.negativeLeave = 0;
        }
      }

      await employee.save();

      res.json({
        success: true,
        msg: "Earn Leave Added",
        data: employee,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// ==========================================
// ADD FLOATING LEAVE
// ==========================================

router.put(
  "/add-floating-leave/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const employee = await Login.findById(
        req.params.id
      );

      if (!employee) {
        return res.status(404).json({
          msg: "Employee not found",
        });
      }

      const today = new Date();

      // Check last floating leave

      if (employee.lastFloatingLeaveDate) {

        const lastDate = new Date(
          employee.lastFloatingLeaveDate
        );

        const diffMonths =
          (today.getFullYear() -
            lastDate.getFullYear()) *
            12 +
          (today.getMonth() -
            lastDate.getMonth());

        if (diffMonths < 6) {
          return res.status(400).json({
            msg:
              "Floating Leave already granted within last 6 months",
          });
        }
      }

      employee.floatingLeave += 3;

      employee.lastFloatingLeaveDate =
        today;

      // Recover negative leave first

      if (employee.negativeLeave < 0) {

        employee.negativeLeave += 3;

        // if (employee.negativeLeave > 0) {
        //   employee.negativeLeave = 0;
        // }
      }

      await employee.save();

      res.json({
        success: true,
        msg: "Floating Leave Added",
        data: employee,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);
// GET EMPLOYEE LEAVE BALANCE


router.get(
  "/leave-balance/:employee_code",
  authMiddleware,
  async (req, res) => {
    try {

      const employee =
        await Login.findOne({
          employee_code:
            req.params.employee_code,
        });

      if (!employee) {
        return res.status(404).json({
          msg: "Employee not found",
        });
      }

      res.json({
        success: true,

        earnLeave:
          employee.earnLeave || 0,

        floatingLeave:
          employee.floatingLeave || 0,

        // negativeLeave:
        //   employee.negativeLeave || 0,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

export default router;

















//  import express from "express";
// import Login from "../models/Login.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ADD EARN LEAVE
// router.put(
//   "/add-earn-leave/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee = await Login.findById(req.params.id);

//       if (!employee) {
//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }

//       const joiningDate = new Date(employee.joiningDate);
//       const today = new Date();

//       const diffMonths =
//         (today.getFullYear() - joiningDate.getFullYear()) * 12 +
//         (today.getMonth() - joiningDate.getMonth());

//       let leaveToAdd = 0;

//       if (diffMonths < 6) {
//         leaveToAdd = 0.83;
//       } else {
//         leaveToAdd = 1.23;
//       }

//       employee.earnLeave += leaveToAdd;

//       // CLEAR NEGATIVE FIRST
//       if (employee.negativeLeave < 0) {
//         employee.negativeLeave += leaveToAdd;

//         if (employee.negativeLeave > 0) {
//           employee.negativeLeave = 0;
//         }
//       }

//       await employee.save();

//       res.json({
//         success: true,
//         data: employee,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );
// }
//   }
// );

// // ADD FLOATING LEAVE
// router.put(
//   "/add-floating-leave/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee = await Login.findById(req.params.id);

//       if (!employee) {
//         return res.status(404).json({
//           msg: "Employee not found",
//         });
//       }
//     }catch(error){
//      res.status(500).json({
//      error: error.message,
//     }
//   }
// );

 
//  employee.floatingLeave += 3;

//       employee.lastFloatingLeaveDate = today;

//       // CLEAR NEGATIVE
//       if (employee.negativeLeave < 0) {
//         employee.negativeLeave += 3;

//         if (employee.negativeLeave > 0) {
//           employee.negativeLeave = 0;
//         }
//       }

//       await employee.save();

//       res.json({
//         success: true,
//         data: employee,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );

// // GET EMPLOYEE LEAVE BALANCE
// router.get(
//   "/leave-balance/:employee_code",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const employee = await Login.findOne({
//         employee_code: req.params.employee_code,
//       });

//       res.json({
//         earnLeave: employee.earnLeave,
//         floatingLeave: employee.floatingLeave,
//         negativeLeave: employee.negativeLeave,
//       });
//     } catch (error) {
//         res.status(500).json({
//         error: error.message,
//       });
//     }
//   }
// );
// export default router;