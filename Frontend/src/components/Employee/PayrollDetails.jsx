export default function PayrollDetails({form,errors,handleChange,}) 
{
  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Payroll Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* CTC */}
        <div>
          <label className="block text-sm mb-2">
            CTC *
          </label>

          <input
            type="number"
            name="ctc"
            value={form.ctc || ""}
            onChange={handleChange}
            placeholder="Enter Annual CTC"
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.ctc ? "border-red-500" : ""
            }`}
          />

          {errors?.ctc && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ctc}
            </p>
          )}
        </div>

        {/* Payroll Group */}
        <div>
          <label className="block text-sm mb-2">
            Payroll Group *
          </label>

          <select
            name="payrollGroup"
            value={form.payrollGroup || ""}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.payrollGroup ? "border-red-500" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="Monthly">
              Monthly
            </option>
            <option value="Weekly">
              Weekly
            </option>
            <option value="Bi-Weekly">
              Bi-Weekly
            </option>
            <option value="Daily">
              Daily
            </option>
          </select>

          {errors?.payrollGroup && (
            <p className="text-red-500 text-xs mt-1">
              {errors.payrollGroup}
            </p>
          )}
        </div>

        {/* Salary Effective Date */}
        <div>
          <label className="block text-sm mb-2">
            Salary Effective Date *
          </label>

          <input
            type="date"
            name="salaryEffectiveDate"
            value={
              form.salaryEffectiveDate
                ? form.salaryEffectiveDate.split("T")[0]
                : ""
            }
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-3 ${
              errors?.salaryEffectiveDate
                ? "border-red-500"
                : ""
            }`}
          />

          {errors?.salaryEffectiveDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.salaryEffectiveDate}
            </p>
          )}
        </div>

        {/* Basic Salary */}
        <div>
          <label className="block text-sm mb-2">
            Basic Salary
          </label>

          <input
            type="number"
            name="basicSalary"
            value={form.basicSalary || ""}
            onChange={handleChange}
            placeholder="Basic Salary"
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>

        {/* HRA */}
        <div>
          <label className="block text-sm mb-2">
            HRA
          </label>

          <input
            type="number"
            name="hra"
            value={form.hra || ""}
            onChange={handleChange}
            placeholder="House Rent Allowance"
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>

        {/* Other Allowances */}
        <div>
          <label className="block text-sm mb-2">
            Other Allowances
          </label>

          <input
            name="allowances"
            value={form.allowances || ""}
            onChange={handleChange}
            placeholder="Medical, Travel etc."
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>

        {/* PF */}
        <div>
          <label className="block text-sm mb-2">
            PF Deduction
          </label>

          <input
            type="number"
            name="pfDeduction"
            value={form.pfDeduction || ""}
            onChange={handleChange}
            placeholder="PF Amount"
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>

        {/* ESIC */}
        <div>
          <label className="block text-sm mb-2">
            ESIC Deduction
          </label>
          <input
            type="number"
            name="esicDeduction"
            value={form.esicDeduction || ""}
            onChange={handleChange}
            placeholder="ESIC Amount"
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>
        {/* Professional Tax */}
        <div>
          <label className="block text-sm mb-2">
            Professional Tax
          </label>
          <input
            type="number"
            name="professionalTax"
            value={form.professionalTax || ""}
            onChange={handleChange}
            placeholder="Professional Tax"
            className="w-full border rounded-lg px-3 py-3"
          />
        </div>
      </div>
    </div>
  );
}