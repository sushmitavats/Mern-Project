import React, { useEffect, useState, } from "react";

import { createUser, updateUser, } from "../api";

const UserModal = ({ onClose, fetchUsers, editData, }) => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      department: "",
      role: "",
      joiningDate: "",
    });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        role: editData.userAccount || "",
        department: editData.department || "",
        joiningDate: editData.joiningDate
          ? editData.joiningDate.split("T")[0]
          : "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, });
  };

  const handleSubmit =
    async () => {
      try {
        if (editData) {
          await updateUser(editData._id, formData);
          alert(
            "User Updated Successfully"
          );
        } else {
          await createUser(formData);
          alert("User Created & Credentials Sent To Email");
        }

        fetchUsers();
        onClose();

      } catch (error) {
        alert(
          error.response?.data?.msg ||
          error.message
        );
      }
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[450px] p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5">
          {editData
            ? "Edit User"
            : "Add New User"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={
            handleChange
          }
          className="w-full border p-2 rounded mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={
            handleChange
          }
          className="w-full border p-2 rounded mb-4"
        />

        <select
          name="role"
          value={formData.role}
          onChange={
            handleChange
          }
          className="w-full border p-2 rounded mb-5"
        >
          <option value="">
            Select Role
          </option>

          <option value="HR">
            HR
          </option>

          <option value="EMPLOYEE">
            EMPLOYEE
          </option>
        </select>


        <input
          type="text"
          name="department"
          placeholder="Enter Department"
          value={
            formData.department
          }
          onChange={
            handleChange
          }
          className="w-full border p-2 rounded mb-4"
        />

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={
              handleSubmit
            }
            className="px-5 py-2 bg-cyan-500 text-white rounded"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;



// I have used here module of management page
//I have given u usermanagement and leavemanagement page  with full frontend and backend part. from usermanagement page admin adding new employee and all that field till now but I want that to add more , I want that there should be two button one is earn leave and second is floating leave, earn leave mai aysa ho ki agar new employee hai then jab admin us button pai add karai then joining date sai 6 month tak usko 0.83 leave milai and after that earn leave 1.23 ka add ho.and floating leave jab admin employee add kar raha ho then jab wo floating leave walai button pai add karai then 3 leave employee ka add ho jayai 6 month tak kai liyai after that then again 6 month pura honai pai yai button active ho then again us employee pai admin click karaiga then again usko 3 leave next 6 month kai liyai mil jayaiga.and leave page pai yai data show ho and jab employee leave add kar raha ho then at real time uska leave jitna hai ussai detect hojayai,aysa ho ki agar mai 1 and half day ka leave leti hu then wo leave 1.5 leave merai earn leave sai pahlai detect ho then agar uska earn leave nahi hai then floation leave sai detect ho(prioraty based)aysa bhi hona chahiyai ki aaj ka half lena hai kal ka full day then usmai calender ho jo aaj ka aaur aanai wala date hi show karai baki date select na ho payai.agar leave employee luga raha ho aaur uska leave 0.5 sai kam ho then wo leave apply hi na kar payai. leave nahi hai then uska leave koy aaur luga sakta hai ,then wo minus mai show karai lekin agar yai dono leave mai sai koy bhi leave add ho jayai month kai end tak then uska positive bhi ho jayai nahi to again leave add karnai kai baad bhi positive nahi hua then 0 pai aa jayai next month sai. I want full final and exact frontend and backend code. 





