import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Login from "../models/Login.js";
import Employee from "../models/EmployeeTable.js";
import Attendance from "../models/Attendance.js";
import Permission from "../models/Permission.js";
import generatePassword from "../utils/generatePassword.js";
import sendMail from "../utils/sendMail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import Department from "../models/Department.js";
import Designation from "../models/Designation.js";

const router = express.Router();
// create new user
router.post(
  "/register",
  authMiddleware, isAdmin,
  async (req, res) => {
    try {
      const {name,email,department,designation,role,joiningDate,} = req.body;
      const existing =
        await Login.findOne({ email });

      if (existing) {
        return res.status(400).json({
          msg: "Email already exists",
        });
      } 
      const plainPassword =
        generatePassword();
      const hashedPassword =
        await bcrypt.hash(
          plainPassword,
          10
        );
      // CREATE USER
      const employees =
        await Employee.find({
          employee_code: {
            $regex: /^EMP\d+$/
          }
        });
      let maxNumber = 0;
      employees.forEach((emp) => {
        const num =
          parseInt(
            emp.employee_code.replace(
              "EMP",
              ""
            )
          );
        if (num > maxNumber) {
          maxNumber = num;
        }
      });
      const employee_code =
        `EMP${String(
          maxNumber + 1
        ).padStart(3, "0")}`;

      // const latestEmployee =
      //   await Employee.findOne()
      //     .sort({ createdAt: -1 });
      // let employee_code = "EMP001";
      // if (latestEmployee) {
      //   const num = parseInt(
      //     latestEmployee.employee_code.replace(
      //       "EMP",
      //       ""
      //     )
      //   );
      //   employee_code =
      //     `EMP${String(
      //       num + 1
      //     ).padStart(3, "0")}`;
      // }

      const user = new Login({
        name,
        email,
        department,
        designation,
        password:
          hashedPassword,
        role:
          role?.toUpperCase(),
        joiningDate,
        employee_code:
          employee_code,
        isFirstLogin: true,
      });
      await user.save();
      //create in employe
      const employeeExists =
        await Employee.findOne({
          employee_code
        });
      if (employeeExists) {
        return res.status(400).json({
          error: "Employee code already exists"
        });
      }

      const splitName =
        name.trim().split(" ");
      const employee =
        new Employee({
          userId: user._id,
          employee_code,
          firstName:
            splitName[0] || "",
          middleName:
            splitName.length > 2
              ?
              splitName.slice(
                1,
                splitName.length - 1
              ).join(" ")
              :
              "",
          lastName:
            splitName.length > 1
              ?
              splitName[
              splitName.length - 1
              ]
              :
              "",
          officialEmail: email,
          department,
          designation,
          joiningDate,
          status: "Active"
        });
      await employee.save();
      // SEND LOGIN MAIL TO USER
      await sendMail(
        email,
        "Employee Login Credentials",

        `
        Welcome To Company

        Your account has been created.

        Employee Code: ${employee_code}

        Email: ${email}

        Temporary Password: ${plainPassword}

        Please login and change password.
        `
      );

      // IF EMPLOYEE CREATED
      const departmentData =
        await Department.findById(
          department
        );
      const designationData =
        await Designation.findById(
          designation
        );
      if (
        role?.toUpperCase() ===
        "EMPLOYEE"
      ) {

        const hrUsers =
          await Login.find({
            role: "HR",
          });

        for (const hr of hrUsers) {

          await sendMail(
            hr.email,
            "New Employee Added",
            `
            New employee has been added.
            Name: ${name}
            Employee Code:${employee_code}
            Department:
            ${departmentData?.departmentName}
            Designation:
            ${designationData?.designationName}
            `
          );
        }
      }

      res.status(201).json({
        success: true,
        msg: "User Created Successfully",
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// add user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      await Login.findOne({ email })
        .populate(
          "department",
          "departmentName"
        )
        .populate(
          "designation",
          "designationName"
        );
    if (!user) {
      return res.status(400).json({
        msg: "User not found"
      });
    }
    if (user.status === "Inactive") {
      return res.status(403).json({
        msg: "User is inactive"
      });
    }
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );
    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid password"
      });
    }
    let permissions = [];
    // ADMIN gets all access
    if (user.role === "ADMIN") {
      permissions = [];
    } else {
      const permissionResult =
        await Permission.aggregate([
          {
            $match: {
              $or: [
                // employee specific
                {
                  employee:
                    user.employee_code
                },
                // department + designation
                {
                  department:
                    user.department?._id,

                  designation:
                    user.designation?._id
                },
                // department only
                {
                  department:
                    user.department?._id,
                  designation: null
                }
              ]}},
          {
            $addFields: {
              priority: {
                $cond: [
                  {
                    $eq: [
                      "$employee",
                      user.employee_code
                    ]
                  },
                  1,
                  {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              "$department",
                              user.department?._id
                            ]
                          },

                          {
                            $eq: [
                              "$designation",
                              user.designation?._id
                            ]}]},
                      2,3
                    ]
                  }]}}},
          {
            $sort: {
              priority: 1
            }
          },
          {
            $limit: 1
          }
        ]);

      permissions =
        permissionResult[0]
          ?.permissions || [];
    }

    console.log(
      "Permissions:",
      permissions
    );

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          employee_code:
            user.employee_code,
          department: user.department?._id || null,
          designation: user.designation?._id || null
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

    res.json({
      success: true,
      token,
      firstLogin:
        user.isFirstLogin,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department:
          user.department,
        designation:
          user.designation,
        employee_code:
          user.employee_code
      },
      permissions
    });
  }
  catch (error) {
    console.log(
      "LOGIN ERROR:",
      error
    );
    res.status(500).json({
      error: error.message
    });
  }
});


router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        msg: "Passwords do not match",
      });
    }

    const user = await Login.findById(req.user.id);
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);
    console.log("DB USER:", user);
    console.log(
      "isFirstLogin:",
      user.isFirstLogin
    );
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    // CHECK OLD PASSWORD
    if (!user.isFirstLogin) {
      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({
          msg: "Old password incorrect",
        });
      }
    }
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );
    // SAVE PASSWORD
    user.password = hashedPassword;
    user.isFirstLogin = false;
    await user.save();
    res.json({
      success: true,
      msg: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
);

// GET ALL USERS
router.get("/all-users", authMiddleware,
  async (req, res) => {
    try {
      const users = await Login.find({
        role: {
          $ne: "ADMIN"
        }
      })
        .populate(
          "department",
          "departmentName"
        )
        .populate(
          "designation",
          "designationName"
        )
        .sort({
          createdAt: 1
        });
      // const formattedUsers = users.map(user => ({
      //   ...user.toObject(),
      //   department:
      //     user.department?.departmentName || "",
      //   designation:
      //     user.designation?.designationName || ""
      // }));
      const formattedUsers =
        users.map(user => ({
          ...user.toObject(),
          department:
            user.department,
          designation:
            user.designation
        }));

      res.json({
        success: true,
        data: formattedUsers
      });
    } catch (error) {
      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);
//update user with change madein in user management
router.put(
  "/update-user/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedUser =
        await Login.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        );
      // await Employee.findOneAndUpdate(
      //   {
      //     employee_code:
      //       updatedUser.employee_code
      //   },
      //   {
      //     $set: {
      //       department: req.body.department,
      //       designation: req.body.designation,
      //       joiningDate: req.body.joiningDate,
      //       status: req.body.status
      //     }
      //   }
      // );

      await Employee.findOneAndUpdate(
        {
          employee_code:
            updatedUser.employee_code
        },
        {
          $set: {
            firstName:
              req.body.name
                ?.split(" ")[0],
            lastName:
              req.body.name
                ?.split(" ")
                .slice(1)
                .join(" "),
            officialEmail:
              req.body.email,
            department:
              req.body.department,
            designation:
              req.body.designation,
            joiningDate:
              req.body.joiningDate,
            status:
              req.body.status
          }
        }
      )
      res.json({
        success: true
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
)
// DELETE USER
router.delete(
  "/delete-user/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await Login.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          msg: "User not found"
        });
      }
      const employeeCode =
        user.employee_code;
      // Delete login record
      await Login.findByIdAndDelete(
        req.params.id
      );
      // Soft delete employee record
      await Employee.findOneAndUpdate(
        {
          employee_code:
            employeeCode
        },
        {
          isDeleted: true
        }
      );
      // Remove attendance
      await Attendance.deleteMany({
        employee_code:
          employeeCode
      });
      res.json({
        success: true,
        msg:
          "User, Employee and Attendance deleted successfully"
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message
      });
    }
  }
);

// change update in both user manag and Employee pg.
router.put(
  "/change-status/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await Login.findById(
          req.params.id
        );
      const newStatus =
        user.status === "Active"
          ? "Inactive"
          : "Active";
      user.status = newStatus;
      await user.save();
      await Employee.findOneAndUpdate(
        {
          employee_code:
            user.employee_code,
        },
        {
          status: newStatus
        }
      );
      res.json({
        success: true
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
)

export default router;