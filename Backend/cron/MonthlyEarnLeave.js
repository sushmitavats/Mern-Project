import cron from "node-cron";
import Login from "../models/Login.js";
// MONTHLY EARN LEAVE
// Runs every day at 11:55 PM
// Actually credits only on SECOND-LAST DAY
export const startMonthlyEarnLeaveCron = () => {
  cron.schedule("55 23 * * *", async () => {
      try {
        const today = new Date();
        // SECOND LAST DAY
        const lastDay =
          new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          ).getDate();
        const secondLastDay = lastDay - 1;
        // Not second-last day
        if (today.getDate() !== secondLastDay) {
          return;
        }
        // ACTIVE EMPLOYEE + HR
        const employees =await Login.find({status: "Active",
            employee_code: {
              $exists: true,
              $ne: "",
            },
          });
        for (const emp of employees) {
          // PREVENT DUPLICATE CREDIT
          if (emp.lastEarnLeaveCreditDate ) {         
            const lastCredit =
              new Date(
                emp.lastEarnLeaveCreditDate
              );
            const sameMonth =
              lastCredit.getMonth() ===today.getMonth();
            const sameYear =
              lastCredit.getFullYear() ===
              today.getFullYear();
            if (sameMonth&&sameYear) {
              continue;
            }
          }
          // CREDIT 0.83 EL
          emp.earnLeave = Number((Number(emp.earnLeave || 0) + 0.83).toFixed(2));
          emp.lastEarnLeaveCreditDate =today;
          await emp.save();
          console.log(`0.83 Earn Leave credited to ${emp.employee_code}`);
        }
        console.log("Monthly Earn Leave 0.83 credit completed successfully.");
      } catch (error) {
        console.error(
          "Monthly Earn Leave Cron Error:",
          error
        );
      }
    }
  );
};

