export default function EmergencyContact({
  form,
  errors,
  handleChange,
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Emergency Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div>
          <label className="block text-sm mb-2">
            Name *
          </label>

          <input
            name="emergencyName"
            value={form.emergencyName || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.emergencyName
                ? "border-red-500"
                : ""
            }`}
          />

          {errors?.emergencyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.emergencyName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Relationship *
          </label>

          <select
            name="relationship"
            value={form.relationship || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.relationship
                ? "border-red-500"
                : ""
            }`}
          >
            <option value="">Select</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Brother</option>
            <option>Sister</option>
            <option>Spouse</option>
            <option>Friend</option>
          </select>

          {errors?.relationship && (
            <p className="text-red-500 text-xs mt-1">
              {errors.relationship}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Phone *
          </label>

          <input
            name="emergencyPhone"
            value={form.emergencyPhone || ""}
            onChange={handleChange}
            maxLength={10}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.emergencyPhone
                ? "border-red-500"
                : ""
            }`}
          />

          {errors?.emergencyPhone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.emergencyPhone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Address
          </label>

          <textarea
            rows={2}
            name="emergencyAddress"
            value={form.emergencyAddress || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>

      </div>
    </div>
  );
}