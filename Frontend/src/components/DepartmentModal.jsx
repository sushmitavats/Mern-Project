import { useEffect, useState } from "react";

import {addDepartment,updateDepartment,} from "../api";

export default function DepartmentModal({ isOpen,onClose,refresh,editData,}) {
  const [departmentName,setDepartmentName] = useState("");

  useEffect(() => {
    if (editData) {
      setDepartmentName(
        editData.departmentName
      );
    } else {
      setDepartmentName("");
    }
  }, [editData]);
     
 
  const handleSubmit =
    async () => {
      try {
        if (!departmentName.trim()) {
          return alert(
            "Department name required"
          );
        }

        if (editData) {
          await updateDepartment(
            editData._id,
            {
              departmentName,
            }
          );
        } else {
          await addDepartment({
            departmentName,
          });
        }

        refresh();

        onClose();
      } catch (err) {
        console.log(err);
      }
    };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[450px] rounded-xl shadow-xl">
        <div className="bg-cyan-500 text-white px-5 py-4 flex justify-between">
          <h2 className="text-xl font-semibold">
            {editData
              ? "Edit Department"
              : "Add Department"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-5">
          <label className="block mb-2 font-medium">
            Department Name
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) =>
              setDepartmentName(
                e.target.value
              )
            }
            className="border rounded-lg w-full p-3"
            placeholder="Enter Department Name"
          />
          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-cyan-500 text-white px-5 py-2 rounded"
            >
              {editData
                ? "Update"
                : "Save"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}