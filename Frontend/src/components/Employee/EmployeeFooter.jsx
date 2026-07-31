import { useNavigate } from "react-router-dom";
export default function EmployeeFooter({
  saveDraftLoading,
  saveNextLoading,
  handleSaveDraft,
  handleSaveNext,
  handleBack,
  isLastTab,
  isFirstTab,
}) {
  const navigate = useNavigate();
  return (
    <div className="mt-8 flex items-center justify-between">
      {/* Left Side Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          // disabled={uploading}
          disabled={saveDraftLoading || saveNextLoading}
          className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        {!isFirstTab && (
          <button
            type="button"
            onClick={handleBack}
            // disabled={uploading}
            disabled={saveDraftLoading || saveNextLoading}
            className="border border-gray-300 px-5 py-2 text-white rounded-lg hover:bg-[#02808d] bg-[#0392a1]"
          >
            ← Back
          </button>
        )}
      </div>
      {/* Right Side Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
        {/* <button
        type="button"
        onClick={handleSaveDraft}
        disabled={uploading}
        className={`border px-5 py-2 rounded-lg ${
          uploading
            ? "bg-[#0392a1]text-gray-500 cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100"
        }`}
      >
        {uploading ? "Uploading..." : "Save Draft"}
      </button> */}
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={saveDraftLoading || saveNextLoading}
          className={`border px-5 py-2 rounded-lg ${saveDraftLoading
            ? "bg-[#0392a1] text-white cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100"
            }`}
        >
          {saveDraftLoading ? "Uploading..." : "Save Draft"}
        </button>
        {/* <button
          type="button"
          onClick={handleSaveNext}
          disabled={uploading}
          className={`px-6 py-2 rounded-lg text-white ${uploading
              ? "bg-[#0392a1] cursor-not-allowed"
              : "bg-[#0392a1] hover:bg-[#0392a1]"
            }`}
        > */}
        {/* {uploading ? "Uploading..." : "Save & Next →"} */}
        {/* {uploading
            ? "Uploading..."
            : isLastTab
              ? "Submit"
              : "Save & Next →"}
        </button> */}
        <button
          type="button"
          onClick={handleSaveNext}
          disabled={saveDraftLoading || saveNextLoading}
          className={`px-6 py-2 rounded-lg text-white ${saveNextLoading
              ? "bg-[#0392a1] cursor-not-allowed"
              : "bg-[#0392a1] hover:bg-[#02808d]"
            }`}
        >
          {saveNextLoading
            ? "Uploading..."
            : isLastTab
              ? "Submit"
              : "Save & Next →"}
        </button>
      </div>


      {/* <div className="flex gap-3">
      <button
        type="button"
        onClick={handleSaveDraft}
        disabled={uploading}
        className={`border px-5 py-2 rounded-lg ${
          uploading
            ? "bg-[#0392a1] text-gray-500 cursor-not-allowed"
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
            ? "bg-[#0392a1] cursor-not-allowed"
            : "bg-[#0392a1] hover:bg-[#02808d]"
        }`}
      >
        {uploading
          ? "Uploading..."
          : isLastTab
          ? "Submit"
          : "Save & Next →"}
      </button>
    </div> */}
    </div>
  );
}
