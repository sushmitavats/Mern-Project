import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import {getDepartments,deleteDepartment,} from "../api";
import DepartmentModal from "../components/DepartmentModal";
import { hasPermission }
from "../utils/hasPermission";

export default function Department() {
  const [departments,setDepartments] = useState([]);
  const [search,setSearch] = useState("");
  const [openModal,setOpenModal] = useState(false);
  const [editData,setEditData] =useState(null);

  const fetchDepartments =
    async () => {
      try {
        const res =
          await getDepartments();

        setDepartments(
          res.data
        );
      } catch (err) {
        console.log(err);
      }
    };
  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments =
    departments.filter(
      (dept) =>
        dept.departmentName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const columns = [
    {
      name: "ID",

      selector: (row) =>
        row.departmentId,

      sortable: true,

      width: "120px",
    },

    {
      name: "Department",

      selector: (row) =>
        row.departmentName,

      sortable: true,
    },

    {
      name: "Action",

      width: "220px",

      cell: (row) => (

        <div className="flex gap-2">

          <button
            onClick={() => {
              setEditData(row);
              setOpenModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={async () => {

              const confirmDelete =
                window.confirm(
                  "Delete Department?"
                );

              if (!confirmDelete)
                return;

              await deleteDepartment(
                row._id
              );

              fetchDepartments();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Delete
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      <div className="w-full flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Department Management
        </h2>
        {
        hasPermission(
             "Department",
              "create"
              ) && (

        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded"
        >
          + Add Department
        </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative w-64 mb-4">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Department"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>
        <div className="user-table border-0 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredDepartments}
          pagination
          highlightOnHover
          striped
          responsive
        />
        </div>
      </div>
      <DepartmentModal
        isOpen={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        refresh={fetchDepartments}
        editData={editData}
      />

    </div>
  );
}
























