import LeaveHistory from "../models/LeaveHistory.js";


await LeaveHistory.create({
  employee_code:
    leave.employee_code,

  leaveType:
    leave.leaveType,

  action:
    req.body.status,

  previousBalance: 0,

  updatedBalance: 0,
});