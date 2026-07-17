import { FaPlus, FaTrash } from "react-icons/fa";

export default function EducationExperienceDetails({
  form,
  errors,
  handleChange,
  educationList = [],
  experienceList = [],
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
}) {
  return (
    <div className="space-y-6 mt-6">
                    {/* Education */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-base font-medium text-gray-700 mb-4">
          Education Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Qualification *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Institution / University *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Year of Passing *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  CGPA / %
                </th>

                <th className="text-center text-xs font-medium text-gray-550 p-2">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {(educationList.length
                ? educationList
                : [form]
              ).map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <input
                      name="qualification"
                      value={item.qualification || ""}
                      onChange={(e) =>
                        handleChange(e, index, "education")
                      }
                      placeholder="Qualification"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="institution"
                      value={item.institution || ""}
                      onChange={(e) =>
                        handleChange(e, index, "education")
                      }
                      placeholder="Institution"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      name="educationYear"
                      value={item.educationYear || ""}
                      onChange={(e) =>
                        handleChange(e, index, "education")
                      }
                      placeholder="2024"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="cgpa"
                      value={item.cgpa || ""}
                      onChange={(e) =>
                        handleChange(e, index, "education")
                      }
                      placeholder="8.5"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="mt-4 inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-50"
        >
          <FaPlus size={12} />
          Add Education
        </button>
      </div>
                    {/* EXPERIENCE */}

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-base font-medium text-gray-700 mb-4">
          Experience Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[950px]">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Company / Organization *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Designation *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Start Date *
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  End Date
                </th>

                <th className="text-left text-xs font-medium text-gray-550 p-2">
                  Last CTC (LPA)
                </th>

                <th className="text-center text-xs font-medium text-gray-550 p-2">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {(experienceList.length
                ? experienceList
                : [form]
              ).map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <input
                      name="company"
                      value={item.company || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="Company"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="experienceDesignation"
                      value={item.experienceDesignation || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="Designation"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="date"
                      name="experienceStartDate"
                      value={item.experienceStartDate || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="date"
                      name="experienceEndDate"
                      value={item.experienceEndDate || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="lastCtc"
                      value={item.lastCtc || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="6.5"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="mt-4 inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-50"
        >
          <FaPlus size={12} />
          Add Experience
        </button>
      </div>
    </div>
  );
}

















































// import { FaPlus, FaTrash } from "react-icons/fa";

// export default function EducationExperienceDetails({
//   form,
//   errors,
//   handleChange,
//   educationList = [],
//   experienceList = [],
//   addEducation,
//   removeEducation,
//   addExperience,
//   removeExperience,
// }) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//       {/* ================= EDUCATION ================= */}
//       <div className="bg-white border rounded-xl p-5 shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">
//           Education Details
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="text-left p-2">Qualification *</th>
//                 <th className="text-left p-2">
//                   Institution / University *
//                 </th>
//                 <th className="text-left p-2">
//                   Year of Passing *
//                 </th>
//                 <th className="text-left p-2">
//                   CGPA / %
//                 </th>
//                 <th className="text-center p-2">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {(educationList.length
//                 ? educationList
//                 : [form]).map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">
//                     <input
//                       name="qualification"
//                       value={item.qualification || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "education")
//                       }
//                       placeholder="Qualification"
//                       className={`w-full border rounded-md px-2 py-2 ${
//                         errors?.qualification
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       name="institution"
//                       value={item.institution || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "education")
//                       }
//                       placeholder="Institution"
//                       className={`w-full border rounded-md px-2 py-2 ${
//                         errors?.institution
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       type="number"
//                       name="educationYear"
//                       value={item.educationYear || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "education")
//                       }
//                       placeholder="2024"
//                       className={`w-full border rounded-md px-2 py-2 ${
//                         errors?.educationYear
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       name="cgpa"
//                       value={item.cgpa || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "education")
//                       }
//                       placeholder="8.5"
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="text-center">
//                     <button
//                       type="button"
//                       onClick={() => removeEducation(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <button
//           type="button"
//           onClick={addEducation}
//           className="mt-4 flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-gray-100"
//         >
//           <FaPlus />
//           Add Education
//         </button>
//       </div>
//                {/* EXPERIENCE  */}

//       <div className="bg-white border rounded-xl p-5 shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">
//           Experience Details
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="text-left p-2">
//                   Company / Organization *
//                 </th>
//                 <th className="text-left p-2">
//                   Designation *
//                 </th>
//                 <th className="text-left p-2">
//                   Start Date *
//                 </th>
//                 <th className="text-left p-2">
//                   End Date
//                 </th>
//                 <th className="text-left p-2">
//                   Last CTC (LPA)
//                 </th>
//                 <th className="text-center p-2">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {(experienceList.length
//                 ? experienceList
//                 : [form]).map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">
//                     <input
//                       name="company"
//                       value={item.company || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "experience")
//                       }
//                       placeholder="Company"
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       name="experienceDesignation"
//                       value={
//                         item.experienceDesignation || ""
//                       }
//                       onChange={(e) =>
//                         handleChange(e, index, "experience")
//                       }
//                       placeholder="Designation"
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       type="date"
//                       name="experienceStartDate"
//                       value={
//                         item.experienceStartDate || ""
//                       }
//                       onChange={(e) =>
//                         handleChange(e, index, "experience")
//                       }
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       type="date"
//                       name="experienceEndDate"
//                       value={
//                         item.experienceEndDate || ""
//                       }
//                       onChange={(e) =>
//                         handleChange(e, index, "experience")
//                       }
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="p-2">
//                     <input
//                       name="lastCtc"
//                       value={item.lastCtc || ""}
//                       onChange={(e) =>
//                         handleChange(e, index, "experience")
//                       }
//                       placeholder="6.5"
//                       className="w-full border rounded-md px-2 py-2"
//                     />
//                   </td>

//                   <td className="text-center">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         removeExperience(index)
//                       }
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <button
//           type="button"
//           onClick={addExperience}
//           className="mt-4 flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-gray-100"
//         >
//           <FaPlus />
//           Add Experience
//         </button>
//       </div>
//     </div>
//   );
// }