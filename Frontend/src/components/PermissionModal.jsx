import React, { useState } from "react";
import axios from "axios";
const PermissionModal = ({ onClose }) => {
  const [roleName, setRoleName] = useState("");

  const [permissions, setPermissions] = useState([]);

  const permissionOptions = [
    "EMPLOYEE_VIEW",
    "EMPLOYEE_CREATE",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_DELETE",
    "ATTENDANCE_VIEW",
    "ATTENDANCE_MANAGE",
    "LEAVE_VIEW",
    "LEAVE_CREATE",
    "LEAVE_APPROVE",
    "ROLE_MANAGE",
    "USER_MANAGEMENT",
  ];


  const handleCheckbox = (value) => {
    if (permissions.includes(value)) {
      setPermissions(
        permissions.filter((item) => item !== value)
      );
    } else {
      setPermissions([...permissions, value]);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/roles/create",
        {
          roleName,
          permissions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Permissions Updated");

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

    return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[500px] p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">
          Manage Permissions
        </h2>

        <select
          value={roleName}
          onChange={(e) =>
            setRoleName(e.target.value)
          }
          className="w-full border p-3 mb-5"
        >
          <option value="">Select Role</option>

          <option value="HR">HR</option>

          <option value="EMPLOYEE">
            EMPLOYEE
          </option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          {permissionOptions.map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={permissions.includes(item)}
                onChange={() =>
                  handleCheckbox(item)
                }
              />

              {item}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>
                 <button
            onClick={handleSubmit}
            className="bg-cyan-500 text-white px-5 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;

   