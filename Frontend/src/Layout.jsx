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
import {
  MdOutlineExitToApp
} from "react-icons/md";

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
      name: "Exit",
      path: "/exit",
      module: "Exit",
      icon: <MdOutlineExitToApp size={22} />,
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
    //   name: "Profile",
    //   path: `/employee-profile/${user?.employee_code}`,
    //   module: "Employee",
    //   icon: <MdOutlineBadge size={22} />,
    // }
    ...(user?.employee_code
      ? [{
        name: "Profile",
        path: `/employee-profile/${user.employee_code}`,
        icon: <MdOutlineBadge size={22} />,
      }]
      : []),
      
  ];
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f9fc] text-[#0f1d3d]">

      {/* SIDEBAR  */}
      <aside
        className={`
      flex h-full flex-shrink-0 flex-col
      bg-[#031b3d]
      border-r border-[#0a315f]
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? "w-[180px]" : "w-[72px]"}
    `}
      >
        {/* LOGO AREA */}
        <div
          className={`
        flex h-[68px] items-center
        border-b border-white/10
        ${sidebarOpen ? "justify-start px-5" : "justify-center"}
      `}
        >
          <img
            src="/logo_2.png"
            alt="Logo"
            className={`
          object-contain
          transition-all duration-300
          ${sidebarOpen ? "w-[130px]" : "w-[38px]"}
        `}
          />
        </div>
        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              if (item.module && !hasPermission(item.module, "view")
              ) {
                return null;
              }
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={index}
                  to={item.path}
                  className="block"
                >
                  <li
                    className={`
                  group relative
                  flex min-h-[42px]
                  items-center
                  rounded-[6px]
                  transition-all duration-200
                  cursor-pointer
                  ${sidebarOpen
                        ? "gap-3 px-3"
                        : "justify-center px-2"
                      }
                  ${isActive
                        ? "bg-[#0392a1] text-white shadow-[0_4px_12px_rgba(3,146,161,0.25)]"
                        : "text-[#d9e3f0] hover:bg-[#073263] hover:text-white"
                      }
                `}
                  >
                    {/* ACTIVE INDICATOR */}
                    {isActive && (
                      <span
                        className="
                      absolute left-0
                      h-[24px] w-[3px]
                      rounded-r-full
                      bg-white
                    "
                      />
                    )}
                    {/* ICON */}
                    <span
                      className={`
                    flex h-[22px] w-[22px]
                    flex-shrink-0
                    items-center justify-center
                    text-[17px]
                    ${isActive
                          ? "text-white"
                          : "text-[#b9c9dc] group-hover:text-white"
                        }
                  `}
                    >
                      {item.icon}
                    </span>
                    {/* LABEL */}
                    {sidebarOpen && (
                      <span
                        className="
                      whitespace-nowrap
                      text-[12px]
                      font-medium
                      tracking-[0.1px]
                    ">
                        {item.name}
                      </span>
                    )}
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
        {/* LOGOUT */}
        <div className="border-t border-white/10 p-3">

          <button
            // onClick={() => {
            //   localStorage.removeItem("token");
            //   localStorage.removeItem("user");
            //   navigate("/login");
            // }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("permissions");
              navigate("/login", { replace: true });
            }}
            className={`
          flex w-full
          items-center
          rounded-[6px]
          bg-[#b4232d]
          text-white
          transition-all duration-200
          hover:bg-[#981d26]

          ${sidebarOpen
                ? "justify-center gap-2 px-3 py-2"
                : "justify-center py-2"
              }
        `}
          >
            <span className="text-[15px]">
              <i className="fa-solid fa-right-from-bracket"></i>
            </span>

            {sidebarOpen && (
              <span className="text-[12px] font-medium">
                Logout
              </span>
            )}
            {/* onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("permissions");
              navigate("/login", { replace: true });
            }} */}
          </button>
        </div>
      </aside>
      {/* MAIN AREA */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOP NAVBAR  */}
        <header
          className="
        flex h-[64px]
        flex-shrink-0
        items-center
        justify-between
        border-b border-[#e4e9f0]
        bg-white
        px-5
      "
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4">
            {/* MENU BUTTON */}
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="
            flex h-[36px] w-[36px]
            items-center justify-center
            rounded-md
            text-[#27364d]
            transition-all
            hover:bg-[#eef8f9]
            hover:text-[#0392a1]
          "
            >
              <HiOutlineMenu className="text-[22px]" />
            </button>

            {/* OPTIONAL PAGE TITLE */}
            <div className="hidden md:block">
              <h1 className="text-[15px] font-semibold text-[#13203d]">
                HRMS Portal
              </h1>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="hidden lg:flex">
              <div
                className="
              flex h-[36px]
              w-[245px]
              items-center
              gap-2
              rounded-md
              border border-[#e1e6ed]
              bg-[#fbfcfe]
              px-3
            "
              >
                <i
                  className="
                fa-solid fa-magnifying-glass
                text-[13px]
                text-[#8b98aa]
              "
                />
                <input
                  type="text"
                  placeholder="Search employee, menu..."
                  className="
                w-full
                bg-transparent
                text-[11px]
                text-[#344054]
                outline-none
                placeholder:text-[#9aa6b5]
              "
                />
              </div>
            </div>
            {/* EMAIL / USER */}
            <div className="flex items-center rounded-md
            bg-[#f5f8fb]
            px-3
            py-2"
            >
              <span
                className="
              max-w-[220px]
              truncate
              text-[12px]
              font-medium
              text-[#344054]
            "
              >
                {user?.email}
              </span>
            </div>
          </div>
        </header>
        {/*PAGE CONTENT */}
        <section
          className="
        min-h-0
        flex-1
        overflow-auto
        bg-[#eef1f5]
      "
        >
          <div className="min-h-full w-full p-4 md:p-5">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
