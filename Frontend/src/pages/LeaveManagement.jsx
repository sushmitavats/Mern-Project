import { useEffect, useRef, useState } from "react";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { getLeaves, addLeave, updateLeaveStatus, searchEmployees, getLeaveBalance, } from "../api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function LeaveManagement() {

  const [employeeResults, setEmployeeResults] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [applyOnBehalf, setApplyOnBehalf] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState({
    earnLeave: 0,
    floatingLeave: 0,
    negativeLeave: 0,
  });
  const [form, setForm] = useState({
    employee_code: "",
    leaveType: "",
    description: "",
    deductedFrom: "",
    leaveDates: [],
  });

  console.log("Submitting:", form);
  const [selectedDate, setSelectedDate] =
    useState(null);

  const [selectedDayType, setSelectedDayType] =
    useState("Full Day");

  const tableRef = useRef(null);
  const dataTable = useRef(null);


  const today = new Date()
    .toISOString()
    .split("T")[0];

  // unique leave
  // const uniqueDates = new Set(
  //   leaveDates.map(d => d.date)
  // );

  const uniqueDates = new Set(
    form.leaveDates.map(
      (d) => d.date
    )
  );

  const LEAVE_STATUS = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  // if (
  //   uniqueDates.size !==
  //   leaveDates.length
  // ) {
  //   return res.status(400).json({
  //     msg: "Duplicate leave dates"
  //   });
  // }


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

  // useEffect(() => {
  //   fetchLeaveBalance();
  // }, []);


  useEffect(() => {

    if (
      user?.role !== "ADMIN" &&
      user?.employee_code
    ) {
      fetchLeaveBalance();
    }

  }, []);

  // const [form, setForm] = useState({
  //   employee_code: "",
  //   name: "",
  //   fromDate: "",
  //   toDate: "",
  //   days: "",
  //   leaveType: "",
  //   dayType: "Full Day",
  // });
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("USER =>", user);

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
        paging: true,

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

  // added for changed table

  const addDateToLeave = () => {
    if (!selectedDate) {
      alert("Select Date");
      return;
    }

    const dateString =
      selectedDate
        .toISOString()
        .split("T")[0];

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

  //check the earn leave comdition

  // if (
  //   leaveSource === "Earn Leave" &&
  //   employee.earnLeave < days
  // ) {
  //   return res.status(400).json({
  //     msg: "Insufficient Earn Leave",
  //   });
  // }
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

    if (!form.leaveType) {
      alert("Select Leave Type");
      return;
    }

    if (
      form.leaveDates.length === 0
    ) {
      alert(
        "Select At Least One Leave Date"
      );
      return;
    }

    if (
      !form.description.trim()
    ) {
      alert(
        "Description Required"
      );
      return;
    }


    // const payload = {
    //   ...form,
    //   deductedFrom: form.leaveType,
    // };

    // console.log("Submitting:", payload);

    // await createLeave(payload);

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

      alert(
        "Leave Applied Successfully"
      );

      fetchLeaves();

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-semibold text-gray-800">
          Leave Management
        </h2>
        {user?.role !== "ADMIN" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
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
            {/* 
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">
                Negative Leave
              </h2>

              <p className="text-2xl text-red-600 font-bold">
              {(leaveBalance?.negativeLeave || 0).toFixed(2)}
              </p>
            </div> */}
          </div>
        )}

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
              <th className="border p-3">Leave Dates</th>
              <th className="border p-3">Total Days</th>
              <th className="border p-3">Leave Type</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Applied By</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                <td className="border p-3">
                  {l.employee_code}
                </td>
                <td className="border p-3">
                  {l.name}
                </td>
                <td className="border p-3">
                  <div className="flex flex-wrap gap-1">
                    {l.leaveDates?.map((d, i) => (
                      <span
                        key={i}
                        className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs"
                      >
                        {d.date}
                        (
                        {d.dayType === "Full Day"
                          ? "FD"
                          : d.dayType === "1st Half Day"
                            ? "FH"
                            : "SH"}
                        )
                      </span>
                    ))}
                  </div>
                </td>

                <td className="border p-3">
                  {l.days}
                </td>

                <td className="border p-3">
                  {l.leaveType}
                </td>

                <td className="border p-3">
                  {l.description}
                </td>

                <td className="border p-3">
                  {l.appliedByEmployeeCode === l.employee_code
                    ? "Self"
                    : l.appliedByName}
                </td>

                {/* <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${l.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : l.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {l.status}
                  </span>
                </td> */}
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${l.status === "Approved"
                      ? "bg-green-500"
                      : l.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                      }`}
                  >
                    {l.status}
                  </span>
                </td>

                <td className="border p-3">
                  {(user.role === "HR" ||
                    user.role === "ADMIN") &&
                    l.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatus(
                              l._id,
                              "Approved"
                            )
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatus(
                              l._id,
                              "Rejected"
                            )
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
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


      {/* <select
        value={form.leaveType}
        onChange={(e) =>
          setForm({
            ...form,
            leaveType: e.target.value,
            deductedFrom: e.target.value,
          })
        }
      >
        <option value="">
          Select Leave Type
        </option>

        <option value="Earn Leave">
          Earn Leave
        </option>

        <option value="Floating Leave">
          Floating Leave
        </option>
      </select> */}


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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leaveType: e.target.value,
                      deductedFrom: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Leave Type
                  </option>

                  <option value="Earn Leave" disabled={leaveBalance.earnLeave <= 0}>
                    Earn Leave
                  </option>

                  <option value="Floating Leave"  disabled={leaveBalance.floatingLeave <= 0}>
                    Floating Leave
                  </option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  {/* <label className="block mb-2 font-medium">
                    Leave Type
                  </label> */}

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
                          date
                            .toISOString()
                            .split("T")[0];

                        const found =
                          form.leaveDates.find(
                            (d) =>
                              d.date === dateString
                          );

                        return found
                          ? "bg-green-500 text-white rounded-full"
                          : "";
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
