// import { useState } from "react";
// import { changePassword } from "../api";


// const ChangePasswordModal = ({
//   onClose,
// }) => {

//   const [
//     oldPassword,
//     setOldPassword,
//   ] = useState("");

//   const [
//     newPassword,
//     setNewPassword,
//   ] = useState("");

//   const [
//     confirmPassword,
//     setConfirmPassword,
//   ] = useState("");

//   const handleSubmit =
//     async () => {

//       try {

//         if (
//           !oldPassword ||
//           !newPassword ||
//           !confirmPassword
//         ) {
//           return alert(
//             "All fields are required"
//           );
//         }

//         if (
//           newPassword !==
//           confirmPassword
//         ) {
//           return alert(
//             "Passwords do not match"
//           );
//         }

//         await changePassword({
//           oldPassword,
//           newPassword,
//           confirmPassword,
//         });

//         alert(
//           "Password Changed Successfully"
//         );

//         onClose();

//       } catch (error) {

//         alert(
//           error.response?.data
//             ?.msg ||
//           "Password change failed"
//         );
//       }
//     };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">





//     <div className="flex justify-between items-center mb-5">

//       <h2 className="text-2xl font-semibold">
//         Change Password
//       </h2>

//       <button
//         onClick={onClose}
//         className="text-xl font-bold"
//       >
//         ×
//       </button>
//       <input
//         type="password"
//         placeholder="old Password"
//         className="w-full border p-2 mb-4"
//         onChange={(e) =>
//           setOldPassword(
//             e.target.value
//           )
//         }
//       />


//       <input
//         type="password"
//         placeholder="New Password"
//         className="w-full border p-2 mb-4"
//         onChange={(e) =>
//           setNewPassword(
//             e.target.value
//           )
//         }
//       />

//       <input
//         type="password"
//         placeholder="Confirm Password"
//         className="w-full border p-2 mb-5"
//         onChange={(e) =>
//           setConfirmPassword(
//             e.target.value
//           )
//         }
//       />

//       <button
//         onClick={
//           handleSubmit
//         }
//         className="w-full bg-cyan-500 text-white py-2 rounded"
//       >
//         Update Password
//       </button>

//     </div>
//     </div >
//   );
// };

// export default ChangePasswordModal;


















// import { useState } from "react";

// import {
//   changePassword,
// } from "../api";

// const ChangePasswordModal = ({
//   onClose,
// }) => {
//   const [oldPassword,
//     setOldPassword] =
//     useState("");

//   const [newPassword,
//     setNewPassword] =
//     useState("");

//   const [confirmPassword,
//     setConfirmPassword] =
//     useState("");

//   //submit new password
//   const handleSubmit =
//     async () => {
//       try {

//         if (
//           !oldPassword ||
//           !newPassword
//           // !confirmPassword
//         ) {
//           return alert(
//             "All fields are required"
//           );
//         }

//         if (
//           newPassword !==
//           confirmPassword
//         ) {
//           return alert(
//             "Passwords do not match"
//           );
//         }

//         await changePassword({
//           oldPassword,
//           newPassword,
//           // confirmPassword,
//         });

//         alert(
//           "Password Changed Successfully"
//         );

//         localStorage.removeItem(
//           "showPasswordModal"
//         );

//         onClose();

//       } catch (error) {

//         alert(
//           error.response?.data
//             ?.msg ||
//           "Password change failed"
//         );
//       }
//     };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-semibold mb-5">
//           Change Password
//         </h2>

//         <input
//           type="password"
//           placeholder="Old Password"
//           className="w-full border p-2 mb-4"
//           onChange={(e) =>
//             setOldPassword(
//               e.target.value
//             )
//           }
//         />

//         <input
//           type="password"
//           placeholder="New Password"
//           className="w-full border p-2 mb-4"
//           onChange={(e) =>
//             setNewPassword(
//               e.target.value
//             )
//           }
//         />

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="w-full border p-2 mb-5"
//           onChange={(e) =>
//             setConfirmPassword(
//               e.target.value
//             )
//           }
//         />

//         <button
//           onClick={onClose}
//           className="w-1/2 border py-2 rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={
//             handleSubmit
//           }
//           className="w-full bg-cyan-500 text-white py-2 rounded"
//         >
//           Update Password
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChangePasswordModal;