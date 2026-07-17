import { FaTrash, FaEye, FaFilePdf } from "react-icons/fa";
import { deleteIdentityDocument } from "../../api";
export default function IdentityDetails({
    form,
    errors,
    handleChange,
    handleIdentityDocumentChange,
    selectedIdentityDocuments,
    removeSelectedIdentityDocument,
    employeeCode,
    setForm,
}) {
    const handleDeleteDocument = async (documentId) => {
        const confirmDelete = window.confirm(
            "Delete this document?"
        );
        if (!confirmDelete) return;
        try {
            await deleteIdentityDocument(
                employeeCode,
                documentId
            );
            setForm(prev => ({
                ...prev,
                documents:
                    prev.documents.filter(
                        doc => doc._id !== documentId
                    )
            }));
        } catch (err) {
            console.log(err);
            alert("Unable to delete document.");
        }
    };
    return (
        <div className="mt-6 bg-white border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-6">
                Identity Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                    <label className="block text-sm mb-2">
                        Aadhaar *
                    </label>
                    <input
                        name="aadhaar"
                        maxLength={12}
                        value={form.aadhaar || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.aadhaar ? "border-red-500" : ""
                            }`}
                    />
                    {errors.aadhaar && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.aadhaar}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        PAN *
                    </label>
                    <input
                        name="pan"
                        value={form.pan || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 uppercase ${errors.pan ? "border-red-500" : ""
                            }`}
                    />
                    {errors.pan && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.pan}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        Passport
                    </label>
                    <input
                        name="passport"
                        value={form.passport || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        Driving License
                    </label>
                    <input
                        name="drivingLicense"
                        value={form.drivingLicense || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        UAN
                    </label>
                    <input
                        name="uan"
                        value={form.uan || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* PF */}
                <div>
                    <label className="block text-sm mb-2">
                        PF Number
                    </label>
                    <input
                        name="pfNumber"
                        value={form.pfNumber || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* ESIC */}
                <div>
                    <label className="block text-sm mb-2">
                        ESIC
                    </label>
                    <input
                        name="esic"
                        value={form.esic || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* document */}
                <div className="md:col-span-4">
                    <label className="font-medium">
                        Upload Documents 
                    </label>
                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleIdentityDocumentChange}
                        className="w-full border rounded-lg p-3 mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Maximum 6 files
                        <br />
                        JPG, JPEG, PNG, PDF
                        <br />
                        Maximum 2 MB each
                    </p>
                    {
                        errors.documents && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.documents}
                            </p>
                        )
                    }
                    {
                        form.documents &&
                        form.documents.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                                {
                                    form.documents.map((doc) => (
                                        <div
                                            key={doc._id}
                                            className="border rounded-lg p-3 bg-gray-50">
                                            <div className="h-36 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                                {doc.fileType === "application/pdf" ?
                                                    <FaFilePdf
                                                        size={70}
                                                        className="text-red-500"
                                                    />
                                                    :
                                                    <img
                                                        src={doc.filePath}
                                                        alt={doc.fileName}
                                                        className="w-full h-full object-contain"
                                                    />
                                                }
                                            </div>
                                            <p className="text-xs text-center truncate mt-3">
                                                {doc.fileName}
                                            </p>
                                            <div className="flex justify-center gap-3 mt-auto pt-4">
                                                <a
                                                    href={doc.filePath}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600"
                                                >
                                                    <FaEye />
                                                </a>
                                                <button
                                                    type="button"
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        handleDeleteDocument(doc._id)
                                                    }
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                </div>
                <div className="md:col-span-4">
                    {selectedIdentityDocuments.length > 0 && (
                        <>
                            <h3 className="font-semibold mt-8 mb-4">
                                New Documents
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {selectedIdentityDocuments.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-3 bg-blue-50"
                                    >
                                        <div className="h-36 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                            {item.file.type === "application/pdf" ? (
                                                <FaFilePdf
                                                    size={70}
                                                    className="text-red-500"
                                                />
                                            ) : (
                                                <img
                                                    src={item.preview}
                                                    alt=""
                                                    className="w-28 h-28 object-cover rounded"
                                                />
                                            )}
                                        </div>

                                        <p className="text-xs text-center truncate mt-3">
                                            {item.file.name}
                                        </p>

                                        {/* <div className="flex justify-center gap-4 mt-3">
                                                {item.file.type !== "application/pdf" && (
                                                    <a
                                                        href={item.preview}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600"
                                                    >
                                                        <FaEye />
                                                    </a>
                                                )}

                                                <button
                                                    type="button"
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        removeSelectedIdentityDocument(index)
                                                    }
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div> */}
                                        <div className="flex justify-center gap-4 mt-3">
                                            <a
                                                href={
                                                    item.file.type === "application/pdf"
                                                        ? URL.createObjectURL(item.file)
                                                        : item.preview
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600"
                                            >
                                                <FaEye />
                                            </a>

                                            <button
                                                type="button"
                                                className="text-red-600"
                                                onClick={() =>
                                                    removeSelectedIdentityDocument(index)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
