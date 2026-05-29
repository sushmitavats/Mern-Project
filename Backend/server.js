import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/Login.js";
import dashboardRoutes from "./routes/Dashbord.js";
import employeeRoutes from "./routes/EmployeeRoute.js";
import attendanceRoutes from "./routes/Attendance.js";
import leaveRoutes from "./routes/Leave.js";
import roleRoutes from "./routes/PermissionRoutes.js";



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
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
app.use("/api/roles", roleRoutes);



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