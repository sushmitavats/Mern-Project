
import React, { useState, useEffect, } from "react";
import { createPermission, updatePermission, } from "../api";
import { getDepartments, getDesignations, getEmployees, } from "../api";
//180
const PermissionModal = ({
  onClose,
  selectedPermission,
}) => {

  const [department, setDepartment] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [employee, setEmployee] =
    useState("");

  const [departments, setDepartments] =
    useState([]);

  const [designations, setDesignations] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const permissionModules = [
    "Employee",
    "Attendance",
    "Leave",
    "Department",
    "Designation",
    "Permission",
    "Role",
  ];

  const [permissions, setPermissions] =
    useState(
      permissionModules.map(
        (module) => ({
          type: module,
          view: false,
          create: false,
          edit: false,
          delete: false,
        })
      )
    );

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {

      const deptRes =
        await getDepartments();

      const desigRes =
        await getDesignations();

      const empRes =
        await getEmployees();

      setDepartments(
        deptRes.data || []
      );

      setDesignations(
        desigRes.data || []
      );

      setEmployees(
        empRes.data || []
      );
    }
    catch (error) {
      console.log(error);
    }
  };

  //  Add dynamic filtering
  const [filteredDesignations,
    setFilteredDesignations]
    = useState([]);

  const [filteredEmployees,
    setFilteredEmployees]
    = useState([]);


  useEffect(() => {

    if (department) {

      const filteredDesig =
        designations.filter((item) =>
            item.department?._id === department
            ||
            item.department === department
        );
      setFilteredDesignations(
        filteredDesig
      );
    }
    else {
      setFilteredDesignations(
        designations
      );
    }
    setDesignation("");
    setEmployee("");
  }, [department, designations]);


  //filter employee
  useEffect(() => {

    let filteredEmp =employees;
    if (department) {
      filteredEmp =
        filteredEmp.filter((emp) =>
            emp.department?._id === department
            ||
            emp.department === department
        );
    }

    if (designation) {

      filteredEmp =
        filteredEmp.filter(
          (emp) =>

            emp.designation?._id === designation
            ||
            emp.designation === designation
        );

    }

    setFilteredEmployees(
      filteredEmp
    );

  }, [
    department,
    designation,
    employees
  ]);

  useEffect(() => {

    if (!selectedPermission)
      return;


    setDepartment(
      selectedPermission?.department?._id || ""
    );

    setDesignation(
      selectedPermission
        ?.designation?._id || ""
    );

    setEmployee(
      selectedPermission
        ?.employee?._id || ""
    );

    if (
      selectedPermission.permissions
    ) {
      setPermissions(
        selectedPermission.permissions
      );
    }

  }, [selectedPermission]);

  const handlePermissionChange = (
    module,
    field
  ) => {

    setPermissions((prev) =>
      prev.map((item) =>
        item.type === module
          ? {
            ...item,
            [field]:
              !item[field],
          }
          : item
      )
    );

  };

  const handleSubmit =
    async () => {

      try {

        const payload = {
          department:
            department || null,
          designation:
            designation || null,
          employee:
            employee || null,
          permissions,
        };

        console.log(payload);

        // if (selectedPermission) {
        //   if (selectedPermission) {
        //     await updatePermission(
        //       selectedPermission._id,
        //       payload
        //     );
        //   } else {
        //     await createPermission(
        //       payload
        //     );
        //   }


        if (selectedPermission) {
          await updatePermission(
            selectedPermission._id,
            payload
          );
        } else {
          await createPermission(
            payload
          );
        }

        alert(
          selectedPermission
            ? "Permission Updated Successfully"
            : "Permission Created Successfully"
        );

        onClose();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
          "Something went wrong"
        );
      }
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-[1100px] rounded-xl shadow-xl">

        <div className="bg-cyan-500 text-white px-5 py-4">
          <h2 className="text-2xl font-semibold">

            {selectedPermission
              ? "Edit Permission"
              : "Add Permission"}

          </h2>
        </div>

        <div className="p-5">

          <div className="grid grid-cols-3 gap-4 mb-5">

            <div>
              <label className="block mb-2 font-medium">
                Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }

                className="w-full border rounded p-3"
              >
                <option value="">
                  Select Department
                </option>

                {departments.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={
                        item._id
                      }
                    >
                      {
                        item.departmentName
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Designation
              </label>

              <select
                value={designation}
                onChange={(e) =>
                  setDesignation(
                    e.target.value
                  )
                }
                className="w-full border rounded p-3"
              >
                <option value="">
                  Select Designation
                </option>

                {filteredDesignations.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={
                        item._id
                      }
                    >
                      {
                        item.designationName
                      }
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Employee
              </label>

              <select
                value={employee}
                onChange={(e) =>
                  setEmployee(
                    e.target.value
                  )
                }
                className="w-full border rounded p-3"
              >
                <option value="">
                  Select Employee
                </option>
                {filteredEmployees.map(
                  (emp) => (
                    <option
                      key={emp._id}
                        value={emp.employee_code}
                    >
                      {emp.employee_code}
                      {" - "}
                      {emp.name}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="border rounded-lg overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">
                    Module
                  </th>

                  <th className="p-3">
                    View
                  </th>

                  <th className="p-3">
                    Create
                  </th>

                  <th className="p-3">
                    Edit
                  </th>

                  <th className="p-3">
                    Delete
                  </th>

                </tr>

              </thead>

              <tbody>

                {permissions.map(
                  (item) => (

                    <tr
                      key={
                        item.type
                      }
                      className="border-t"
                    >

                      <td className="p-3 font-medium">
                        {
                          item.type
                        }
                      </td>

                      {[
                        "view",
                        "create",
                        "edit",
                        "delete",
                      ].map(
                        (field) => (

                          <td
                            key={
                              field
                            }
                            className="text-center"
                          >

                            <input
                              type="checkbox"
                              checked={
                                item[
                                field
                                ]
                              }
                              onChange={() =>
                                handlePermissionChange(
                                  item.type,
                                  field
                                )
                              }
                            />

                          </td>
                        )
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={
                handleSubmit
              }
              className="bg-cyan-500 text-white px-5 py-2 rounded"
            >
              {selectedPermission
                ? "Update"
                : "Save"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PermissionModal;






































// import React, { useState ,useEffect} from "react";
// import axios from "axios";
// import { getDepartments } from "../api";
// const PermissionModal = ({ onClose }) => {
//   const [roleName, setRoleName] = useState("");

//   const [departments, setDepartments] =
//     useState([]);
//     const [departmentId, setDepartmentId] =
//   useState("");

//   const [permissions, setPermissions] = useState([]);

//   const permissionOptions = [
//     "EMPLOYEE_VIEW",
//     "EMPLOYEE_CREATE",
//     "EMPLOYEE_UPDATE",
//     "EMPLOYEE_DELETE",
//     "ATTENDANCE_VIEW",
//     "ATTENDANCE_MANAGE",
//     "LEAVE_VIEW",
//     "LEAVE_CREATE",
//     "LEAVE_APPROVE",
//     "ROLE_MANAGE",
//     "USER_MANAGEMENT",
//   ];


//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const res = await getDepartments();

//       setDepartments(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   const handleCheckbox = (value) => {
//     if (permissions.includes(value)) {
//       setPermissions(
//         permissions.filter((item) => item !== value)
//       );
//     } else {
//       setPermissions([...permissions, value]);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.post(
//         "http://localhost:5000/api/roles/create",
//         {
//           department: departmentId,
//           permissions,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Permissions Updated");

//       onClose();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//       <div className="bg-white w-[500px] p-6 rounded-lg">
//         <h2 className="text-2xl font-bold mb-5">
//           Manage Permissions
//         </h2>

//         <select
//           value={roleName}
//           onChange={(e) =>
//             setRoleName(e.target.value)
//           }
//           className="w-full border p-3 mb-5"
//         >
//           <option value="">
//             Select Department
//           </option>

//           {departments.map((dept) => (
//             <option
//               key={dept.departmentId}
//               value={dept.departmentId}
//             >
//               {dept.departmentName}
//             </option>
//           ))}
//         </select>

//         <div className="grid grid-cols-2 gap-3">
//           {permissionOptions.map((item, index) => (
//             <label
//               key={index}
//               className="flex items-center gap-2"
//             >
//               <input
//                 type="checkbox"
//                 checked={permissions.includes(item)}
//                 onChange={() =>
//                   handleCheckbox(item)
//                 }
//               />

//               {item}
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="bg-gray-400 text-white px-5 py-2 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-cyan-500 text-white px-5 py-2 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PermissionModal;

