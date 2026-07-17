import {
  FaUser,
  FaBriefcase,
  FaIdCard,
  FaMapMarkerAlt,
  FaUniversity,
  FaMoneyCheckAlt,
  FaGraduationCap,
  FaPhoneAlt,
  FaFileAlt,
  FaLaptop,
  FaCalendarAlt,
  FaSignOutAlt,
  FaPlusCircle,
} from "react-icons/fa";

export default function EmployeeTabs({ activeTab, setActiveTab, completedTabs, }) {
  const tabs = [
    { id: "basic", label: "Basic Information", icon: <FaUser /> },
    { id: "employment", label: "Employment Details", icon: <FaBriefcase /> },
    { id: "identity", label: "Identity", icon: <FaIdCard /> },
    { id: "address", label: "Address", icon: <FaMapMarkerAlt /> },
    { id: "bank", label: "Bank", icon: <FaUniversity /> },
    { id: "payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "emergency", label: "Emergency Contact", icon: <FaPhoneAlt /> },
    { id: "documents", label: "Documents", icon: <FaFileAlt /> },
    { id: "itassets", label: "IT & Assets", icon: <FaLaptop /> },
    { id: "leave", label: "Leave", icon: <FaCalendarAlt /> },
    { id: "exit", label: "Exit", icon: <FaSignOutAlt /> },
    { id: "additional", label: "Additional", icon: <FaPlusCircle /> },
  ];

  const canAccess = (tab) =>
    tab === "basic" || completedTabs.includes(tab);

  return (
    <div className="flex flex-nowrap gap-4 text-sm mt-6 border-b overflow-x-auto pb-2">
      {tabs.map((tab) => (
        // <button
        //   key={tab.id}
        //   disabled={!canAccess(tab.id)}
        //   onClick={() => canAccess(tab.id) && setActiveTab(tab.id)}
        //   className={`pb-2 whitespace-nowrap
        //     ${
        //       activeTab === tab.id
        //         ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
        //         : "text-gray-500"
        //     }
        //     ${
        //       !canAccess(tab.id)
        //         ? "opacity-50 cursor-not-allowed"
        //         : "cursor-pointer"
        //     }`}
        // >
        //   {tab.label}
        // </button>
        <button
          key={tab.id}
          disabled={!canAccess(tab.id)}
          onClick={() => canAccess(tab.id) && setActiveTab(tab.id)}
          className={`flex items-center gap-2 pb-2 whitespace-nowrap
    ${activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
            }`}
        >
          <span className="text-base">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}














// import {
//   FaUser,
//   FaBriefcase,
//   FaIdCard,
//   FaMapMarkerAlt,
//   FaUniversity,
//   FaMoneyCheckAlt,
//   FaGraduationCap,
//   FaPhoneAlt,
//   FaFileAlt,
//   FaLaptop,
//   FaCalendarAlt,
//   FaSignOutAlt,
//   FaPlusCircle,
// } from "react-icons/fa";

// export default function EmployeeTabs({
//   activeTab,
//   setActiveTab,
//   completedTabs,
// }) {
//   const tabs = [
//     { id: "basic", label: "Basic Information", icon: <FaUser /> },
//     { id: "employment", label: "Employment Details", icon: <FaBriefcase /> },
//     { id: "identity", label: "Identity", icon: <FaIdCard /> },
//     { id: "address", label: "Address", icon: <FaMapMarkerAlt /> },
//     { id: "bank", label: "Bank", icon: <FaUniversity /> },
//     { id: "payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
//     { id: "education", label: "Education", icon: <FaGraduationCap /> },
//     { id: "emergency", label: "Emergency Contact", icon: <FaPhoneAlt /> },
//     { id: "documents", label: "Documents", icon: <FaFileAlt /> },
//     { id: "itassets", label: "IT & Assets", icon: <FaLaptop /> },
//     { id: "leave", label: "Leave", icon: <FaCalendarAlt /> },
//     { id: "exit", label: "Exit", icon: <FaSignOutAlt /> },
//     { id: "additional", label: "Additional", icon: <FaPlusCircle /> },
//   ];

//   const canAccess = (tab) =>
//     tab === "basic" || completedTabs.includes(tab);

//   return (
//     <div className="flex flex-nowrap gap-4 text-sm mt-6 border-b overflow-x-auto pb-2">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           disabled={!canAccess(tab.id)}
//           onClick={() => canAccess(tab.id) && setActiveTab(tab.id)}
//           className={`flex items-center gap-2 pb-2 whitespace-nowrap transition-colors duration-200
//             ${
//               activeTab === tab.id
//                 ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
//                 : "text-gray-600 hover:text-blue-500"
//             }
//             ${
//               !canAccess(tab.id)
//                 ? "opacity-50 cursor-not-allowed"
//                 : "cursor-pointer"
//             }`}
//         >
//           <span className="text-base">{tab.icon}</span>
//           <span>{tab.label}</span>
//         </button>
//       ))}
//     </div>
//   );
// }