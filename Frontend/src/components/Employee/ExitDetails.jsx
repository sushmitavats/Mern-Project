export default function ExitDetails({
  form,
  errors,
  handleChange,
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Exit Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label>Resignation Date</label>
          <input
            type="date"
            name="resignationDate"
            value={form.resignationDate || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.resignationDate
              ? "border-red-500"
              : ""
              }`}
          />
          {errors?.resignationDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.resignationDate}
            </p>
          )}
        </div>
        <div>
          <label>Last Working Day</label>
          <input
            type="date"
            name="lwd"
            value={form.lwd || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div>
          <label>Exit Reason</label>
          <input
            name="exitReason"
            value={form.exitReason || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>F & F Status</label>
          <input
            name="fnf"
            value={form.fnf || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
}