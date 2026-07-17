export default function AdditionalDetails({
  form,
  errors,
  handleChange,
}) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">

      <h2 className="font-semibold text-lg mb-6">
        Additional Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label>Skills</label>

          <input
            name="skills"
            value={form.skills || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>Certifications</label>

          <input
            name="certifications"
            value={form.certifications || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>Languages</label>

          <input
            name="languages"
            value={form.languages || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>LinkedIn</label>

          <input
            name="linkedIn"
            value={form.linkedIn || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label>Notes</label>

          <textarea
            rows={4}
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

    </div>
  );
}