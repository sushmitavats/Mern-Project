import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { hasPermission } from "../utils/hasPermission";
import { useNavigate } from "react-router-dom";
import { getLeaves, updateLeaveStatus, } from "../api";
import {
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export default function LeaveManagement() {
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // const fetchLeaveBalance = async () => {
  //   try {
  //     const res = await getLeaveBalance(
  //       user.employee_code
  //     );
  //     console.log(
  //       "LEAVE BALANCE RESPONSE",
  //       res.data
  //     );
  //     setLeaveBalance(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (user?.role !== "ADMIN" && user?.employee_code
  //   ) {
  //     fetchLeaveBalance();
  //   }
  // }, []);
  // const fetchLeaveBalance = async () => {
  //   try {
  //     if (!user?.employee_code) return;

  //     const res = await getLeaveBalance(user.employee_code);
  //     setLeaveBalance({
  //       earnLeave: Number(res.data.earnLeave || 0),
  //       floatingLeave: Number(res.data.floatingLeave || 0),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // console.log("USER =>", user);
  //leave fetch
  const fetchLeaves = async () => {
    try {
      console.log("Fetching leaves...");
      // const res = await getLeaves()
      const res = await getLeaves();
      setLeaves(res.data || []);
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
  // const handleStatus = async (id, status) => {
  //   try {
  //     await updateLeaveStatus(id, status);
  //     // Refresh balance after approval / rejection
  //     if (user?.role !== "ADMIN") {
  //       await fetchLeaveBalance();
  //     }
  //     alert(`Leave ${status} successfully.`);
  //   } catch (err) {
  //     console.log(err);
  //     alert(err.response?.data?.msg || "Failed to update leave status.");
  //   }
  // };
  //nc
  // const handleStatus = async (id, status) => {
  //   const previousLeaves = [...leaves];

  //   try {
  //     // Immediate UI update
  //     setLeaves((prevLeaves) =>
  //       prevLeaves.map((leave) =>
  //         leave._id === id
  //           ? { ...leave, status: status, }
  //           : leave
  //       )
  //     );
  const handleStatus = async (id, status) => {
    const actionText = status === "Approved" ? "approve" : "reject";

    // Confirmation before changing status
    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this leave?`
    );

    // User clicked Cancel
    if (!confirmed) {
      return;
    }

    const previousLeaves = [...leaves];

    try {
      // Immediate UI update
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === id
            ? { ...leave, status: status }
            : leave
        )
      );

      // Update backend
      const response = await updateLeaveStatus(id, status);

      // Use backend response if available
      if (response?.data?.leave) {
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave._id === id
              ? response.data.leave
              : leave
          )
        );
      }

      // Success alert
      alert(
        status === "Approved"
          ? "Leave approved successfully."
          : "Leave rejected successfully."
      );

    } catch (err) {
      console.log("Status Update Error:", err);

      // Rollback UI if API fails
      setLeaves(previousLeaves);

      alert(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to update leave status."
      );
    }
  };
  // Update backend
  //     const response = await updateLeaveStatus(id, status);
  //     // Use backend response if available
  //     if (response?.data?.leave) {
  //       setLeaves((prevLeaves) =>
  //         prevLeaves.map((leave) =>
  //           leave._id === id
  //             ? response.data.leave
  //             : leave
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     console.log("Status Update Error:", err);
  //     // Rollback UI if API fails
  //     setLeaves(previousLeaves);
  //     alert(
  //       err.response?.data?.msg ||
  //       err.response?.data?.message ||
  //       "Failed to update leave status."
  //     );
  //   }
  // };

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
    // {
    //   name: "Leave Dates",
    //   cell: row => (
    //     <div className="max-h-16 overflow-y-auto flex flex-wrap gap-1">
    //       {row.leaveDates?.map((d, i) => (
    //         <span
    //           key={i}
    //           className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs"
    //         >
    //           {d.date} (
    //           {d.dayType === "Full Day"
    //             ? "FD"
    //             : d.dayType === "1st Half Day"
    //               ? "FH"
    //               : "SH"}
    //           )
    //         </span>
    //       ))}
    //     </div>
    //   ),
    //   width: "250px",
    //   grow: 2,
    // },
    {
      name: "Leave Dates",
      width: "250px",
      grow: 2,
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto py-1">
          {row.leaveDates?.map((d, i) => (
            <span
              key={i}
              className="
            inline-flex items-center
            bg-cyan-50
            text-cyan-700
            border border-cyan-100
            px-2 py-1
            rounded-md
            text-xs
            font-medium
          "
            >
              {d.date}
              <span className="ml-1 text-cyan-500">
                (
                {d.dayType === "Full Day"
                  ? "FD"
                  : d.dayType === "1st Half Day"
                    ? "FH"
                    : "SH"}
                )
              </span>
            </span>
          ))}
        </div>
      ),
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
      width: "120px",
      center: true,
      cell: (row) => {
        const statusStyles = {
          Approved:
            "bg-green-100 text-green-700 border border-green-200",
          Rejected:
            "bg-red-100 text-red-700 border border-red-200",
          Pending:
            "bg-yellow-100 text-yellow-700 border border-yellow-200",
        };

        return (
          <span
            className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold
          ${statusStyles[row.status] || "bg-gray-100 text-gray-600"}
        `}
          >
            {row.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      width: "150px",
      center: true,
      cell: (row) => {
        const canApprove = hasPermission("Leave", "edit");
        return (
          <div className="flex items-center justify-center gap-2">
            {/* APPROVE */}

            {/* APPROVE */}
            <button
              type="button"
              title="Approve Leave"
              aria-label="Approve Leave"
              disabled={!canApprove}
              onClick={() => handleStatus(row._id, "Approved")}
              className={`
              w-9 h-9
              flex items-center justify-center
              rounded-lg
              transition-all duration-200
              ${row.status === "Approved"
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white"
                          }
              ${!canApprove
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                          }
            `}
            >
              <FaCheck size={14} />
            </button>

            {/* REJECT */}
            <button
              type="button"
              title="Reject Leave"
              aria-label="Reject Leave"
              disabled={!canApprove}
              onClick={() => handleStatus(row._id, "Rejected")}
              className={`
                w-9 h-9
                flex items-center justify-center
                rounded-lg
                transition-all duration-200
                ${row.status === "Rejected"
                              ? "bg-red-600 text-white shadow-sm"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                            }
                ${!canApprove
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                            }
              `}
            >
              <FaTimes size={14} />
            </button>
            {/* <button
              type="button"
              title={
                row.status === "Approved"
                  ? "Leave is already Approved"
                  : "Approve Leave"
              }
              aria-label="Approve Leave"
              disabled={!canApprove}
              onClick={() => handleStatus(row._id, "Approved")}
              className={`
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            transition-all duration-200
            ${row.status === "Approved"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white"
                }
            ${!canApprove
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
                }
          `}
            >
              <FaCheck size={14} />
            </button>
            {/* REJECT */}
            {/* <button
              type="button"
              title={
                row.status === "Rejected"
                  ? "Leave is already Rejected"
                  : "Reject Leave"
              }
              aria-label="Reject Leave"
              disabled={!canApprove}
              onClick={() => handleStatus(row._id, "Rejected")}
              className={`w-9 h-9 flex items-center justify-center rounded-lg
                transition-all duration-200
            ${row.status === "Rejected"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                }
            ${!canApprove
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
                }
          `}>
              <FaTimes size={14} />
            </button> */} 

          </div>

        );
      },
    },


    // {
    //   name: "Action",
    //   cell: (row) => {
    //     const canApprove =
    //       hasPermission(
    //         "Leave",
    //         "edit"
    //       );
    //     return (
    //       <div className="flex gap-2">
    //         <button
    //           onClick={() => {
    //             if (!canApprove) {
    //               alert(
    //                 "You are not permitted to approve leave"
    //               );
    //               return;
    //             }
    //             handleStatus(
    //               row._id,
    //               "Approved"
    //             );
    //             alert(
    //               "Approved successfully"
    //             );
    //           }}
    //           className={`px-2 py-1 rounded text-white ${canApprove
    //             ? "bg-green-500"
    //             : "bg-gray-400 cursor-not-allowed"
    //             }`}
    //         >
    //           Approve
    //         </button>
    //         <button
    //           onClick={() => {
    //             if (!canApprove) {
    //               alert(
    //                 "You are not permitted to reject leave"
    //               );
    //               return;
    //             }
    //             handleStatus(
    //               row._id,
    //               "Rejected"
    //             );
    //             alert(
    //               "Rejected successfully"
    //             );
    //           }}
    //           className={`px-2 py-1 rounded text-white ${canApprove
    //             ? "bg-red-500"
    //             : "bg-gray-400 cursor-not-allowed"
    //             }`}
    //         >
    //           Reject
    //         </button>
    //       </div>
    //     );
    //   },
    // }
  ];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-semibold text-gray-800">
          Leave Management
        </h2>
        {/* {user?.role !== "ADMIN" && (
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
        )} */}
        <div className="flex gap-2">

          {hasPermission("Leave", "create") && (
            <button
              onClick={() => navigate("/leave/apply")}
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
          {/* <DataTable
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
          /> */}
          <DataTable
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
            noDataComponent={
              <div className="py-8 text-gray-500">
                No leave records found.
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}