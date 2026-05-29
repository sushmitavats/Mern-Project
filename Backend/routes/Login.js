import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Login from "../models/Login.js";
import Permission from "../models/Role.js";
import generatePassword from "../utils/generatePassword.js";
import sendMail from "../utils/sendMail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// create new user
router.post(
  "/register",
  authMiddleware, isAdmin,
  async (req, res) => {
    try {

      const {
        name,
        email,
        department,
        role,
      } = req.body;

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

      // GET LAST EMPLOYEE CODE
      const employees =
        await Login.find({
          employee_code: {
            $regex: /^EMP\d+$/,
          },
        }).sort({
          createdAt: -1,
        });

      let employee_code = "EMP001";

      if (employees.length > 0) {

        const lastEmployee =
          employees[0];

        const lastCode = parseInt(
          lastEmployee.employee_code.replace(
            "EMP",
            ""
          )
        );

        employee_code = `EMP${String(
          lastCode + 1
        ).padStart(3, "0")}`;
      }

      // CREATE USER
      const user = new Login({
        name,
        email,
        department,

        password:
          hashedPassword,

        role:
          role?.toUpperCase(),

        employee_code:
          employee_code,

        isFirstLogin: true,
      });

      await user.save();

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
      // SEND MAIL TO ALL HR

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

            Employee Code:
            ${employee_code}

            Department:
            ${department}
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


//user can login
router.post("/login", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    console.log(req.body);

    const user = await Login.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        msg: "User is inactive",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    const rolePermission =
      await Permission.findOne({
        roleName: user.role,
      });

    const permissions =
      rolePermission?.permissions || [];

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        employee_code:
          user.employee_code,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,

      firstLogin:
        user.isFirstLogin,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        employee_code:
          user.employee_code,
        permissions,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});


router.post(
  "/change-password",
  authMiddleware,
  async (req, res) => {
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
router.get(
  "/all-users",
  authMiddleware,
  async (req, res) => {

    try {

      const users =
        await Login.find({
          role: {
            $ne: "ADMIN",
          },
        }).sort({
          createdAt: 1,
        });
      res.json({
        success: true,
        data: users,
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// UPDATE USER
router.put(
  "/update-user/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Login.findByIdAndUpdate(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        msg:
          "User Updated Successfully",
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// DELETE USER
router.delete(
  "/delete-user/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Login.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        msg:
          "User Deleted Successfully",
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// CHANGE STATUS
router.put(
  "/change-status/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await Login.findById(
          req.params.id
        );

      user.status =
        user.status ===
          "Active"
          ? "Inactive"
          : "Active";

      await user.save();

      res.json({
        success: true,
        data: user,
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);



router.post("/reset-admin", async (req, res) => {

  try {

    const hashedPassword = await bcrypt.hash(
      "Admin123",
      10
    );

    await Login.updateOne(
      {
        email: "sushmitav9944@gmail.com",
      },
      {
        $set: {
          password: hashedPassword,
          isFirstLogin: false,
        },
      }
    );

    res.json({
      success: true,
      msg: "Admin password reset",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;