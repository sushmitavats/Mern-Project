import React, { useState, useEffect } from "react";
import { FaCamera, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeProfile, updateEmployeeProfile, } from "../api";
import { toast } from "react-toastify";

export default function EmployeeProfile() {
    const navigate = useNavigate();
    const { employee_code } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [employee, setEmployee] = useState({
        fullName: "",
        employeeId: "",
        email: "",
        phone: "",
        alternateMobile: "",
        dob: "",
        gender: "",
        department: "",
        designation: "",
        profilePhoto: "",
    });
    useEffect(() => {
        fetchEmployeeProfile();
    }, [employee_code]);
    // get all data from hr page
    const fetchEmployeeProfile = async () => {
        try {
            const res = await getEmployeeProfile(employee_code);
            const profile = res.data.data;
            const basic = profile.basic || {};
            setEmployee({
                fullName:
                    `${basic.firstName || ""} ${basic.middleName || ""} ${basic.lastName || ""}`.trim(),
                employeeId: basic.employee_code || "",
                email: basic.officialEmail || "",
                phone: basic.mobile || "",
                alternateMobile: basic.alternateMobile || "",
                dob: basic.dob ? basic.dob.split("T")[0] : "",
                gender: basic.gender || "",
                department: basic.department?.departmentName || "",
                designation: basic.designation?.designationName || "",
                profilePhoto: basic.profilePhoto || "",
            });
        } catch (err) {
            console.log(err);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow only digits for alternate mobile
        if (name === "alternateMobile") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setEmployee((prev) => ({
                ...prev,
                alternateMobile: digitsOnly,
            }));
            if (digitsOnly && !/^[6-9]\d{9}$/.test(digitsOnly)) {
                setErrors((prev) => ({
                    ...prev,
                    alternateMobile:
                        "Enter a valid 10-digit mobile number starting with 6-9",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    alternateMobile: "",
                }));
            }
            return;
        }
        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    //user can change their profile pic
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Allowed file types
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG files are allowed.");
            e.target.value = ""; // clear invalid file
            return;
        }
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("Profile photo must be less than 2 MB.");
            e.target.value = "";
            return;
        }
        // Save the actual file for backend upload
        setSelectedImage(file);
        // Show preview immediately
        const preview = URL.createObjectURL(file);
        setEmployee((prev) => ({
            ...prev,
            profilePhoto: preview,
        }));
    };
    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (employee.alternateMobile && !/^[6-9]\d{9}$/.test(employee.alternateMobile)) {
            setErrors({
                alternateMobile:
                    "Enter a valid 10-digit mobile number starting with 6-9",
            });
            return;
        }
        try {
            const formData = new FormData();
            formData.append(
                "alternateMobile",
                employee.alternateMobile
            );
            if (selectedImage) {
                formData.append(
                    "profilePhoto",
                    selectedImage
                );
            }
            await updateEmployeeProfile(
                employee.employeeId,
                formData
            );
            toast.success(
                "Profile updated successfully"
            );
            fetchEmployeeProfile();
            setSelectedImage(null);
        } catch (err) {
            console.error(err);
            toast.error(
                "Failed to update profile"
            );
        }
    };
    return (
        <div className="min-h-screen bg-[#EDF2F7] p-4 sm:p-5 lg:p-6">
            <div className="rounded-xl border border-[#D9E1E8] bg-white shadow-[0_2px_8px_rgba(14,41,64,0.05)]">
                {/* PAGE HEADER */}
                <div className="border-b border-[#E5EAF0] px-5 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold text-[#0E2940]">
                            Employee Profile
                        </h1>
                        <p className="text-[12px] text-[#7A8795]">
                            Update employee personal and official information
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/employee-profile/view/${employee.employeeId}`)
                        }
                        className="px-4 py-2 rounded-md bg-[#0E2940] text-white hover:bg-[#12395b]">
                        View Profile
                    </button>
                </div>
                {/* CONTENT */}
                <div className="px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* LEFT PROFILE SECTION */}
                            <div className="flex flex-col items-center border-b border-[#E5EAF0] pb-7 lg:col-span-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                                {/* PROFILE IMAGE */}
                                <div className="relative">
                                    <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full border-2 border-[#D8E0E7] bg-[#F2F5F8]">
                                        {employee.profilePhoto ? (
                                            <img
                                                src={employee.profilePhoto}
                                                alt="profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="relative h-[60px] w-[60px]">
                                                <div className="absolute left-1/2 top-0 h-[24px] w-[24px] -translate-x-1/2 rounded-full bg-[#AEB8C7]" />
                                                <div className="absolute bottom-0 left-1/2 h-[28px] w-[52px] -translate-x-1/2 rounded-t-full bg-[#AEB8C7]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* CAMERA BUTTON */}
                                    <label className="absolute bottom-0 right-0 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#16B7AF] text-white shadow-md transition hover:bg-[#0E9C95]">
                                        <FaCamera className="text-[12px]" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                {/* NAME */}
                                <p className="mt-5 text-center text-[18px] font-semibold text-[#17213B]">
                                    {employee.fullName}
                                </p>
                                {/* DESIGNATION */}
                                <p className="mt-1 text-center text-[13px] text-[#667085]">
                                    {employee.designation}
                                </p>
                                {/* EMPLOYEE ID */}
                                <div className="mt-4 rounded-full border border-[#D8E6E8] bg-[#EFFAF9] px-3 py-1">
                                    <span className="text-[11px] font-semibold text-[#0E9C95]">
                                        {employee.employeeId}
                                    </span>
                                </div>
                                {/* UPLOAD TEXT */}
                                {/* <p className="mt-5 text-center text-[11px] font-semibold text-[#17213B]">
                                    Upload Profile Photo
                                </p>
                                <p className="mt-1 text-center text-[10px] text-[#8994A5]">
                                    JPG, PNG (Max 2MB)
                                </p> */}
                            </div>
                            {/* RIGHT FORM SECTION */}
                            <div className="lg:col-span-9">
                                <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                                    {/* EMPLOYEE ID */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Employee ID
                                        </label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={employee.employeeId}
                                            // onChange={handleChange}
                                            disabled
                                            placeholder="Enter employee ID"
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition placeholder:text-[#98A2B3] focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"

                                        />
                                    </div>
                                    {/* FULL NAME */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={employee.fullName}
                                            // onChange={handleChange}
                                            readOnly
                                            placeholder="Enter full name"
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition placeholder:text-[#98A2B3] focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />
                                    </div>
                                    {/* EMAIL */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={employee.email}
                                            onChange={handleChange}
                                            disabled
                                            placeholder="Enter email address"
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition placeholder:text-[#98A2B3] focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />

                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Alternate Mobile
                                        </label>
                                        <input
                                            type="text"
                                            name="alternateMobile"
                                            value={employee.alternateMobile}
                                            onChange={handleChange}
                                            maxLength={10}
                                            placeholder="Enter alternate mobile number"
                                            className={`h-[44px] w-full rounded-md border px-3 text-[14px] outline-none ${errors.alternateMobile
                                                ? "border-red-500 bg-red-50"
                                                : "border-[#D5DDE5] bg-[#F3F4F6]"
                                                }`}
                                        />
                                        {errors.alternateMobile && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.alternateMobile}
                                            </p>
                                        )}
                                    </div>
                                    {/* DATE OF BIRTH */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={employee.dob}
                                            // onChange={handleChange}
                                            readOnly
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />
                                    </div>
                                    {/* GENDER */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Gender
                                        </label>
                                        <input
                                            type="text"
                                            name="gender"
                                            value={employee.gender}
                                            readOnly
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />

                                    </div>
                                    {/* DEPARTMENT */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={employee.department}
                                            // onChange={handleChange}
                                            readOnly
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />
                                    </div>
                                    {/* DESIGNATION */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Designation
                                        </label>
                                        {/* <select
                                            name="designation"
                                            value={employee.designation}
                                            // onChange={handleChange}
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        >
                                        </select> */}
                                        <input
                                            type="text"
                                            name="designation"
                                            value={employee.designation}
                                            // onChange={handleChange}
                                            readOnly
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-white px-3 text-[14px] text-[#17213B] outline-none transition focus:border-[#16B7AF] focus:ring-2 focus:ring-[#16B7AF]/10"
                                        />

                                    </div>
                                </div>
                                {/* BOTTOM ACTION */}
                                <div className="mt-7 flex justify-end border-t border-[#E5EAF0] pt-5">
                                    <button
                                        type="submit"
                                        className="inline-flex h-[42px] items-center gap-2 rounded-md bg-[#16B7AF] px-5 text-[13px] font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0E9C95] hover:shadow-md"
                                    >
                                        <FaCheckCircle className="text-[14px]" />
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}
