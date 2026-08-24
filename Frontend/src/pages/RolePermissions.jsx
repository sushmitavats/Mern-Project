import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import PermissionModal from "../components/PermissionModal";
import { getPermissions, deletePermission } from "../api";

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

      alert(error.response?.data?.message || "Error fetching permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this permission?"
    );

    if (!confirmDelete) return;

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

    const department =
      item.department?.departmentName?.toLowerCase() || "";

    const designation =
      item.designation?.designationName?.toLowerCase() || "";

    const employee =
      item.employeeData?.employee_code?.toLowerCase() || "";

    return (
      department.includes(search.toLowerCase()) ||
      designation.includes(search.toLowerCase()) ||
      employee.includes(search.toLowerCase())
    );
  });

  // Table
  const columns = [
    {
      name: "ID",
      cell: (row, index) => index + 1,
      width: "80px",
    },

    {
      name: "Department",
      selector: (row) => row.department?.departmentName || "-",
      sortable: true,
    },

    {
      name: "Designation",
      selector: (row) => row.designation?.designationName || "-",
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
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.permissions?.map((perm, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-[4px] border border-[#bde3e7] bg-[#eefafb] px-2 py-1 text-[10px] font-semibold text-[#027d89]"
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
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      width: "130px",
    },

    {
      name: "Action",
      width: "220px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // setSelectedRole(row);
              setSelectedPermission(row);
              setOpen(true);
            }}
            className="rounded-[5px] border border-[#e5b83d] bg-[#fff8e1] px-3 py-1.5 text-[10px] font-semibold text-[#a87500] transition-all duration-200 hover:bg-[#ffefb8]"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-[5px] border border-[#f1b4b4] bg-[#fff1f1] px-3 py-1.5 text-[10px] font-semibold text-[#d92d20] transition-all duration-200 hover:bg-[#ffe1e1]"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        border: "1px solid #dfe5ec",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    },

    tableWrapper: {
      style: {
        display: "block",
        borderRadius: "8px",
        overflow: "hidden",
      },
    },

    headRow: {
      style: {
        backgroundColor: "#f7f9fb",
        borderBottom: "1px solid #dfe5ec",
        minHeight: "48px",
      },
    },

    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "11px",
        color: "#344054",
        textTransform: "none",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },

    cells: {
      style: {
        fontSize: "11px",
        color: "#475467",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "10px",
        paddingBottom: "10px",
      },
    },

    rows: {
      style: {
        minHeight: "54px",
        borderBottom: "1px solid #eef1f4",
        backgroundColor: "#ffffff",
        transition: "background-color 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#f5fbfc",
        borderBottomColor: "#d6eef0",
        outline: "none",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #eef1f4",
        minHeight: "52px",
        fontSize: "11px",
        color: "#667085",
      },
    },
  };

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <div className="rounded-[10px] border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#101828]">
              Permission Management
            </h2>

            <p className="mt-1 text-[11px] text-[#667085]">
              Manage Roles, Designations, Employees and Permissions
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPermission(null);
              setOpen(true);
            }}
            className="rounded-[6px] bg-[#0392a1] px-4 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-[#027d89] focus:outline-none focus:ring-2 focus:ring-[#0392a1]/20"
          >
            + Add Permission
          </button>
        </div>

        <div className="relative mb-4 w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#98a2b3]" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[35px] w-full rounded-[6px] border border-[#cfd7e2] px-3 pl-9 py-2 text-[11px] text-[#344054] outline-none placeholder:text-[#98a2b3] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20"
          />
        </div>

        <div className="user-table overflow-x-auto border-0">
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
              <div className="py-5 text-[12px] text-[#667085]">
                No Permissions Found
              </div>
            }
          />
        </div>
      </div>

      {open && (
        <PermissionModal
          selectedPermission={selectedPermission}
          onClose={() => {
            setOpen(false);
            fetchPermissions();
          }}
        />
      )}
    </div>
  );
};

export default RolePermissions;