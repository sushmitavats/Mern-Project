import { useEffect, useState } from "react";
import { addDesignation, updateDesignation, getDepartments, } from "../api";

export default function DesignationModal({ isOpen, onClose, refresh, editData, }) {
  const [designationName, setDesignationName] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [departments, setDepartments] =
    useState([]);

  //fetch department list
  useEffect(() => {
    fetchDepartments();
  }, []);


  const fetchDepartments =
    async () => {
      try {
        const res =
          await getDepartments();
          console.log("Designation Data:", res.data);

        setDepartments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  // edit the list
  useEffect(() => {
    if (editData) {
      setDesignationName(
        editData.designationName
      );

      setDepartment(
        editData.department?._id || ""
      );
    } else {
      setDesignationName("");
      setDepartment("");
    }
  }, [editData]);

  //submit
  const handleSubmit = async () => {

    if (
      !designationName.trim() ||
      !department
    ) {
      return alert(
        "Designation and Department are required"
      );
    }
    try {
      if (editData) {
        await updateDesignation(
          editData._id,
          {
            designationName,
            department,
          }
        );
      } else {
        await addDesignation({
          designationName,
          department,
        });
      }
      setDesignationName("");
      setDepartment("");

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

        <div className="bg-cyan-500 text-white px-5 py-4">
          <h2 className="text-xl font-semibold">
            {editData
              ? "Edit Designation"
              : "Add Designation"}
          </h2>
        </div>

        <div className="p-5">

          <label className="block mb-2 font-medium">
            Designation Name
          </label>

          <input
            type="text"
            value={designationName}
            onChange={(e) =>
              setDesignationName(
                e.target.value
              )
            }
            placeholder="Enter Designation Name"
            className="w-full border rounded-lg p-3"
          />

          <label className="block mb-2 font-medium mt-4">
            Department
          </label>

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              Select Department
            </option>

            {departments.map((dept) => (
              <option
                key={dept._id}
                value={dept._id}
              >
                {dept.departmentName}
              </option>
            ))}
          </select>
                 {/* submit */}
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