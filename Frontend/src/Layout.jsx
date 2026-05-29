import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { HiOutlineMenu } from "react-icons/hi";

import { hasPermission } from "./utils/hasPermission";

export default function Layout() {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const location = useLocation();

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      permission: null,
    },

    {
      name: "Employees",
      path: "/employees",
      permission: "EMPLOYEE_VIEW",
    },

    {
      name: "Attendance",
      path: "/attendance",
      permission: "ATTENDANCE_VIEW",
    },

    {
      name: "Leave",
      path: "/leave",
      permission: "LEAVE_VIEW",
    },

    {
      name: "Role Permissions",
      path: "/roles",
      permission: "ROLE_MANAGE",
    },

    {
      name: "User Management",
      path: "/users",
      permission: "USER_MANAGEMENT",
    },
  ];

  return (

    <div className="flex h-screen bg-[#eef1f5]">

      {/* SIDEBAR */}
      <div
        className={`bg-white border-r transition-all duration-300 overflow-hidden ${
          sidebarOpen
            ? "w-[220px]"
            : "w-0"
        }`}
      >

        <div className="p-4 font-semibold text-lg whitespace-nowrap">
          HRMS Portal
        </div>

        <ul className="px-3 space-y-2 text-sm">

          {menuItems.map((item, index) => {

            if (
              item.permission &&
              !hasPermission(item.permission)
            ) {
              return null;
            }

            return (

              <Link
                key={index}
                to={item.path}
              >

                <li
                  className={`px-3 py-2 rounded cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-[#00b3bd] text-white"
                      : "hover:bg-[#00b3bd] hover:text-white"
                  }`}
                >

                  {item.name}

                </li>

              </Link>
            );
          })}

          <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              navigate("/login");

            }}

            className="bg-red-500 text-white px-4 py-2 rounded mt-5 w-full"
          >

            Logout

          </button>

        </ul>
      </div>

      {/* MAIN SECTION */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >

            <HiOutlineMenu className="text-2xl" />

          </button>

          <div>

            <span className="text-sm text-blue-600">

              {user?.email}

            </span>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-auto flex-1">

          <Outlet />

        </div>

      </div>
    </div>
  );
}












