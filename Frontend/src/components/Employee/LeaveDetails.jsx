// export default function LeaveDetails({
//   form,
//   errors,
//   handleChange,
// }) {
//   return (
//     <div className="mt-6 bg-white border rounded-xl p-6">
//       <h2 className="font-semibold text-lg mb-6">
//         Leave Details
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//         <div>
//           <label>Leave Policy *</label>

//           <select
//             name="leavePolicy"
//             value={form.leavePolicy || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg p-3 ${
//               errors?.leavePolicy
//                 ? "border-red-500"
//                 : ""
//             }`}
//           >
//             <option value="">Select</option>
//             <option>Annual Leave</option>
//             <option>Sick Leave</option>
//             <option>Casual Leave</option>
//           </select>

//           {errors?.leavePolicy && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.leavePolicy}
//             </p>
//           )}
//         </div>

//         <div>
//           <label>Attendance Policy *</label>

//           <input
//             name="attendancePolicy"
//             value={form.attendancePolicy || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg p-3 ${
//               errors?.attendancePolicy
//                 ? "border-red-500"
//                 : ""
//             }`}
//           />

//           {errors?.attendancePolicy && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.attendancePolicy}
//             </p>
//           )}
//         </div>

//         <div>
//           <label>Holiday Calendar *</label>

//           <input
//             name="holidayCalendar"
//             value={form.holidayCalendar || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg p-3 ${
//               errors?.holidayCalendar
//                 ? "border-red-500"
//                 : ""
//             }`}
//           />

//           {errors?.holidayCalendar && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.holidayCalendar}
//             </p>
//           )}
//         </div>

//         <div>
//           <label>Weekly Off *</label>

//           <select
//             name="weeklyOff"
//             value={form.weeklyOff || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg p-3 ${
//               errors?.weeklyOff
//                 ? "border-red-500"
//                 : ""
//             }`}
//           >
//             <option value="">Select</option>
//             <option>Sunday</option>
//             <option>Saturday</option>
//           </select>

//           {errors?.weeklyOff && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.weeklyOff}
//             </p>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }