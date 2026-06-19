import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa"; import PermissionModal from "../components/PermissionModal";
import { getPermissions, deletePermission, } from "../api";

const RolePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [search, setSearch] = useState("");
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await getPermissions();
      setPermissions(res.data.data || []);
      console.log(res);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message
        || "Error fetching permissions");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPermissions();

  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this permission?");
    if (!confirmDelete)
      return;
    try {
      await deletePermission(id);
      fetchPermissions();
      alert("Permission deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };
  const filteredPermissions = permissions.filter((item) => {
    // const role = item.role?.toLowerCase() || "";
    const department = item.department?.departmentName?.toLowerCase() || "";
    const designation = item.designation?.designationName?.toLowerCase() || "";
    const employee =
      item.employeeData?.employee_code?.toLowerCase() || "";
    return (department.includes(search.toLowerCase())
      || designation.includes(search.toLowerCase())
      || employee.includes(search.toLowerCase())
    );
  });

  //table
  const columns = [
    {
      name: "ID",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Department",
      selector: row =>
        row.department
          ?.departmentName || "-",
      sortable: true
    },
    {
      name: "Designation",
      selector: row =>
        row.designation?.designationName || "-",
      sortable: true,
    },
    {
      name: "Employee",
      selector: (row) =>
        row.employeeData
          ? `${row.employeeData.employee_code} - ${row.employeeData.name}`
          : "-",
    },

    {
      name: "Modules",
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {row.permissions?.map((perm, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
            >
              {perm.type}
            </span>
          ))}
        </div>
      ),
      grow: 2,
    },

    {
      name: "Created At",
      cell: row =>
        new Date(row.createdAt).toLocaleDateString(),
      width: "130px",
    },

    {
      name: "Action",
      width: "220px",
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              // setSelectedRole(row);
              setSelectedPermission(row)
              setOpen(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const customStyles =
  {
    table: {
      style: { border: "1px solid #d1d5db", borderRadius: "12px", overflow: "hidden", }
    },
    headRow: {
      style: { backgroundColor: "#f8fafc", borderBottom: "2px solid #d1d5db", minHeight: "55px", },
    },
    headCells: {
      style: { fontWeight: "700", fontSize: "14px", },
    },
    rows: { style: { minHeight: "55px", borderBottom: "1px solid #e5e7eb", }, },
  };



  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-xl shadow-md border p-5">
        <div className="flex justify-between items-center mb-5">
          <div> <h2 className="text-2xl font-bold text-gray-800">
            Permission Management </h2>
            <p className="text-gray-500">
              Manage Roles, Designations, Employees and Permissions </p>
          </div>
          <button onClick={() => { setSelectedPermission(null); setOpen(true); }}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg" >
            + Add Permission </button> </div> <div className="relative w-72 mb-4">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-3 py-2 w-64"
          />

        </div>
        <div className="user-table border-0 overflow-x-auto"> 
        <DataTable
          columns={columns}
          data={filteredPermissions}
          pagination
          responsive
          highlightOnHover
          striped
          persistTableHead
          progressPending={loading}
          noDataComponent={
            <div className="py-5">
              No Permissions Found
            </div>
          }
        />
        </div>

      </div>

      {open &&
        (
          <PermissionModal
            selectedPermission={selectedPermission}
            onClose={() => { setOpen(false); fetchPermissions(); }} />)}
    </div>);
};

export default RolePermissions;


