import { FaTrash, FaEye, FaFilePdf } from "react-icons/fa";
import { deleteBankDocument } from "../../api";
export default function BankDetails({ form, setForm, errors, handleChange, handleChequeChange, selectedCheques, removeSelectedCheque, employeeCode, getInputClass, setErrors, }) {

  const handleDeleteDocument = async (documentId) => {
    const confirmDelete = window.confirm(
      "Delete this document?"
    );
    if (!confirmDelete) return;
    try {
      await deleteBankDocument(
        employeeCode,
        documentId
      );
      // form.cancelledCheque =
      //   form.cancelledCheque.filter(
      //     doc => doc._id !== documentId
      //   );
      // setForm(prev => ({
      //   ...prev,
      //   cancelledCheque:
      //     prev.cancelledCheque.filter(
      //       doc => doc._id !== documentId
      //     )
      // }));
      setForm(prev => {
        const updatedDocs = prev.cancelledCheque.filter(
          doc => doc._id !== documentId
        );
        // update validation
        setErrors(prevErrors => ({
          ...prevErrors,
          cancelledCheque:
            updatedDocs.length + selectedCheques.length < 1
              ? "At least one bank document is required"
              : ""
        }));
        return {
          ...prev,
          cancelledCheque: updatedDocs
        };
      });
    }
    catch (err) {
      console.log(err);
      alert("Unable to delete document.");
    }
  };
  return (
    <div className="mt-3 w-full rounded-[8px] border border-[#dfe5ec] bg-white p-4 sm:p-5 lg:p-6">
      {/* SECTION HEADER */}
      <div className="mb-4 border-b border-[#e4e9ef] pb-3">
        <h2 className="text-[16px] font-bold leading-5 text-[#101828]">
          Bank Details
        </h2>
      </div>
      {/* BANK FORM */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* ACCOUNT HOLDER */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            Account Holder <span className="text-red-500">*</span>
          </label>
          <input
            name="accountHolder"
            value={form.accountHolder || ""}
            onChange={handleChange}
            className={getInputClass("accountHolder")}
          />
          {errors?.accountHolder && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.accountHolder}
            </p>
          )}
        </div>
        {/* BANK */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            Bank <span className="text-red-500">*</span>
          </label>
          <input
            name="bankName"
            value={form.bankName || ""}
            onChange={handleChange}
            className={getInputClass("bankName")}
          />
          {errors?.bankName && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.bankName}
            </p>
          )}
        </div>
        {/* ACCOUNT NUMBER */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            name="accountNumber"
            value={form.accountNumber || ""}
            onChange={handleChange}
            className={getInputClass("accountNumber")}
          />
          {errors?.accountNumber && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.accountNumber}
            </p>
          )}
        </div>
        {/* IFSC */}
        <div>

          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            IFSC <span className="text-red-500">*</span>
          </label>

          <input
            name="ifsc"
            value={form.ifsc || ""}
            onChange={handleChange}
            className={getInputClass("ifsc")}
          />

          {errors?.ifsc && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.ifsc}
            </p>
          )}
        </div>
        {/* BRANCH */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            Branch
          </label>
          <input
            name="branch"
            value={form.branch || ""}
            onChange={handleChange}
            className={getInputClass("branch")}
          />
          {errors?.branch && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.branch}
            </p>
          )}
        </div>
        {/* UPI */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
            UPI
          </label>
          <input
            name="upi"
            value={form.upi || ""}
            onChange={handleChange}
            className={getInputClass("upi")}
          />
          {errors?.upi && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.upi}
            </p>
          )}
        </div>
        {/* UPLOAD BANK DOCUMENT */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="mt-2 rounded-[8px] border border-[#e1e6ed] bg-[#fcfdfe] p-4">
            <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
              Upload Bank Document *
            </label>
            {/* UPLOAD BOX */}
            <div
              className="
                        rounded-[7px]
                        border
                        border-dashed
                        border-[#cfd7e2]
                        bg-white
                        p-3
                        transition-all
                        duration-200
                        hover:border-[#0392a1]
                        hover:bg-[#f8fcfc]
                    "
            >

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChequeChange}
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
                <br />
                At least one document require
              </p>
            </div>
            {/* {errors.cancelledCheque && (
                <p className="mt-2 text-[10px] text-red-500">
                  {errors.cancelledCheque}
                </p>
              )} */}
            {errors?.cancelledCheque && (
              <p className="mt-2 text-[10px] text-red-500">
                {errors.cancelledCheque}
              </p>
            )}
            {/* EXISTING DOCUMENTS */}
            {form.cancelledCheque &&
              form.cancelledCheque.length > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {form.cancelledCheque.map((doc) => (
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
                          <FaEye size={16} />
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteDocument(doc._id)
                          }
                          className="
                                                text-red-500
                                                transition
                                                hover:text-red-700
                                            "
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {/* NEW DOCUMENTS */}
            {selectedCheques.length > 0 && (
              <>
                <h3 className="mb-3 mt-6 text-[12px] font-bold text-[#17213b]">
                  New Documents
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {selectedCheques.map((item, index) => (
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
                            className="h-full w-full object-contain"
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
                          className="
                                                text-[#0392a1]
                                                transition
                                                hover:text-[#027d89]
                                            "
                        >
                          <FaEye size={16} />
                        </a>
                        <button
                          type="button"
                          className="
                                                text-red-500
                                                transition
                                                hover:text-red-700
                                            "
                          onClick={() =>
                            removeSelectedCheque(index)
                          }
                        >
                          <FaTrash size={16} />
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

    </div>
  );
}



