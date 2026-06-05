import cron from "node-cron";
import Login from "../models/Login.js";

cron.schedule("0 0 1 * *", async () => {
  try {
    const employees = await Login.find({
      role: "EMPLOYEE",
    });

    for (const emp of employees) {
      const joiningDate = new Date(
        emp.joiningDate
      );

      const today = new Date();

      const diffMonths =
        (today.getFullYear() - joiningDate.getFullYear()) * 12 +
        (today.getMonth() - joiningDate.getMonth());

      if (diffMonths < 6) {
        emp.earnLeave += 0.83;
      } else {
        emp.earnLeave += 1;
      }

      //Counter Saved;

      await emp.save();
    }

    console.log("Monthly EL Added");
  } catch (error) {
    console.log(error);
  }
});