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
  axiosInstance.get(`/employees/search?search=${search}`);

export const getLeaves = () => axiosInstance.get("/leave");
export const addLeave = (data) => axiosInstance.post("/leave", data);
export const updateLeaveStatus = (id, status) =>
  axiosInstance.put(`/leave/${id}`, { status });

export const getNextEmployeeCode = () =>
  axiosInstance.get("/employees/next-code");

//roles
export const getRoles = () =>
  axiosInstance.get("/roles/all");

export const addRole = (data) =>
  axiosInstance.post("/roles/add", data);

export const deleteRoleById = (id) =>
  axiosInstance.delete(`/roles/delete/${id}`);

export const updateRoleById = (id, data) =>
  axiosInstance.put(`/roles/${id}`, data);


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


// GET LEAVE BALANCE
export const getLeaveBalance = (
  employee_code
) =>
  axiosInstance.get(
    `/leave/balance/${employee_code}`
  );


// GET LEAVE HISTORY
export const getLeaveHistory = (
  employee_code
) =>
  axiosInstance.get(
    `/leave/history/${employee_code}`
  );


// ADD EARN LEAVE
export const addEarnLeave = (id) =>
  axiosInstance.put(
    `/leave/add-earn/${id}`
  );


// ADD FLOATING LEAVE
export const addFloatingLeave = (
  id
) =>
  axiosInstance.put(
    `/leave/add-floating/${id}`
  );


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
