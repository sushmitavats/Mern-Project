import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getLeaves, addLeave, updateLeaveStatus, searchEmployees, getLeaveBalance, getEmployees } from "../api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { hasPermission } from "../utils/hasPermission";

//logic
export default function LeaveManagement() {

  const [employeeResults, setEmployeeResults] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [applyOnBehalf, setApplyOnBehalf] = useState(false);
  const [search, setSearch] = useState("");
  const [leaveBalance, setLeaveBalance] = useState({
    earnLeave: 0,
    floatingLeave: 0,
  });
  const [form, setForm] = useState({
    employee_code: "",
    leaveType: "",
    leaveSource: "",
    description: "",
    deductedFrom: "",
    leaveDates: [],
  });

  console.log("Submitting:", form);
  const [selectedDate, setSelectedDate] =
    useState(null);
  const [selectedDayType, setSelectedDayType] =
    useState("Full Day");
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchLeaveBalance = async () => {
    try {
      const res = await getLeaveBalance(
        user.employee_code
      );
      console.log(
        "LEAVE BALANCE RESPONSE",
        res.data
      );
      setLeaveBalance(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    if (
      user?.role !== "ADMIN" &&
      user?.employee_code
    ) {
      fetchLeaveBalance();
    }

  }, []);

  console.log("USER =>", user);

  //leave fetch
  const fetchLeaves = async () => {
    try {
      console.log("Fetching leaves...");
      const res = await getLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  //table
  const filteredLeaves = leaves.filter((leave) => {
    return (
      leave.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
      leave.name?.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
      leave.status?.toLowerCase().includes(search.toLowerCase()) ||
      leave.description?.toLowerCase().includes(search.toLowerCase())
    );
  });
  const addDateToLeave = () => {
    if (!selectedDate) {
      alert("Select Date");
      return;
    }
    const dateString =
      selectedDate.toLocaleDateString(
        "en-CA"
      );
    const exists =
      form.leaveDates.find(
        (d) => d.date === dateString
      );
    if (exists) {
      alert("Date already added");
      return;
    }
    setForm({
      ...form,
      leaveDates: [
        ...form.leaveDates,
        {
          date: dateString,
          dayType: selectedDayType,
        },
      ],
    });
  };
  //handle employee
  const handleEmployeeSearch = async (value) => {
    setEmployeeSearch(value);
    if (!value.trim()) {
      setEmployeeResults([]);
      return;
    }
    try {
      const res = await searchEmployees(value);
      // setEmployeeResults(res.data);
      setEmployeeResults(
        res.data.filter(
          emp =>
            emp.employee_code !==
            user.employee_code
        )
      );
    } catch (err) {
      console.log(err);
    }
  };
  //submit form
  const handleSubmit = async () => {

    console.log("FORM BEFORE VALIDATION", form);

    if (!form.leaveType) {
      alert("Select Leave Type");
      return;
    }

    if (form.leaveDates.length === 0) {
      alert(
        "Select At Least One Leave Date"
      );
      return;
    }

    if (!form.description.trim()) {
      alert(
        "Description Required"
      );
      return;
    }


    if (form.leaveType === "Floating Leave" &&
      leaveBalance.floatingLeave < 0.5) {
      alert(
        "Floating Leave balance is less than half day (0.5)"
      );
      return;
    }
    // handle submit
    try {
      let finalForm = {
        ...form,
      };
      if (!applyOnBehalf) {
        finalForm.employee_code =
          user.employee_code;
      }
      console.log("FINAL FORM =>", finalForm);
      await addLeave(finalForm);
      await fetchLeaveBalance(); // refresh balances
      await fetchLeaves();
      setForm({
        employee_code: "",
        leaveType: "",
        leaveSource: "",
        description: "",
        deductedFrom: "",
        leaveDates: [],
      });

      setEmployeeSearch("");
      setSelectedDate(null);
      setSelectedDayType("Full Day");
      setApplyOnBehalf(false);

      alert(
        "Leave Applied Successfully"
      );
      setShowModal(false);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.msg ||
        "Error"
      );
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
  useEffect(() => {
    fetchLeaves();
    if (
      user?.role !== "ADMIN" &&
      user?.employee_code
    ) {
      fetchLeaveBalance();
    }
  }, []);

  //table
  const columns = [
    {
      name: "ID",
      selector: row => row.employee_code,
      sortable: true,
    },
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Leave Dates",
      cell: row => (
        <div className="max-h-16 overflow-y-auto flex flex-wrap gap-1">
          {row.leaveDates?.map((d, i) => (
            <span
              key={i}
              className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs"
            >
              {d.date} (
              {d.dayType === "Full Day"
                ? "FD"
                : d.dayType === "1st Half Day"
                  ? "FH"
                  : "SH"}
              )
            </span>
          ))}
        </div>
      ),
      width: "250px",
      grow: 2,
    },
    {
      name: "Total Days",
      selector: row => row.days,
      sortable: true,
      width: "120px",
    },
    {
      name: "Leave Type",
      selector: row => row.leaveType,
      sortable: true,
    },
    {
      name: "Description",
      cell: row => (
        <div
          title={row.description}
          className="max-w-[200px] truncate"
        >
          {row.description}
        </div>
      ),
      // width: "220px",
    },
    {
      name: "Applied By",
      cell: row =>
        row.appliedByEmployeeCode === row.employee_code
          ? "Self"
          : row.appliedByName,
      sortable: true,
    },
    {
      name: "Status",
      cell: row => (
        <span
          className={`px-2 py-1 rounded text-white text-xs ${row.status === "Approved"
            ? "bg-green-500"
            : row.status === "Rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
            }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  
    {
  name: "Action",
  cell: (row) => {

    const canApprove =
      hasPermission(
        "Leave",
        "edit"
      );

    return (

      <div className="flex gap-2">

        <button
          onClick={() => {

            if (!canApprove) {
              alert(
                "You are not permitted to approve leave"
              );
              return;
            }

            handleStatus(
              row._id,
              "Approved"
            );

            alert(
              "Approved successfully"
            );

          }}

          className={`px-2 py-1 rounded text-white ${
            canApprove
              ? "bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Approve
        </button>
        <button
          onClick={() => {
            if (!canApprove) {
              alert(
                "You are not permitted to reject leave"
              );
              return;
            }
            handleStatus(
              row._id,
              "Rejected"
            );
            alert(
              "Rejected successfully"
            );
          }}
          className={`px-2 py-1 rounded text-white ${
            canApprove
              ? "bg-red-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Reject
        </button>
      </div>
    );
  },
}
  ];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-semibold text-gray-800">
          Leave Management
        </h2>
        {user?.role !== "ADMIN" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="w-full bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold">
                Earn Leave
              </h2>
              <p className="text-2xl text-cyan-600 font-bold">
                {(leaveBalance?.earnLeave || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">
                Floating Leave
              </h2>
              <p className="text-2xl text-green-600 font-bold">
                {(leaveBalance?.floatingLeave || 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {/* {user?.role !== "ADMIN" && */}
           {hasPermission(
            "Leave",
            "create"
          ) && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
              >
                Add Leave
              </button>
            )}
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Download Excel
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2"
            />
          </div>
        </div>
        {/* <div className="w-full overflow-x-auto"> */}
        <div className="user-table border-0 overflow-x-auto">
          <DataTable
            style={{ width: "100%" }}
            columns={columns}
            data={filteredLeaves}
            pagination
            highlightOnHover
            responsive
            striped
            dense
            persistTableHead
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            sortIcon={<span>↕</span>}
          />
        </div>
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
              {/* // leave type */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Leave Type
                </label>

                <select
                  className="border p-3 rounded w-full"
                  value={form.leaveType}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (
                      value === "Floating Leave" &&
                      leaveBalance.floatingLeave < 0.5
                    ) {
                      alert(
                        "Floating Leave balance is less than half day (0.5)"
                      );
                      return;
                    }
                    setForm({
                      ...form,
                      leaveType: value,
                      deductedFrom: value,
                      leaveSource: value,
                    });
                  }}
                >
                  <option value="">
                    Select Leave Type
                  </option>
                  <option value="Earn Leave">
                    Earn Leave
                  </option>
                  <option
                    value="Floating Leave"
                    disabled={leaveBalance.floatingLeave < 0.5}
                  >
                    Floating Leave
                  </option>
                </select>
              </div>

              {/* leave days */}
              <div className="mb-4">
                <select
                  className="border p-3 rounded w-full"
                  value={selectedDayType}
                  onChange={(e) =>
                    setSelectedDayType(
                      e.target.value
                    )
                  }
                >
                  <option>
                    Full Day
                  </option>

                  <option>
                    1st Half Day
                  </option>

                  <option>
                    2nd Half Day
                  </option>

                </select>
              </div>


              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <div className="mb-5">
                    {/* // fron calendae */}

                    <label className="font-medium block mb-2">
                      Select Leave Date
                    </label>
                    <button
                      type="button"
                      onClick={addDateToLeave}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add Date
                    </button>

                    <Calendar
                      minDate={new Date()}
                      onChange={setSelectedDate}
                      value={selectedDate}
                      tileClassName={({ date }) => {
                        const dateString =
                          date.toLocaleDateString(
                            "en-CA"
                          );

                        const found = form.leaveDates.find(
                          (d) => d.date === dateString
                        );

                        return found
                          ? "leave-selected"
                          : "";
                      }}
                      tileContent={({ date }) => {
                        const dateString =
                          date.toLocaleDateString(
                            "en-CA"
                          );

                        const found = form.leaveDates.find(
                          (d) => d.date === dateString
                        );

                        if (!found) return null;

                        return (
                          <div className="text-[10px] font-bold">
                            {found.dayType === "Full Day"
                              ? "FD"
                              : found.dayType ===
                                "1st Half Day"
                                ? "FH"
                                : "SH"}
                          </div>
                        );
                      }}
                    />

                  </div>

                  <div className="mb-5">

                    <label className="block mb-2 font-medium">
                      Description
                    </label>

                    <textarea
                      rows="4"
                      className="border p-3 rounded w-full"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                <div className="mt-4">

                  {form.leaveDates.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="bg-green-100 border border-green-500 rounded p-2 mb-2 flex justify-between"
                      >
                        <span>
                          {item.date}
                        </span>

                        <span>
                          {item.dayType ===
                            "Full Day"
                            ? "FD"
                            : item.dayType ===
                              "1st Half Day"
                              ? "FH"
                              : "SH"}
                        </span>

                      </div>
                    )
                  )}

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