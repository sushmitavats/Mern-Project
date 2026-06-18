import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import {getDepartments,deleteDepartment,} from "../api";
import DepartmentModal from "../components/DepartmentModal";

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

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Department Management
        </h2>

        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded"
        >
          + Add Department
        </button>

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

        <DataTable
          columns={columns}
          data={filteredDepartments}
          pagination
          highlightOnHover
          striped
          responsive
        />

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
























// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { FaSearch, } from "react-icons/fa";
// import { getEmployees, deleteEmployee } from "../api";
// import AddEmployeeModal from "../components/AddEmployee";
// import ViewEmployeeModal from "../components/ViewEmployeeModal";
// import EditEmployeeModal from "../components/EditEmployeeModal";
// import { MdDelete } from "react-icons/md";
// import { MdEditSquare } from "react-icons/md";
// import { Tooltip } from "react-tooltip";

// export default function Department() {
//   const [employees, setEmployees] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [search, setSearch] = useState("");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const fetchEmployees = async () => {
//     try {
//       const res = await getEmployees();
//       console.log(res.data);

//       setEmployees(res.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);
//   const filteredEmployees = employees.filter((emp) => {

//     return (

//       emp.name?.toLowerCase().includes(search.toLowerCase()) ||
//       emp.email?.toLowerCase().includes(search.toLowerCase()) ||
//       emp.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
//       emp.department?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   const columns = [

//     {
//       name: "Employee ID",
//       selector: row => row.employee_code,
//       sortable: true,
//     },

//     {
//       name: "Name",
//       selector: row => row.name,
//       sortable: true,
//     },
// {
//   name: "Email",

//   cell: row => (
//     <>
//       <div
//         data-tooltip-id={`email-${row._id}`}
//         data-tooltip-content={row.email}
//         className="max-w-[180px] truncate whitespace-nowrap overflow-hidden cursor-pointer"
//       >
//         {row.email}
//       </div>

//       <Tooltip id={`email-${row._id}`} />
//     </>
//   ),

//   sortable: true,
//   grow: 2,
// },
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
//   {
//   name: "Department",

//   cell: row => (

//     <div
//       title={row.department}
//       className="max-w-[120px] truncate whitespace-nowrap overflow-hidden"
//     >
//       {row.department}
//     </div>

//   ),

//   sortable: true,
// },

// {
//   name: "Designation",

//   cell: row => (

//     <div
//       title={row.designation}
//       className="max-w-[120px] truncate whitespace-nowrap overflow-hidden"
//     >
//       {row.designation}
//     </div>

//   ),

//   sortable: true,
// },
//     {
//       name: "Joining Date",

//       cell: row => (
//         row.joiningDate
//           ? new Date(row.joiningDate).toLocaleDateString()
//           : "-"
//       ),

//       sortable: true,
//     },

//     {
//       name: "Status",

//       cell: row => (

//         <span
//           className={`px-3 py-1 rounded-full text-white text-xs ${row.status === "Active"
//             ? "bg-green-600"
//             : "bg-red-500"
//             }`}
//         >
//           {row.status}
//         </span>

//       ),
//     },

//     {
//       name: "Action",
//       width: "150px",

//       cell: row => (

//         <div className="flex items-center gap-1">

//           {/* VIEW */}
//           <button
//             onClick={() => {
//               setSelectedEmployee(row);
//               setViewModal(true);
//             }}
//             className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded-md"
//           >
//             View
//           </button>

//           {/* EDIT */}
//           <button
//             onClick={() => {
//               setSelectedEmployee(row);
//               setEditModal(true);
//             }}
//             className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center"
//           >
//             <MdEditSquare size={14} />
//           </button>

//           {/* DELETE */}
//           <button
//             onClick={() =>
//               handleDelete(row.employee_code)
//             }
//             className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center"
//           >
//             <MdDelete size={14} />
//           </button>

//         </div>
//       ),
//     }
//   ];


//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this employee?"
//     );

//     if (!confirmDelete) return;
//     try {
//       await deleteEmployee(id);

//       fetchEmployees();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Employee Management
//         </h2>

//         {(user.role === "HR" || user.role == 'ADMIN') && (
//           <button
//             onClick={() => setOpenModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
//           >
//             + Add Employee
//           </button>
//         )}
//       </div>

//       <AddEmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         refresh={fetchEmployees}
//       />
//         <div className="bg-white rounded-2xl shadow-md border p-4">

//           {/* SEARCH */}
//           <div className="flex justify-between items-center mb-3">

//             <div className="relative w-56">

//               <FaSearch className="absolute top-3 left-3 text-gray-400 text-sm" />

//               <input
//                 type="text"
//                 placeholder="Search employee..."
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
//               />

//             </div>

//           </div>

//           {/* TABLE */}
//           <div className="user-table border-0 overflow-x-auto">

//             <DataTable
//               columns={columns}
//               data={filteredEmployees}
//               pagination
//               highlightOnHover
//               responsive
//               striped
//               persistTableHead
//               dense
//               sortIcon={
//                 <span style={{ fontSize: "14px" }}>
//                   ↕
//                 </span>
//               }
              
//             />
//             <Tooltip id="email-tooltip" />
//           </div>

//         </div>
     
//       <ViewEmployeeModal
//         employee={viewModal ? selectedEmployee : null}
//         onClose={() => setViewModal(false)}
//       />
//       <EditEmployeeModal
//         isOpen={editModal}
//         employee={selectedEmployee}
//         onClose={() => setEditModal(false)}
//         refresh={fetchEmployees}
//       />
//     </div>
//   );
// }