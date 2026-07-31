import {FaUser,FaBriefcase,FaIdCard,FaMapMarkerAlt,FaUniversity,FaMoneyCheckAlt,FaGraduationCap,
  FaLaptop,FaCalendarAlt,FaSignOutAlt,FaPlusCircle,} from "react-icons/fa";

export default function EmployeeTabs({
  activeTab,
  setActiveTab,
  completedTabs,
}) {
  const tabs = [
    { id: "basic", label: "Basic Information", icon: <FaUser /> },
    { id: "employment", label: "Employment Details", icon: <FaBriefcase /> },
    { id: "identity", label: "Identity", icon: <FaIdCard /> },
    { id: "address", label: "Address", icon: <FaMapMarkerAlt /> },
    { id: "bank", label: "Bank", icon: <FaUniversity /> },
    { id: "payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
    // MUST match EditEmployeePage
    { id: "eduAndexp", label: "Edu & Exp", icon: <FaGraduationCap /> },
    { id: "itassets", label: "IT & Assets", icon: <FaLaptop /> },
    // { id: "leave", label: "Leave", icon: <FaCalendarAlt /> },
    // { id: "exit", label: "Exit", icon: <FaSignOutAlt /> },
    { id: "additional", label: "Additional", icon: <FaPlusCircle /> },
  ];

  const canAccess = (tabId) =>
    tabId === "basic" || completedTabs.includes(tabId);
  return (
    <div className="flex flex-nowrap gap-4 text-sm mt-6 border-b overflow-x-auto pb-2">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      type="button"
      disabled={!canAccess(tab.id)}
      onClick={() => canAccess(tab.id) && setActiveTab(tab.id)}
      className={`pb-2 whitespace-nowrap
        ${
          activeTab === tab.id
            ? "text-[#0392a1] border-b border-b-[#0392a1] font-semibold"
            : "text-gray-500"
        }
        ${
          !canAccess(tab.id)
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{tab.icon}</span>
        <span>{tab.label}</span>
      </div>
    </button>
  ))}
</div>
  );
}
