import React from "react";

const holidays = [
  {
    name: "Republic Day",
    date: "2026-01-26",
  },
  {
    name: "Holi",
    date: "2026-03-14",
  },
];

export default function HolidayCalendar() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Holiday Calendar
      </h1>

      {holidays.map((holiday) => (
        <div
          key={holiday.date}
          className="bg-white shadow rounded p-4 mb-3"
        >
          <h2>{holiday.name}</h2>

          <p>{holiday.date}</p>
        </div>
      ))}
    </div>
  );
}