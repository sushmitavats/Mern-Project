export default function ITAssets({
  form,
  errors,
  handleChange,
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        IT & Assets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div>
          <label>Username *</label>

          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${
              errors?.username
                ? "border-red-500"
                : ""
            }`}
          />

          {errors?.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label>Official Email *</label>

          <input
            name="officialEmail"
            value={form.officialEmail || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${
              errors?.officialEmail
                ? "border-red-500"
                : ""
            }`}
          />

          {errors?.officialEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.officialEmail}
            </p>
          )}
        </div>

        <div>
          <label>Laptop</label>

          <input
            name="laptop"
            value={form.laptop || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>Asset ID</label>

          <input
            name="assetId"
            value={form.assetId || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>Git / Jira / CRM Access</label>

          <input
            name="systemAccess"
            value={form.systemAccess || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>
    </div>
  );
}