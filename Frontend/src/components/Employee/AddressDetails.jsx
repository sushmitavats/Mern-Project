export default function AddressDetails({form,errors,handleChange,sameAsCurrent,setSameAsCurrent,}) {

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setSameAsCurrent(checked);
    if (checked) {
        handleChange({
            target: {
                name: "permanentAddress",
                value: form.currentAddress,
            },
        });
        handleChange({
            target: {
                name: "permanentPincode",
                value: form.currentPincode,
            },
        });
    } else {
        handleChange({
            target: {
                name: "permanentAddress",
                value: "",
            },
        });
        handleChange({
            target: {
                name: "permanentPincode",
                value: "",
            },
        });
    }
};
  return (
    <div className="mt-3 w-full rounded-[8px] border border-[#dfe5ec] bg-white p-4 sm:p-5 lg:p-6">
      {/* SECTION HEADER */}
      <div className="mb-4 border-b border-[#e4e9ef] pb-3">
        <h2 className="text-[16px] font-bold leading-5 text-[#101828]">
          Address Details
        </h2>
      </div>
      {/* ADDRESS GRID */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* CURRENT ADDRESS */}
        <div className="rounded-[8px] border border-[#e1e6ed] bg-[#fcfdfe] p-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
              Current Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              name="currentAddress"
              value={form.currentAddress || ""}
              onChange={handleChange}
              className={`w-full resize-none rounded-[6px] border bg-white px-3 py-2.5 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b2] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20 ${errors?.currentAddress
                ? "border-red-500"
                : "border-[#cfd7e2]"
                }`}
            />
            {errors?.currentAddress && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.currentAddress}
              </p>
            )}
          </div>
          {/* CURRENT PINCODE */}
          <div className="mt-4 max-w-[180px]">
            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
              Current Pincode <span className="text-red-500">*</span>
            </label>
            <input
              name="currentPincode"
              value={form.currentPincode || ""}
              onChange={handleChange}
              className={`h-[34px] w-full rounded-[6px] border bg-white px-3 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b2] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20 ${errors?.pincode
                ? "border-red-500"
                : "border-[#cfd7e2]"
                }`}
            />
            {errors?.currentPincode && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.currentPincode}
              </p>
            )}
          </div>
        </div>
        {/* PERMANENT ADDRESS */}
        <div className="rounded-[8px] border border-[#e1e6ed] bg-[#fcfdfe] p-4">
          {/* CHECKBOX - TOP RIGHT */}
          <div className="mb-3 flex justify-end">
            <label className="flex cursor-pointer items-center gap-2">
              <span className="text-[10px] font-medium text-[#667085]">
                Same as current
              </span>
              <input
                type="checkbox"
                checked={sameAsCurrent}
                onChange={handleSameAddress}
                className="
                            h-3.5
                            w-3.5
                            cursor-pointer
                            rounded
                            border-[#cfd7e2]
                            accent-[#0392a1]
                        "
              />
            </label>
          </div>
          {/* PERMANENT ADDRESS */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              name="permanentAddress"
              value={form.permanentAddress || ""}
              onChange={handleChange}
              className={`w-full resize-none rounded-[6px] border bg-white px-3 py-2.5 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b2] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20 ${errors?.permanentAddress
                ? "border-red-500"
                : "border-[#cfd7e2]"
                }`}
            />
            {errors?.permanentAddress && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.permanentAddress}
              </p>
            )}
          </div>
          {/* PERMANENT PINCODE */}
          <div className="mt-4 max-w-[180px]">
            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
              Permanent Pincode<span className="text-red-500">*</span>
            </label>
            <input
              name="permanentPincode"
              value={form.permanentPincode || ""}
              onChange={handleChange}
              className={`h-[34px] w-full rounded-[6px] border bg-white px-3 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b2] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20 ${errors?.pincode
                ? "border-red-500"
                : "border-[#cfd7e2]"
                }`}
            />
             {errors?.permanentPincode && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.permanentPincode} 
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





// useEffect(() => {
//   if (sameAsCurrent) {
//     handleChange({
//       target: {
//         name: "permanentAddress",
//         value: form.currentAddress
//       }
//     });
//     handleChange({
//       target: {
//         name: "permanentPincode",
//         value: form.currentPincode
//       }
//     });
//   }
// }, [
//   form.currentAddress,
//   form.currentPincode,
//   sameAsCurrent
// ]);


// if (!form.currentPincode)
//     newErrors.currentPincode = "Current Pincode required";

// if (!form.permanentPincode)
//     newErrors.permanentPincode = "Permanent Pincode required";





















// export default function AddressDetails({
//   form,
//   errors,
//   handleChange,
// }) {
//   return (
//     <div className="mt-6 bg-white border rounded-xl p-6">
//       <h2 className="font-semibold text-lg mb-6">
//         Address Details
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

//         <div>
//           <label className="block text-sm mb-2">
//             Current Address *
//           </label>

//           <textarea
//             rows={4}
//             name="currentAddress"
//             value={form.currentAddress || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg px-3 py-3 ${
//               errors?.currentAddress ? "border-red-500" : ""
//             }`}
//           />
//           {errors?.currentAddress && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.currentAddress}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm mb-2">
//             Permanent Address *
//           </label>

//           <textarea
//             rows={4}
//             name="permanentAddress"
//             value={form.permanentAddress || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg px-3 py-3 ${
//               errors?.permanentAddress ? "border-red-500" : ""
//             }`}
//           />

//           {errors?.permanentAddress && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.permanentAddress}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm mb-2">
//             Pincode *
//           </label>

//           <input
//             name="pincode"
//             value={form.pincode || ""}
//             onChange={handleChange}
//             className={`w-full border rounded-lg px-3 py-3 ${
//               errors?.pincode ? "border-red-500" : ""
//             }`}
//           />

//           {errors?.pincode && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.pincode}
//             </p>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }