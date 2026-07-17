import { Link, Outlet, useLocation, useNavigate, } from "react-router-dom";
import { useState } from "react";
import { hasPermission } from "./utils/hasPermission";
import {
  MdOutlineDashboard,
  MdPeopleOutline,
  MdOutlineFactCheck,
  MdOutlineSecurity,
  MdOutlinePerson,
  MdOutlineEventNote,
  MdOutlineBusiness,
  MdOutlineBadge,
} from "react-icons/md";
import { HiOutlineMenu } from "react-icons/hi";

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
      module: null,
      icon: <MdOutlineDashboard size={22} />,
    },
    {
      name: "Employees",
      path: "/employees",
      module: "Employee",
      icon: <MdPeopleOutline size={22} />,
    },

    {
      name: "Attendance",
      path: "/attendance",
      module: "Attendance",
      icon: <MdOutlineFactCheck size={22} />,
    },

    {
      name: "Role Permissions",
      path: "/roles",
      module: "Permission",
      icon: <MdOutlineSecurity size={22} />,
    },

    {
      name: "User Management",
      path: "/users",
      module: "Usermanagement",
      icon: <MdOutlinePerson size={22} />,
    },

    {
      name: "Leave",
      path: "/leave",
      module: "Leave",
      icon: <MdOutlineEventNote size={22} />,
    },

    {
      name: "Department",
      path: "/department",
      module: "Department",
      icon: <MdOutlineBusiness size={22} />,
    },
    // {
    //   name: "EditEmployreeModal",
    //   path:"/employees/edit/:employee_code",
    //   module: "Employee",                                  //added for emp edit 
    // },

    {
      name: "Designation",
      path: "/designation",
      module: "Designation",
      icon: <MdOutlineBadge size={22} />,
    },
  ];
  return (
    <div className="flex h-screen bg-[#eef1f5]">
      <div
        className={`bg-white border-r flex-shrink-0 transition-all duration-300 ${sidebarOpen
          ? "w-64"
          : "w-20"
          }`}
      >
        {/* <div className="p-4 font-semibold text-lg whitespace-nowrap">
          HRMS Portal
        </div> */}
        <div className="flex justify-center items-center p-4 border-b">
          <img
            src="/logo_2.png"
            alt="Logo"
            className={`transition-all duration-300 ${sidebarOpen ? "w-40" : "w-12"
              }`}
          />
        </div>
        <ul className="px-3 space-y-2 text-sm">
          {menuItems.map((item, index) => {
            if (
              item.module &&
              !hasPermission(
                item.module,
                "view"
              )
            ) {
              return null;
            }
            return (
              <Link
                key={index}
                to={item.path}
              >
                {/* <li
                  className={`px-3 py-2 rounded cursor-pointer transition-all duration-200 ${location.pathname === item.path
                    ? "bg-[#00b3bd] text-white"
                    : "hover:bg-[#00b3bd] hover:text-white"
                    }`}
                >
                  {sidebarOpen ? item.name : item.name.charAt(0)}
                </li> */}
                <li
                  className={`flex items-center gap-3 px-3 py-3 rounded cursor-pointer transition-all duration-200 ${location.pathname === item.path
                      ? "bg-[#00b3bd] text-white"
                      : "hover:bg-[#00b3bd] hover:text-white"
                    }`}
                >
                  <span>{item.icon}</span>

                  {sidebarOpen && (
                    <span>{item.name}</span>
                  )}
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
        <div className="overflow-auto flex-1 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
