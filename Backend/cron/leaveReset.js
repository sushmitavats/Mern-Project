import cron from "node-cron";
import Login from "../models/Login.js";

// Runs daily at 12:10 AM
cron.schedule("10 0 * * *", async () => {
  try {
    const today = new Date();
    const employees = await Login.find({
      status: "Active",
      role: "EMPLOYEE"
    });
    for (const emp of employees) {
      if (!emp.joiningDate) continue;

      if (!emp.lastFloatingLeaveDate) {
        emp.floatingLeave += 3;
        emp.lastFloatingLeaveDate = today;
        await emp.save();
        continue;
      }
      const last = new Date(
        emp.lastFloatingLeaveDate
      );
      const diffMonths =
        (today.getFullYear() - last.getFullYear()) * 12 +
        (today.getMonth() - last.getMonth());
      if (diffMonths >= 6) {
        emp.floatingLeave += 3;
        emp.lastFloatingLeaveDate = today;
        await emp.save();
      }
    }
    console.log(
      "Automatic Floating Leave check completed."
    );
  } catch (error) {
    console.log("Floating Leave Cron Error:",error);
  }
});