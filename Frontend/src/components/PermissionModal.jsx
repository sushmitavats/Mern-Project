import React, { useState, useEffect, } from "react";
import { createPermission, updatePermission, } from "../api";
import { getDepartments, getDesignations, getEmployees, } from "../api";
const PermissionModal = ({onClose,selectedPermission,}) => {
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
    "Usermanagement",
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
    //fetch data
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
  if (!department) {
    setFilteredDesignations([]);
    return;
  }
  const filteredDesig = designations.filter((item) => {
    const deptId =
      item.department?._id ||
      item.department ||
      item.departmentId;

    return String(deptId) === String(department);
  });
  setFilteredDesignations(filteredDesig);
}, [department, designations]);

//permission
  useEffect(() => {
    if (selectedPermission) {
      setDepartment(
        selectedPermission.department?._id || ""
      );
      setDesignation(
        selectedPermission.designation?._id || ""
      );
      setEmployee(
        selectedPermission.employee || ""
      );
      const updatedPermissions =
        permissionModules.map((module) => {
          const existing =
            selectedPermission.permissions?.find(
              p => p.type === module
            );
          return existing
            ? {
              type: module,
              view: existing.view || false,
              create: existing.create || false,
              edit: existing.edit || false,
              delete: existing.delete || false,
            }
            : {
              type: module,
              view: false,
              create: false,
              edit: false,
              delete: false,
            };
        });
      setPermissions(
        updatedPermissions
      );

    } else {
      setDepartment("");
      setDesignation("");
      setEmployee("");

      setPermissions(
        permissionModules.map(
          module => ({
            type: module,
            view: false,
            create: false,
            edit: false,
            delete: false
          })
        )
      );
    }

  }, [selectedPermission]);

  //employee filter
  useEffect(() => {
    let filteredEmp = [...employees];
    if (department) {
      filteredEmp = filteredEmp.filter(
          emp => {

            const deptId =
              emp.department?._id ||
              emp.department;

            return deptId === department;
          }
        );
    }
    if (designation) {
      filteredEmp =
        filteredEmp.filter(
          emp => {
            const desigId =
              emp.designation?._id ||
              emp.designation;
            return desigId === designation;
          }
        );
    }
    setFilteredEmployees(
      filteredEmp
    );
  }, [department,designation,employees
  ]);

  useEffect(() => {
    if (employee &&!filteredEmployees.some(
        emp =>emp.employee_code === employee
      )
    ) {
      const existingEmployee =
        employees.find(
          emp =>
            emp.employee_code === employee
        );

      if (existingEmployee) {

        setFilteredEmployees(
          prev => [
            ...prev,
            existingEmployee
          ]
        );
      }
    }
  }, [
    employee,
    filteredEmployees,
    employees
  ]);
  //handle permission
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
  //handle submit
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
                onChange={(e) => {
                  const value =
                    e.target.value;
                  setDepartment(value);
                  // reset only on manual change
                  setDesignation("");
                  setEmployee("");
                }}
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
                      {item.departmentName}
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
                disabled={!department}
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
                      { item.designationName}
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
                disabled={!department}
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
                      {["view",
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
