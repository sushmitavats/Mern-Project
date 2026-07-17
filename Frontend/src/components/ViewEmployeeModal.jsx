export default function ViewEmployeeModal({ employee, onClose }) {
  if (!employee) return null;
  // add employee
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Employee Details
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 font-bold text-lg"
          >
            X
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Employee Code</p>
            <p>{employee.employee_code}</p>
          </div>

          <div>
            <p className="font-semibold">Name</p>
            <p>{employee.name}</p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p>{employee.email}</p>
          </div>

          <div>
            <p className="font-semibold">Contact</p>
            <p>{employee.contact}</p>
          </div>

          {/* <div>
            <p className="font-semibold">Department</p>
            <p>{employee.department}</p>
          </div>

          <div>
            <p className="font-semibold">Designation</p>
            <p>{employee.designation}</p>
          </div> */}
          <div>
            <p className="font-semibold">Department</p>
            <p>
              {employee.department?.departmentName || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Designation</p>
            <p>
              {employee.designation?.designationName || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Bank Account</p>
            <p>{employee.bankAccount}</p>
          </div>

          <div>
            <p className="font-semibold">PF Account</p>
            <p>{employee.pfAccount}</p>
          </div>

          <div>
            <p className="font-semibold">Gender</p>
            <p>{employee.gender}</p>
          </div>

          <div>
            <p className="font-semibold">DOB</p>
            <p>
              {employee.dob
                ? new Date(employee.dob).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Emergency Contact</p>
            <p>{employee.emergencyContact}</p>
          </div>

          <div>
            <p className="font-semibold">Aadhaar</p>
            <p>{employee.aadhaar}</p>
          </div>

          <div>
            <p className="font-semibold">PAN</p>
            <p>{employee.pan}</p>
          </div>

          <div>
            <p className="font-semibold">Joining Date</p>
            <p>
              {employee.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Relieving Date</p>
            <p>
              {employee.relievingDate
                ? new Date(employee.relievingDate).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold">Address</p>
            <p>{employee.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}