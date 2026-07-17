import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/Login.js";
import dashboardRoutes from "./routes/Dashbord.js";
import employeeRoutes from "./routes/EmployeeRoute.js";
// import employeeRoute from "./routes/EmployeeRoutes.js";
import attendanceRoutes from "./routes/Attendance.js";
import leaveRoutes from "./routes/Leave.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import leaveBalanceRoutes from "./routes/leaveBalanceRoutes.js";
import "./cron/leaveReset.js";
import "./cron/monthlyEarnLeave.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import designationRoutes from "./routes/designationRoutes.js";
import path from "path";


dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
  })
);
app.use("/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HRMS API Running Successfully",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
// app.use("/api/roles", roleRoutes);
app.use("/api", leaveBalanceRoutes);
app.use("/api/departments",departmentRoutes);
app.use("/api/designation",designationRoutes);
app.use("/api/permission",permissionRoutes);
// app.use("/api/employee-profile",employeeRoute);  //routes edit
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});