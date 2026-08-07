import { FaPlus, FaTrash } from "react-icons/fa";
export default function EducationExperienceDetails({
  form,
  errors,
  educationErrors = [],
  experienceErrors = [],
  handleChange,
  educationList = [],
  experienceList = [],
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="space-y-6 mt-6">

      {/* EDUCATION */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-[16px] font-bold leading-5 text-[#101828] mb-4 border-b border-[#e4e9ef] pb-3">
          Education Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 ">Higher Qualification *</th>
                <th className="text-left p-2">Institution / University *</th>
                <th className="text-left p-2">Year of Passing *</th>
                <th className="text-left p-2">CGPA / %</th>
                <th className="text-center p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {educationList.map((item, index) => (
                <tr key={index} className="border-b">
                  {/* Qualification */}
                  <td className="p-2">
                    <select
                      name="qualification"
                      value={item.qualification || ""}
                      onChange={(e) => handleChange(e, index, "education")}
                      className={`w-full border rounded-md px-3 py-2 text-sm ${educationErrors?.[index]?.qualification
                        ? "border-red-500"
                        : ""
                        }`}
                    >
                      <option value="">Select Qualification</option>
                      <optgroup label="School">
                        <option value="10th / Secondary">
                          10th / Secondary
                        </option>
                        <option value="12th / Higher Secondary">
                          12th / Higher Secondary
                        </option>
                      </optgroup>
                      <optgroup label="Graduation">
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.E.">B.E.</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="B.Com">B.Com</option>
                        <option value="BBA">BBA</option>
                        <option value="BA">BA</option>
                        <option value="BCA">BCA</option>
                        <option value="LLB">LLB</option>
                      </optgroup>
                      <optgroup label="Post Graduation">
                        <option value="M.Tech">M.Tech</option>
                        <option value="MBA">MBA</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="M.Com">M.Com</option>
                        <option value="MA">MA</option>
                      </optgroup>
                      <optgroup label="Others">
                        <option value="Diploma">Diploma</option>
                        <option value="ITI">ITI</option>
                        <option value="PhD">PhD</option>
                        <option value="Certification">Certification</option>
                        <option value="Other">Other</option>
                      </optgroup>
                    </select>
                    {educationErrors?.[index]?.qualification && (
                      <p className="text-red-500 text-xs mt-1">
                        {educationErrors[index].qualification}
                      </p>
                    )}
                  </td>
                  {/* Institution */}
                  <td className="p-2">
                    <input
                      name="institution"
                      value={item.institution || ""}
                      onChange={(e) =>
                        handleChange(e, index, "education")
                      }
                      placeholder="Institution"
                      className={`w-full border rounded-md px-3 py-2 text-sm ${educationErrors?.[index]?.institution
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    {educationErrors?.[index]?.institution && (
                      <p className="text-red-500 text-xs mt-1">
                        {educationErrors[index].institution}
                      </p>
                    )}
                  </td>
                  {/* Year */}
                  <td className="p-2">
                    <input
                      type="month"
                      name="educationYear"
                      value={item.educationYear ? `${item.educationYear}-01` : ""}
                      onChange={(e) => handleChange(e, index, "education")}
                      max={today.slice(0, 7)}
                      className={`w-full border rounded-md px-3 py-2 text-sm ${educationErrors?.[index]?.educationYear ? "border-red-500" : ""
                        }`}
                    />
                    {educationErrors?.[index]?.educationYear && (
                      <p className="text-red-500 text-xs mt-1">
                        {educationErrors[index].educationYear}
                      </p>
                    )}
                  </td>
                  {/* CGPA */}
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
                  {/* Delete */}
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
        <h2 className="text-[16px] font-bold leading-5 text-[#101828] mb-4 border-b border-[#e4e9ef] pb-3">
          Experience Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[950px]">

            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Company</th>
                <th className="text-left p-2">Designation</th>
                <th className="text-left p-2">Start Date</th>
                <th className="text-left p-2">End Date</th>
                <th className="text-left p-2">Last CTC</th>
                <th className="text-center p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {experienceList.map((item, index) => (
                <tr key={index} className="border-b">
                  {/* Company */}
                  <td className="p-2">
                    <input
                      name="company"
                      value={item.company || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="Company"
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.company
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    {experienceErrors?.[index]?.company && (
                      <p className="text-red-500 text-xs mt-1">
                        {experienceErrors[index].company}
                      </p>
                    )}
                  </td>
                  {/* Designation */}
                  <td className="p-2">
                    <input
                      name="experienceDesignation"
                      value={item.experienceDesignation || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="Designation"
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.experienceDesignation
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    {experienceErrors?.[index]?.experienceDesignation && (
                      <p className="text-red-500 text-xs mt-1">
                        {experienceErrors[index].experienceDesignation}
                      </p>
                    )}
                  </td>
                  {/* Start Date */}
                  <td className="p-2">
                    {/* <input
                      type="date"
                      name="experienceStartDate"
                      value={item.experienceStartDate || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.experienceStartDate
                        ? "border-red-500"
                        : ""
                        }`}
                    /> */}
                    <input
                      type="date"
                      name="experienceStartDate"
                      value={item.experienceStartDate || ""}
                      onChange={(e) => handleChange(e, index, "experience")}
                      max={today}
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.experienceStartDate ? "border-red-500" : ""
                        }`}
                    />
                    {experienceErrors?.[index]?.experienceStartDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {experienceErrors[index].experienceStartDate}
                      </p>
                    )}
                  </td>
                  {/* End Date */}
                  <td className="p-2">

                    <input
                      type="date"
                      name="experienceEndDate"
                      value={item.experienceEndDate || ""}
                      onChange={(e) => handleChange(e, index, "experience")}
                      max={today}  // To block future year
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.experienceEndDate ? "border-red-500" : ""
                        }`}
                    />
                  </td>
                  {/* Last CTC */}
                  <td className="p-2">
                    {/* <input
                      name="lastCtc"
                      value={item.lastCtc || ""}
                      onChange={(e) =>
                        handleChange(e, index, "experience")
                      }
                      placeholder="6.5"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    /> */}
                    <input
                      name="lastCtc"
                      value={item.lastCtc || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and optional decimal (max 2 decimal places)
                        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                          handleChange(
                            {
                              target: {
                                name: "lastCtc",
                                value,
                              },
                            },
                            index,
                            "experience"
                          );
                        }
                      }}
                      placeholder="6.50"
                      inputMode="decimal"
                      maxLength={12}
                      className={`w-full border rounded-md px-3 py-2 text-sm ${experienceErrors?.[index]?.lastCtc ? "border-red-500" : ""
                        }`}
                    />
                    {experienceErrors?.[index]?.lastCtc && (
                      <p className="text-red-500 text-xs mt-1">
                        {experienceErrors[index].lastCtc}
                      </p>
                    )}
                  </td>
                  {/* Delete */}
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
