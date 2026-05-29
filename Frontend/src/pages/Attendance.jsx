import { useEffect, useState, useRef } from "react";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";

import { getAttendance, saveAttendance } from "../api";

export default function Attendance() {
  const [data, setData] = useState([]);

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await getAttendance();
      setData(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
//  useEffect(() => {

//   if (!tableRef.current) return;
//   if (data.length === 0) return;
//   if (dataTableRef.current) {
//     dataTableRef.current.destroy();
//     dataTableRef.current = null;
//   }

//   const timer = setTimeout(() => {

//     dataTableRef.current =
//       new DataTable(tableRef.current, {
//         searchable: true,
//         sortable: true,
//         paging: true,

//         perPage: 5,

//         perPageSelect: [5, 10, 15, 20],

//         fixedHeight: false,

//         labels: {
//           placeholder:
//             "Search attendance...",

//           perPage:
//             "entries per page",

//           noRows:
//             "No attendance found",
//           info:
//             "Showing {start} to {end} of {rows} entries",
//         },
//       });

//   }, 0);

//   return () => {

//     clearTimeout(timer);

//     if (dataTableRef.current) {

//       dataTableRef.current.destroy();

//       dataTableRef.current = null;
//     }
//   };

// }, []);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

 
  const handleSave = async (row) => {
    try {
      await saveAttendance(row);
await fetchData();
alert("Saved Successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save");
    }
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl  font-semibold  text-gray-800">
          Employee Attendance
        </h2>
      </div>

   
      <div className="bg-white rounded-xl shadow-md p-2">
        <table
  ref={tableRef}
  className="min-w-full border border-gray-300"
>

  <thead className="bg-gray-100">

    <tr>

      <th className="border border-gray-300 px-4 py-3 text-left">
        Emp ID
      </th>

      <th className="border border-gray-300 px-4 py-3 text-left">
        Name
      </th>

      <th className="border border-gray-300 px-4 py-3 text-left">
        In Time
      </th>

      <th className="border border-gray-300 px-4 py-3 text-left">
        Out Time
      </th>

      <th className="border border-gray-300 px-4 py-3 text-left">
        Action
      </th>

    </tr>

  </thead>

  <tbody>

    {data.map((emp, index) => (

      <tr
        key={emp.employee_code}
        className="hover:bg-gray-50"
      >

        <td className="border border-gray-300 px-4 py-3">
          {emp.employee_code}
        </td>

        <td className="border border-gray-300 px-4 py-3">
          {emp.name}
        </td>

        <td className="border border-gray-300 px-4 py-3">

          <input
            type="time"
            value={emp.inTime || ""}
            onChange={(e) =>
              handleChange(
                index,
                "inTime",
                e.target.value
              )
            }
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />

        </td>

        <td className="border border-gray-300 px-4 py-3">

          <input
            type="time"
            value={emp.outTime || ""}
            onChange={(e) =>
              handleChange(
                index,
                "outTime",
                e.target.value
              )
            }
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />

        </td>

        <td className="border border-gray-300 px-4 py-3">

          <button
            onClick={() => handleSave(emp)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>

      
         

      </div>
    </div>
  );
}









