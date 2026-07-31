import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { getEmployees, deleteEmployee, updateEmployeeStatus } from "../api";
import ViewEmployeeModal from "../components/ViewEmployeeModal";
// import EditEmployeeModal from "../components/EditEmployeeModal";
import { useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import { Tooltip } from "react-tooltip";
// import { hasPermission } from "../utils/hasPermission";
import { checkAccess } from "../utils/checkAccess";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [search, setSearch] = useState("");
  // const [editModal, setEditModal] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"));
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      console.log(res.data);
      setEmployees(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };
  // Handle change
  const handleStatusChange = async (employee_code, status) => {
    try {
      await updateEmployeeStatus(employee_code, { status });

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };
  // Will fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);
  const filteredEmployees = employees.filter((emp) => {
    return (
      `${emp.firstName || ""} ${emp.lastName || ""}`
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      emp.officialEmail?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.departmentName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      emp.designation?.designationName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const columns = [
    {
      name: "Employee ID",
      selector: (row) => row.employee_code,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) =>
        `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-",
      sortable: true,
    },
    {
      name: "Email",
      cell: (row) => (
        <>
          <div
            data-tooltip-id={`email-${row._id}`}
            data-tooltip-content={row.officialEmail}
            className="max-w-[180px] cursor-pointer overflow-hidden truncate whitespace-nowrap text-[11px] text-[#344054]"
          >
            {row.officialEmail || row.personalEmail || "-"}
          </div>

          <Tooltip id={`email-${row._id}`} />
        </>
      ),
      // sortable: true,
      grow: 2,
    },

    // {
    //   name: "Contact",
    //   cell: row => (
    //     <div
    //       data-tooltip-id="email-tooltip"
    //       data-tooltip-content={row.contact}
    //       className="max-w-[100px] truncate whitespace-nowrap overflow-hidden cursor-pointer"
    //     >
    //       {row.contact}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Mobile",
      cell: (row) => (
        <div className="max-w-[100px] cursor-pointer overflow-hidden truncate whitespace-nowrap text-[11px] text-[#475467]">
          {row.mobile || "-"}
        </div>
      ),
      // sortable: true,
    },
    {
      name: "Department",
      cell: (row) => (
        <div
          title={row.department?.departmentName || ""}
          className="max-w-[120px] overflow-hidden truncate whitespace-nowrap text-[11px] text-[#475467]"
        >
          {row.department?.departmentName || "-"}
        </div>
      ),
      // sortable: true,
    },
    {
      name: "Designation",
      cell: (row) => (
        <div
          title={row.designation?.designationName || ""}
          className="max-w-[120px] overflow-hidden truncate whitespace-nowrap text-[11px] text-[#475467]"
        >
          {row.designation?.designationName || "-"}
        </div>
      ),
      // sortable: true,
    },
    {
      name: "Joining Date",
      cell: (row) =>
        row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : "-",
      // sortable: true,
    },

    // My status
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() =>
            handleStatusChange(
              row.employee_code,
              row.status === "Active" ? "Inactive" : "Active"
            )
          }
          className={`cursor-pointer rounded-full px-3 py-1 text-[10px] font-semibold text-white transition-all duration-200 ${
            row.status === "Active"
              ? "bg-[#0392a1] hover:bg-[#027d89]"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {row.status}
        </button>
      ),
    },

    {
      name: "Action",
      width: "150px",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {/* VIEW */}
          <button
            onClick={() => {
              setSelectedEmployee(row);
              setViewModal(true);
            }}
            className="rounded-[5px] border border-[#cfd7e2] bg-[#f8fafc] px-2.5 py-1.5 text-[10px] font-semibold text-[#344054] transition-all duration-200 hover:border-[#0392a1] hover:bg-[#eefafb] hover:text-[#027d89]"
          >
            View
          </button>
          {/* EDIT */}
          <button
            onClick={() => {
              checkAccess("Employee", "edit", () => {
                navigate(`/employees/edit/${row.employee_code}`);
              });
            }}
            className="flex items-center justify-center rounded-[5px] bg-[#0392a1] p-2 text-white transition-all duration-200 hover:bg-[#027d89]"
          >
            <MdEditSquare />
          </button>
        </div>
      ),
    },
  ];
  // const handleDelete = async (employee_code) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this employee?"
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     await deleteEmployee(employee_code);

  //     fetchEmployees();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <div className="h-full w-full bg-[#eef1f5] p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#101828]">
          Employee Management
        </h2>
      </div>

      {/* 
        {
          hasPermission(
            "Employee",
            "create"
          ) && (
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              + Add Employee
            </button>
          )} 
      */}

      {/* 
      <AddEmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refresh={fetchEmployees}
      /> 
      */}

      <div className="w-full overflow-hidden rounded-[10px] border border-[#dfe5ec] bg-white p-4 shadow-sm">
        {/* SEARCH */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#98a2b3]" />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[36px] w-full rounded-[6px] border border-[#cfd7e2] bg-white pl-9 pr-3 text-[11px] text-[#344054] outline-none placeholder:text-[#98a2b3] transition-all duration-200 focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="user-table w-full overflow-x-auto border-0">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            pagination
            highlightOnHover
            responsive
            striped
            persistTableHead
            dense
            sortIcon={<span style={{ fontSize: "14px" }}>↕</span>}
          />

          <Tooltip id="email-tooltip" />
        </div>
      </div>

      <ViewEmployeeModal
        employee={viewModal ? selectedEmployee : null}
        onClose={() => setViewModal(false)}
      />

      {/* <EditEmployeeModal
        isOpen={editModal}
        employee={selectedEmployee}
        onClose={() => setEditModal(false)}
        refresh={fetchEmployees}
      /> */}
    </div>
  );
}





























