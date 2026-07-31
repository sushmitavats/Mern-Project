import React from "react";

export default function AdditionalDetails({
  form,
  setForm,
  errors,
  handleChange,
  getInputClass,
  skillInput,
  certificationInput,
  languageInput,
  setSkillInput,
  setCertificationInput,
  setLanguageInput,
}) {

  const tagRegex =
/^(?!\d+$)[A-Za-z0-9.#+-]+(?:\s+[A-Za-z0-9.#+-]+)*$/;

  const addTag = (
    fieldName,
    value,
    setInput
  ) => {

    const tag = value.trim();

    if (!tag) return;

    if (!tagRegex.test(tag)) {
      handleChange({
        target: {
          name: fieldName,
          value: form[fieldName],
        },
      });

      return;
    }

    const existing = form[fieldName]
      ? form[fieldName]
          .split(",")
          .map((x) => x.trim())
      : [];

    if (existing.includes(tag)) {
      setInput("");
      return;
    }

    handleChange({
      target: {
        name: fieldName,
        value: [...existing, tag].join(", "),
      },
    });

    setInput("");
  };
  const removeTag = (fieldName, tagToRemove) => {
  const updated = (form[fieldName] || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== tagToRemove);

  handleChange({
    target: {
      name: fieldName,
      value: updated.join(", "),
    },
  });
};

  const renderTags = (
    field,
    inputValue,
    setInput,
    placeholder
  ) => (
    <div>

      <label className="block text-sm font-medium mb-2 capitalize">
        {field}
      </label>

      <div
        className={`min-h-[48px] w-full rounded-lg border p-2 flex flex-wrap gap-2 items-center ${
          errors[field]
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >

        {/* {(form[field] || "")
          .split(",")
          .filter((x) => x.trim())
          .map((item, index) => (
          
            <span
              key={`${field}-${tag}`}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {item}

              <button
                type="button"
                onClick={() =>
                  removeTag(field, item)
                }
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>

            </span>

          ))} */}
          {(form[field] || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean)
  .map((tag) => (
    <span
      key={`${field}-${tag}`}
      className="bg-blue-100 text-[#0392a1] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
    >
      {tag}

      <button
        type="button"
        onClick={() => removeTag(field, tag)}
        className="text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>
    </span>
  ))}

        <input
          value={inputValue}
          placeholder={placeholder}
          className="flex-1 min-w-[140px] outline-none"

          onChange={(e) => {

            const value = e.target.value;

            setInput(value);

            if (
              value &&
              !tagRegex.test(value)
            ) {

              handleChange({
                target: {
                  name: field,
                  value: form[field],
                },
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(field,inputValue,setInput
              );

            }

          }}

          onBlur={() =>
            addTag(
              field,
              inputValue,
              setInput
            )
          }

        />

      </div>

      {errors[field] && (

        <p className="text-red-500 text-xs mt-1">
          {errors[field]}
        </p>

      )}

    </div>

  );

  return (

    <div className="mt-6 bg-white border rounded-xl p-6">

      <h2 className="font-semibold text-lg mb-6">
        Additional Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {renderTags(
          "skills",
          skillInput,
          setSkillInput,
          "Type skill and press Enter"
        )}

        {renderTags(
          "certifications",
          certificationInput,
          setCertificationInput,
          "Type certification"
        )}

        {renderTags(
          "languages",
          languageInput,
          setLanguageInput,
          "Type language"
        )}

        <div>

          <label className="block text-sm mb-2">
            LinkedIn
          </label>

          <input
            name="linkedIn"
            value={form.linkedIn || ""}
            onChange={handleChange}
            className={getInputClass("linkedIn")}
            placeholder="https://www.linkedin.com/in/username"
          />

          {errors.linkedIn && (

            <p className="text-red-500 text-xs mt-1">
              {errors.linkedIn}
            </p>

          )}

        </div>

        <div className="md:col-span-2">

          <label className="block text-sm mb-2">
            Notes
          </label>

          <textarea
            rows={4}
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            className={getInputClass("notes")}
          />

        </div>

      </div>

    </div>

  );

}














// export default function AdditionalDetails({
//   form,
//   errors,
//   handleChange,
//   getInputClass,
// }) {
//   return (
//     <div className="mt-6 bg-white border rounded-xl p-6">
//       <h2 className="font-semibold text-lg mb-6">
//         Additional Details
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {/* <div>
//           <label>Skills</label>
//           <input
//             name="skills"
//             value={form.skills || ""}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-3"
//           />
//         </div> */}
//         <div>
//           <label className="block text-sm mb-2">
//             Skills
//           </label>
//           <div
//             className={`min-h-[48px] w-full border rounded-lg p-2 flex flex-wrap gap-2 items-center ${errors?.skills ? "border-red-500" : "border-gray-300"
//               }`}
//           >
//             {(form.skills || "")
//               .split(",")
//               .filter((item) => item.trim() !== "")
//               .map((skill, index) => (
//                 <span
//                   key={index}
//                   className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//                 >
//                   {skill.trim()}
//                 </span>
//               ))}
//             <input
//               type="text"
//               placeholder="Type skill and press Enter"
//               className="flex-1 outline-none min-w-[150px]"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const value = e.target.value.trim();
//                   if (!value) return;
//                   const existing = form.skills
//                     ? form.skills
//                       .split(",")
//                       .map((x) => x.trim())
//                     : [];
//                   if (!existing.includes(value)) {
//                     handleChange({
//                       target: {
//                         name: "skills",
//                         value: [...existing, value].join(", "),
//                       },
//                     });
//                   }
//                   e.target.value = "";
//                 }
//               }}
//             />
//           </div>
//           {errors?.skills && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.skills}
//             </p>
//           )}
//         </div>
//         <div>
//           <label>Certifications</label>
//           <input
//             name="certifications"
//             value={form.certifications || ""}
//             onChange={handleChange}
//             className={getInputClass("certifications")}
//           />
//           {errors?.certifications && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.certifications}
//             </p>
//           )}
//         </div>
//         <div>
//           <label>Languages</label>
//           <input
//             name="languages"
//             value={form.languages || ""}
//             onChange={handleChange}
//              className={getInputClass("languages")}
            
//           />
//           {errors?.languages && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.languages}
//             </p>
//           )}
//         </div>
//         {/* <div>
//           <label>LinkedIn</label>

//           <input
//             name="linkedIn"
//             value={form.linkedIn || ""}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-3"
//           />
//         </div> */}
//         <div>
//           <label>LinkedIn</label>
//           <input
//             name="linkedIn"
//             value={form.linkedIn || ""}
//             onChange={handleChange}
//             className={getInputClass("linkedIn")}
//           />
//           {errors?.linkedIn && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.linkedIn}
//             </p>
//           )}
//         </div>
//         <div className="md:col-span-2">
//           <label>Notes</label>
//           <textarea
//             rows={4}
//             name="notes"
//             value={form.notes || ""}
//             onChange={handleChange}
//             className={getInputClass("notes")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }