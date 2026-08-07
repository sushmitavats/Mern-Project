
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeProfile } from "../api";

export default function EmployeeProfileView() {
  const { employee_code } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [employee_code]);
  const fetchProfile = async () => {
    try {
      const res = await getEmployeeProfile(employee_code);
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }
  const basic = profile.basic || {};
  return (<div className="min-h-screen bg-[#EDF2F7] p-6"> <div className="bg-white rounded-xl shadow border"> <div className="border-b px-6 py-4 flex justify-between items-center"> <div> <h1 className="text-2xl font-semibold text-[#0E2940]">
    Employee Profile </h1> <p className="text-sm text-gray-500">
      Complete employee information </p> </div>
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-[#16B7AF] text-white rounded-md hover:bg-[#0E9C95]"
    >
      Back
    </button>
  </div>
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-6">
        {basic.profilePhoto ? (
          <img
            src={basic.profilePhoto}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200" />
        )}
        <div>
          <h2 className="text-xl font-semibold">
            {basic.firstName} {basic.middleName} {basic.lastName}
          </h2>
          <p className="text-gray-600">
            {basic.designation?.designationName}
          </p>
          <p className="text-sm text-gray-500">
            {basic.employee_code}
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="Employee ID" value={basic.employee_code} />
        <Info label="Official Email" value={basic.officialEmail} />
        <Info label="Personal Email" value={basic.personalEmail} />
        <Info label="Mobile" value={basic.mobile} />
        <Info label="Alternate Mobile" value={basic.alternateMobile} />
        <Info label="Gender" value={basic.gender} />
        <Info label="Date of Birth" value={basic.dob?.split("T")[0]} />
        <Info label="Department" value={basic.department?.departmentName} />
        <Info label="Designation" value={basic.designation?.designationName} />
        <Info label="Joining Date" value={basic.joiningDate?.split("T")[0]} />
        <Info label="Employment Status" value={basic.employmentStatus} />
        <Info label="Status" value={basic.status} />
      </div>

      <Section title="Identity Details" data={profile.identity} />
      <Section title="Bank Details" data={profile.bank} />
      <Section title="Payroll Details" data={profile.payroll} />
      <Section title="IT Assets" data={profile.itAssets} />
      <Section title="Exit Details" data={profile.exit} />
      <Section title="Additional Details" data={profile.additional} />
    </div>
  </div>
  </div>
  );
}
function Info({ label, value }) {
  return (<div className="border rounded-lg p-4 bg-[#FAFBFC]"> <p className="text-xs text-gray-500 capitalize">{label}</p> <p className="font-medium text-[#17213B]">{value || "-"}</p> </div>
  );
}
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
//added
function Section({ title, data }) {
  if (!data || Object.keys(data).length === 0) return null;

const fieldOrder = {
"Bank Details": [
"bankName",
"accountHolder",
"accountNumber",
"ifsc",
"branch",
"upi",
],

"IT Assets": [
"username",
"officialEmail",
"laptop",
"systemAccess",
],

"Identity Details": [
"aadhaar",
"pan",
"passport",
"drivingLicense",
"pfNumber",
"uan",
"esic",
],

"Payroll Details": [
"salary",
"ctc",
"basicSalary",
"hra",
"allowances",
"pfApplicable",
"esiApplicable",
"paymentMode",
],

"Exit Details": [
"exitDate",
"reason",
"noticePeriod",
"lastWorkingDay",
"remarks",
],

// "Additional Details": [
// "bloodGroup",
// "maritalStatus",
// "emergencyContactName",
// "emergencyContactNumber",
// "emergencyContactRelation",
    // Additional
  "Additional Details": [
    "skills",
    "certifications",
    "languages",
    "linkedIn",
    "notes",
  ],
};
  const hiddenFields = [
    "_id",
    "__v",
    "employee_code",
    "createdAt",
    "updatedAt",
    "documents",
    "cancelledCheque",
  ];
  const orderedKeys = fieldOrder[title]
    ? fieldOrder[title].filter((key) => key in data)
    : Object.keys(data).filter((key) => !hiddenFields.includes(key));
    
  return (<div> <h3 className="text-lg font-semibold mb-3 text-[#0E2940]">
    {title} </h3>
    <div className="grid md:grid-cols-2 gap-4">
      {orderedKeys.map((key) => {
        const value = data[key];
        if (typeof value === "object" && value !== null) return null;
        if (Array.isArray(value)) return null;
        return (
          <Info
            key={key}
            label={formatLabel(key)}
            value={value}
          />
        );
      })}
    </div>
  </div>
  );
}


