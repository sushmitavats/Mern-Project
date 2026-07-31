import { FaCamera } from "react-icons/fa";
export default function BasicInformation({
    form,
    errors,
    handleChange,
    handleImageChange,
    getInputClass
}) {
    const maxDOB = new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate()
    ).toISOString().split("T")[0];
    return (
        <div className="mt-3 w-full rounded-[8px] border border-[#dfe5ec] bg-white p-4 sm:p-5 lg:p-6">

            {/*HEADER  */}
            <div className="mb-4 border-b border-[#e4e9ef] pb-3">
                <h2 className="text-[16px] font-bold text-[#101828]">
                    Basic Information
                </h2>
            </div>
            {/*  MAIN GRID */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-12">
                {/*PROFILE PHOTO */}
                <div className="flex flex-col items-center md:col-span-2 lg:col-span-2">
                    <div className="relative">
                        <div className="
                        flex h-[96px] w-[96px]
                        items-center justify-center
                        overflow-hidden
                        rounded-full
                        border-2 border-dashed
                        border-[#cfd7e2]
                        bg-[#f0f3f7]
                    "
                        >
                            {form.profilePhoto && form.profilePhoto !== "" ? (
                                <img
                                    src={form.profilePhoto}
                                    alt="profile"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="relative h-[48px] w-[48px]">
                                    <div className="
                                    absolute left-1/2 top-0
                                    h-[19px] w-[19px]
                                    -translate-x-1/2
                                    rounded-full
                                    bg-[#aeb8c7]
                                "
                                    />
                                    <div className="
                                    absolute bottom-0 left-1/2
                                    h-[21px] w-[40px]
                                    -translate-x-1/2
                                    rounded-t-full
                                    bg-[#aeb8c7]
                                "
                                    />
                                </div>
                            )}
                        </div>
                        {/* CAMERA BUTTON */}
                        <label
                            className="
                        absolute bottom-[-3px] right-[-3px]
                        flex h-[25px] w-[25px]
                        cursor-pointer items-center justify-center
                        rounded-full border-2 border-white
                        bg-[#1877f2] text-white shadow-sm
                    "
                        >
                            <FaCamera className="text-[10px]" />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <p className="mt-2 text-center text-[11px] font-semibold text-[#17213b]">
                        Upload Profile Photo
                    </p>
                    <p className="mt-0.5 text-center text-[9px] text-[#8994a5]">
                        JPG, PNG (Max 2MB)
                    </p>
                </div>
                {/*  FORM AREA*/}
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:col-span-10 lg:grid-cols-4">
                    {/*  ROW 1  */}
                    {/* EMPLOYEE ID */}
                    {/* FIRST NAME */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="firstName"
                            value={form.firstName || ""}
                            readOnly
                            placeholder="Enter first name"
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-[#f8fafc]
                        px-3
                        text-[11px]
                        text-[#7c8798]
                        outline-none
                        placeholder:text-[#9aa4b2]
                    "
                        />
                    </div>
                    {/* MIDDLE NAME */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Middle Name
                        </label>
                        <input
                            name="middleName"
                            value={form.middleName || ""}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                        placeholder:text-[#9aa4b2]
                        focus:border-[#0392a1]
                        focus:ring-1
                        focus:ring-[#0392a1]/20
                    "
                        />
                    </div>
                    {/* LAST NAME */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="lastName"
                            value={form.lastName || ""}
                            readOnly
                            placeholder="Enter last name"
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-[#f8fafc]
                        px-3
                        text-[11px]
                        text-[#7c8798]
                        outline-none
                        placeholder:text-[#9aa4b2]
                    "
                        />
                    </div>
                    {/*  ROW 2 =================
                    {/* GENDER */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Gender <span className="text-red-500"></span>
                        </label>
                        <select
                            name="gender"
                            value={form.gender || ""}
                            onChange={handleChange}
                            className={getInputClass("gender")}
                        >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        {errors.gender && (
                            <p className="mt-1 text-[10px] text-red-500">
                                {errors.gender}
                            </p>
                        )}
                    </div>
                    {/* DATE OF BIRTH */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob ? form.dob.split("T")[0] : ""}
                            onChange={handleChange}
                            max={maxDOB}
                            className="
                              h-[34px]
                               w-full
                                rounded-[6px]
                                border
                                bg-white
                                px-3
                                text-[11px]
                                outline-none"
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.dob}
                            </p>
                        )}
                    </div>
                    {/* PERSONAL EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Personal Email <span className="text-red-500"></span>
                        </label>
                        <input
                            name="personalEmail"
                            value={form.personalEmail || ""}
                            onChange={handleChange}
                            placeholder="Enter personal email"
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                        placeholder:text-[#9aa4b2]
                        focus:border-[#0392a1]
                        focus:ring-1
                        focus:ring-[#0392a1]/20
                    "
                        />
                    </div>
                    {/* OFFICIAL EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Official Email *
                        </label>
                        <input
                            name="officialEmail"
                            value={form.officialEmail || ""}
                            readOnly
                            placeholder="Enter official email"
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-[#f8fafc]
                        px-3
                        text-[11px]
                        text-[#7c8798]
                        outline-none
                        placeholder:text-[#9aa4b2]
                    "
                        />
                    </div>
                    {/*  ROW 3 */}
                    {/* MOBILE */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="mobile"
                            value={form.mobile || ""}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            className={getInputClass("mobile")}
                        />
                        {errors.mobile &&
                            <p className="mt-1 text-[10px] text-red-500">
                                {errors.mobile}
                            </p>}
                    </div>
                    {/* ALTERNATE MOBILE */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Alternate Mobile <span className="text-red-500"></span>
                        </label>
                        <input
                            name="alternateMobile"
                            value={form.alternateMobile || ""}
                            onChange={handleChange}
                            placeholder="Enter alternate number"
                            className={getInputClass("alternateMobile")}
                        />
                        {errors.alternateMobile &&
                            <p className="mt-1 text-[10px] text-red-500">
                                {errors.alternateMobile}
                            </p>}
                    </div>
                    {/* MARITAL STATUS */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Marital Status
                        </label>
                        <select
                            name="maritalStatus"
                            value={form.maritalStatus || ""}
                            onChange={handleChange}
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                        focus:border-[#0392a1]
                        focus:ring-1
                        focus:ring-[#0392a1]/20"
                        >
                            <option value="">Select status</option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                        </select>
                    </div>
                    {/* BLOOD GROUP */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Blood Group
                        </label>
                        <select
                            name="bloodGroup"
                            value={form.bloodGroup || ""}
                            onChange={handleChange}
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                        focus:border-[#0392a1]
                        focus:ring-1
                        focus:ring-[#0392a1]/20
                    "
                        >
                            <option value="">Select blood group</option>
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                            <option>O+</option>
                            <option>O-</option>
                        </select>
                    </div>
                    {/* NATIONALITY */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Nationality
                        </label>
                        <select
                            name="nationality"
                            value={form.nationality || ""}
                            onChange={handleChange}
                            className="
                        h-[34px] w-full
                        rounded-[6px]
                        border border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                        focus:border-[#0392a1]
                        focus:ring-1
                        focus:ring-[#0392a1]/20
                    "
                        >
                            <option value="">Select nationality</option>
                            <option>Indian</option>
                            <option>American</option>
                            <option>British</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}


