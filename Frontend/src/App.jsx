import Dashboard from "./pages/Dashboard";
import Login from "./Login";
import Employees from "./pages/Employees";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";

import Attendance from "./pages/Attendance";
import LeaveManagement from "./components/LeaveManagement";
import RolePermissions from "./pages/RolePermissions";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <div className="App">

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute permission="EMPLOYEE_VIEW">
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute permission="ATTENDANCE_VIEW">
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave"
            element={
              <ProtectedRoute permission="LEAVE_VIEW">
                <LeaveManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute permission="ROLE_MANAGE">
                <RolePermissions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute permission="USER_MANAGEMENT">
                <UserManagement />
              </ProtectedRoute>
            }
          />

        </Route>

        <Route
          path="*"
          element={<h1>404 Page Not Found</h1>}
        />

      </Routes>

    </div>
  );
}

export default App;




















// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path='/login' element={<Login />} />
//         <Route path='/signup' element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// import { useState } from "react";
// import Login from "./Login";
// import Signup from "./signup";

// function App() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <>
//       {isLogin ? <Login /> : <Signup />}

//       <div style={{ textAlign: "center", marginTop: "10px" }}>
//         {isLogin ? (
//           <p>
//             Don't have an account?{" "}
//             <button onClick={() => setIsLogin(false)}>
//               Sign Up
//             </button>
//           </p>
//         ) : (
//           <p>
//             Already have an account?{" "}
//             <button onClick={() => setIsLogin(true)}>
//               Login
//             </button>
//           </p>
//         )}
//       </div>
//     </>
//   );
// }
