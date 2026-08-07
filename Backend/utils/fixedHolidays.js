export const FIXED_HOLIDAYS = [
  {
    date: "01-01",
    name: "New Year",
  },
  {
    date: "26-01",
    name: "Republic Day",
  },
  {
    date: "15-08",
    name: "Independence Day",
  },
  {
    date: "02-10",
    name: "Gandhi Jayanti",
  },
];
export function isFixedHoliday(dateString) {
  // dateString format: YYYY-MM-DD
  const [, month, day] =
    dateString.split("-");
  return FIXED_HOLIDAYS.some(
    (h) => h.date === `${day}-${month}`
  );
}