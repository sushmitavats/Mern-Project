import Dashboard from "./pages/Dashboard";
import Login from "./Login";
import Employees from "./pages/Employees";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import RolePermissions from "./pages/RolePermissions";
import UserManagement from "./pages/UserManagement";
import Department from "./pages/Department";
import Designation from "./pages/Designation";
import EditEmployeePage from "./pages/EditEmployeePage";
import EmployeeProfile from "./pages/EmployeeProfile";
// import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeProfileView from "./pages/EmployeeProfileView"
import LeaveApply from "./pages/LeaveApply";
import Exit from "./pages/Exit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Employees */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute
                module="Employee"
              >
                <Employees />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/employees/edit/:employee_code"
            element={
            <ProtectedRoute module="Employee">
               <EditEmployeePage />
               </ProtectedRoute>
             }
            /> */}
          <Route
            path="/employees"
            element={<Employees />}
          />
          <Route
            path="/employees/edit/:employee_code"
            element={<EditEmployeePage />}
          />
          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute
                module="Attendance"
              >
                <Attendance />
              </ProtectedRoute>
            }
          />
          {/* Leave */}
          <Route
            path="/leave"
            element={
              <ProtectedRoute
                module="Leave"
              >
                <LeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/apply"
            element={
              <ProtectedRoute module="Leave">
                <LeaveApply />
              </ProtectedRoute>
            }
          />
          {/* Role Permission */}
          <Route path="/exit" element={<Exit />} />
          {/* <Route
            path="/employee-profile"
            element={
              <EmployeeProfile />
            }
          /> */}
          <Route
            path="/employee-profile/:employee_code"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
                  {/* <Route
          path="/employee-profile/:employee_code"
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        /> */}
          <Route
            path="/employee-profile/view/:employee_code"
            element={
              <ProtectedRoute module="Employee">
                <EmployeeProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute
                module="Role"
              >
                <RolePermissions />
              </ProtectedRoute>
            }
          />
          {/* User Management */}
          <Route
            path="/users"
            element={
              <ProtectedRoute
                module="Usermanagement"
              >
                <UserManagement />
              </ProtectedRoute>
            }
          />
          {/* Department */}
          <Route
            path="/department"
            element={
              <ProtectedRoute
                module="Department"
              >
                <Department />
              </ProtectedRoute>
            }
          />
          {/* Designation */}
          <Route
            path="/designation"
            element={
              <ProtectedRoute
                module="Designation"
              >
                <Designation />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* <Route
          path="/employee-profile"
          element={
            <ProtectedRoute module="Employee">
              <EmployeeProfile />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="*"
          element={
            <h1>
              404 Page Not Found
            </h1>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

    </div>
  );
}

export default App;

