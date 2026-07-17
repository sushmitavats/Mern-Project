export default function Documents() {
  const documents = [
    "Aadhaar Copy",
    "PAN Copy",
    "Photo",
    "Resume",
    "Offer Letter",
    "Cancelled Cheque",
    "Education Certificates",
    "Experience Certificates",
    "Employment Agreement",
  ];

  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {documents.map((doc, index) => (
          <div key={index}>
            <label className="block text-sm mb-2">
              {doc}
            </label>

            <input
              type="file"
              className="w-full border rounded-lg p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}