export default function PayrollDetails({ form, errors, handleChange, getInputClass }) {

  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      <h2 className="text-[16px] font-bold leading-5 text-[#101828] mb-4 border-b border-[#e4e9ef] pb-3">
        Payroll Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CTC */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            CTC *
          </label>
          <input
            type="number"
            name="ctc"
            value={form.ctc ?? ""}
            onChange={handleChange}
            placeholder="Enter Annual CTC"
            className={getInputClass("ctc")}
          />

          {errors?.ctc && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ctc}
            </p>
          )}
        </div>

        {/* Payroll Group */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            Payroll Group *
          </label>
          <select
            name="payrollGroup"
            value={form.payrollGroup || ""}
            onChange={handleChange}
            className={getInputClass("payrollGroup")}
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
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
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
            className={getInputClass("salaryEffectiveDate")}
          />

          {errors?.salaryEffectiveDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.salaryEffectiveDate}
            </p>
          )}
        </div>

        {/* Basic Salary */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            Basic Salary
          </label>

          {/* <input
            type="number"
            name="basicSalary"
           value={form.basicSalary ?? ""}
            onChange={handleChange}
            placeholder="Basic Salary"
            className={getInputClass("basicSalary")}
          />
          {errors?.basicSalary && (
            <p className="text-red-500 text-xs mt-1">
              {errors.basicSalary}
            </p>
          )} */}
          <input
            type="text"
            inputMode="decimal"
            name="basicSalary"
            value={form.basicSalary ?? ""}
            onChange={handleChange}
            placeholder="Basic Salary"
            className={getInputClass("basicSalary")}
          />
          {errors?.basicSalary && (
            <p className="text-red-500 text-xs mt-1">{errors.basicSalary}</p>
          )}
        </div>

        {/* HRA */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            HRA
          </label>

          {/* <input
            type="number"
            name="hra"
            value={form.hra ?? ""}
            onChange={handleChange}
            placeholder="House Rent Allowance"
            className={getInputClass("hra")}
          /> */}
          <input
            type="text"
            inputMode="decimal"
            name="hra"
            value={form.hra ?? ""}
            onChange={handleChange}
            placeholder="House Rent Allowance"
            className={getInputClass("hra")}
          />
          {errors?.hra && (
            <p className="text-red-500 text-xs mt-1">{errors.hra}</p>
          )}
        </div>

        {/* Other Allowances */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            Other Allowances
          </label>

          {/* <input
            name="allowances"
            value={form.allowances ?? ""}
            onChange={handleChange}
            placeholder="Medical, Travel etc."
            className={getInputClass("allowances")}
          /> */}
          <input
            type="text"
            inputMode="decimal"
            name="allowances"
            value={form.allowances ?? ""}
            onChange={handleChange}
            placeholder="Medical, Travel etc."
            className={getInputClass("allowances")}
          />
          {errors?.allowances && (
            <p className="text-red-500 text-xs mt-1">{errors.allowances}</p>
          )}
        </div>

        {/* PF */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            PF Deduction
          </label>

          {/* <input
            type="number"
            name="pfDeduction"
            value={form.pfDeduction ?? ""}
            onChange={handleChange}
            placeholder="PF Amount"
            className={getInputClass("esicDeduction")}
          /> */}
          <input
            type="text"
            inputMode="decimal"
            name="pfDeduction"
            value={form.pfDeduction ?? ""}
            onChange={handleChange}
            placeholder="PF Amount"
            className={getInputClass("pfDeduction")}
          />
          {errors?.pfDeduction && (
            <p className="text-red-500 text-xs mt-1">{errors.pfDeduction}</p>
          )}
        </div>

        {/* ESIC */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            ESIC Deduction
          </label>
          {/* <input
            type="number"
            name="esicDeduction"
            value={form.esicDeduction ?? ""}
            onChange={handleChange}
            placeholder="ESIC Amount"
            className="w-full border rounded-lg px-3 py-3"
          /> */}
          <input
            type="text"
            inputMode="decimal"
            name="esicDeduction"
            value={form.esicDeduction ?? ""}
            onChange={handleChange}
            placeholder="ESIC Amount"
            className={getInputClass("esicDeduction")}
          />
          {errors?.esicDeduction && (
            <p className="text-red-500 text-xs mt-1">{errors.esicDeduction}</p>
          )}
        </div>
        {/* Professional Tax */}
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#17213b]">
            Professional Tax
          </label>
          {/* <input
            type="number"
            name="professionalTax"
            value={form.professionalTax ?? ""}
            onChange={handleChange}
            placeholder="Professional Tax"
            className={getInputClass("professionalTax")}
          /> */}
          <input
            type="text"
            inputMode="decimal"
            name="professionalTax"
            value={form.professionalTax ?? ""}
            onChange={handleChange}
            placeholder="Professional Tax"
            className={getInputClass("professionalTax")}
          />
          {errors?.professionalTax && (
            <p className="text-red-500 text-xs mt-1">{errors.professionalTax}</p>
          )}
        </div>
      </div>
    </div>
  );
}







// value={form.basicSalary ?? ""}
// value={form.hra ?? ""}
// value={form.allowances ?? ""}
// value={form.pfDeduction ?? ""}
// value={form.esicDeduction ?? ""}
// value={form.professionalTax ?? ""}