import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeByCode, saveDraft, saveEmployee, getDepartments, getDesignations } from "../api";
import EmployeeTabs from "../components/Employee/EmployeeTabs";
import BasicInformation from "../components/Employee/BasicInformation";
import EmploymentDetails from "../components/Employee/EmploymentDetails";
import IdentityDetails from "../components/Employee/IdentityDetails";
import AddressDetails from "../components/Employee/AddressDetails";
import BankDetails from "../components/Employee/BankDetails";
import PayrollDetails from "../components/Employee/PayrollDetails";
// import EducationDetails from "../components/Employee/EducationDetails";
// import ExperienceDetails from "../components/Employee/ExperienceDetails";
import EmergencyContact from "../components/Employee/EmergencyContact";
import Documents from "../components/Employee/Documents";
import ITAssets from "../components/Employee/ITAssets";
import LeaveDetails from "../components/Employee/LeaveDetails";
import ExitDetails from "../components/Employee/ExitDetails";
import AdditionalDetails from "../components/Employee/AdditionalDetails";
import EmployeeFooter from "../components/Employee/EmployeeFooter";
import EducationExperienceDetails from "../components/Employee/EducationExperienceDetails";

export default function EditEmployeePage() {

    const { employee_code } = useParams();
    const [form, setForm] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("basic");
    const [uploading, setUploading] = useState(false);
    const [completedTabs, setCompletedTabs] = useState(["basic"]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedCheques, setSelectedCheques] = useState([]);
    const [selectedIdentityDocuments, setSelectedIdentityDocuments] = useState([]);
    // const [chequePreview, setChequePreview] = useState("");
    // const [selectedCheques, setSelectedCheques] = useState();
    const tabOrder = ["basic", "employment", "identity", "address", "bank", "payroll", "education", "experience", "emergency", "documents", "itassets",
        "leave", "exit", "additional",];

    useEffect(() => {
        fetchEmployee();
        fetchDropdowns();
    }, []);

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
            // setChequePreview(res.data.cancelledCheque || "");
            setSelectedImage(null);

        } catch (err) {
            console.log(err);
        }
    };
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
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setForm(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    //     validateField(name, value);
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateField(name, value);
        // Reset designation when department changes
        if (name === "department") {
            setForm((prev) => ({
                ...prev,
                department: value,
                designation: "",
            }));
        }
    };
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
            ...validFiles
        ]);
    };

    //  Create handleIdentityDocumentChange
    // const handleIdentityDocumentChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     if (!files.length) return;
    //     const allowedTypes = [
    //         "image/jpeg",
    //         "image/jpg",
    //         "image/png",
    //         "application/pdf"
    //     ];

    //     const MAX_SIZE = 2 * 1024 * 1024;
    //     const validFiles = [];
    //     for (const file of files) {
    //         if (!allowedTypes.includes(file.type)) {
    //             alert(`${file.name} is not supported.`);
    //             continue;
    //         }
    //         if (file.size > MAX_SIZE) {
    //             alert(`${file.name} exceeds 2 MB.`);
    //             continue;
    //         }
    //         validFiles.push({
    //             file,
    //             preview:
    //                 file.type === "application/pdf"
    //                     ? null
    //                     : URL.createObjectURL(file)
    //         });
    //     }
    //     const alreadyUploaded =
    //         form.identityDocuments
    //             ? form.identityDocuments.length
    //             : 0;

    //     if (alreadyUploaded + selectedIdentityDocuments.length + validFiles.length > 6) {
    //         alert("Maximum 6 documents allowed.");
    //         return;
    //     }
    //     setSelectedIdentityDocuments(prev => [
    //         ...prev,
    //         ...validFiles
    //     ]);
    // };
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
        }

        e.target.value = "";
    };

    useEffect(() => {
        return () => {
            if (form.profilePhoto && form.profilePhoto.startsWith("blob:")) {
                URL.revokeObjectURL(form.profilePhoto);
            }
        };
    }, [form.profilePhoto]);

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
            // const totalDocuments =
            //     (form.identityDocuments?.length || 0) +
            //     selectedIdentityDocuments.length;
            // if (totalDocuments === 0) {
            //     newErrors.identityDocuments =
            //         "At least one identity document is required.";
            // }
        }
        //    ADDRESS 
        if (activeTab === "address") {
            if (!form.currentAddress)
                newErrors.currentAddress =
                    "Current Address required";
            if (!form.permanentAddress)
                newErrors.permanentAddress =
                    "Permanent Address required";
            if (!form.pincode)
                newErrors.pincode =
                    "Pincode required";
            else if (!/^\d{6}$/.test(form.pincode))
                newErrors.pincode =
                    "Pincode must be 6 digits";
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
            if (form.upi && !/^[\w.-]+@[a-zA-Z]+$/.test(form.upi)) {
                newErrors.upi =
                    "Invalid UPI ID";
            }
        }
        //    PAYROLL 
        if (activeTab === "payroll") {
            if (!form.ctc)
                newErrors.ctc =
                    "CTC is required";
            if (!form.payrollGroup)
                newErrors.payrollGroup =
                    "Payroll Group required";
            if (!form.salaryEffectiveDate)
                newErrors.salaryEffectiveDate =
                    "Salary Effective Date required";
        }
        console.log("ACTIVE TAB :", activeTab);
        console.log("VALIDATION ERRORS :", newErrors);

        console.log(newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    //have save draft
    const handleSaveDraft = async () => {
        try {
            setUploading(true);
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key !== "_id" && key !== "__v") {
                    formData.append(key, form[key]);
                }
            });
            if (selectedImage) {
                formData.append("profilePhoto", selectedImage);
            }
            // if (selectedCheque) {
            //     formData.append("cancelledCheque", selectedCheque);
            // }
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
            setUploading(false);
        }
    };

    const validateField = (name, value) => {
        let message = "";
        switch (name) {
            case "firstName":
                if (!value.trim())
                    message = "First Name is required";
                break;
            case "lastName":
                if (!value.trim())
                    message = "Last Name is required";
                break;
            case "mobile":
                if (!value)
                    message = "Mobile is required";
                else if (!/^[0-9]{10}$/.test(value))
                    message = "Enter valid mobile no";
                break;
            case "personalEmail":
                if (!value)
                    message = "Email is required";
                else if (!/^\S+@\S+\.\S+$/.test(value))
                    message = "Invalid email";
                break;
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
                if (!value)
                    message = "Reporting Manager is required";
                break;
            case "workLocation":
                if (!value)
                    message = "Work Location is required";
                break;
            case "joiningDate":
                if (!value)
                    message = "Joining Date is required";
                break;
            case "aadhaar":
                if (!value)
                    message = "Aadhaar is required";
                else if (!/^\d{12}$/.test(value))
                    message = "Invalid Aadhaar";
                break;
            case "pan":
                if (!value)
                    message = "PAN is required";
                else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
                    value.toUpperCase()))
                    message = "Invalid PAN";
                break;
            case "currentAddress":
                if (!value.trim())
                    message = "Current Address is required";
                break;
            case "permanentAddress":
                if (!value.trim())
                    message = "Permanent Address is required";
                break;
            case "pincode":
                if (!value)
                    message = "Pincode is required";
                else if (!/^[0-9]{6}$/.test(value))
                    message = "Pincode must be 6 digits";
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
            case "ctc":
                if (!value)
                    message = "CTC is required";
                break;
            case "payrollGroup":
                if (!value)
                    message = "Payroll Group is required";
                break;
            case "salaryEffectiveDate":
                if (!value)
                    message = "Salary Effective Date is required";
                break;

            default:
                break;
        }
        setErrors(prev => ({
            ...prev,
            [name]: message
        }));
    };

    const handleSaveNext = async () => {
        console.log("FORM DATA:", form);
        const isValid = validate();
        console.log("Validation Errors :", errors);
        if (!isValid) {
            const firstError = Object.values(errors)[0];
            alert(firstError || "Please correct the highlighted fields.");
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key !== "_id" && key !== "__v" && key !== "profilePhoto" && key !== "cancelledCheque") {
                    formData.append(key, form[key]);
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
                    item.file
                );
            });
            await saveEmployee(formData);
            // After successful save, clear selected files.
            setSelectedIdentityDocuments([]);
            const employee = await getEmployeeByCode(employee_code);
            setForm(prev => ({
                ...prev,
                documents: employee.data.documents || []
            }));
            // Clear newly selected bank documents
            setSelectedCheques([]);
            setForm(prev => ({
                ...prev,
                cancelledCheque: employee.data.cancelledCheque || []
            }));

            localStorage.removeItem("employeeDraft");
            const currentIndex = tabOrder.indexOf(activeTab);

            if (currentIndex < tabOrder.length - 1) {
                const nextTab = tabOrder[currentIndex + 1];
                setCompletedTabs((prev) =>
                    prev.includes(nextTab)
                        ? prev
                        : [...prev, nextTab]
                );
                setActiveTab(nextTab);
            }
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Response:", err.response?.data);
        } finally {
            setUploading(false);   // Stop loading
        }
    };
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
    //delete document
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
                />
            )}
            {activeTab === "address" && (
                <AddressDetails
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "bank" && (
                // <BankDetails
                //     form={form}
                //     errors={errors}
                //     handleChange={handleChange}
                //     handleChequeChange={handleChequeChange}
                //     chequePreview={chequePreview}
                // />
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
                />
            )}
            {activeTab === "payroll" && (
                <PayrollDetails
                    form={form}
                    handleChange={handleChange}
                // handleChequeChange={handleChequeChange}
                />
            )}
            {activeTab === "education" && (
                <EducationExperienceDetails
                    form={form}
                    handleChange={handleChange}
                />
            )}
            {/* {activeTab === "experience" && (
                <ExperienceDetails
                    form={form}
                    handleChange={handleChange}
                />
            )} */}
            {activeTab === "emergency" && (
                <EmergencyContact
                    form={form}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "documents" && (
                <Documents
                    form={form}
                />
            )}
            {activeTab === "itassets" && (
                <ITAssets
                    form={form}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "leave" && (
                <LeaveDetails
                    form={form}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "exit" && (
                <ExitDetails
                    form={form}
                    handleChange={handleChange}
                />
            )}
            {activeTab === "additional" && (
                <AdditionalDetails
                    form={form}
                    handleChange={handleChange}
                />
            )}
            <EmployeeFooter
                uploading={uploading}
                handleSaveDraft={handleSaveDraft}
                handleSaveNext={handleSaveNext}
            />
        </div>
    );
}
