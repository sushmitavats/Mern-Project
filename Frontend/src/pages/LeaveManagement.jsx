import { useEffect, useRef, useState } from "react";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import {getLeaves,addLeave,updateLeaveStatus,searchEmployees,} from "../api";

export default function LeaveManagement() {

  const [employeeResults, setEmployeeResults] = useState([]);
  const [employeeSearch, setEmployeeSearch] =useState("");
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [applyOnBehalf, setApplyOnBehalf] = useState(false);

  const tableRef = useRef(null);
  const dataTable = useRef(null);

  const today = new Date()
  .toISOString()
  .split("T")[0];

  if (
  form.dayType === "1st Half Day" ||
  form.dayType === "2nd Half Day"
) {
  setForm({
    ...form,
    days: 0.5,
  });
}

  const [form, setForm] = useState({
    employee_code: "",
    name: "",
    fromDate: "",
    toDate: "",
    days: "",
    leaveType: "",
    dayType: "Full Day",
  });
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchLeaves = async () => {
    try {
      const res = await getLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

useEffect(() => {
  if (!tableRef.current || leaves.length === 0) return;
  if (dataTable.current) {
    dataTable.current.destroy();
    dataTable.current = null;
  }

  console.log(dataTable.current);
  const timeout = setTimeout(() => {
    dataTable.current = new DataTable(tableRef.current, {
      searchable: true,
      sortable: true,
      paging: true,
      perPage: 5,
      perPageSelect: [5, 10, 15, 20],
      paging:true,

      labels: {
        placeholder: "Search leave...",
        perPage: "entries per page",
        noRows: "No leave found",
        info: "Showing {start} to {end} of {rows} entries",
      },
    });
  }, 0);

  return () => {
    clearTimeout(timeout);

    if (dataTable.current) {
      dataTable.current.destroy();
      dataTable.current = null;
    }
  };
}, [leaves]);


useEffect(() => {

  if (form.fromDate && form.toDate) {
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);
    const diffTime =
      to.getTime() - from.getTime();
    const diffDays =
      Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      ) + 1;
    setForm((prev) => ({
      ...prev,
      days: diffDays > 0 ? diffDays : 0,
    }));
  }
}, [form.fromDate, form.toDate]);
const handleEmployeeSearch = async (
  value
) => {
  setEmployeeSearch(value);
  if (!value.trim()) {
    setEmployeeResults([]);
    return;
  }
  try {
    const res =
      await searchEmployees(value);

    setEmployeeResults(res.data);

  } catch (err) {

    console.log(err);
  }
};

const handleSubmit = async () => {

  try {

    let finalForm = { ...form };
       if (!applyOnBehalf) {

      finalForm.employee_code =
        user.employee_code;
    }


    await addLeave(finalForm);

    fetchLeaves();

    setShowModal(false);

  } catch (err) {

    console.log(err);
  }
};
  const handleStatus = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-semibold text-gray-800">
          Leave Management
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Add Leave
          </button>

    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Download Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table
  ref={tableRef}
  className="w-full border-collapse"
>
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">ID</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">From</th>
              <th className="border p-3">To</th>
              <th className="border p-3">Days</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                <td className="border p-3">{l.employee_code}</td>
                <td className="border p-3">{l.name}</td>
                <td className="border p-3">{l.fromDate}</td>
                <td className="border p-3">{l.toDate}</td>
                <td className="border p-3">{l.days}</td>

                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      l.status === "Pending"
                        ? "bg-yellow-400"
                        : l.status === "Approved"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>

                <td className="border p-3">
                  {user.role === "HR" && (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() =>
                          handleStatus(l._id, "Approved")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() =>
                          handleStatus(l._id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


     {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[900px] rounded-lg shadow-lg overflow-hidden">
            <div className="bg-cyan-500 text-white px-5 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Apply Leave
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-3xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block mb-2 font-medium">
                    From Date
                  </label>

                  <input
                    type="date"
                    className="border p-3 rounded w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fromDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="border p-3 rounded w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        toDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>

  <label className="block mb-2 font-medium">
    Number Of Days
  </label>
  <input
    type="number"
    value={form.days}
    readOnly
    className="border p-3 rounded w-full bg-gray-100"
  />
</div>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block mb-2 font-medium">
                    Leave Type
                  </label>

                  <select
                    className="border p-3 rounded w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        leaveType: e.target.value,
                      })
                          }
                  >
                    <option>Select Leave</option>
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Paid Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Day Type
                  </label>

                  <select
                    className="border p-3 rounded w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dayType: e.target.value,
                      })
                    }
                  >
                    <input
  type="date"
  min={today}
/>
                    <option>Full Day</option>
                    <option>1st Half Day</option>
                     <option>2nd Half Day</option>
                  </select>
                </div>
              </div>

              <div className="mb-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={applyOnBehalf}
                  onChange={(e) =>
                    setApplyOnBehalf(e.target.checked)
                  }
                />

                <label className="font-medium">
                  Apply Leave On The Behalf
                </label>
              </div>
              {applyOnBehalf && (

  <div className="mb-5 relative">

    <label className="block mb-2 font-medium">
      Search Employee
    </label>

    <input
      type="text"
      placeholder="Search by ID or Name"
      className="border p-3 rounded w-full"
      value={employeeSearch}
      onChange={(e) =>
        handleEmployeeSearch(e.target.value)
      }
    />

    {employeeResults.length > 0 && (

      <div className="absolute bg-white border rounded w-full mt-1 shadow-lg max-h-60 overflow-y-auto z-50">

        {employeeResults.map((emp) => (

          <div
            key={emp.employee_code}

            className="p-3 hover:bg-gray-100 cursor-pointer border-b"

            onClick={() => {

              setForm({
                ...form,
                employee_code:
                  emp.employee_code,
              });

              setEmployeeSearch(
                `${emp.employee_code} - ${emp.name}`
              );

              setEmployeeResults([]);
            }}
          >

            <p className="font-medium">
              {emp.employee_code}
            </p>

            <p className="text-sm text-gray-500">
              {emp.name}
            </p>

          </div>
        ))}
      </div>
    )}
  </div>
)}

        <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-cyan-500 text-white px-5 py-2 rounded"
                >
                  Submit Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
