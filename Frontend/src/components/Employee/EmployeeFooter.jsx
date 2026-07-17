export default function EmployeeFooter({
  uploading,
  handleSaveDraft,
  handleSaveNext,
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">

      <button
        type="button"
        onClick={handleSaveDraft}
        disabled={uploading}
        className={`border px-5 py-2 rounded-lg ${
          uploading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100"
        }`}
      >
        {uploading ? "Uploading..." : "Save Draft"}
      </button>

      <button
        type="button"
        onClick={handleSaveNext}
        disabled={uploading}
        className={`px-6 py-2 rounded-lg text-white ${
          uploading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Save & Next →"}
      </button>

    </div>
  );
}
