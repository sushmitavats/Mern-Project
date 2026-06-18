import axios from "axios";

// BASE URL
const BASE_URL = "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

//login 
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("REQUEST STARTED");

    const token = localStorage.getItem("token");
                   
    console.log("TOKEN:", token);
    console.log("URL:", config.url);

    if (
      token &&
      config.url &&
      !config.url.includes("/auth/login")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);




axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    console.log(
      "API ERROR:",
      error.response?.data
    );

    return Promise.reject(error);
  }
);

// export const addMonthlyEarnLeave =
// () =>
// axiosInstance.put(
//  "/monthly-earn-leave"
// );

  // leave fl & el
export const monthlyEarnLeave =
  () =>
    axiosInstance.put(
      "/monthly-earn-leave"
    );

export const grantFloatingLeave =
  () =>
    axiosInstance.put(
      "/grant-floating-leave"
    );

//employee
export const getEmployees = () => axiosInstance.get("/employees");

export const addEmployee = (data) =>
  axiosInstance.post("/employees", data);

export const deleteEmployee = (employee_code) =>
  axiosInstance.delete(`/employees/code/${employee_code}`);

export const updateEmployee = (employee_code, data) =>
  axiosInstance.put(`/employees/code/${employee_code}`, data);

//dashboard
export const getDashboard = () =>
  axiosInstance.get("/dashboard");

export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);

export const getAttendance = () =>
  axiosInstance.get("/attendance");

export const saveAttendance = (data) =>
  axiosInstance.post("/attendance", data);

export const searchEmployees = (search) =>
  axiosInstance.get(
    `/leave/search-employee?search=${search}`
  );


// export const searchEmployees = (search) =>
//   axiosInstance.get(`/employees/search?search=${search}`);

export const getLeaves = () => axiosInstance.get("/leave");
export const addLeave = (data) => axiosInstance.post("/leave", data);
export const updateLeaveStatus = (id, status) =>
  axiosInstance.put(`/leave/${id}`, { status });

export const getNextEmployeeCode = () =>
  axiosInstance.get("/employees/next-code");

//roles
// export const getRoles = () =>
//   axiosInstance.get("/roles/all");

// export const addRole = (data) =>
//   axiosInstance.post("/roles/add", data);

// export const deleteRoleById = (id) =>
//   axiosInstance.delete(`/roles/delete/${id}`);

// export const updateRoleById = (id, data) =>
//   axiosInstance.put(`/roles/${id}`, data);



// User Management

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
export const changePassword = (data) =>
  axiosInstance.post(
    "/auth/change-password",
    data
  );


// GET USERS
export const getUsers = () =>
  axiosInstance.get(
    "/auth/all-users"
  );

// CREATE USER
export const createUser = (data) =>
  axiosInstance.post(
    "/auth/register",
    data
  );

// UPDATE USER
export const updateUser = (
  id,
  data
) =>
  axiosInstance.put(
    `/auth/update-user/${id}`,
    data
  );

// DELETE USER
export const deleteUser = (id) =>
  axiosInstance.delete(
    `/auth/delete-user/${id}`
  );

// CHANGE STATUS
export const changeUserStatus = (
  id
) =>
  axiosInstance.put(
    `/auth/change-status/${id}`
  );


  // Leave ka babal tamasa API

  
//ENTERPRISE LEAVE FEATURES


  export const getLeaveBalance = (employee_code) =>
  axiosInstance.get(`/leave-balance/${employee_code}`);

// GET LEAVE HISTORY
export const getLeaveHistory = (
  employee_code
) =>
  axiosInstance.get(
    `/leave/history/${employee_code}`
  );


// ADD EARN LEAVE
// export const addEarnLeave = (id) =>
//   axiosInstance.put(
//     `/leave/add-earn/${id}`
//   );
  export const addEarnLeave = (id) =>
  axiosInstance.put(`/add-earn-leave/${id}`);


// ADD FLOATING LEAVE
// export const addFloatingLeave = (
//   id
// ) =>
//   axiosInstance.put(
//     `/leave/add-floating/${id}`
//   );

export const addFloatingLeave = (id) =>
  axiosInstance.put(`/add-floating-leave/${id}`);

// HOLIDAY APIs 


// ADD HOLIDAY
export const addHoliday = (data) =>
  axiosInstance.post(
    "/holiday/add",
    data
  );


// GET HOLIDAYS
export const getHolidays = () =>
  axiosInstance.get(
    "/holiday/all"
  );


// NOTIFICATION APIs 


// GET NOTIFICATIONS
export const getNotifications = (
  employee_code
) =>
  axiosInstance.get(
    `/notification/${employee_code}`
  );


// MARK NOTIFICATION READ
export const markNotificationRead = (
  id
  
) =>
  axiosInstance.put(
    `/notification/read/${id}`
  );

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
  axiosInstance.post("/departments",data);

  export const updateDepartment = (id,data) =>
  axiosInstance.put(`/departments/${id}`,data);

  export const deleteDepartment = (id) =>
  axiosInstance.delete(`/departments/${id}`);


  //designation api
  export const getDesignations = () =>
    axiosInstance.get("/designation");

export const addDesignation =(data) =>
    axiosInstance.post("/designation",data);

export const updateDesignation =(id, data) =>
  axiosInstance.put(`/designation/${id}`,data);

export const deleteDesignation =(id) =>
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
export const updatePermission = (
  id,
  data
) =>
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
