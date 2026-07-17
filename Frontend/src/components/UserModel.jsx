import React, { useEffect, useState } from "react";
import { createUser, updateUser, getDepartments, getDesignations } from "../api";

const UserModal = ({ onClose, fetchUsers, editData, }) => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    status: "Active",
    joiningDate: ""
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const deptRes =
        await getDepartments();
      const desigRes =
        await getDesignations();
      setDepartments(
        deptRes.data
      );
      setDesignations(
        desigRes.data
      );
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (editData && departments.length && designations.length) {
  //     const selectedDepartment =
  //       departments.find(
  //         (dept) =>
  //           dept.departmentName ===
  //           editData.department
  //       );
  //     const selectedDesignation =
  //       designations.find(
  //         (des) =>
  //           des.designationName ===
  //           editData.designation
  //       );

  //     setFormData({
  //       name: editData.name || "",
  //       email: editData.email || "",
  //       department: selectedDepartment?._id || "",
  //       designation: selectedDesignation?._id || "",
  //       status: editData.status || "Active",
  //       joiningDate: editData.joiningDate
  //         ? new Date(editData.joiningDate)
  //           .toISOString()
  //           .split("T")[0]
  //         : ""
  //     });
  //   }
  // }, [editData, departments, designations]);

  useEffect(() => {
    if (editData) {
      setFormData({
        name:
          editData.name || "",
        email:
          editData.email || "",
        department:
          editData.department?._id || "",
        designation:
          editData.designation?._id || "",
        status:
          editData.status || "Active",
        joiningDate:
          editData.joiningDate
            ?
            editData.joiningDate.substring(
              0,
              10
            )
            :
            ""

      });

    }

  }, [editData]);

  //handle new data
  const handleChange = (e) => {
    const { name, value } =
      e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "department"
        ? {
          designation: ""
        }
        : {})
    });
  };
  //submit data
  const handleSubmit =
    async () => {
      try {
        if (
          !formData.name.trim() ||
          !formData.email.trim() ||
          !formData.department ||
          !formData.designation ||
          !formData.status ||
          !formData.joiningDate
        ) {
          alert("Please fill all fields");
          return;
        }
        // Email validation
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
          alert("Please enter a valid email");
          return;
        }

        if (editData) {
          await updateUser(
            editData._id,
            formData
          );
          alert(
            "User Updated Successfully"
          );
        } else {
          await createUser(
            formData
          );
          alert(
            "User Created Successfully"
          );
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

    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData
              ? "Edit User"
              : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
          {/* DEPARTMENT */}
          <div>
            <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option
                  key={dept._id}
                  value={dept._id}
                >
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
          {/* DESIGNATION */}
          <div>
            <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
              Designation
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">
                Select Designation
              </option>

              {designations
                .filter(
                  (des) =>
                    des.department?._id ===
                    formData.department
                )
                .map((des) => (
                  <option
                    key={des._id}
                    value={des._id}
                  >
                    {des.designationName}
                  </option>
                ))}
            </select>
          </div>

          {/* STATUS + JOIN DATE */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-bold uppercase text-gray-700 mb-2">
                Joining Date
              </label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
