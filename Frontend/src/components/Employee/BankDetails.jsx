import { FaTrash, FaEye, FaFilePdf } from "react-icons/fa";
import { deleteBankDocument } from "../../api";
export default function BankDetails({ form, setForm, errors, handleChange, handleChequeChange, selectedCheques, removeSelectedCheque, employeeCode }) {

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
      setForm(prev => ({
        ...prev,
        cancelledCheque:
          prev.cancelledCheque.filter(
            doc => doc._id !== documentId
          )
      }));
    }
    catch (err) {
      console.log(err);
      alert("Unable to delete document.");
    }
  };
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Bank Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        <div>
          <label>Account Holder *</label>

          <input
            name="accountHolder"
            value={form.accountHolder || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.accountHolder ? "border-red-500" : ""
              }`}
          />

          {errors?.accountHolder && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountHolder}
            </p>
          )}
        </div>

        <div>
          <label>Bank *</label>
          <input
            name="bankName"
            value={form.bankName || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.bankName ? "border-red-500" : ""
              }`}
          />
          {errors?.bankName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.bankName}
            </p>
          )}
        </div>

        <div>
          <label>Account Number *</label>
          <input
            name="accountNumber"
            value={form.accountNumber || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.accountNumber ? "border-red-500" : ""
              }`}
          />

          {errors?.accountNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountNumber}
            </p>
          )}
        </div>

        <div>
          <label>IFSC *</label>

          <input
            name="ifsc"
            value={form.ifsc || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 ${errors?.ifsc ? "border-red-500" : ""
              }`}
          />

          {errors?.ifsc && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ifsc}
            </p>
          )}
        </div>

        <div>
          <label>Branch</label>

          <input
            name="branch"
            value={form.branch || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>UPI</label>

          <input
            name="upi"
            value={form.upi || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div className="md:col-span-3">
          <label className="font-medium">
            Upload Bank Document
          </label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChequeChange}
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
            form.cancelledCheque &&
            form.cancelledCheque.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {
                  form.cancelledCheque.map((doc) => (
                    <div
                      key={doc._id}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-center">
                        {
                          doc.fileType === "application/pdf"
                            ?
                            <div className="flex flex-col items-center">
                              <FaFilePdf
                                size={70}
                                className="text-red-500"
                              />
                            </div>
                            :
                            <img
                              src={doc.filePath}
                              alt={doc.fileName}
                              className="w-28 h-28 object-cover rounded"
                            />
                        }
                      </div>
                      <p
                        className="text-xs mt-3 text-center truncate"
                      >
                        {doc.fileName}
                      </p>
                      <div className="flex justify-center gap-4 mt-3">
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600"
                        >
                          <FaEye size={18} />
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteDocument(doc._id)
                          }
                          className="text-red-600"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            selectedCheques.length > 0 && (
              <>
                <h3 className="font-semibold mt-8 mb-4">
                  New Documents
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {
                    selectedCheques.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-blue-50"
                      >
                        <div className="flex justify-center">
                          {
                            item.file.type === "application/pdf"
                              ?
                              <FaFilePdf
                                size={70}
                                className="text-red-500"
                              />
                              :
                              <img
                                src={item.preview}
                                alt=""
                                className="w-28 h-28 object-cover rounded"
                              />
                          }
                        </div>
                        <p
                          className="text-xs text-center truncate mt-3" >
                          {item.file.name}
                        </p>
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
                              removeSelectedCheque(index)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </>
            )
          }
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}





