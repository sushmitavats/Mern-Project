import { useState, useEffect } from "react";
import { updateEmployee } from "../api";

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  refresh,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (employee) {
      setForm(employee);
    }
  }, [employee]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async () => {
  try {

    const { _id, ...updatedData } = form;

    await updateEmployee(
      form.employee_code,
      updatedData
    );

    refresh();

    onClose();

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[700px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Employee</h2>

          <button onClick={onClose}>X</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />


       <input
            name="contact"
            value={form.contact || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="department"
            value={form.department || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="designation"
            value={form.designation || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={form.status || "Active"}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}