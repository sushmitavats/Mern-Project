export default function AddressDetails({
  form,
  errors,
  handleChange,
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Address Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        <div>
          <label className="block text-sm mb-2">
            Current Address *
          </label>

          <textarea
            rows={4}
            name="currentAddress"
            value={form.currentAddress || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.currentAddress ? "border-red-500" : ""
            }`}
          />

          {errors?.currentAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentAddress}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Permanent Address *
          </label>

          <textarea
            rows={4}
            name="permanentAddress"
            value={form.permanentAddress || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.permanentAddress ? "border-red-500" : ""
            }`}
          />

          {errors?.permanentAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.permanentAddress}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Pincode *
          </label>

          <input
            name="pincode"
            value={form.pincode || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.pincode ? "border-red-500" : ""
            }`}
          />

          {errors?.pincode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pincode}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}