export default function EmploymentDetails({ form = {}, handleChange, errors = {}, departments, designations }) {
    return (
        <div className="mt-6 bg-white border rounded-xl p-6">

            <h2 className="font-semibold text-lg mb-6">
                Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Employee Type */}
                <div>
                    <label className="block text-sm mb-2">
                        Employee Type *
                    </label>
                    <select
                        name="employeeType"
                        value={form.employeeType || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.employeeType ? "border-red-500" : ""
                            }`}
                    >
                        <option value="">Select</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Freelancer">Freelancer</option>
                    </select>
                    {errors.employeeType && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.employeeType}
                        </p>
                    )}
                </div>
                {/* Department */}
                {/* Department */}
                <div>
                    <label className="block text-sm mb-2">
                        Department *
                    </label>

                    <select
                        name="department"
                        value={form.department || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select Department</option>

                        {departments.map((dept) => (
                            <option
                                key={dept._id}
                                value={dept._id}
                            >
                                {dept.departmentName}
                            </option>
                        ))}
                    </select>

                    {errors.department && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.department}
                        </p>
                    )}
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-sm mb-2">
                        Designation *
                    </label>

                    <select
                        name="designation"
                        value={form.designation || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select Designation</option>

                        {designations
                            .filter(
                                des => des.department?._id === form.department
                            )
                            .map(des => (
                                <option
                                    key={des._id}
                                    value={des._id}
                                >
                                    {des.designationName}
                                </option>
                            ))}
                    </select>

                    {errors.designation && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.designation}
                        </p>
                    )}
                </div>
                {/* Reporting Manager */}
                <div>
                    <label className="block text-sm mb-2">
                        Reporting Manager *
                    </label>
                    {/* <input
                        name="reportingManager"
                        value={form.reportingManager || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    /> */}
                    <input
                        name="reportingManager"
                        value={form.reportingManager || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.reportingManager
                            ? "border-red-500"
                            : ""
                            }`}
                    />
                    {errors.reportingManager && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.reportingManager}
                        </p>
                    )}
                </div>
                {/* Team */}
                <div>
                    <label className="block text-sm mb-2">
                        Team
                    </label>
                    <input
                        name="team"
                        value={form.team || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Work Location */}
                <div>
                    <label className="block text-sm mb-2">
                        Work Location *
                    </label>
                    {/* <input
                        name="workLocation"
                        value={form.workLocation || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    /> */}
                    <input
                        name="workLocation"
                        value={form.workLocation || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.workLocation
                            ? "border-red-500"
                            : ""
                            }`}
                    />
                    {errors.workLocation && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.workLocation}
                        </p>
                    )}
                </div>
                {/* Office Branch */}
                <div>
                    <label className="block text-sm mb-2">
                        Office Branch
                    </label>

                    <input
                        name="officeBranch"
                        value={form.officeBranch || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Joining Date */}
                <div>
                    <label className="block text-sm mb-2">
                        Joining Date *
                    </label>
                    {/* <input
                        type="date"
                        name="joiningDate"
                        value={
                            form.joiningDate
                                ? form.joiningDate.split("T")[0]
                                : ""
                        }
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    /> */}
                    <input
                        type="date"
                        name="joiningDate"
                        // value={form.workLocation || ""}
                        value={
                            form.joiningDate
                                ? form.joiningDate.split("T")[0]
                                : ""
                        }
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.joiningDate
                            ? "border-red-500"
                            : ""
                            }`}
                    />
                    {errors.joiningDate && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.joiningDate}
                        </p>
                    )}
                </div>
                {/* Employment Status */}
                <div>
                    <label className="block text-sm mb-2">
                        Employment Status
                    </label>

                    <select
                        name="employmentStatus"
                        value={form.employmentStatus || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>On Leave</option>
                        <option>Resigned</option>
                    </select>
                </div>
                {/* Shift */}
                <div>
                    <label className="block text-sm mb-2">
                        Shift
                    </label>
                    <select
                        name="shift"
                        value={form.shift || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select</option>
                        <option>Morning</option>
                        <option>Evening</option>
                        <option>Night</option>
                    </select>
                </div>
                {/* Probation */}
                <div>
                    <label className="block text-sm mb-2">
                        Probation Period
                    </label>
                    <input
                        name="probationPeriod"
                        value={form.probationPeriod || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Confirmation */}
                <div>
                    <label className="block text-sm mb-2">
                        Confirmation Date
                    </label>
                    <input
                        type="date"
                        name="confirmationDate"
                        value={
                            form.confirmationDate
                                ? form.confirmationDate.split("T")[0]
                                : ""
                        }
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Notice */}
                <div>
                    <label className="block text-sm mb-2">
                        Notice Period
                    </label>
                    <input
                        name="noticePeriod"
                        value={form.noticePeriod || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Cost Center */}
                <div>
                    <label className="block text-sm mb-2">
                        Cost Center
                    </label>
                    <input
                        name="costCenter"
                        value={form.costCenter || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
            </div>
        </div>
    );
}