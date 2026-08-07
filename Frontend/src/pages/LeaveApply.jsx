import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addLeave,searchEmployees,getLeaveBalance, getLeaves,
} from "../api";
import { useNavigate } from "react-router-dom";
export default function LeaveApply() {
    const navigate = useNavigate();

    const [employeeResults, setEmployeeResults] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [applyOnBehalf, setApplyOnBehalf] = useState(false);

    const [leaveBalance, setLeaveBalance] = useState({
        earnLeave: 0,
        floatingLeave: 0,
    });
    const [form, setForm] = useState({
        employee_code: "",
        leaveType: "",
        leaveSource: "",
        description: "",
        deductedFrom: "",
        leaveDates: [],
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDayType, setSelectedDayType] = useState("Full Day");
    const user = JSON.parse(localStorage.getItem("user"));
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [selectedHalf, setSelectedHalf] =
        useState("1st Half Day");
    const [calendarLeaves, setCalendarLeaves] =
        useState([]);
    //state declaration
    const FIXED_HOLIDAYS = [
        "01-01",
        "26-01",
        "15-08",
        "02-10",
    ];
    const isHoliday = (dateString) => {
        const [, month, day] =
            dateString.split("-");
        return FIXED_HOLIDAYS.includes(
            `${day}-${month}`
        );
    };
    const isWeekend = (dateString) => {
        const d = new Date(dateString);
        const day = d.getDay();
        return day === 0 || day === 6;
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
    //add date
    const addDateToLeave = () => {
        if (!selectedDate) {
            alert("Select Date");
            return;
        }
        const dateString = selectedDate.toLocaleDateString("en-CA");
        const exists = form.leaveDates.find((d) => d.date === dateString);
        if (exists) {
            alert("Date already added");
            return;
        }
        setForm({
            ...form,
            leaveDates: [
                ...form.leaveDates,
                {
                    date: dateString,
                    dayType: selectedDayType,
                },
            ],
        });
    };
    //useeffect
    useEffect(() => {
        const load = async () => {
            try {
                const balance =
                    await getLeaveBalance(user.employee_code);
                setLeaveBalance({
                    earnLeave:
                        balance.data.earnLeave || 0,
                    floatingLeave:
                        balance.data.floatingLeave ||
                        0,
                });
                const leaves =
                    await getLeaves();
                setCalendarLeaves(
                    leaves.data || []
                );
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
                leaveDates: [
                    {
                        date: fromDate,
                        dayType: selectedHalf,
                    },
                ],
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
    //submit
    // const handleSubmit = async () => {
    //     console.log("FORM BEFORE VALIDATION", form);
    //     if (!form.leaveType) {
    //         alert("Select Leave Type");
    //         return;
    //     }
    //     if (form.leaveDates.length === 0) {
    //         alert("Select At Least One Leave Date");
    //         return;
    //     }
    //     if (!form.description.trim()) {
    //         alert("Description Required");
    //         return;
    //     }
    //     if (
    //         form.leaveType === "Floating Leave" &&
    //         leaveBalance.floatingLeave < 0.5
    //     ) {
    //         alert("Floating Leave balance is less than half day (0.5)");
    //         return;
    //     }
    //     try {
    //         let finalForm = { ...form };
    //         if (!applyOnBehalf) {
    //             finalForm.employee_code = user.employee_code;
    //         }
    //         await addLeave(finalForm);
    //         alert("Leave Applied Successfully");
    //         navigate("/leave");
    //     } catch (err) {
    //         console.log(err);
    //         alert(err.response?.data?.msg || "Error");
    //     }
    // };
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
            alert(
                "No valid working day selected"
            );
            return;
        }
        if (!form.description.trim()) {
            alert("Reason is required");
            return;
        }
        if (
            form.leaveType ===
            "Floating Leave" &&
            leaveBalance.floatingLeave < 0.5
        ) {
            alert(
                "Floating Leave balance is less than 0.5 day"
            );
            return;
        }
        try {
            const payload = {
                ...form,
                employee_code:
                    applyOnBehalf
                        ? form.employee_code
                        : user.employee_code,
                leaveSource:
                    form.leaveType,
            };
            await addLeave(payload);
            alert("Leave Applied Successfully");
            navigate("/leave");
        } catch (err) {
            console.log(err);
            alert(
                err.response?.data?.msg ||
                "Error"
            );
        }
    };
    //emp search
    const handleEmployeeSearch = async (value) => {
        setEmployeeSearch(value);
        if (!value.trim()) {
            setEmployeeResults([]);
            return;
        }
        try {
            const res = await searchEmployees(value);
            setEmployeeResults(
                res.data.filter(
                    (emp) => emp.employee_code !== user.employee_code
                )
            );
        } catch (err) {
            console.log(err);
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


            {/* Birthday Leave */}
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
                    Birthday Leave </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#1B2559]">
                        {leaveBalance.birthdayLeave || 0}
                    </h3>
                </div> </div> </div>
            {/* Total Leave */}
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
                        {(leaveBalance.earnLeave || 0) +
                            (leaveBalance.floatingLeave || 0) +
                            (leaveBalance.birthdayLeave || 0)}
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
                <h2 className="text-[18px] font-bold text-[#101828]">
                    Leave Apply
                </h2>
                <p className="mt-2 text-[15px] text-[#7B849B]">
                    Apply for leave and track your leave balance
                </p>
            </div>

            {/* <div className="flex items-center rounded-xl bg-white px-5 py-3 shadow-sm border border-[#E8EDF5]">
                <span className="text-[#94A3B8] text-sm">Dashboard</span>
                <span className="mx-2 text-[#CBD5E1]">/</span>
                <span className="text-[#94A3B8] text-sm">Leave</span>
                <span className="mx-2 text-[#CBD5E1]">/</span>
                <span className="text-sm font-semibold text-[#2563EB]">
                    Apply Leave
                </span>
            </div> */}
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
                    <button className="rounded-xl border border-[#D8E2EE] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#2563EB] hover:text-white">
                        Today
                    </button>
                </div>
                <div className="p-6">
                    {/* <Calendar
                        minDate={new Date()}
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileClassName={({ date }) => {
                            const dateString = date.toLocaleDateString("en-CA");
                            const found = form.leaveDates.find((d) => d.date === dateString);
                            return found ? "leave-selected" : "";
                        }}
                        tileContent={({ date }) => {
                            const dateString = date.toLocaleDateString("en-CA");
                            const found = form.leaveDates.find((d) => d.date === dateString);
                            if (!found) return null;
                            return (
                                <div className="
                                  mt-1
                                  text-[9px]
                                  font-bold
                                  text-white">
                                    {found.dayType === "Full Day"
                                        ? "FD"
                                        : found.dayType === "1st Half Day"
                                            ? "FH"
                                            : "SH"} </div>
                            );
                        }}
                    />  */}
                    <Calendar
                        minDate={new Date()}
                        value={
                            fromDate
                                ? new Date(fromDate)
                                : new Date()
                        }
                        onChange={(date) => {
                            const value =
                                date.toLocaleDateString(
                                    "en-CA"
                                );

                            setFromDate(value);

                            if (isHalfDay) {
                                setToDate(value);
                            }
                        }}
                        tileDisabled={({ date }) => {
                            const value =
                                date.toLocaleDateString(
                                    "en-CA"
                                );

                            return (
                                isWeekend(value) ||
                                isHoliday(value)
                            );
                        }}
                        tileClassName={({ date }) => {
                            const value =
                                date.toLocaleDateString(
                                    "en-CA"
                                );

                            if (isHoliday(value))
                                return "holiday-tile";

                            const leave =
                                calendarLeaves.find((l) =>
                                    l.leaveDates?.some(
                                        (d) => d.date === value
                                    )
                                );

                            if (!leave) return null;

                            if (
                                leave.status ===
                                "Approved"
                            )
                                return "approved-leave";

                            if (leave.status === "Pending"
                            )
                                return "pending-leave";
                            return null;
                        }}
                    />
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

                            {/* <select
                                value={form.leaveType}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm({
                                        ...form,
                                        leaveType: value,
                                        leaveSource: value,
                                        deductedFrom: value,
                                    });
                                }}
                                className="
                                        h-[34px]
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
                            >
                                <option value="">Select Leave Type</option>
                                <option value="Earn Leave">Earn Leave</option>
                                <option value="Floating Leave">Floating Leave</option>
                            </select> */}
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
                                    disabled={
                                        leaveBalance.floatingLeave <
                                        0.5
                                    }
                                >
                                    Floating Leave
                                    {leaveBalance.floatingLeave <
                                        0.5
                                        ? " (Balance < 0.5)"
                                        : ""}
                                </option>
                            </select>
                        </div>

                        {/* Day Type */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                Day Type
                            </label>

                            <select
                                value={selectedDayType}
                                onChange={(e) => setSelectedDayType(e.target.value)}
                                className="
                                    h-[34px]
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
                            >
                                <option>Full Day</option>
                                <option>1st Half Day</option>
                                <option>2nd Half Day</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* From Date */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                From Date
                            </label>

                            {/* <input
                                type="date"
                                value={selectedDate ? selectedDate.toLocaleDateString("en-CA") : ""}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className="
                                h-[34px]
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
                            /> */}
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            />
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                                To Date
                            </label>
                            {/* <input
                                type="date"
                                className="
                                    h-[34px]
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
                            /> */}
                            <input
                                type="date"
                                value={toDate}
                                disabled={isHalfDay}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
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

                            {/* <input
                                type="text"
                                value={`${form.leaveDates.length || 0} Days`}
                                readOnly
                                className="
                        h-[34px]
                        w-full
                        rounded-[6px]
                        border
                        border-[#cfd7e2]
                        bg-white
                        px-3
                        text-[11px]
                        text-[#344054]
                        outline-none
                    "
                            /> */}
                            <input
                                type="text"
                                value={`${totalDays} Day${totalDays > 1 ? "s" : ""
                                    }`}
                                readOnly
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054]"
                            />
                        </div>

                        {/* Half Day */}
                        {/* <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Half Day
                            </label>

                            <div className="flex h-[34px] items-center gap-3">
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={selectedDayType !== "Full Day"}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedDayType("1st Half Day");
                                            } else {
                                                setSelectedDayType("Full Day");
                                            }
                                        }}
                                    />

                                    <div
                                        className="
                                            h-[22px]
                                            w-[42px]
                                            rounded-full
                                            bg-[#CBD5E1]
                                            transition
                                            peer-checked:bg-[#0392A1]
                                            after:absolute
                                            after:mt-[3px]
                                            after:ml-[3px]
                                            after:h-4
                                            after:w-4
                                            after:rounded-full
                                            after:bg-white
                                            after:transition-all
                                            peer-checked:after:translate-x-5
                                        "
                                    />
                                </label>

                                <span className="text-[11px] font-medium text-[#344054]">
                                    Yes, I am applying for half day
                                </span>
                            </div>
                        </div> */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Half Day
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={isHalfDay}
                                    onChange={(e) => {
                                        const checked =
                                            e.target.checked;

                                        setIsHalfDay(
                                            checked
                                        );

                                        if (checked) {
                                            setSelectedHalf(
                                                "1st Half Day"
                                            );
                                        }
                                    }}
                                />

                                <span className="text-[11px]">
                                    Apply Half Day
                                </span>
                            </div>

                            {isHalfDay && (
                                <div className="mt-3 flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedHalf ===
                                                "1st Half Day"
                                            }
                                            onChange={() =>
                                                setSelectedHalf(
                                                    "1st Half Day"
                                                )
                                            }
                                        />
                                        1st Half
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedHalf ===
                                                "2nd Half Day"
                                            }
                                            onChange={() =>
                                                setSelectedHalf(
                                                    "2nd Half Day"
                                                )
                                            }
                                        />
                                        2nd Half
                                    </label>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Add Date */}
                    {/* <button
                        type="button"
                        onClick={addDateToLeave}
                        className="
                        + Add Date
                    </button> */}

                    {/* Reason */}
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
                    <div className="mt-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={applyOnBehalf}
                                onChange={(e) => setApplyOnBehalf(e.target.checked)}
                                className="h-5 w-5 rounded accent-[#2563EB]"
                            />

                            <label className="text-[15px] font-semibold text-[#1B2559]">
                                Apply On Behalf of Employee
                            </label>
                        </div>
                    </div>

                    {applyOnBehalf && (
                        <div className="mt-5">
                            <label className="mb-1.5 block text-[11px] font-bold text-[#17213b]">
                                Search Employee
                            </label>
                            <input
                                type="text"
                                value={employeeSearch}
                                placeholder="Search Employee ID or Name"
                                onChange={(e) => handleEmployeeSearch(e.target.value)}
                                className="h-[34px] w-full rounded-[6px] border border-[#cfd7e2] bg-white px-3 text-[11px] text-[#344054] outline-none focus:border-[#0392a1] focus:ring-1 focus:ring-[#0392a1]/20"
                            />
                            {employeeResults.length > 0 && (
                                <div className="mt-3 max-h-[240px] overflow-auto rounded-2xl border border-[#E5EAF1] bg-white shadow-lg">
                                    {employeeResults.map((emp) => (
                                        <div
                                            key={emp.employee_code}
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    employee_code: emp.employee_code,
                                                });
                                                setEmployeeSearch(`${emp.employee_code} - ${emp.name}`);
                                                setEmployeeResults([]);
                                            }}
                                            className="cursor-pointer border-b border-[#EEF2F7] px-5 py-4 transition hover:bg-blue-50"
                                        >
                                            <div className="font-semibold">{emp.employee_code}</div>
                                            <div className="text-sm text-gray-500">{emp.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Buttons */}
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
    </div>
    );
}

