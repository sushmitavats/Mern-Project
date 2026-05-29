import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, changeUserStatus, } from "../api";
import UserModal from "../components/UserModel";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaSearch, } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
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
    fetchUsers();
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
  // SEARCH FILTER
  const filteredUsers = users.filter((user) => {

    return (
      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      user.employee_code
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      user.department
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  });

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
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      grow: 1,
    },

    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
      grow: 1,
    },

    {
      name: "Status",

      cell: (row) => (

        <button
          onClick={() =>
            handleStatus(row._id)
          }
          className={`px-4 py-1 rounded-full text-white text-sm font-medium ${row.status === "Active"
              ? "bg-green-500"
              : "bg-red-500"
            }`}
        >
          {row.status}
        </button>
      ),
    },

    {
      name: "Action",

      cell: (row) => (

        <div className="flex gap-2">

          <button
            onClick={() =>
              handleEdit(row)
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow"
          >
            <FaEdit />
          </button>

          <button
            onClick={() =>
              handleDelete(row._id)
            }
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow"
          >
            <FaTrash />
          </button>
          <button
            onClick={() =>
              addEarnLeave(row._id)
            }
          >
            Add EL
          </button>

          <button
            onClick={() =>
              addFloatingLeave(row._id)
            }
          >
            Add FL
          </button>


        </div>
      ),
    },
  ];

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>

        <button
          onClick={() => {

            setEditData(null);

            setShowModal(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
        >
          Add New User
        </button>

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

