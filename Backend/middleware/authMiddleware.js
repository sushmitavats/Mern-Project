import jwt from "jsonwebtoken";
import Login from "../models/Login.js";

export const authMiddleware = async (req, res,next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        msg: "No token provided",
      });
    }
    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await Login.findOne({
        employee_code:
          decoded.employee_code,
      }).select("-password");
    if (!user) {
      return res.status(401).json({
        msg: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Invalid Token",
    });
  }
};