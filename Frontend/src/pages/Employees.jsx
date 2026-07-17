import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, } from "react-icons/fa";
import { getEmployees, deleteEmployee, updateEmployeeStatus } from "../api";
import ViewEmployeeModal from "../components/ViewEmployeeModal";
// import EditEmployeeModal from "../components/EditEmployeeModal";
import { useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { hasPermission } from "../utils/hasPermission";
import { checkAccess } from "../utils/checkAccess"

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [search, setSearch] = useState("");
  // const [editModal,setEditModal] =useState(false);
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
  // handle change 
  const handleStatusChange = async (
    employee_code,
    status
  ) => {
    try {
      await updateEmployeeStatus(
        employee_code,
        { status }
      );
      fetchEmployees();
    }
    catch (err) {
      console.log(err);
    }
  };
  //will fetchEmployees
  useEffect(() => {
    fetchEmployees();
  }, []);
  const filteredEmployees = employees.filter((emp) => {

    return (
      `${emp.firstName || ""} ${emp.lastName || ""}`?.toLowerCase().includes(search.toLowerCase()) ||
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
      selector: row => row.employee_code,
      sortable: true,
    },
    {
      name: "Name",
      selector: row => `${row.firstName || ""} ${row.lastName || ""}` .trim() || "-",
      sortable: true,
    },
    {
      name: "Email",
      cell: row => (
        <>
          <div
            data-tooltip-id={`email-${row._id}`}
            data-tooltip-content={row.officialEmail}
            className="max-w-[180px] truncate whitespace-nowrap overflow-hidden cursor-pointer"
          >
            {row.officialEmail || row.personalEmail || "-"}
          </div>

          <Tooltip id={`email-${row._id}`} />
        </>
      ),
      sortable: true,
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
      cell: row => (
        <div
          className="max-w-[100px] truncate whitespace-nowrap overflow-hidden"
        >
          {row.mobile || "-"}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Department",
      cell: row => (
        <div
          title={
            row.department?.departmentName || ""
          }
          className="max-w-[120px] truncate whitespace-nowrap overflow-hidden"
        >
          {
            row.department?.departmentName || "-"
          }
        </div>
      ),
      sortable: true,
    },
    {
      name: "Designation",
      cell: row => (
        <div
          title={row.designation?.designationName || ""}
          className="max-w-[120px] truncate whitespace-nowrap overflow-hidden"
        >
          {row.designation?.designationName || "-"}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Joining Date",
      cell: row => (
        row.joiningDate
          ? new Date(row.joiningDate).toLocaleDateString()
          : "-"
      ),
      sortable: true,
    },
    //my status
    {
      name: "Status",
      cell: row => (
        <button
          onClick={() =>
            handleStatusChange(
              row.employee_code,
              row.status === "Active"
                ? "Inactive"
                : "Active"
            )
          }
          className={`px-3 py-1 rounded-full text-white text-xs cursor-pointer ${row.status === "Active"
            ? "bg-green-600 hover:bg-green-700"
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
      cell: row => (
        <div className="flex items-center gap-1">
          {/* VIEW */}
          <button
            onClick={() => {
              setSelectedEmployee(row);
              setViewModal(true);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded-md"
          >
            View
          </button>

          {/* EDIT */}
          <button
            onClick={() => {
              checkAccess(
                "Employee",
                "edit",
                () => {
                  navigate(
                      `/employees/edit/${row.employee_code}`
                  )
                }
              )
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center"
          >
            <MdEditSquare />
          </button>
        </div >
      ),
    }
  ];

  const handleDelete = async (employee_code) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;
    try {
      await deleteEmployee(employee_code);

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="p-6 bg-gray-100 h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">
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
          )} */}

      {/* 
      <AddEmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refresh={fetchEmployees}
      /> */}
      <div className="bg-white rounded-2xl shadow-md border p-4 w-full">
        {/* SEARCH */}
        <div className="flex justify-between items-center mb-3">
          <div className="relative w-56">
            <FaSearch className="absolute top-3 left-3 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        {/* TABLE */}
        <div className="user-table border-0 overflow-x-auto" >
          <DataTable
            columns={columns}
            data={filteredEmployees}
            pagination
            highlightOnHover
            responsive
            striped
            persistTableHead
            dense
            sortIcon={
              <span style={{ fontSize: "14px" }}>
                ↕
              </span>
            }
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
