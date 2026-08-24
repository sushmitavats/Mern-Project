import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import "../App.css";
// import { addLeave, searchEmployees, getLeaveBalance, getLeaves, } from "../api";
import {
    addLeave,
    searchEmployees,
    getLeaveBalance,
    getLeaves,
    searchReportingManagers,
    // getEmployeeCalendarLeaves,
    // getHolidays,
    // monthlyEarnLeave,
    // grantFloatingLeave,
} from "../api";
import { useNavigate } from "react-router-dom";

export default function LeaveApply() {
    const navigate = useNavigate();
    const [employeeResults, setEmployeeResults] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [applyOnBehalf, setApplyOnBehalf] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [leaveBalance, setLeaveBalance] = useState({earnLeave: 0,floatingLeave: 0,totalLeave: 0});
    const [form, setForm] = useState({
        employee_code: "",
        leaveType: "",
        leaveSource: "",
        description: "",
        deductedFrom: "",
        leaveDates: [],
    });
    // const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDayType, setSelectedDayType] = useState("Full Day");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [selectedHalf, setSelectedHalf] = useState("1st Half Day");
    const [calendarLeaves, setCalendarLeaves] = useState([]);
    const [activeMonth, setActiveMonth] = useState(new Date());
    //reportimng manager
    const [reportingManagerSearch, setReportingManagerSearch] = useState("");
    const [reportingManagerResults, setReportingManagerResults] = useState([]);
    const [selectedReportingManager, setSelectedReportingManager] = useState(null);
    const [reportingManagerLoading, setReportingManagerLoading] = useState(false);
    //state declaration
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("USER:", user);
    const FIXED_HOLIDAYS = {
        "01-01": "New Year",
        "26-01": "Republic Day",
        "15-08": "Independence Day",
        "02-10": "Gandhi Jayanti",
    };
    const isHoliday = (dateString) => {
        const [, month, day] = dateString.split("-");
        return Boolean(FIXED_HOLIDAYS[`${day}-${month}`]);
    };
    const isWeekend = (dateString) => {
        const d = new Date(dateString);
        const day = d.getDay();
        return day === 0 || day === 6;
    };
    // Check if current date is already applied (Pending or Approved)
    const isAlreadyApplied = (dateString) => {
        return calendarLeaves.some(
            (leave) =>
                (leave.status === "Pending" || leave.status === "Approved") &&
                leave.leaveDates?.some((d) => d.date === dateString)
        );
    };
    // Check if date is in current selection
    const isSelectedDate = (dateString) => {
        return form.leaveDates.some((d) => d.date === dateString);
    };
    const getDateRange = (start, end) => {
        const dates = [];
        const current = new Date(start);
        while (current <= new Date(end)) {
            const value = current.toLocaleDateString("en-CA");
            if (!isWeekend(value) && !isHoliday(value)) {
                dates.push(value);
            }
            current.setDate(
                current.getDate() + 1
            );
        }
        return dates;
    };
    useEffect(() => {
        const load = async () => {
            try {
                // Always load calendar leaves
                const leaves = await getLeaves();
                setCalendarLeaves(leaves.data || []);
                // ADMIN does not have employee_code, so skip balance API
                if (user?.role === "ADMIN") {
                    return;
                }
                if (!user?.employee_code) {
                    console.error("Employee code missing:", user);
                    return;
                }
                const balance = await getLeaveBalance(user.employee_code);
                setLeaveBalance({
                    earnLeave: Number(balance.data.earnLeave || 0),
                    floatingLeave: Number(balance.data.floatingLeave || 0),
                    totalLeave: Number(balance.data.totalLeave || 0),
                });
            } catch (err) {
                console.log(err);
            }
        };
        load();
    }, []);
    // Auto-generate leave dates
    useEffect(() => {
        if (!fromDate) {
            setForm((prev) => ({
                ...prev,
                leaveDates: [],
            }));
            return;
        }
        if (isHalfDay) {
            setToDate(fromDate);
            setForm((prev) => ({
                ...prev,
                leaveDates: [{ date: fromDate, dayType: selectedHalf, },],
            }));
            return;
        }
        if (!toDate) {
            setForm((prev) => ({
                ...prev,
                leaveDates: [],
            }));
            return;
        }
        if (new Date(toDate) < new Date(fromDate)) {
            return;
        }
        const dates = getDateRange(fromDate, toDate).map((d) => ({
            date: d,
            dayType: "Full Day",
        }));
        setForm((prev) => ({
            ...prev,
            leaveDates: dates,
        }));
    }, [fromDate, toDate, isHalfDay, selectedHalf,]);

    // Total days calculation
    const totalDays = useMemo(() => {
        if (isHalfDay) return 0.5;
        return form.leaveDates.length;
    }, [
        isHalfDay,
        form.leaveDates,
    ]);
    //before refresh get updated
    const refreshLeaveBalance = async () => {
        const balance = await getLeaveBalance(user.employee_code);

        setLeaveBalance({
            earnLeave: Number(balance.data.earnLeave || 0),
            floatingLeave: Number(balance.data.floatingLeave || 0),
            totalLeave: Number(balance.data.totalLeave || 0),
        });
    };
    //submit
    const handleSubmit = async () => {
        if (!form.leaveType) {
            alert("Select Leave Type");
            return;
        }
        if (!fromDate) {
            alert("Select From Date");
            return;
        }
        if (!toDate) {
            alert("Select To Date");
            return;
        }
        if (form.leaveDates.length === 0) {
            alert("No valid working day selected");
            return;
        }

        if (!form.description.trim()) {
            alert("Reason is required");
            return;
        }
        // GET TARGET EMPLOYEE
        const targetEmployeeCode = applyOnBehalf
            ? selectedEmployee?.employee_code
            : user?.employee_code;
        // VALIDATE TARGET EMPLOYEE
        if (!targetEmployeeCode) {
            alert(
                applyOnBehalf
                    ? "Please select an employee."
                    : "Logged-in employee code is missing.");
            return;
        }
        // REPORTING MANAGER REQUIRED
        if (!selectedReportingManager?.employee_code) {
            alert("Please select a reporting manager.");
            return;
        }
        // FLOATING LEAVE VALIDATION
        if (form.leaveType === "Floating Leave" &&
            Number(leaveBalance.floatingLeave) < Number(totalDays)) {
            alert("Insufficient Floating Leave balance.");
            return;
        }
        try {
            const payload = {
                employee_code: targetEmployeeCode,
                leaveType: form.leaveType,
                leaveSource: form.leaveType,
                description: form.description,
                leaveDates: form.leaveDates,
                reportingManagerEmployeeCode:
                    selectedReportingManager.employee_code,
            };
            console.log(
                "FINAL LEAVE PAYLOAD:",
                JSON.stringify(payload, null, 2)
            );
            await addLeave(payload);
            if (!applyOnBehalf) {
                await refreshLeaveBalance();
            }
            alert("Leave Applied Successfully");
            navigate("/leave");
        } catch (err) {
            console.error(
                "Leave Apply Error:", err);
            console.error("Backend Error:", err.response?.data);
            alert(err.response?.data?.msg || "Error while applying leave.");
        }
    };
    //emp search
    const handleEmployeeSearch = async (value) => {
        setEmployeeSearch(value);
        if (!value.trim()) {
            setEmployeeResults([]);
            setForm((prev) => ({
                ...prev,
                employee_code: "",
            }));
            return;
        }
        // Clear results if search is empty
        if (!value.trim()) {
            setEmployeeResults([]);
            return;
        }
        try {
            const res = await searchEmployees(value);
            setEmployeeResults(res.data || []);
        } catch (err) {
            console.log("Employee Search Error:", err);
            setEmployeeResults([]);
        }
    };

    //handle reporting manager search
    const handleReportingManagerSearch = async (value) => {
        setReportingManagerSearch(value);
        setSelectedReportingManager(null);
        if (!value.trim()) {
            setReportingManagerResults([]);
            return;
        }
        try {
            setReportingManagerLoading(true);
            const res = await searchReportingManagers(value);
            setReportingManagerResults(res.data || []);
        } catch (error) {
            console.error(
                "Reporting Manager Search Error:",
                error
            );
            setReportingManagerResults([]);
        } finally {
            setReportingManagerLoading(false);
        }
    };
    return (<div className="min-h-screen w-full bg-[#eef1f5] p-4 sm:p-5 lg:p-6">
        {/* ===== LEAVE BALANCE ==== */} <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Earn Leave */}
            <div className="
                  rounded-[24px]
                  border
                  border-[#E7EDF5]
                  bg-white
                  p-5
                  shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-semibold text-[#7B849B]">
                            Earn Leave </p>
                        <h3 className="mt-2 text-3xl font-bold text-[#1B2559]">
                            {leaveBalance.earnLeave}
                        </h3>
                    </div>
                    <div className="
                         flex
                         h-12
                         w-12
                         items-center
                         justify-center
                         rounded-xl
                         bg-[#E8F0FF]
                         font-bold
                         text-[#2563EB]">
                        EL
                    </div>
                </div>
            </div>
            {/* Floating Leave */}
            <div className="
                   rounded-[24px]
                    border
                    border-[#E7EDF5]
                    bg-white
                    p-5
                    shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-semibold text-[#7B849B]">
                            Floating Leave </p>
                        <h3 className="mt-2 text-3xl font-bold text-[#1B2559]">
                            {leaveBalance.floatingLeave} </h3>
                    </div>
                    <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#E8FAF5]
                            font-bold
                            text-[#0392A1]
                            ">
                        FL </div> </div> </div>
            <div className="
                    rounded-[24px]
                    border
                    border-[#E7EDF5]
                    bg-white
                    p-5
                    shadow-[0_10px_30px_rgba(15,23,42,.05)]
                    "> <div className="flex items-center justify-between"> <div> <p className="text-[12px]
                    font-semibold
                    text-[#7B849B]">
                    Total Leave </p>
                    <h3 className="mt-2 text-3xl font-bold text-[#1B2559]">
                        {/* {(Number(leaveBalance.earnLeave || 0) + Number(leaveBalance.floatingLeave || 0)).toFixed(2)} */}


                        {/*{leaveBalance.totalLeave.toFixed(2)} */}
                        {Math.max(Number(leaveBalance.totalLeave || 0),0).toFixed(2)}
                    </h3>
                </div>
                    <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F1EAFE]
                        font-bold
                        text-[#7C3AED]">
                        TL </div> </div> </div> </div>
        {/* ===== HEADER ===== */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                {/* <h2 className="text-[18px] font-bold text-[#101828]">
                    Leave Apply
                </h2> */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-lg border border-[#DCE5EF] px-3 py-2 text-sm font-semibold text-[#475467] hover:bg-gray-100"
                    >
                        ← Back
                    </button>

                    <h2 className="text-[18px] font-bold text-[#101828]">
                        Leave Apply
                    </h2>
                </div>
                <p className="mt-2 text-[15px] text-[#7B849B]">
                    Apply for leave and track your leave balance
                </p>
            </div>
        </div>
        {/* ================= TOP SECTION ================= */}
        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[430px_1fr]">
            {/* LEFT */}
            <div className="rounded-[28px] border border-[#E9EEF5] bg-white shadow-[0_15px_35px_rgba(15,23,42,.06)] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#EEF2F7] px-7 py-5">
                    <div>
                        <h3 className="text-[16px] font-bold leading-5 text-[#101828]">
                            Calendar
                        </h3>
                        <p className="mt-1 text-sm text-[#94A3B8]">
                            Select leave dates
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const today = new Date();
                            setActiveMonth(today);
                            setFromDate(today.toLocaleDateString("en-CA"));
                            if (isHalfDay) {
                                setToDate(today.toLocaleDateString("en-CA"));
                            }
                        }}
                        className="rounded-xl border border-[#D8E2EE] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#2563EB] hover:text-white">
                        Today
                    </button>
                </div>
                <div className="p-6">
                    <Calendar
                        view="month"
                        minDetail="month"
                        maxDetail="month"
                        minDate={new Date()}
                        activeStartDate={activeMonth}
                        onActiveStartDateChange={({ activeStartDate }) =>
                            setActiveMonth(activeStartDate)
                        }
                        value={
                            fromDate
                                ? toDate
                                    ? [new Date(fromDate), new Date(toDate)]
                                    : new Date(fromDate)
                                : null
                        }
                        onClickDay={(date) => {
                            const value = date.toLocaleDateString("en-CA");
                            if (isWeekend(value)) {
                                alert("Cannot apply leave. It is a weekend.");
                                return;
                            }
                            if (isHoliday(value)) {
                                alert("Cannot apply leave. It is a public holiday.");
                                return;
                            }
                            if (isAlreadyApplied(value)) {
                                alert("Cannot apply leave. Leave has already been applied for this date.");
                                return;
                            }
                            if (!fromDate || (fromDate && toDate)) {
                                setFromDate(value);
                                setToDate("");
                                return;
                            }
                            if (new Date(value) < new Date(fromDate)) {
                                setFromDate(value);
                            } else {
                                setToDate(value);
                            }
                        }}
                        // tileDisabled={({ date }) => {

                        tileClassName={({ date }) => {
                            const value = date.toLocaleDateString("en-CA");
                            if (isSelectedDate(value)) return "selected-leave";
                            if (isHoliday(value)) return "holiday-tile";
                            if (isWeekend(value)) return "weekend-tile";
                            const leave = calendarLeaves.find((l) =>
                                l.leaveDates?.some((d) => d.date === value)
                            );
                            if (!leave) return null;
                            if (leave.status === "Approved") return "approved-leave";
                            if (leave.status === "Pending") return "pending-leave";
                            if (leave.status === "Rejected") return "rejected-leave";
                            return null;
                        }}
                        tileContent={({ date }) => {
                            const value = date.toLocaleDateString("en-CA");
                            const [, month, day] = value.split("-");
                            const label = FIXED_HOLIDAYS[`${day}-${month}`];
                            if (!label) return null;
                            return <div className="holiday-label">{label}</div>;
                        }}
                    />

                </div>
                <div className="mt-5 rounded-xl border border-[#E5EAF1] bg-white p-4">
                    <h4 className="text-sm font-semibold text-[#1B2559] mb-3">
                        Calendar Legend
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-green-600"></span>
                            Selected Leave
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-yellow-400"></span>
                            Pending Leave
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-blue-600"></span>
                            Approved Leave
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-gray-400"></span>
                            Rejected Leave
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-pink-400"></span>
                            Public Holiday
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-red-200"></span>
                            Weekend
                        </div>
                    </div>
                </div>
            </div>
            {/* RIGHT  */}
            <div className="rounded-[28px] border border-[#E9EEF5] bg-white p-8 shadow-[0_15px_35px_rgba(15,23,42,.06)]">
                <div className="mb-8">
                    <h3 className="text-[16px] font-bold leading-5 text-[#101828]">
                        Apply for Leave
                    </h3>
                    <p className="mt-2 text-[15px] text-[#7B849B]">
                        Fill all required details before submitting your leave request.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Leave Type */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Leave Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.leaveType}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        leaveType:
                                            e.target.value,
                                        leaveSource:
                                            e.target.value,
                                        deductedFrom:
                                            e.target.value,
                                    })
                                }
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            >
                                <option value="">
                                    Select Leave Type
                                </option>
                                <option value="Earn Leave">
                                    Earn Leave
                                </option>
                                <option
                                    value="Floating Leave"
                                    disabled={leaveBalance.floatingLeave < 0.5}
                                >
                                    Floating Leave
                                    {leaveBalance.floatingLeave < 0.5 ? " (Balance < 0.5)" : ""}
                                </option>
                            </select>
                        </div>
                        {/* Day Type */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                Day Type
                            </label>
                            <select
                                value={isHalfDay ? selectedHalf : "Full Day"}
                                onChange={(e) => {
                                    setSelectedDayType(e.target.value);
                                    if (e.target.value === "Full Day") {
                                        setIsHalfDay(false);
                                        setSelectedHalf("1st Half Day");
                                    } else {
                                        setIsHalfDay(true);
                                        setSelectedHalf(e.target.value);
                                    }
                                }}
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            >
                                <option value="Full Day">
                                    Full Day
                                </option>
                                <option value="1st Half Day">
                                    1st Half Day
                                </option>
                                <option value="2nd Half Day">
                                    2nd Half Day
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* From Date */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                From Date
                            </label>
                            <input
                                type="text"
                                value={fromDate}
                                readOnly
                                placeholder="Select from calendar"
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            />
                        </div>
                        {/* To Date */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                To Date
                            </label>
                            <input
                                type="text"
                                value={toDate}
                                readOnly
                                placeholder="Select from calendar"
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {/* Total Days */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Total Days
                            </label>
                            <input
                                type="text"
                                // value={`${totalDays} Day${totalDays > 1 ? "s" : ""
                                value={`${totalDays} Day${totalDays !== 1 ? "s" : ""}`}
                                // }`}
                                readOnly
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            />
                        </div>
                        {/* imp code start */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reporting Manager <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={
                                    selectedReportingManager
                                        ? `${selectedReportingManager.name} (${selectedReportingManager.employee_code})`
                                        : reportingManagerSearch
                                }
                                onChange={(e) => {
                                    if (selectedReportingManager) {
                                        setSelectedReportingManager(null);
                                    }
                                    handleReportingManagerSearch(e.target.value);
                                }}
                                placeholder="Search by name or employee code"
                                className="w-full border rounded-lg px-3 py-2"
                            />
                            {reportingManagerLoading && (
                                <div className="absolute right-3 top-9 text-xs text-gray-400">
                                    Searching...
                                </div>
                            )}
                            {reportingManagerResults.length > 0 &&
                                !selectedReportingManager && (
                                    <div className="
                                                absolute
                                                z-50
                                                w-full
                                                bg-white
                                                border
                                                rounded-lg
                                                shadow-lg
                                                mt-1
                                                max-h-52
                                                overflow-y-auto
                                            ">
                                        {reportingManagerResults.map((employee) => (
                                            <button
                                                type="button"
                                                key={employee.employee_code}
                                                onClick={() => {
                                                    setSelectedReportingManager(employee);
                                                    setReportingManagerSearch("");
                                                    setReportingManagerResults([]);
                                                }}
                                                className="
                                                        w-full
                                                        text-left
                                                        px-3
                                                        py-2
                                                        hover:bg-cyan-50
                                                        border-b
                                                        last:border-b-0
                                                        "
                                            >
                                                <div className="font-medium text-gray-800">
                                                    {employee.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {employee.employee_code}
                                                    {employee.email
                                                        ? ` • ${employee.email}`
                                                        : ""}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            {selectedReportingManager && (
                                <div className="
                                        mt-1
                                        text-xs
                                        text-green-600
                                        ">
                                    Reporting Manager selected:
                                    {" "}
                                    <b>
                                        {selectedReportingManager.name}
                                    </b>
                                    {" "}
                                    ({selectedReportingManager.employee_code})
                                </div>
                            )}
                        </div>

                        {/* imp code end */}
                        {/* half day */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Half Day
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={isHalfDay}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setIsHalfDay(checked);
                                        if (checked) {
                                            setSelectedHalf("1st Half Day");
                                            setSelectedDayType("1st Half Day");
                                        } else {
                                            setSelectedDayType("Full Day");
                                        }
                                    }}
                                    className="h-4 w-4 accent-[#0392a1]"
                                />
                                <span className="text-[11px]">
                                    Apply Half Day
                                </span>
                            </div>
                            {isHalfDay && (
                                <div className="mt-3 flex gap-5">
                                    <label className="flex items-center gap-2 text-[11px]">
                                        <input
                                            type="radio"
                                            name="halfDay"
                                            checked={selectedHalf === "1st Half Day"}
                                            onChange={() => {
                                                setSelectedHalf("1st Half Day");
                                                setSelectedDayType("1st Half Day");
                                            }}
                                            className="accent-[#0392a1]"
                                        />
                                        1st Half
                                    </label>

                                    <label className="flex items-center gap-2 text-[11px]">
                                        <input
                                            type="radio"
                                            name="halfDay"
                                            checked={selectedHalf === "2nd Half Day"}
                                            onChange={() => {
                                                setSelectedHalf("2nd Half Day");
                                                setSelectedDayType("2nd Half Day");
                                            }}
                                            className="accent-[#0392a1]"
                                        />
                                        2nd Half
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                            Reason
                        </label>
                        <textarea
                            rows={5}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="w-full resize-none rounded-[6px] border bg-white px-3 py-2.5 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b2] focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20 border-[#cfd7e2]"
                            placeholder="Write your leave reason..."
                        />
                    </div>
                    {/* Selected Dates */}
                    <div>
                        <h4 className="text-[16px] font-bold leading-5 text-[#101828]">
                            Selected Dates
                        </h4>
                        <div className="space-y-2 max-h-[180px] overflow-auto">
                            {form.leaveDates.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-2xl border border-blue-100 bg-[#F8FBFF] px-5 py-4 transition-all hover:shadow-md"
                                >
                                    <span>{item.date}</span>
                                    <span className="font-semibold text-[#2563EB]">{item.dayType}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Apply On Behalf */}
                    {/* Apply On Behalf */}
                    <div className="mt-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={applyOnBehalf}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setApplyOnBehalf(checked);
                                    // if (!checked) {
                                    //     setEmployeeSearch("");
                                    //     setEmployeeResults([]);
                                    //     setForm((prev) => ({
                                    //         ...prev,
                                    //         employee_code: "",
                                    //     }));
                                    // }
                                    if (!checked) {
                                        setEmployeeSearch("");
                                        setEmployeeResults([]);
                                        setSelectedEmployee(null);
                                        // setReportingManager(null);
                                        setForm((prev) => ({
                                            ...prev,
                                            employee_code: "",
                                        }));
                                    }
                                }}
                                className="h-5 w-5 rounded accent-[#2563EB]"
                            />
                            <label className="text-[15px] font-semibold text-[#1B2559]">
                                Apply On Behalf of Employee
                            </label>
                        </div>
                    </div>
                    {applyOnBehalf && (
                        <div className="mt-5 relative">

                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Search Employee
                            </label>

                            <input
                                type="text"
                                value={employeeSearch}
                                placeholder="Search Employee Name or Code"
                                onChange={(e) =>
                                    handleEmployeeSearch(e.target.value)
                                }
                                className="
                                    h-[38px]
                                    w-full
                                    rounded-[6px]
                                    border
                                    border-[#cfd7e2]
                                    bg-white
                                    px-3
                                    text-[11px]
                                    text-[#344054]
                                    outline-none
                                    focus:border-[#0392a1]
                                    focus:ring-1
                                    focus:ring-[#0392a1]/20
                                "
                            />

                            {/* Search Suggestions */}
                            {employeeResults.length > 0 && (
                                <div
                                    className="
                                    absolute
                                    left-0
                                    right-0
                                    top-[62px]
                                    z-[100]
                                    max-h-[250px]
                                    overflow-y-auto
                                    rounded-lg
                                    border
                                    border-[#E5EAF1]
                                    bg-white
                                    shadow-lg
                                "
                                >
                                    {employeeResults.map((emp) => (
                                        <button
                                            key={emp.employee_code}
                                            type="button"
                                            onClick={async () => {
                                                const employee = {
                                                    employee_code: String(emp.employee_code).trim(),
                                                    name: emp.name,
                                                    email: emp.email,
                                                };
                                                setSelectedEmployee(employee);
                                                setForm((prev) => ({
                                                    ...prev,
                                                    employee_code: employee.employee_code,
                                                }));
                                                // Show selected employee
                                                setEmployeeSearch(
                                                    `${emp.employee_code} - ${emp.name}`
                                                );
                                                // Close suggestions
                                                setEmployeeResults([]);
                                                // Clear old manager
                                                // setReportingManager(null);
                                                // await fetchReportingManager(
                                                //     emp.employee_code
                                                // );
                                            }}
                                            className="
                                                block
                                                w-full
                                                border-b
                                                border-[#EEF2F7]
                                                px-4
                                                py-3
                                                text-left
                                                hover:bg-blue-50
                                            "
                                        >
                                            <div className="text-[12px] font-semibold text-[#1B2559]">
                                                {emp.name}
                                            </div>

                                            <div className="mt-0.5 text-[10px] text-[#667085]">
                                                {emp.employee_code}
                                            </div>

                                            {emp.email && (
                                                <div className="mt-0.5 text-[10px] text-[#98A2B3]">
                                                    {emp.email}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Selected Employee */}
                            {selectedEmployee && (
                                <div
                                    className="
                                        mt-2
                                        rounded-md
                                        border
                                        border-green-200
                                        bg-green-50
                                        px-3
                                        py-2
                                        text-[10px]
                                        text-green-700
                                    "
                                >
                                    Selected Employee:
                                    <span className="ml-1 font-semibold">
                                        {selectedEmployee.employee_code} -{" "}
                                        {selectedEmployee.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={() => navigate("/leave")}
                            className="rounded-2xl border border-[#DCE5EF] px-7 py-3 font-semibold text-[#475467] transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-lg text-white bg-[#0392a1] hover:bg-[#02808d]"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div >
    );
}
