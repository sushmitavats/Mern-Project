import axios from "axios";

// BASE URL
// "http://localhost:5000/api";
// "http://localhost:5000/api";
//http://192.168.1.18:5000/api
const BASE_URL = "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

//login 
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("REQUEST STARTED");
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    console.log("URL:", config.url);
    if (token && config.url && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use((response) => response,
  (error) => {
    console.log("API ERROR:",
      error.response?.data
    );
    return Promise.reject(error);
  }
);
//leave api start from here##
//HOLIDAY API
export const getHolidays = () => axiosInstance.get("/holiday/all");
export const addHoliday = (data) => axiosInstance.post("/holiday/add", data);
//api of EL on last day of month and FL
export const monthlyEarnLeave = () => axiosInstance.put("/monthly-earn-leave");
export const grantFloatingLeave = () => axiosInstance.put("/grant-floating-leave");
// export const getLeaveBalance = (employee_code) => axiosInstance.get(`/leave-balance/${employee_code}`);
export const getLeaveBalance = (employee_code) =>
  axiosInstance.get(`/leave/leave-balance/${employee_code}`);
// GET LEAVE HISTORY
export const getLeaves = () => axiosInstance.get("/leave");
export const addLeave = (data) => axiosInstance.post("/leave", data);
// export const updateLeaveStatus = (id, status) => axiosInstance.put(`/leave/${id}`, { status });
export const updateLeaveStatus = (id, status, rejectedReason = "") =>
  axiosInstance.put(
    `/leave/${id}`,
    { status, rejectedReason, }
  );
// export const searchEmployees = (search) => axiosInstance.get(`/employees/search?search=${search}`);
export const searchEmployees = (search) =>
  axiosInstance.get(
    `/leave/search-employee?search=${search}`
  );
// leave employee calandar
export const getEmployeeCalendarLeaves = (employeeCode) => {
  return api.get(`/leave/calendar/${employeeCode}`);
};
export const searchReportingManagers = async (search) => {
    return axiosInstance.get(
        `/leave/search-employee?search=${encodeURIComponent(search)}`
    );
};
//leave api ends here**
//employee
export const getEmployees = () => axiosInstance.get("/employees");
export const addEmployee = (data) =>
  axiosInstance.post("/employees", data);
export const deleteEmployee = (employee_code) =>
  axiosInstance.delete(`/employees/code/${employee_code}`);
// export const updateEmployee = (employee_code, data) =>
//   axiosInstance.put(`/employees/code/${employee_code}`, data);
//for employee side status update
export const getEmployeeByCode = (code) =>
  axiosInstance.get(`/employees/${code}`);
export const updateEmployeeStatus =
  (employee_code, data) =>
    axiosInstance.put(`/employees/status/${employee_code}`, data);
//added for edit  

export const saveDraft = (data) =>
  axiosInstance.post(
    "/employees/draft",
    data,
    {
      headers: { "Content-Type": "multipart/form-data", },
    }
  );
// Save Next (Basic Information → Employment Details)
export const saveEmployee = (data) =>
  axiosInstance.post("/employees/save", data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
// Employee Profile (View Profile)
export const getEmployeeProfile = (employee_code) =>
  axiosInstance.get(`/profile/${employee_code}`);
//put
export const updateEmployeeProfile = (employee_code, formData) =>
  axiosInstance.put(`/profile/${employee_code}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
//api of education and experience
// Education & Experience DRUD operation

export const saveEducationExperience = (data) =>
  axiosInstance.post("/education-experience/save", data);
export const getEducationExperience = (employeeCode) =>
  axiosInstance.get(`/education-experience/${employeeCode}`);
export const deleteEducation = (employeeCode, educationId) =>
  axiosInstance.delete(
    `/education-experience/education/${employeeCode}/${educationId}`
  );
export const deleteExperience = (employeeCode, experienceId) =>
  axiosInstance.delete(
    `/education-experience/experience/${employeeCode}/${experienceId}`
  );

//delete bank document
export const deleteBankDocument = (employee_code, documentId) =>
  axiosInstance.delete(
    `/employees/bank-document/${employee_code}/${documentId}`
  );
//delete Identity document
export const deleteIdentityDocument = (employeeCode, documentId) =>
  axiosInstance.delete(
    `/employees/identity-document/${employeeCode}/${documentId}`
  );

export const getNextEmployeeCode =
  () => axiosInstance.get("/employees/next-code");

export const saveAddress = (data) =>
  axiosInstance.post("/employees/address/save", data);

export const getAddress = (employee_code) =>
  axiosInstance.get(
    `/employees/address/${employee_code}`
  );
export const updateEmployee = (employee_code, data) =>
  axiosInstance.put(
    `/employees/code/${employee_code}`,
    data
  );
// export const updateEmployeeProfile = (employee_code, formData) =>
//   axiosInstance.put(`/profile/${employee_code}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//---Add EditEmployee Route---
// IT Asset Details API
export const saveITAssetDetails = (data) =>
  axiosInstance.post("/it-asset/save", data);

export const getITAssetDetails = (employee_code) =>
  axiosInstance.get(`/it-asset/${employee_code}`);

// Exit Details API
export const saveExitDetails = (data) =>
  axiosInstance.post("/exit-detail/save", data);

export const getExitDetails = (employee_code) =>
  axiosInstance.get(`/exit-detail/${employee_code}`);

// Additional Details API
export const saveAdditionalDetails = (data) =>
  axiosInstance.post("/additional-detail/save", data);

export const getAdditionalDetails = (employee_code) =>
  axiosInstance.get(`/additional-detail/${employee_code}`);

//dashboard
export const getDashboard = () =>
  axiosInstance.get("/dashboard");
export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);
export const getAttendance = () =>
  axiosInstance.get("/attendance");
export const saveAttendance = (data) =>
  axiosInstance.post("/attendance", data);
// export const searchEmployeess = (search) =>
//   axiosInstance.get(
//     `/leave/search-employee?search=${search}`
//   );
// export const searchEmployees = (
//   search
// ) =>
//   axiosInstance.get(
//     `/employees/search?search=${search}`
//   );
// export const searchEmployees = (search) =>
//   axiosInstance.get(`/employees/search?search=${search}`);
// LOGIN
export const loginUser = async (data) => {
  console.log("LOGIN API FUNCTION CALLED");
  const response = await axiosInstance.post(
    "/auth/login",
    data
  );
  console.log("LOGIN API RESPONSE:", response);
  return response;
};
// CHANGE PASSWORD
export const changePassword = (data) => axiosInstance.post(
  "/auth/change-password",
  data
);
// GET USERS
export const getUsers = () => axiosInstance.get(
  "/auth/all-users"
);
// CREATE USER
export const createUser = (data) =>
  axiosInstance.post(
    "/auth/register",
    data
  );
// UPDATE USER
export const updateUser = (id, data) => axiosInstance.put(
  `/auth/update-user/${id}`,
  data
);

// DELETE USER
export const deleteUser = (id) => axiosInstance.delete(
  `/auth/delete-user/${id}`
);
// CHANGE STATUS
export const changeUserStatus = (id) =>
  axiosInstance.put(
    `/auth/change-status/${id}`
  );
// GET NOTIFICATIONS
export const getNotifications = (employee_code) =>
  axiosInstance.get(`/notification/${employee_code}`);
// MARK NOTIFICATION READ
export const markNotificationRead = (id) => axiosInstance.put(`/notification/read/${id}`);
// DOWNLOAD PDF REPORT
export const downloadLeaveReport =
  () =>
    axiosInstance.get(
      "/report/pdf",
      {
        responseType: "blob",
      }
    );
// department api
export const getDepartments = () =>
  axiosInstance.get("/departments");

export const addDepartment = (data) =>
  axiosInstance.post("/departments", data);

export const updateDepartment = (id, data) =>
  axiosInstance.put(`/departments/${id}`, data);

export const deleteDepartment = (id) =>
  axiosInstance.delete(`/departments/${id}`);

//designation api
export const getDesignations = () =>
  axiosInstance.get("/designation");

export const addDesignation = (data) =>
  axiosInstance.post("/designation", data);

export const updateDesignation = (id, data) =>
  axiosInstance.put(`/designation/${id}`, data);

export const deleteDesignation = (id) =>
  axiosInstance.delete(`/designation/${id}`);

// GET ALL PERMISSIONS
export const getPermissions = () =>
  axiosInstance.get("/permission/all");

// GET SINGLE PERMISSION
export const getPermissionById = (id) =>
  axiosInstance.get(`/permission/${id}`);

// CREATE PERMISSION
export const createPermission = (data) =>
  axiosInstance.post(
    "/permission/create",
    data
  );

// UPDATE PERMISSION
export const updatePermission = (id, data) =>
  axiosInstance.put(
    `/permission/update/${id}`,
    data
  );
// DELETE PERMISSION
export const deletePermission = (id) =>
  axiosInstance.delete(
    `/permission/delete/${id}`
  );
//need later
// GET EMPLOYEES BY DESIGNATION
export const getEmployeesByDesignation = (
  designationId
) =>
  axiosInstance.get(
    `/employees/designation/${designationId}`
  );
// GET DESIGNATIONS BY DEPARTMENT
export const getDesignationByDepartment =
  (departmentId) =>
    axiosInstance.get(
      `/designation/department/${departmentId}`
    );
