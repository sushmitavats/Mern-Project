import { useState, useEffect } from "react";
import { addEmployee, getNextEmployeeCode, getDepartments, getDesignations } from "../api";

export default function AddEmployeeModal({ isOpen, onClose, refresh }) {

  const [form, setForm] = useState({
    employee_code: "",
    name: "",
    email: "",
    contact: "",
    department: "",
    designation: "",
    bankAccount: "",
    pfAccount: "",
    joiningDate: "",
    relievingDate: "",
    status: "Active",
    address: "",
    gender: "",
    dob: "",
    emergencyContact: "",
    aadhaar: "",
    pan: "",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await getNextEmployeeCode();
        setForm((prev) => ({
          ...prev,
          employee_code: res.data.code,
          employee_id: res._id
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCode();
  }, []);


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
  if (!isOpen) return;
     //handle change
  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,

    ...(name === "department"
      ? { designation: "" }
      : {})
  }));
};

//submit

// const handleSubmit = async () => {
//   console.log(form);

//   try {
//      await addEmployee(form);
//   } catch(err){
//      console.log(err);
//   }
// };


  const handleSubmit = async () => {
    if (!form.employee_code || !form.name || !form.email) {
      alert("Please fill required fields");
      return;
    }

    try {
      await addEmployee(form);
      refresh();
      onClose();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Error saving employee");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center overflow-y-auto py-10">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Employee</h2>
          <button onClick={onClose}>X</button>
        </div>


        <div className="grid grid-cols-2 gap-3">

          <input name="employee_code" placeholder="Emp ID" value={form.employee_code} readOnly className="border p-2" />
          <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
          <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />
          <input name="contact" placeholder="Contact" onChange={handleChange} className="border p-2" />
          {/* <input name="department" placeholder="Department" onChange={handleChange} className="border p-2" />
          <input name="designation" placeholder="Designation" onChange={handleChange} className="border p-2" /> */}
          {/* department */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
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


          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">
              Select Designation
            </option>

            {designations
              .filter(
                (des) =>
                  des.department?._id ===
                  form.department
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
          <input name="bankAccount" placeholder="Bank Account" onChange={handleChange} className="border p-2" />
          <input name="pfAccount" placeholder="PF Account" onChange={handleChange} className="border p-2" />

          <input type="date" name="joiningDate" onChange={handleChange} className="border p-2" />
          <input type="date" name="relievingDate" onChange={handleChange} className="border p-2" />

          <select name="status" onChange={handleChange} className="border p-2">
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select
            name="gender"
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            name="dob"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="aadhaar"
            placeholder="Aadhaar Number"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="pan"
            placeholder="PAN Number"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="emergencyContact"
            placeholder="Emergency Contact"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>


        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 text-white">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2 text-white">Save</button>
        </div>

      </div>
    </div>
  );
}