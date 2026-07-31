import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
import { FaCamera, FaCheckCircle } from "react-icons/fa";
// import { getEmployeeProfile } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import {getEmployeeProfile,updateEmployeeProfile,} from "../api";
import { toast } from "react-toastify";

export default function EmployeeProfile() {
    const navigate = useNavigate();
    const { employee_code } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
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
        setEmployee((prev) => ({ ...prev, [name]: value }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImage(file);
        const preview = URL.createObjectURL(file);
        setEmployee((prev) => ({
            ...prev,
            profilePhoto: preview,
        }));
    };
    // const handleImageChange = (e) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setEmployee((prev) => ({
    //             ...prev,
    //             profilePhoto: reader.result,
    //         }));
    //     };
    //     reader.readAsDataURL(file);
    // };
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log("Updated Employee:", employee);
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            // phone number
            formData.append("mobile", employee.phone);
            // profile photo
            if (selectedImage) {
                formData.append("profilePhoto", selectedImage);
            }
            await updateEmployeeProfile(employee.employeeId, formData);
            toast.success("Profile updated successfully");
            // Refresh latest data
            fetchEmployeeProfile();
            // Clear temporary file
            setSelectedImage(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };
    return (
        <div className="min-h-screen bg-[#EDF2F7] p-4 sm:p-5 lg:p-6">
            <div className="rounded-xl border border-[#D9E1E8] bg-white shadow-[0_2px_8px_rgba(14,41,64,0.05)]">
                {/* PAGE HEADER */}
                {/* <div className="border-b border-[#E5EAF0] px-5 py-4 sm:px-6">
                    <h1 className="text-[22px] font-semibold text-[#0E2940]">
                        Employee Profile
                    </h1>
                    <p className="mt-1 text-[12px] text-[#7A8795]">
                        Update employee personal and official information
                    </p>
                </div> */}
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
                                <p className="mt-5 text-center text-[11px] font-semibold text-[#17213B]">
                                    Upload Profile Photo
                                </p>
                                <p className="mt-1 text-center text-[10px] text-[#8994A5]">
                                    JPG, PNG (Max 2MB)
                                </p>
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
                                    {/* PHONE */}
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-[#17213B]">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={employee.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="h-[44px] w-full rounded-md border border-[#D5DDE5] bg-[#F3F4F6] px-3 text-[14px] text-[#17213B] outline-none"
                                        />
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


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getEmployeeProfile } from "../api";

// export default function EmployeeProfile() {
//   const { employee_code } = useParams();
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProfile();
//   }, [employee_code]);

//   const fetchProfile = async () => {
//     try {
//       const res = await getEmployeeProfile(employee_code);
//       setProfile(res.data.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading profile...</div>;
//   if (!profile) return <div className="p-6">Employee not found</div>;

//   const basic = profile.basic || {};

//   return (
//     <div className="p-6 bg-[#EDF2F7] min-h-screen">
//       <div className="bg-white rounded-xl shadow border p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold text-[#0E2940]">
//               Employee Profile
//             </h1>
//             <p className="text-sm text-gray-500">
//               View employee profile
//             </p>
//           </div>

//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//           >
//             Back
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex flex-col items-center border-r pr-6">
//             {basic.profilePhoto ? (
//               <img
//                 src={basic.profilePhoto}
//                 alt="profile"
//                 className="w-32 h-32 rounded-full object-cover border"
//               />
//             ) : (
//               <div className="w-32 h-32 rounded-full bg-gray-200" />
//             )}

//             <h2 className="mt-4 text-lg font-semibold">
//               {basic.firstName} {basic.lastName}
//             </h2>

//             <p className="text-sm text-gray-500">
//               {basic.designation?.designationName}
//             </p>

//             <div className="mt-3 px-3 py-1 rounded-full bg-teal-50 border text-teal-700 text-xs font-semibold">
//               {basic.employee_code}
//             </div>
//           </div>

//           <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Employee ID</label>
//               <input
//                 value={basic.employee_code || ""}
//                 disabled
//                 className="w-full border rounded p-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Official Email</label>
//               <input
//                 value={basic.officialEmail || ""}
//                 disabled
//                 className="w-full border rounded p-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">First Name</label>
//               <input
//                 value={basic.firstName || ""}
//                 disabled
//                 className="w-full border rounded p-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Last Name</label>
//               <input
//                 value={basic.lastName || ""}
//                 disabled
//                 className="w-full border rounded p-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Mobile</label>
//               <input
//                 value={basic.mobile || ""}
//                 disabled
//                 className="w-full border rounded p-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Alternate Mobile</label>
//               <input
//                 value={basic.alternateMobile || ""}
//                 className="w-full border rounded p-2"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 flex justify-end">
//           <button className="px-5 py-2 bg-[#16B7AF] text-white rounded">
//             View Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }









































