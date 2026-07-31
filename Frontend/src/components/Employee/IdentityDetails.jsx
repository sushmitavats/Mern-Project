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
    getInputClass,
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
        <div className="mt-3 w-full rounded-[8px] border border-[#dfe5ec] bg-white p-4 sm:p-5 lg:p-6">

            {/*SECTION HEADER  */}
            <div className="mb-4 border-b border-[#e4e9ef] pb-3">
                <h2 className="text-[16px] font-bold leading-5 text-[#101828]">
                    Identity Details
                </h2>
            </div>
            {/*  IDENTITY FORM GRID */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                {/*  AADHAAR */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        Aadhaar <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="aadhaar"
                        maxLength={12}
                        value={form.aadhaar || ""}
                        onChange={handleChange}
                        className={getInputClass("aadhaar")}
                    />
                    {errors.aadhaar && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.aadhaar}
                        </p>
                    )}
                </div>
                {/*PAN */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        PAN <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="pan"
                        value={form.pan || ""}
                        onChange={handleChange}
                        className={getInputClass("pan")}
                    />
                    {errors.pan && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.pan}
                        </p>
                    )}
                </div>
                {/*PASSPORT*/}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        Passport
                    </label>
                    <input
                        name="passport"
                        value={form.passport || ""}
                        onChange={handleChange}
                        className={getInputClass("passport")}
                    />
                    {errors.passport && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.passport}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        Driving License
                    </label>
                    <input
                        name="drivingLicense"
                        value={form.drivingLicense || ""}
                        onChange={handleChange}
                        className={getInputClass("drivingLicense")}
                    />

                    {errors.drivingLicense && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.drivingLicense}
                        </p>
                    )}
                </div>
                {/*  UAN */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        UAN
                    </label>
                    <input
                        name="uan"
                        value={form.uan || ""}
                        onChange={handleChange}
                        className={getInputClass("uan")}
                    />
                    {errors.uan && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.uan}
                        </p>
                    )}
                </div>
                {/*  PF  */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        PF Number
                    </label>
                    <input
                        name="pfNumber"
                        value={form.pfNumber || ""}
                        onChange={handleChange}
                        className={getInputClass("pfNumber")}
                    />
                    {errors.pfNumber && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.pfNumber}
                        </p>
                    )}
                </div>
                {/*  ESIC  */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        ESIC
                    </label>
                    <input
                        name="esic"
                        value={form.esic || ""}
                        onChange={handleChange}
                        className={getInputClass("esic")}
                    />
                    {errors.esic && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {errors.esic}
                        </p>
                    )}
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                    <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                        Upload Documents *
                    </label>
                    <div
                        className="
                    rounded-[8px]
                    border
                    border-dashed
                    border-[#cfd7e2]
                    bg-[#fafbfc]
                    p-4
                    transition
                    hover:border-[#0392a1]
                    hover:bg-[#f8fcfc]
                "
                    >

                        <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleIdentityDocumentChange}
                            className="
                        block
                        w-full
                        cursor-pointer
                        rounded-[6px]
                        border
                        border-[#d7dee8]
                        bg-white
                        p-2
                        text-[11px]
                        text-[#667085]
                        file:mr-3
                        file:rounded-[5px]
                        file:border-0
                        file:bg-[#0392a1]
                        file:px-3
                        file:py-1.5
                        file:text-[10px]
                        file:font-semibold
                        file:text-white
                        hover:file:bg-[#027d89]
                    "
                        />
                        <p className="mt-2 text-[10px] leading-4 text-[#8994a5]">
                            Maximum 6 files
                            <br />
                            JPG, JPEG, PNG, PDF
                            <br />
                            Maximum 2 MB each
                        </p>
                    </div>
                    {errors.documents && (
                        <p className="mt-2 text-[10px] text-red-500">
                            {errors.documents}
                        </p>
                    )}
                    {/* EXISTING DOCUMENTS */}
                    {form.documents &&
                        form.documents.length > 0 && (
                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {form.documents.map((doc) => (
                                    <div
                                        key={doc._id}
                                        className="
                                    overflow-hidden
                                    rounded-[8px]
                                    border
                                    border-[#dfe5ec]
                                    bg-white
                                    p-3
                                    shadow-sm
                                "
                                    >
                                        <div
                                            className="
                                        flex
                                        h-[120px]
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[6px]
                                        bg-[#f5f7fa]
                                    "
                                        >
                                            {doc.fileType === "application/pdf" ? (
                                                <FaFilePdf
                                                    size={55}
                                                    className="text-red-500"
                                                />
                                            ) : (
                                                <img
                                                    src={doc.filePath}
                                                    alt={doc.fileName}
                                                    className="h-full w-full object-contain"
                                                />
                                            )}
                                        </div>
                                        <p className="mt-2 truncate text-center text-[10px] font-medium text-[#344054]">
                                            {doc.fileName}
                                        </p>
                                        <div className="mt-3 flex justify-center gap-4">
                                            <a
                                                href={doc.filePath}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                            text-[#0392a1]
                                            transition
                                            hover:text-[#027d89]
                                        "
                                            >
                                                <FaEye />
                                            </a>
                                            <button
                                                type="button"
                                                className="
                                            text-red-500
                                            transition
                                            hover:text-red-700
                                        "
                                                onClick={() =>
                                                    handleDeleteDocument(doc._id)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
                {/*NEW DOCUMENTS */}
                <div className="sm:col-span-2 lg:col-span-4">
                    {selectedIdentityDocuments.length > 0 && (
                        <>
                            <h3 className="mb-3 mt-4 text-[13px] font-bold text-[#17213b]">
                                New Documents
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {selectedIdentityDocuments.map((item, index) => (
                                    <div
                                        key={index}
                                        className="
                                    overflow-hidden
                                    rounded-[8px]
                                    border
                                    border-[#cfe7ea]
                                    bg-[#f5fcfc]
                                    p-3
                                "
                                    >
                                        <div
                                            className="
                                        flex
                                        h-[120px]
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[6px]
                                        bg-[#f1f4f6]
                                    "
                                        >
                                            {item.file.type === "application/pdf" ? (

                                                <FaFilePdf
                                                    size={55}
                                                    className="text-red-500"
                                                />

                                            ) : (

                                                <img
                                                    src={item.preview}
                                                    alt=""
                                                    className="h-full w-full rounded-[6px] object-contain"
                                                />

                                            )}
                                        </div>
                                        <p className="mt-2 truncate text-center text-[10px] font-medium text-[#344054]">
                                            {item.file.name}
                                        </p>


                                        <div className="mt-3 flex justify-center gap-4">

                                            <a
                                                href={
                                                    item.file.type === "application/pdf"
                                                        ? URL.createObjectURL(item.file)
                                                        : item.preview
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#0392a1]"
                                            >
                                                <FaEye />
                                            </a>
                                            <button
                                                type="button"
                                                className="text-red-500"
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
