import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, changeUserStatus, monthlyEarnLeave, grantFloatingLeave, } from "../api";
import UserModal from "../components/UserModel";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaSearch, } from "react-icons/fa";
import { hasPermission } from "../utils/hasPermission";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [isLastDay, setIsLastDay] = useState(false);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (hasPermission("Usermanagement", "view")) {
      fetchUsers();
    }
  }, []);
  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };
  // EDIT
  const handleEdit = (user) => {
    setEditData(user);
    setShowModal(true);
  };
  // STATUS
  const handleStatus = async (id) => {
    try {
      await changeUserStatus(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const today = new Date();
    const lastDay =
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    setIsLastDay(today.getDate() === lastDay);
  }, []);
  const handleMonthlyEL = async () => {
    try {
      await monthlyEarnLeave();
      await fetchUsers();
      alert("Monthly Earn Leave credited successfully.");
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };
  const handleFL = async () => {
    try {
      await grantFloatingLeave();
      await fetchUsers();
      alert("6-month Floating Leave cycle completed successfully.");
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };
  const filteredUsers =
    users.filter(user => {
      return (
        user.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
        ||
        user.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
        ||
        user.employee_code
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
        ||
        user.department
          ?.departmentName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
    })
  // TABLE COLUMNS
  const columns = [
    {
      name: "Employee Code",
      selector: (row) => row.employee_code,
      sortable: true,
      grow: 1,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Department",
      // selector: (row) =>
      //   row.department || "-",
      selector: (row) =>
        row.department
          ?.departmentName || "-",
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) =>
        row.designation
          ?.designationName || "-",
      sortable: true,
    },
    {
      name: "EL",
      selector: (row) =>
        row.earnLeave || 0,
      sortable: true,
    },

    {
      name: "FL",
      selector: (row) =>
        row.floatingLeave || 0,
      sortable: true,
    },
    {
      name: "Status",
      cell: row => {
        const canEdit =
          hasPermission(
            "Usermanagement",
            "edit"
          );
        return (
          <button
            onClick={() => {
              if (!canEdit) {
                alert(
                  "You are not permitted to change status"
                );
                return;
              }
              handleStatus(
                row._id
              );
            }}
            className={`px-4 py-1 rounded-full text-white text-sm font-medium
          ${row.status === "Active"
                ?
                "bg-green-500"
                :
                "bg-red-500"
              }
          ${!canEdit
                ?
                "opacity-60 cursor-not-allowed"
                :
                ""
              }
          `}
          >
            {row.status}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: row => {
        const canEdit =
          hasPermission(
            "Usermanagement",
            "edit"
          );
        const canDelete =
          hasPermission(
            "Usermanagement",
            "delete"
          );
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!canEdit) {
                  alert(
                    "You are not permitted to edit users"
                  );
                  return;
                }
                handleEdit(
                  row
                );
              }}
              className={`px-3 py-2 rounded-lg text-white shadow
            ${canEdit
                  ?
                  "bg-blue-500 hover:bg-blue-600"
                  :
                  "bg-gray-400 cursor-not-allowed"
                }   
            `}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => {
                if (!canDelete) {
                  alert(
                    "You are not permitted to delete users"
                  );
                  return;
                }
                handleDelete(
                  row._id
                );
              }}
              className={`px-3 py-2 rounded-lg text-white shadow
            ${canDelete
                  ?
                  "bg-red-500 hover:bg-red-600"
                  :
                  "bg-gray-400 cursor-not-allowed"
                }     
            `}
            >
              <FaTrash />
            </button>
          </div>
        );
      }
    }
  ];
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        {
          hasPermission(
            "Usermanagement",
            "create"
          ) && (
            <button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
            >
              Add New User
            </button>
          )
        }
      </div>
      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
        {/* SEARCH */}
        <div className="flex justify-between items-center mb-3">
          <div className="relative w-56">
            <FaSearch className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              disabled={!isLastDay}
              onClick={handleMonthlyEL}
              className={`px-4 py-2 rounded text-white ${isLastDay
                ? "bg-cyan-500"
                : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Add Earn Leave
            </button>
            <button
              onClick={handleFL}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Add Floating Leave
            </button>
          </div>
        </div >
        {/* datable  */}
        <div className="user-table">
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            highlightOnHover
            responsive
            persistTableHead
            sortIcon={
              <span style={{ fontSize: "14px" }}>
                ↕
              </span>
            }
          />
        </div>
      </div>
      {/* MODAL */}
      {showModal && (
        <UserModal
          onClose={() =>
            setShowModal(false)
          }
          fetchUsers={fetchUsers}
          editData={editData}
        />
      )}
    </div>
  );
};
export default UserManagement;

