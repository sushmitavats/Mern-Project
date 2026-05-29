export default function LeaveBalanceCard({
  title,
  value,
}) {
  return (
    <div className="bg-white shadow rounded p-5">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="text-3xl font-bold text-cyan-600 mt-2">
        {value}
      </p>
    </div>
  );
}