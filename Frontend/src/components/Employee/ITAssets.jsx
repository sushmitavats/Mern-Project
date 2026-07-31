export default function ITAssets({
  form,
  errors,
  handleChange,
   getInputClass
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="text-[16px] font-bold leading-5 text-[#101828] mb-4 border-b border-[#e4e9ef] pb-3">
        IT & Assets
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">System ID*</label>
          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
             className={getInputClass("username")}
          />
          {errors?.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">Official Email *</label>
          <input
            name="officialEmail"
            value={form.officialEmail || ""}
            // onChange={handleChange}
             readOnly
             className={getInputClass("officialEmail")}
           
          />
          {errors?.officialEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.officialEmail}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">Laptop</label>
          <input
            name="laptop"
            value={form.laptop || ""}
            onChange={handleChange}
            className={getInputClass("laptop")}

          />
          {errors?.laptop && (
            <p className="text-red-500 text-xs mt-1">
              {errors.laptop}
            </p>
          )}
        </div>
        {/* <div>
          <label>Assert ID</label>
          <input
            name="assetId"
            value={form.assetId || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.assetId ? "border-red-500" : ""
              }`}
          />

          {errors?.assetId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.assetId}
            </p>
          )}
        </div> */}

        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">Git / Jira / CRM Access</label>      
          <input
            name="systemAccess"
            value={form.systemAccess || ""}
            onChange={handleChange}
           className={getInputClass("systemAccess")}
          />
          {errors?.systemAccess && (
            <p className="text-red-500 text-xs mt-1">
              {errors.systemAccess}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}


