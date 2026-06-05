import cron from "node-cron";
import Login from "../models/Login.js";

cron.schedule("0 0 1 * *", async () => {
  try {
    const employees = await Login.find();

    for (const emp of employees) {
      if (emp.negativeLeave < 0) {
        emp.negativeLeave = 0;
        await emp.save();
      }
    }

    console.log("Negative leave reset done");
  } catch (error) {
    console.log(error);
  }
});