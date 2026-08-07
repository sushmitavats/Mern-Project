import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployeeByCode, saveDraft, saveEmployee, getDepartments, getDesignations } from "../api";
import EmployeeTabs from "../components/Employee/EmployeeTabs";
import BasicInformation from "../components/Employee/BasicInformation";
import EmploymentDetails from "../components/Employee/EmploymentDetails";
import IdentityDetails from "../components/Employee/IdentityDetails";
import AddressDetails from "../components/Employee/AddressDetails";
import BankDetails from "../components/Employee/BankDetails";
import PayrollDetails from "../components/Employee/PayrollDetails";
import ITAssets from "../components/Employee/ITAssets";
// import ExitDetails from "../components/Employee/ExitDetails";
import AdditionalDetails from "../components/Employee/AdditionalDetails";
import EmployeeFooter from "../components/Employee/EmployeeFooter";
import EducationExperienceDetails from "../components/Employee/EducationExperienceDetails";
import { saveEducationExperience, getEducationExperience, deleteEducation, deleteExperience } from "../api";
import {
    saveITAssetDetails, getITAssetDetails, saveExitDetails, getExitDetails, saveAdditionalDetails,
    getAdditionalDetails,
} from "../api";



export default function EditEmployeePage() {
    const { employee_code } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("basic");
    // const [uploading, setUploading] = useState(false);
    const [completedTabs, setCompletedTabs] = useState(["basic"]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedCheques, setSelectedCheques] = useState([]);
    const [selectedIdentityDocuments, setSelectedIdentityDocuments] = useState([]);
    const [educationList, setEducationList] = useState([
        { qualification: "", institution: "", educationYear: "", cgpa: "", },
    ]);
    const [experienceList, setExperienceList] = useState([]);
    const [sameAsCurrent, setSameAsCurrent] = useState(false);
    // hook for validation
    const [educationErrors, setEducationErrors] = useState([]);
    const [experienceErrors, setExperienceErrors] = useState([]);
    const tabOrder = ["basic", "employment", "identity", "address", "bank", "payroll", "eduAndexp", "itassets",
        "additional",];
    const currentTabIndex = tabOrder.indexOf(activeTab);
    const [saveDraftLoading, setSaveDraftLoading] = useState(false);
    const [saveNextLoading, setSaveNextLoading] = useState(false);

    //additional skills
    const [skillInput, setSkillInput] = useState("");
    const [certificationInput, setCertificationInput] = useState("");

    const [languageInput, setLanguageInput] = useState("");

    useEffect(() => {
        fetchEmployee();
        fetchDropdowns();
    }, [employee_code]);
    //1.Employee ka existing data backend se lana.
    const fetchEmployee = async () => {
        try {
            const res = await getEmployeeByCode(employee_code);
            setForm({
                ...res.data,
                department: res.data.department?._id || "",
                designation: res.data.designation?._id || "",
                profilePhoto: res.data.profilePhoto || "",
                cancelledCheque: res.data.cancelledCheque || "",
                identityDocuments: res.data.identityDocuments || []
            });
            setSelectedImage(null);
            const educationRes =
                await getEducationExperience(employee_code);
            if (educationRes.data) {
                setEducationList(
                    educationRes.data.education?.length
                        ? educationRes.data.education
                        : [{
                            qualification: "",
                            institution: "",
                            educationYear: "",
                            cgpa: "",
                        }]);
                setExperienceList(
                    educationRes.data.experience || []
                )
            }
        } catch (err) {
            console.log(err);
        }
    };
    //2Department aur Designation dropdown bharna.
    // fetch depart and designation dropdown
    const fetchDropdowns = async () => {
        try {
            const dept = await getDepartments();
            const des = await getDesignations();

            setDepartments(dept.data);
            setDesignations(des.data);
        } catch (err) {
            console.log(err);
        }
    };
    //3Ek aur education row add karna.(purpose)
    // education and experience
    const addEducation = () => {
        setEducationList((prev) => [
            ...prev,
            {
                qualification: "",
                institution: "",
                educationYear: "",
                cgpa: "",
            },
        ]);
    };
    //4
    const addExperience = () => {
        setExperienceList((prev) => [
            ...prev,
            {
                company: "",
                experienceDesignation: "",
                experienceStartDate: "",
                experienceEndDate: "",
                lastCtc: "",
            },
        ]);
    };
    //5 Education Input Change.Ye poore project ka backbone hai.
    //updation of the form page
    const handleChange = (e, index = null, type = null) => {
        const { name, value } = e.target;
        // Education
        if (type === "education") {
            const updated = [...educationList];
            // Convert date into year number before storing
            if (name === "educationYear" && value) {
                updated[index][name] = Number(value.split("-")[0]);
            } else {
                updated[index][name] = value;
            }
            setEducationList(updated);
            const eduErrors = [...educationErrors];
            if (!eduErrors[index]) eduErrors[index] = {};
            switch (name) {
                case "qualification":
                    eduErrors[index].qualification =
                        value.trim() ? "" : "Qualification is required";
                    break;
                case "institution":
                    eduErrors[index].institution =
                        value.trim() ? "" : "Institution is required";
                    break;
                case "educationYear":
                    eduErrors[index].educationYear =
                        value ? "" : "Year is required";
                    break;
            }
            setEducationErrors(eduErrors);
            return;
        }
        // Experience
        if (type === "experience") {
            const updated = [...experienceList];
            updated[index][name] = value;
            setExperienceList(updated);
            // validateExperienceField(index, name, value);
            const expErrors = [...experienceErrors];
            if (!expErrors[index]) {
                expErrors[index] = {};
            }
            switch (name) {
                case "company":
                    expErrors[index].company =
                        value.trim() ? "" : "Company required";
                    break;
                case "experienceDesignation":
                    expErrors[index].experienceDesignation =
                        value.trim() ? "" : "Designation required";
                    break;
                case "experienceStartDate":
                    expErrors[index].experienceStartDate =
                        value ? "" : "Start Date required";
                    break;
                default:
                    break;
            }
            setExperienceErrors(expErrors);
            return;
        }
        // validateField(name, value);
        // Normal Form Fields
        let updatedValue = value;
        if (name === "pan") {
            updatedValue = value.toUpperCase();
        }
        if (name === "aadhaar") {
            updatedValue = value.replace(/\D/g, "").slice(0, 12);
        }
        if (name === "mobile" || name === "alternateMobile") {
            updatedValue = value.replace(/\D/g, "").slice(0, 10);
        }
        //ADD THE DOB VALIDATION HERE
        if (name === "dob") {
            const dob = new Date(updatedValue);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const month = today.getMonth() - dob.getMonth();
            if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                alert("Employee age must be at least 18 years.");
                setErrors(prev => ({
                    ...prev,
                    dob: "Employee must be at least 18 years old"
                }));
                return;
            }
        }
        // Payroll numeric fields should never be negative
        // const payrollFields = [
        //     "ctc",
        //     "basicSalary",
        //     "hra",
        //     "allowances",
        //     "pfDeduction",
        //     "esicDeduction",
        //     "professionalTax",
        // ];
        // if (payrollFields.includes(name)) {
        //     if (updatedValue === "") {
        //         // allow clearing
        //     } else if (Number(updatedValue) < 0) {
        //         updatedValue = 0;
        //     }
        // }
        const payrollFields = [
            "ctc",
            "basicSalary",
            "hra",
            "allowances",
            "pfDeduction",
            "esicDeduction",
            "professionalTax",
        ];

        if (payrollFields.includes(name)) {
            if (updatedValue === "") {
            } else if (!/^\d*\.?\d*$/.test(updatedValue)) {
                return; // block -, +, @, %, $, letters, etc.
            }
            // Prevent leading zeros like 00012
            if (/^0\d+/.test(updatedValue)) {
                updatedValue = String(Number(updatedValue));
            }
            // Optional: limit to 2 decimal places
            if (/^\d+(\.\d{0,2})?$/.test(updatedValue) === false && updatedValue !== "") {
                return;
            }
        }

        const errorMessage = validateField(name, updatedValue);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage,
        }));

        setForm(prev => ({
            ...prev,
            [name]: updatedValue,
            ...(name === "department" && {
                designation: "",
            }),
        }));
    };
    //6Employee ki Profile Photo select aur preview karna
    //handling basic info image change.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];
        if (!validTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG images are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5 MB.");
            return;
        }
        const preview = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            if (img.width < 150 || img.height < 200) {
                URL.revokeObjectURL(preview);
                alert("Minimum image size should be 150 × 200 pixels.");
                return;
            }
            setSelectedImage(file);
            setForm(prev => ({
                ...prev,
                profilePhoto: preview
            }));
        };
        img.src = preview;
    };
    //7Is function me multiple files upload ho sakti hain.
    const handleChequeChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf"
        ];
        const MAX_SIZE = 2 * 1024 * 1024;
        const validFiles = [];
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name} is not supported.`);
                e.target.value = "";
                continue;
            }
            if (file.size > MAX_SIZE) {
                alert(`${file.name} exceeds 2 MB.`);
                continue;
            }
            validFiles.push({
                file,
                preview:
                    file.type === "application/pdf"
                        ? null
                        : URL.createObjectURL(file)
            });
        }
        const alreadyUploaded =
            form.cancelledCheque
                ? form.cancelledCheque.length
                : 0;
        if (alreadyUploaded + selectedCheques.length + validFiles.length > 6) {
            alert("Maximum 6 documents allowed.");
            return;
        }
        setSelectedCheques(prev => [
            ...prev,
            ...validFiles,
        ]);
        setErrors(prev => ({
            ...prev,
            cancelledCheque: ""
        }));
    };
    //7.1
    useEffect(() => {
        if (sameAsCurrent) {
            handleChange({
                target: {
                    name: "permanentAddress",
                    value: form.currentAddress
                }
            });
            handleChange({
                target: {
                    name: "permanentPincode",
                    value: form.currentPincode
                }
            });
        }
    }, [
        form.currentAddress,
        form.currentPincode,
        sameAsCurrent
    ]);
    //8
    //when new document added
    const handleIdentityDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf"
        ];
        const MAX_SIZE = 2 * 1024 * 1024;
        const alreadyUploaded = form.documents
            ? form.documents.length
            : 0;
        const alreadySelected = selectedIdentityDocuments.length;
        // Remaining slots
        const remainingSlots = 6 - (alreadyUploaded + alreadySelected);
        if (remainingSlots <= 0) {
            alert("You can't add more than 6 documents.");
            e.target.value = "";
            return;
        }
        const validFiles = [];
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name} is not supported.`);
                continue;
            }
            if (file.size > MAX_SIZE) {
                alert(`${file.name} exceeds 2 MB.`);
                continue;
            }
            // Stop when limit reached
            if (validFiles.length >= remainingSlots) {
                alert("You can't add more than 6 documents.");
                break;
            }
            validFiles.push({
                file,
                preview:
                    file.type === "application/pdf"
                        ? null
                        : URL.createObjectURL(file)
            });
        }
        if (validFiles.length > 0) {
            setSelectedIdentityDocuments(prev => [
                ...prev,
                ...validFiles
            ]);
            // setErrors(prev => ({
            //     ...prev,
            //     documents: ""
            // }));
        }
        //2 doc is compulsort
        const totalDocs =
            (form.documents?.length || 0) +
            selectedIdentityDocuments.length +
            validFiles.length;
        if (totalDocs < 2) {
            setErrors(prev => ({
                ...prev,
                documents: "At least 2 documents are required",
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                documents: "",
            }));
        }
        e.target.value = "";
    };
    //clean up.Browser memory clean karta hai.(URL.createObjectURL())
    useEffect(() => {
        return () => {
            if (form.profilePhoto && form.profilePhoto.startsWith("blob:")) {
                URL.revokeObjectURL(form.profilePhoto);
            }
        };
    }, [form.profilePhoto]);

    //9 Ye project ka dusra backbone hai.
    //vallidatin
    const validate = () => {
        const newErrors = {};
        //  BASIC INFORMATION 
        if (activeTab === "basic") {
            if (!form.gender)
                newErrors.gender = "Gender is required";
            if (!form.dob)
                newErrors.dob = "Date of Birth is required";
            if (form.personalEmail && !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(form.personalEmail)) {
                newErrors.personalEmail =
                    "Enter valid Gmail address";
            }
            if (!form.mobile)
                newErrors.mobile = "Mobile is required";
            else if (!/^[6-9]\d{9}$/.test(form.mobile))
                newErrors.mobile = "Enter valid Mobile Number";
            if (form.alternateMobile && !/^[6-9]\d{9}$/.test(form.alternateMobile)) {
                newErrors.alternateMobile =
                    "Enter valid Alternate Mobile";
            }
            if (form.maritalStatus && !["Single", "Married", "Divorced"].includes(form.maritalStatus)) {
                newErrors.maritalStatus =
                    "Invalid Marital Status";
            }
            if (form.bloodGroup && !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",].includes(form.bloodGroup)) {
                newErrors.bloodGroup =
                    "Invalid Blood Group";
            }
            if (form.nationality && form.nationality.trim().length < 3) {
                newErrors.nationality =
                    "Enter valid Nationality";
            }
        }
        //EMPLOYMENT 
        if (activeTab === "employment") {
            if (!form.employeeType)
                newErrors.employeeType =
                    "Employee Type is required";
            if (!form.department)
                newErrors.department =
                    "Department is required";
            if (!form.designation)
                newErrors.designation =
                    "Designation is required";
            if (!form.reportingManager)
                newErrors.reportingManager =
                    "Reporting Manager is required";
            if (form.reportingManager && !/^[A-Za-z ]+$/.test(form.reportingManager))
                newErrors.reportingManager =
                    "Only letters allowed";
            if (!form.workLocation)
                newErrors.workLocation =
                    "Work Location is required";
            if (!form.joiningDate)
                newErrors.joiningDate =
                    "Joining Date is required";
            if (form.noticePeriod && isNaN(form.noticePeriod)) {
                newErrors.noticePeriod =
                    "Notice Period should be numeric";
            }
            if (form.probationPeriod && isNaN(form.probationPeriod)) {
                newErrors.probationPeriod =
                    "Probation should be numeric";
            }
        }
        // identity
        if (activeTab === "identity") {
            if (!form.aadhaar)
                newErrors.aadhaar =
                    "Aadhaar is required";
            else if (!/^\d{12}$/.test(form.aadhaar))
                newErrors.aadhaar =
                    "Aadhaar must be 12 digits";
            if (!form.pan)
                newErrors.pan =
                    "PAN is required";
            else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase()))
                newErrors.pan =
                    "Invalid PAN Number";
            if (form.passport && !/^[A-Z][0-9]{7}$/.test(form.passport)) {
                newErrors.passport =
                    "Invalid Passport Number";
            }
            if (form.drivingLicense && form.drivingLicense.length < 10) {
                newErrors.drivingLicense =
                    "Invalid Driving License";
            }
            if (form.uan && !/^\d{12}$/.test(form.uan)) {
                newErrors.uan =
                    "UAN should be 12 digits";
            }
            if (form.pfNumber && form.pfNumber.length < 10) {
                newErrors.pfNumber =
                    "Invalid PF Number";
            }
            // Minimum 2 documents
            const existingDocs = form.documents?.length || 0;
            const newDocs = selectedIdentityDocuments?.length || 0;

            if (existingDocs + newDocs < 2) {
                newErrors.documents = "At least 2 documents are required";
            }
        }
        // ADDRESS 
        if (activeTab === "address") {
            if (!form.currentAddress)
                newErrors.currentAddress =
                    "Current Address required";
            if (!form.permanentAddress)
                newErrors.permanentAddress =
                    "Permanent Address required";

            if (form.currentPincode && !/^\d{6}$/.test(form.currentPincode)) {
                newErrors.currentPincode =
                    "Current Pincode must be 6 digits";
            }
            if (form.permanentPincode && !/^\d{6}$/.test(form.permanentPincode)) {
                newErrors.permanentPincode =
                    "Permanent Pincode must be 6 digits";
            }
        }
        // BANK 
        if (activeTab === "bank") {
            if (!form.accountHolder)
                newErrors.accountHolder =
                    "Account Holder required";
            if (!form.bankName)
                newErrors.bankName =
                    "Bank Name required";
            if (!form.accountNumber)
                newErrors.accountNumber =
                    "Account Number required";
            else if (!/^\d{9,18}$/.test(form.accountNumber))
                newErrors.accountNumber =
                    "Invalid Account Number";
            if (!form.ifsc)
                newErrors.ifsc =
                    "IFSC required";
            else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase()))
                newErrors.ifsc =
                    "Invalid IFSC";
            if (form.branch && !/^[A-Za-z0-9\s.-]{3,50}$/.test(form.branch)) {
                newErrors.branch = "Invalid Branch Name";
            }
            if (form.upi && !/^[\w.-]+@[a-zA-Z]+$/.test(form.upi)) {
                newErrors.upi =
                    "Invalid UPI ID";
            }
            // At least one bank document
            // const existingDocs = form.cancelledCheque?.length || 0;
            // const newDocs = selectedCheques?.length || 0;

            // if (existingDocs + newDocs < 1) {
            //     newErrors.cancelledCheque =
            //         "At least one bank document is required";
            // }
            const totalBankDocs =
                (form.cancelledCheque?.length || 0) +
                selectedCheques.length;

            if (totalBankDocs < 1) {
                newErrors.cancelledCheque =
                    "At least one bank document is required";
            }
        }
        //  PAYROLL 
        if (activeTab === "payroll") {
            // if (!form.ctc)
            //     newErrors.ctc = "CTC is required";
            if (form.ctc === "" || form.ctc === null || form.ctc === undefined)
                newErrors.ctc = "Number is required";
            if (!form.payrollGroup)
                newErrors.payrollGroup = "Payroll Group is required";
            if (!form.salaryEffectiveDate)
                newErrors.salaryEffectiveDate =
                    "Salary Effective Date is required";
        }
        if (activeTab === "eduAndexp") {
            let eduErrors = [];
            let expErrors = [];
            let hasError = false;
            // At least one education required
            if (educationList.length === 0) {
                alert("Please add at least one Education.");
                hasError = true;
            }
            educationList.forEach((item, index) => {
                const err = {};
                if (!item.qualification?.trim())
                    err.qualification = "Qualification is required";
                if (!item.institution?.trim())
                    err.institution = "Institution is required";
                if (!item.educationYear)
                    err.educationYear = "Year is required";
                eduErrors[index] = err;
                if (Object.keys(err).length > 0)
                    hasError = true;
            });
            experienceList.forEach((item, index) => {
                const err = {};
                if (!item.company?.trim())
                    err.company = "Company is required";
                if (!item.experienceDesignation?.trim())
                    err.experienceDesignation = "Designation is required";
                if (!item.experienceStartDate)
                    err.experienceStartDate = "Start Date is required";
                // End Date cannot be before Start Date
                if (item.experienceStartDate && item.experienceEndDate &&
                    new Date(item.experienceEndDate) < new Date(item.experienceStartDate)) {
                    err.experienceEndDate = "End Date cannot be earlier than Start Date";
                }
                 if (item.lastCtc &&!/^\d+(\.\d{1,2})?$/.test(item.lastCtc)) {
                err.lastCtc = "Enter a valid CTC amount";
            }
                expErrors[index] = err;
                if (Object.keys(err).length > 0)
                    hasError = true;
            });
            // if (item.lastCtc &&!/^\d+(\.\d{1,2})?$/.test(item.lastCtc)) {
            //     err.lastCtc = "Enter a valid CTC amount";
            // }
            setEducationErrors(eduErrors);
            setExperienceErrors(expErrors);
            if (hasError) {
                setErrors({
                    education: "Please correct the education details.",
                    experience: "Please correct the end date details.",
                });
                return {
                    isValid: false,
                    errors: {
                        education: "Please correct the education details.",
                        experience: "Please correct the end date details.",
                    },
                };
            }
        }
        if (activeTab === "itassets") {
            if (!form.username?.trim()) {
                newErrors.username = "Username is required";
            }
            if (!form.officialEmail?.trim()) {
                newErrors.officialEmail =
                    "Official Email is required";
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.officialEmail)) {
                newErrors.officialEmail =
                    "Invalid Official Email";
            }
        }
        if (activeTab === "leave") {
            if (!form.leavePolicy)
                newErrors.leavePolicy =
                    "Leave Policy is required";
            if (!form.attendancePolicy?.trim())
                newErrors.attendancePolicy =
                    "Attendance Policy is required";
            if (!form.holidayCalendar?.trim())
                newErrors.holidayCalendar =
                    "Holiday Calendar is required";
            if (!form.weeklyOff)
                newErrors.weeklyOff =
                    "Weekly Off is required";
        }

        if (activeTab === "additional") {
            if (form.linkedIn && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(form.linkedIn)) {
                newErrors.linkedIn =
                    "Enter valid LinkedIn URL";
            }
            // if (form.skills?.trim())
            //     newErrors.skills = "Skills are required";
            // if (form.certifications?.trim())
            //     newErrors.certifications = "Certifications are required";
            // if (form.languages?.trim())
            //     newErrors.languages = "Languages are required";
            if (
                form.skills &&
                !form.skills.trim()
            ) {
                newErrors.skills = "Enter a valid skill";
            }
            // Certifications (optional)
            if (
                form.certifications &&
                !form.certifications.trim()
            ) {
                newErrors.certifications = "Enter a valid certification";
            }
            // Languages (optional)
            if (
                form.languages &&
                !form.languages.trim()
            ) {
                newErrors.languages = "Enter a valid language";
            }
        }
        console.log("ACTIVE TAB :", activeTab);
        console.log("VALIDATION ERRORS :", newErrors);
        console.log(newErrors);
        setErrors(newErrors);
        console.log(errors);

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors,
        };
    };
    //10
    //have save draft
    const handleSaveDraft = async () => {
        try {
            setSaveDraftLoading(true);
            const formData = new FormData();
            // Saare form fields
            // Object.keys(form).forEach(key => {
            //     if (key !== "_id" && key !== "__v") {
            //         formData.append(key, form[key]);
            //     }
            // });
            Object.keys(form).forEach((key) => {
                if (key !== "_id" && key !== "__v") {
                    const value = form[key];
                    formData.append(
                        key,
                        value === null || value === undefined ? "" : value
                    );
                }
            });
            if (selectedImage) {
                formData.append("profilePhoto", selectedImage);
            }
            selectedCheques.forEach(item => {   //see
                formData.append(
                    "cancelledCheque",
                    item.file
                );
            });
            selectedIdentityDocuments.forEach(item => {
                formData.append(
                    "identityDocuments",
                    item.file
                );
            });
            await saveDraft(formData);
            localStorage.setItem(
                "employeeDraft",
                JSON.stringify(form)
            );
            alert(
                "Draft Saved Successfully"
            );
        }
        catch (error) {
            console.log(error);
        } finally {
            setSaveDraftLoading(false);
        }
    };
    //11
    const validateField = (name, value) => {
        let message = "";
        const tagRegex = /^(?!\d+$)[A-Za-z0-9+#.-]+(?:\s+[A-Za-z0-9+#.-]+)*$/;
        switch (name) {
            case "firstName":
                if (!value.trim()) message = "First Name is required";
                else if (!/^[A-Za-z ]+$/.test(value))
                    message = "Only alphabets allowed";
                break;

            case "middleName":
                if (value && !/^[A-Za-z ]+$/.test(value))
                    message = "Only alphabets allowed";
                break;

            case "lastName":
                if (!value.trim()) message = "Last Name is required";
                else if (!/^[A-Za-z ]+$/.test(value))
                    message = "Only alphabets allowed";
                break;

            case "gender":
                if (!value) message = "Gender is required";
                break;

            case "dob":
                if (!value) {
                    message = "Date of Birth is required";
                } else {
                    const dob = new Date(value);
                    const today = new Date();

                    let age =
                        today.getFullYear() - dob.getFullYear();

                    const month =
                        today.getMonth() - dob.getMonth();
                    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
                        age--;
                    }
                    if (age < 18)
                        message = "Employee must be at least 18 years old";
                }
                break;
            case "mobile":
                if (!value)
                    message = "Mobile Number is required";
                else if (!/^[6-9]\d{9}$/.test(value))
                    message = "Enter valid mobile number";
                break;
            case "alternateMobile":
                if (
                    value &&
                    !/^[6-9]\d{9}$/.test(value)
                )
                    message = "Enter valid mobile number";
                break;
            case "personalEmail":
                if (
                    value &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                )
                    message = "Invalid email";
                break;
            //employee detail page
            case "employeeType":
                if (!value)
                    message = "Employee Type is required";
                break;
            case "department":
                if (!value)
                    message = "Department is required";
                break;
            case "designation":
                if (!value)
                    message = "Designation is required";
                break;
            case "reportingManager":
                if (!value.trim())
                    message = "Reporting Manager is required";
                break;
            case "workLocation":
                if (!value.trim())
                    message = "Work Location is required";
                break;
            case "joiningDate":
                if (!value)
                    message = "Joining Date is required";
                break;
            //identity page
            case "aadhaar":
                if (!value)
                    message = "Aadhaar is required";
                else if (!/^\d{12}$/.test(value))
                    message = "Aadhaar must contain 12 digits";
                break;

            case "pan":
                if (!value)
                    message = "PAN is required";
                else if (
                    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                        value.toUpperCase()
                    )
                )
                    message = "Invalid PAN Number";
                break;
            case "passport":
                if (value && !/^[A-Z][0-9]{7}$/.test(value.toUpperCase()))
                    message = "Invalid Passport Number";
                break;
            case "drivingLicense":
                if (value && value.length < 10)
                    message = "Invalid Driving License";
                break;
            case "uan":
                if (value && !/^\d{12}$/.test(value))
                    message = "UAN must contain 12 digits";
                break;

            case "pfNumber":
                if (value && value.length < 10)
                    message = "Invalid PF Number";
                break;

            case "esic":
                if (value && !/^\d{10,17}$/.test(value))
                    message = "Invalid ESIC Number";
                break;
            case "currentAddress":
                if (!value.trim())
                    message = "Current Address is required";
                break;
            case "permanentAddress":
                if (!value.trim())
                    message = "Permanent Address is required";
                break;
            case "currentPincode":
                if (!value)
                    message = "Current Pincode is required";
                else if (!/^[0-9]{6}$/.test(value))
                    message = "Current Pincode must be 6 digits";
                break;
            case "permanentPincode":
                if (!value)
                    message = "Permanent Pincode is required";
                else if (!/^[0-9]{6}$/.test(value))
                    message = "Permanent Pincode must be 6 digits";
                break;
            case "accountHolder":
                if (!value)
                    message = "Account Holder is required";
                break;
            case "bankName":
                if (!value)
                    message = "Bank Name is required";
                break;
            case "accountNumber":
                if (!value)
                    message = "Account Number is required";
                else if (!/^[0-9]{9,18}$/.test(value))
                    message = "Invalid Account Number";
                break;
            case "ifsc":
                if (!value)
                    message = "IFSC is required";
                else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()))
                    message = "Invalid IFSC";
                break;
            //payroll
            // case "ctc":
            //     if (!value)
            //         message = "CTC is required";
            //     else if (Number(value) <= 0)
            //         message = "CTC must be greater than 0";
            //     break;
            case "ctc":
                if (value === "" || value === null || value === undefined)
                    message = "Number is required";
                else if (Number(value) < 0)
                    message = "CTC cannot be negative";
                break;
            // case "LASTctc":
            //     if (value === "" || value === null || value === undefined)
            //         message = "Number is required";
            //     else if (Number(value) < 0)
            //         message = "CTC cannot be negative";
            //     break;
            case "lastCtc":
                if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
                    message[index].lastCtc = "Enter a valid CTC amount";
                } else {
                    message[index].lastCtc = "";
                }
                break;

            case "payrollGroup":
                if (!value)
                    message = "Payroll Group is required";
                break;
            case "salaryEffectiveDate":
                if (!value)
                    message = "Salary Effective Date is required";
                break;
            case "basicSalary":
            case "hra":
            case "allowances":
            case "pfDeduction":
            case "esicDeduction":
            case "professionalTax":
                if (value !== "") {
                    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                        message = "Enter a valid amount";
                    } else if (Number(value) < 0) {
                        message = "Amount cannot be negative";
                    }
                }
                break;
            //education
            case "username":
                if (!value.trim())
                    message = "System ID is required";
                break;
            case "leavePolicy":
                if (!value)
                    message = "Leave Policy is required";
                break;
            case "attendancePolicy":
                if (!value.trim())
                    message = "Attendance Policy is required";
                break;
            case "holidayCalendar":
                if (!value.trim())
                    message = "Holiday Calendar is required";
                break;
            case "weeklyOff":
                if (!value)
                    message = "Weekly Off is required";
                break;
            case "fnf":
                if (form.resignationDate && !value.trim()) {
                    message = "F & F Status is required";
                }
                break;
            //Additional
            case "linkedIn":
                if (value && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(value)) {
                    message = "Invalid LinkedIn URL";
                }
                break;
            case "skills":
                if (value) {
                    const tags = value.split(",");
                    for (const tag of tags) {
                        if (!tagRegex.test(tag.trim())) {
                            message =
                                "Only letters, numbers, +, #, . and - are allowed.";
                            break;
                        }
                    }
                }
                break;
            case "certifications":
                if (value) {
                    const tags = value.split(",");
                    for (const tag of tags) {
                        if (!tagRegex.test(tag.trim())) {
                            message =
                                "Invalid certification.";
                            break;
                        }
                    }
                }
                break;
            case "languages":
                if (value) {
                    const tags = value.split(",");
                    for (const tag of tags) {
                        if (!tagRegex.test(tag.trim())) {
                            message =
                                "Invalid language.";
                            break;
                        }
                    }
                }
                break;
            default:
                break;
        }
        return message;
    };
    //12
    const handleSaveNext = async () => {
        console.log("FORM DATA:", form);
        // const { isValid, errors: validationErrors } = validate();
        const validationResult = validate();

        if (!validationResult || !validationResult.isValid) {
            const validationErrors = validationResult?.errors || {};
            const firstError =
                Object.values(validationErrors).find(Boolean) ||
                "Please correct the highlighted fields.";

            alert(firstError);
            return;
        }
        try {
            setSaveNextLoading(true);
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (key !== "_id" && key !== "__v" && key !== "profilePhoto" && key !== "cancelledCheque") {
                    const value = form[key];
                    // Send empty string instead of null or undefined
                    formData.append(
                        key,
                        value === null || value === undefined ? "" : value
                    );
                }
            });
            if (selectedImage) {
                formData.append("profilePhoto", selectedImage);
            }
            selectedCheques.forEach(item => {
                formData.append(
                    "cancelledCheque",
                    item.file
                );
            });
            // Save Employee
            selectedIdentityDocuments.forEach(item => {
                formData.append(
                    "identityDocuments",
                    item.file,
                );
            });

            await saveEmployee(formData);
            if (activeTab === "eduAndexp") {
                await saveEducationExperience({
                    employee_code,
                    education: educationList,
                    experience: experienceList,
                });
            }
            if (activeTab === "itassets") {
                await saveITAssetDetails({
                    employee_code: form.employee_code,
                    username: form.username,
                    officialEmail: form.officialEmail,
                    laptop: form.laptop,
                    assetId: form.assetId,
                    systemAccess: form.systemAccess,
                });
            }
            // if (activeTab === "leave") {
            //     await saveLeaveDetails({
            //         employee_code: form.employee_code,
            //         leavePolicy: form.leavePolicy,
            //         attendancePolicy: form.attendancePolicy,
            //         holidayCalendar: form.holidayCalendar,
            //         weeklyOff: form.weeklyOff,
            //     });
            // }
            if (activeTab === "exit") {
                await saveExitDetails({
                    employee_code: form.employee_code,
                    resignationDate: form.resignationDate,
                    lwd: form.lwd,
                    exitReason: form.exitReason,
                    fnf: form.fnf,
                });
            }
            console.log("FORM");
            console.log(form);
            console.log("Skills =", form.skills);

            if (activeTab === "additional") {
                await saveAdditionalDetails({
                    employee_code: form.employee_code,
                    skills: form.skills,
                    certifications: form.certifications,
                    languages: form.languages,
                    linkedIn: form.linkedIn,
                    notes: form.notes,
                });
            }
            // After successful save, clear selected files.
            setSelectedIdentityDocuments([]);
            // const employee = await getEmployeeByCode(employee_code);
            const [employeeRes, educationRes, itAssetRes, exitRes, additionalRes,
            ] = await Promise.all([
                getEmployeeByCode(employee_code),
                getEducationExperience(employee_code),
                getITAssetDetails(employee_code),
                // getLeaveDetails(employee_code),
                getExitDetails(employee_code),
                getAdditionalDetails(employee_code),
            ]);
            console.log("Employee:", employeeRes.data.officialEmail);
            console.log("IT Asset:", itAssetRes.data.officialEmail);
            setForm(prev => ({
                ...prev,
                ...employeeRes.data,
                ...itAssetRes.data,
                officialEmail:
                    itAssetRes.data.officialEmail ||
                    employeeRes.data.officialEmail,
                // ...leaveRes.data,
                ...exitRes.data,
                ...additionalRes.data,
                department: employeeRes.data.department?._id || "",
                designation: employeeRes.data.designation?._id || "",
                documents: employeeRes.data.documents || []
            }));
            // Clear newly selected bank documents
            setSelectedCheques([]);
            localStorage.removeItem("employeeDraft");
            const currentIndex = tabOrder.indexOf(activeTab);
            // If this is the last tab
            if (currentIndex === tabOrder.length - 1) {
                toast.success("Employee Updated Successfully!", {
                    autoClose: 1500,
                });
                setTimeout(() => {
                    navigate("/employees");
                }, 1600);
                return;
            }
            // Otherwise move to next tab
            const nextTab = tabOrder[currentIndex + 1];
            setCompletedTabs((prev) =>
                prev.includes(nextTab)
                    ? prev
                    : [...prev, nextTab]
            );
            setActiveTab(nextTab);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Response:", err.response?.data);
        } finally {
            setSaveNextLoading(false);  // Stop loading
        }
    };
    // for back
    const handleBack = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabOrder[currentIndex - 1]);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };
    //13
    //--delete part started--//
    //delete identity document
    const removeSelectedIdentityDocument = (index) => {
        setSelectedIdentityDocuments(prev => {
            if (prev[index]?.preview) {
                URL.revokeObjectURL(
                    prev[index].preview
                );
            }
            return prev.filter(
                (_, i) => i !== index
            );
        });
    };
    //delete document//14
    const removeSelectedCheque = (index) => {
        setSelectedCheques(prev => {
            if (prev[index]?.preview) {
                URL.revokeObjectURL(
                    prev[index].preview
                );
            }
            return prev.filter(
                (_, i) => i !== index
            );
        });
    };
    //15
    const removeEducation = async (index) => {
        if (educationList.length === 1) {
            alert("At least one education is required.");
            return;
        }
        const row = educationList[index];
        if (row._id) {
            await deleteEducation(row._id);
        }
        setEducationList(prev => prev.filter((_, i) => i !== index));
    }
    const removeExperience = async (index) => {
        const row = experienceList[index];
        if (row._id) {
            await deleteExperience(row._id);
        }
        setExperienceList(prev =>
            prev.filter((_, i) => i !== index)
        );
    };
    const getInputClass = (field) => `
h-[34px]
w-full
rounded-[6px]
border
bg-white
px-3
text-[11px]
text-[#344054]
outline-none
placeholder:text-[#9aa4b2]
transition-colors
duration-200
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
${errors[field]
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-[#cfd7e2] focus:border-[#0392a1] focus:ring-2 focus:ring-[#0392a1]/20"
        }
`;
    return (
        <div className="p-4">
            <EmployeeTabs
                setForm={setForm}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                completedTabs={completedTabs}
            />
            {activeTab === "basic" && (
                <BasicInformation
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    handleImageChange={handleImageChange}
                    getInputClass={getInputClass}
                />
            )}
            {activeTab === "employment" && (
                <EmploymentDetails
                    form={form}
                    errors={errors}
                    departments={departments}
                    designations={designations}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "identity" && (
                <IdentityDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    handleChange={handleChange}
                    handleIdentityDocumentChange={handleIdentityDocumentChange}
                    selectedIdentityDocuments={selectedIdentityDocuments}
                    removeSelectedIdentityDocument={removeSelectedIdentityDocument}
                    employeeCode={employee_code}
                    getInputClass={getInputClass}
                />
            )}
            {activeTab === "address" && (
                <AddressDetails
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    sameAsCurrent={sameAsCurrent}
                    setSameAsCurrent={setSameAsCurrent}
                />
            )}
            {activeTab === "bank" && (
                <BankDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    handleChange={handleChange}
                    handleChequeChange={handleChequeChange}
                    selectedCheques={selectedCheques}
                    setSelectedCheques={setSelectedCheques}
                    removeSelectedCheque={removeSelectedCheque}
                    employeeCode={employee_code}
                    getInputClass={getInputClass}
                    setErrors={setErrors}
                />
            )}
            {activeTab === "payroll" && (
                <PayrollDetails
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    getInputClass={getInputClass}
                />
            )}
            {activeTab === "eduAndexp" && (
                <EducationExperienceDetails
                    form={form}
                    errors={errors}
                    educationErrors={educationErrors}
                    experienceErrors={experienceErrors}
                    handleChange={handleChange}
                    educationList={educationList}
                    experienceList={experienceList}
                    addEducation={addEducation}
                    removeEducation={removeEducation}
                    addExperience={addExperience}
                    removeExperience={removeExperience}
                />
            )}
            {activeTab === "itassets" && (
                <ITAssets
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    getInputClass={getInputClass}
                />
            )}
            {/* {activeTab === "leave" && (
                <LeaveDetails
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                />
            )} */}
            {/* {activeTab === "exit" && (
                <ExitDetails
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                />
            )} */}
            {activeTab === "additional" && (
                <AdditionalDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    handleChange={handleChange}
                    getInputClass={getInputClass}

                    skillInput={skillInput}
                    certificationInput={certificationInput}
                    languageInput={languageInput}

                    setSkillInput={setSkillInput}
                    setCertificationInput={setCertificationInput}
                    setLanguageInput={setLanguageInput}
                />
            )}
            {/* <EmployeeFooter
                uploading={uploading}
                handleSaveDraft={handleSaveDraft}
                handleSaveNext={handleSaveNext}
                handleBack={handleBack}
                isLastTab={activeTab === "additional"}
                isFirstTab={activeTab === "basic"}
            /> */}
            <EmployeeFooter
                saveDraftLoading={saveDraftLoading}
                saveNextLoading={saveNextLoading}
                handleSaveDraft={handleSaveDraft}
                handleSaveNext={handleSaveNext}
                handleBack={handleBack}
                isLastTab={activeTab === "additional"}
                isFirstTab={activeTab === "basic"}
            />
        </div>
    );
}



