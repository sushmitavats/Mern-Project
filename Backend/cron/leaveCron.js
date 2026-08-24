import cron from "node-cron";
import Login from "../models/Login.js";
/*
  One day before month end:
  - Credits Earn Leave
  - Uses attendance rule (>15 present days)
*/

//now it is not imported in server.js , this and MonthlyEarn leave is same for both
export const startLeaveCron = () => {
  cron.schedule("55 23 * * *",
    async () => {
      try {
        const today = new Date();
        const lastDay =
          new Date(today.getFullYear(),today.getMonth() + 1,0).getDate();
        // One day before month end
        if (today.getDate() !== lastDay - 1) {
          return;
        }
        const employees =
          await Login.find({role: {$in: ["EMPLOYEE","HR",],},
            status: "Active",
          });
        for (const emp of employees) {
          // Attendance eligibility
          if (emp.presentDaysThisMonth <= 15) {
            continue;
          }
          const joining =new Date(emp.joiningDate);
          const months =(today.getFullYear() - joining.getFullYear()) *12 +
            (today.getMonth() - joining.getMonth());
          const credit =
            months < 6 ? 0.83: 1;
          // Earn Leave can go negative,
          // but monthly credit simply adds
          emp.earnLeave += credit;
          emp.lastEarnLeaveCreditDate = today;
          // Reset attendance counter
          emp.presentDaysThisMonth = 0;
          await emp.save();
        }
        console.log(
          "Monthly Earn Leave credited successfully"
        );
      } catch (error) {
        console.error(
          "Leave Cron Error:",error
        );
      }
    }
  );
};