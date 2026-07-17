import { FaCamera } from "react-icons/fa";
export default function BasicInformation({
    form,
    errors,
    handleChange,
    handleImageChange
}) {
    return (
        <div className="mt-6 bg-white border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-6">
                Basic Information
            </h2>
            <h3 className="font-medium text-gray-700 mb-5">
                Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {/* Profile */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-40 border rounded-lg overflow-hidden shadow bg-gray-100">
                        {form.profilePhoto && form.profilePhoto !== "" ?
                            <img
                                src={form.profilePhoto}
                                alt="profile"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            :
                            <div className="text-center">
                                <FaCamera className="mx-auto text-3xl text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                    Passport Photo
                                </p>
                            </div>
                        }
                    </div>
                    <label
                        className="mt-3 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Upload img
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </label>
                </div>              
                <div>
                    <label className="block text-sm mb-2">
                        First Name *
                    </label>
                    <input
                        name="firstName"
                        value={form.firstName || ""}
                        readOnly
                        className="w-full border rounded-lg px-3 py-3 bg-gray-100 cursor-not-allowed"
                    />
                </div>
                {/* Middle */}
                <div>
                    <label className="block text-sm mb-2">
                        Middle Name
                    </label>
                    <input
                        name="middleName"
                        value={form.middleName || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Last */}
                <div>
                    <label className="block text-sm mb-2">
                        Last Name *
                    </label>
                    <input
                        name="lastName"
                        value={form.lastName || ""}
                        readOnly
                        className="w-full border rounded-lg px-3 py-3 bg-gray-100 cursor-not-allowed"
                    />
                </div>
                {/* Gender */}
                <div>
                    <label className="block text-sm mb-2">
                        Gender *
                    </label>
                    <select
                        name="gender"
                        value={form.gender || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                {/* DOB */}
                <div>
                    <label className="block text-sm mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={
                            form.dob
                                ? form.dob.split("T")[0]
                                : ""
                        }
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Marital */}
                <div>
                    <label className="block text-sm mb-2">
                        Marital Status
                    </label>
                    <select
                        name="maritalStatus"
                        value={form.maritalStatus || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                    </select>
                </div>
                {/* Blood */}
                <div>
                    <label className="block text-sm mb-2">
                        Blood Group
                    </label>
                    <select
                        name="bloodGroup"
                        value={form.bloodGroup || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select</option>
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
                <div>
                    <label className="block text-sm mb-2">
                        Personal Email
                    </label>
                    <input
                        name="personalEmail"
                        value={form.personalEmail || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        Official Email *
                    </label>
                    <input
                        name="officialEmail"
                        value={form.officialEmail || ""}
                        readOnly
                        className="w-full border rounded-lg px-3 py-3 bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-2">
                        Mobile *
                    </label>
                    <input
                        name="mobile"
                        value={form.mobile || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-3 py-3 ${errors.mobile ? "border-red-500" : ""
                            }`}
                    />
                    {errors.mobile && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.mobile}
                        </p>
                    )}
                 
                </div>
                {/* Alternate */}
                <div>
                    <label className="block text-sm mb-2">
                        Alternate Mobile
                    </label>
                    <input
                        name="alternateMobile"
                        value={form.alternateMobile || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    />
                </div>
                {/* Nationality */}
                <div>
                    <label className="block text-sm mb-2">
                        Nationality
                    </label>
                    <select
                        name="nationality"
                        value={form.nationality || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3"
                    >
                        <option value="">Select</option>
                        <option>Indian</option>
                        <option>American</option>
                        <option>British</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
        </div>
    );
}