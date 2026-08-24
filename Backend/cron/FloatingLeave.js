import cron from "node-cron";
import Login from "../models/Login.js";

/*
FLOATING LEAVE CRON
Financial/Calendar Year is divided into two fixed halves:
FIRST HALF:
January - June
Maximum FL = 3
SECOND HALF:
July - December
Maximum FL = 3
Monthly FL = 0.5
JOINING DATE RULE:
Joining date 1st - 15th:
    Joining month is counted.
Joining date 16th - month end:
    Joining month is NOT counted.
Examples:
Joining: 10 March
March + April + May + June
4 months × 0.5 = 2.0 FL
Joining: 21 March
April + May + June
3 months × 0.5 = 1.5 FL
Joining: 10 January
January - June
6 months × 0.5 = 3.0 FL
Joining: 21 January
February - June
5 months × 0.5 = 2.5 FL
Joining: 10 July
July - December
6 months × 0.5 = 3.0 FL
Joining: 21 July
August - December
5 months × 0.5 = 2.5 FL
At the beginning of every half-year:

January 1  -> New Jan-Jun cycle
July 1     -> New Jul-Dec cycle

Existing consumed balance is NOT carried into the new half.

*/
// GET CURRENT HALF-YEAR START
const getHalfYearStart = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // January - June
  if (month <= 5) {
    return new Date(year, 0, 1);
  }
  // July - December
  return new Date(year, 6, 1);
};
// CALCULATE FLOATING LEAVE FOR JOINING EMPLOYEE
const calculateJoiningFloatingLeave = (joiningDate,cycleStart,cycleEnd) => {
  if (!joiningDate) {
    return 0;
  }
  const joining = new Date(joiningDate);
  if (isNaN(joining.getTime())) {
    return 0;
  }
  /*
    If employee joined after current cycle,
    they are not eligible yet.
  */
  if (joining > cycleEnd) {
    return 0;
  }
  /*
    Determine the first eligible month.
    Joining date 1-15:
        Joining month is included.
    Joining date 16-end:
        Joining month is excluded.
  */
  let firstEligibleMonth;
  if (joining.getDate() <= 15) {
    firstEligibleMonth = new Date(
      joining.getFullYear(),
      joining.getMonth(),
      1
    );
  } else {
    firstEligibleMonth = new Date(
      joining.getFullYear(),
      joining.getMonth() + 1,
      1
    );
  }
  /*
    Employee joined before current half-year.
    Example:
      Joining = March 2025
      Current cycle = January-June 2026
    Employee gets all 6 months:
      6 × 0.5 = 3
  */
  if (firstEligibleMonth < cycleStart) {
    firstEligibleMonth = new Date(
      cycleStart.getFullYear(),
      cycleStart.getMonth(),
      1
    );
  }
  /*
    Employee's first eligible month is after
    the current cycle.

    Example:
      Joining = August
      Current cycle = January-June

    No FL for this cycle.
  */

  if (firstEligibleMonth > cycleEnd) {
    return 0;
  }

  /*
    Calculate number of eligible months.
  */

  const months =
    (cycleEnd.getFullYear() -
      firstEligibleMonth.getFullYear()) *
      12 +
    (cycleEnd.getMonth() -
      firstEligibleMonth.getMonth()) +
    1;

  /*
    Maximum 6 months in one half.
  */

  const eligibleMonths = Math.min(
    Math.max(months, 0),
    6
  );

  /*
    0.5 FL per month.
  */

  return Number(
    (eligibleMonths * 0.5).toFixed(2)
  );
};


// ---------------------------------------------------------
// START CRON
// ---------------------------------------------------------

export const startFloatingLeaveCron = () => {

  /*
    Runs every day at 12:10 AM.
  */

  cron.schedule(
    "10 0 * * *",
    async () => {

      try {

        const today = new Date();

        /*
        ---------------------------------------------------
        CURRENT HALF-YEAR
        ---------------------------------------------------
        */

        const cycleStart =
          getHalfYearStart(today);

        /*
          January-June
        */

        let cycleEnd;

        if (today.getMonth() <= 5) {

          cycleEnd = new Date(
            today.getFullYear(),
            5,
            30,
            23,
            59,
            59,
            999
          );

        } else {

          /*
            July-December
          */

          cycleEnd = new Date(
            today.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );
        }


        /*
        ---------------------------------------------------
        GET ACTIVE EMPLOYEES
        ---------------------------------------------------
        */

        const employees = await Login.find({
          status: "Active",
          employee_code: {
            $exists: true,
            $ne: "",
          },
        });


        /*
        ---------------------------------------------------
        PROCESS EACH EMPLOYEE
        ---------------------------------------------------
        */

        for (const emp of employees) {

          /*
          -----------------------------------------------
          JOINING DATE REQUIRED
          -----------------------------------------------
          */

          if (!emp.joiningDate) {

            console.log(
              `Skipping ${emp.employee_code}: joining date not found.`
            );

            continue;
          }


          const joiningDate =
            new Date(emp.joiningDate);


          /*
          -----------------------------------------------
          INVALID JOINING DATE
          -----------------------------------------------
          */

          if (isNaN(joiningDate.getTime())) {

            console.log(
              `Skipping ${emp.employee_code}: invalid joining date.`
            );

            continue;
          }


          /*
          -----------------------------------------------
          EMPLOYEE JOINED AFTER CURRENT HALF
          -----------------------------------------------
          */

          if (joiningDate > cycleEnd) {

            continue;
          }


          /*
          -----------------------------------------------
          CHECK WHETHER CURRENT HALF IS ALREADY PROCESSED
          -----------------------------------------------
          */

          let currentCycleProcessed = false;

          if (emp.floatingLeaveIssuedDate) {

            const issuedDate =
              new Date(
                emp.floatingLeaveIssuedDate
              );

            if (
              !isNaN(issuedDate.getTime()) &&
              issuedDate.getFullYear() ===
                cycleStart.getFullYear() &&
              issuedDate.getMonth() ===
                cycleStart.getMonth() &&
              issuedDate.getDate() ===
                cycleStart.getDate()
            ) {

              currentCycleProcessed = true;
            }
          }


          /*
          -----------------------------------------------
          FIRST TIME / NEW HALF-YEAR
          -----------------------------------------------
          */

          if (!currentCycleProcessed) {

            const newFloatingLeave =
              calculateJoiningFloatingLeave(
                joiningDate,
                cycleStart,
                cycleEnd
              );


            /*
            IMPORTANT:

            We RESET the balance at the beginning
            of a new half-year.

            Previous half's remaining FL is not carried
            forward.
            */

            emp.floatingLeave =
              newFloatingLeave;


            /*
            Store the fixed cycle start.

            Jan-Jun:
                January 1

            Jul-Dec:
                July 1
            */

            emp.floatingLeaveIssuedDate =
              cycleStart;


            /*
            Store processing date.
            */

            emp.lastFloatingLeaveDate =
              today;


            await emp.save();


            console.log(
              `Floating Leave initialized for ${emp.employee_code}: ${newFloatingLeave} FL`
            );
          }

        }


        console.log(
          "Floating Leave half-year cycle check completed successfully."
        );

      } catch (error) {

        console.error(
          "Floating Leave Cron Error:",
          error
        );

      }

    }
  );
};























// import cron from "node-cron";
// import Login from "../models/Login.js";
// // FLOATING LEAVE CRON
// //
// // Runs every day at 12:10 AM
// //
// // Logic:
// // 1. Get Active users having employee_code
// // 2. Check floatingLeaveIssuedDate
// // 3. Calculate completed months
// // 4. If 6 months completed:
// //      - Reset remaining FL
// //      - Give fresh 3 FL
// //      - Start new cycle from 1st of current month
// //      - Update lastFloatingLeaveDate
// //
// // No role-based condition.

// export const startFloatingLeaveCron = () => {
//     cron.schedule(
//         "10 0 * * *",
//         async () => {
//             try {
//                 const today = new Date();        
//                 // GET ACTIVE USERS HAVING EMPLOYEE CODE
               

//                 const employees = await Login.find({
//                     status: "Active",
//                     employee_code: {
//                         $exists: true,
//                         $ne: "",
//                     },
//                 });
//                 for (const emp of employees) {
//                     // FLOATING LEAVE ISSUE DATE REQUIRED
//                     if (!emp.floatingLeaveIssuedDate) {
//                         continue;
//                     }
//                     const cycleStart = new Date(
//                         emp.floatingLeaveIssuedDate
//                     );
//                     // Invalid date protection
//                     if (isNaN(cycleStart.getTime())) {
//                         continue;
//                     }
//                     // CALCULATE COMPLETED MONTHS
//                     const months =
//                         (today.getFullYear() - cycleStart.getFullYear()) * 12 +
//                         (today.getMonth()-cycleStart.getMonth());
//                     // EVERY COMPLETED 6-MONTH CYCLE
//                     if (months >= 6) {
//                         // RESET REMAINING FLOATING LEAVE
//                         emp.floatingLeave = 0;
//                         // GIVE FRESH 3 FLOATING LEAVES
//                         emp.floatingLeave = 3;
//                         // START NEXT 6-MONTH CYCLE
//                         // FROM FIRST DAY OF CURRENT MONTH
//                         emp.floatingLeaveIssuedDate =
//                             new Date(
//                                 today.getFullYear(),
//                                 today.getMonth(),
//                                 1
//                             );
//                         // UPDATE LAST FLOATING LEAVE DATE
//                         emp.lastFloatingLeaveDate = today;

//                         await emp.save();

//                         console.log(
//                             `Floating Leave reset to 3 for ${emp.employee_code}`
//                         );
//                     }
//                 }

//                 console.log(
//                     "Floating Leave cycle check completed successfully."
//                 );

//             } catch (error) {

//                 console.error(
//                     "Floating Leave Cron Error:",
//                     error
//                 );
//             }
//         }
//     );
// };