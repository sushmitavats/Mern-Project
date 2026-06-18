import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";

import {
  getDesignations,
  deleteDesignation,
} from "../api";

import DesignationModal from "../components/DesignationModal";

export default function Designation() {
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchDesignations = async () => {
    try {
      const res = await getDesignations();
      setDesignations(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const filtered = designations.filter((item) =>
    item.designationName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this designation?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDesignation(id);
      fetchDesignations();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      name: "Code",
      selector: (row) => row.designationCode,
      sortable: true,
      width: "180px",
    },

    {
      name: "Designation",
      selector: (row) => row.designationName,
      sortable: true,
      grow: 2,
    },


    {
      name: "Department",
      selector: (row) =>
        row.department?.departmentName || "-",
      sortable: true,
      grow: 2,
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
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
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
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        overflow: "hidden",
      },
    },

    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #d1d5db",
        minHeight: "55px",
      },
    },

    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "14px",
        borderRight: "1px solid #d1d5db",
      },
    },

    rows: {
      style: {
        minHeight: "55px",
        borderBottom: "1px solid #e5e7eb",
      },
    },

    cells: {
      style: {
        borderRight: "1px solid #e5e7eb",
      },
    },
  };

  return (
    <div className="w-full">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold text-gray-800">
          Designation Management
        </h2>

        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Designation
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-md border p-4">

        <div className="relative w-56 mb-4">

          <FaSearch className="absolute top-3 left-3 text-gray-400 text-sm" />

          <input
            type="text"
            placeholder="Search designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
          />

        </div>

        <DataTable
          columns={columns}
          data={filtered}
          pagination
          responsive
          highlightOnHover
          customStyles={customStyles}
          noDataComponent={
            <div className="h-20 flex items-center justify-center text-gray-500">
              There are no records to display
            </div>
          }
        />

      </div>

      <DesignationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refresh={fetchDesignations}
        editData={editData}
      />
    </div>
  );
}























// import {
//   useEffect,
//   useState,
// } from "react";

// import DataTable from "react-data-table-component";

// import { FaSearch } from "react-icons/fa";

// import {
//   getDesignations,
//   deleteDesignation,
// } from "../api";

// import DesignationModal from "../components/DesignationModal";

// export default function Designation() {
//   const [
//     designations,
//     setDesignations,
//   ] = useState([]);

//   const [search, setSearch] =
//     useState("");

//   const [openModal, setOpenModal] =
//     useState(false);

//   const [editData, setEditData] =
//     useState(null);

//   const fetchDesignations =
//     async () => {
//       const res =
//         await getDesignations();

//       setDesignations(
//         res.data
//       );
//     };

//   useEffect(() => {
//     fetchDesignations();
//   }, []);

//   const filtered =
//     designations.filter((d) =>
//       d.designationName
//         .toLowerCase()
//         .includes(
//           search.toLowerCase()
//         )
//     );

//   const columns = [
//     {
//       name: "Code",
//       selector: (row) =>
//         row.designationCode,
//     },

//     {
//       name: "Designation",
//       selector: (row) =>
//         row.designationName,
//     },

//     {
//       name: "Department",
//       selector: (row) =>
//         row.department
//           ?.departmentName,
//     },

//     {
//       name: "Description",
//       selector: (row) =>
//         row.description,
//     },

//     {
//       name: "Status",
//       selector: (row) =>
//         row.status,
//     },

//     {
//       name: "Created Date",
//       cell: (row) =>
//         new Date(
//           row.createdAt
//         ).toLocaleDateString(),
//     },

//     {
//       name: "Action",

//       cell: (row) => (
//         <div className="flex gap-2">
//           <button
//             className="bg-blue-500 text-white px-3 py-1 rounded"
//             onClick={() => {
//               setEditData(row);
//               setOpenModal(true);
//             }}
//           >
//             Edit
//           </button>

//           <button
//             className="bg-red-500 text-white px-3 py-1 rounded"
//             onClick={async () => {
//               await deleteDesignation(
//                 row._id
//               );

//               fetchDesignations();
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="w-full">

//       <div className="flex justify-between mb-5">

//         <h2 className="text-2xl font-bold">
//           Designation Management
//         </h2>

//         <button
//           className="bg-cyan-500 text-white px-5 py-2 rounded"
//           onClick={() => {
//             setEditData(null);
//             setOpenModal(true);
//           }}
//         >
//           Add Designation
//         </button>

//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">

//         <div className="relative w-64 mb-4">

//           <FaSearch className="absolute left-3 top-3 text-gray-400" />

//           <input
//             type="text"
//             placeholder="Search"
//             value={search}
//             onChange={(e) =>
//               setSearch(
//                 e.target.value
//               )
//             }
//             className="border rounded-lg pl-10 py-2 w-full"
//           />

//         </div>

//         <DataTable
//           columns={columns}
//           data={filtered}
//           pagination
//           responsive
//           striped
//         />

//       </div>

//       <DesignationModal
//         isOpen={openModal}
//         onClose={() =>
//           setOpenModal(false)
//         }
//         refresh={
//           fetchDesignations
//         }
//         editData={editData}
//       />

//     </div>
//   );
// }