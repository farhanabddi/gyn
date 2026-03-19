export default function TransactionsTable({ data, showDuration = true }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500">
            <th className="px-6 py-3 font-normal">Member</th>
            <th className="px-6 py-3 font-normal">Amount</th>
            {/* We conditionally render the duration column so we can reuse this table on the Dashboard (which has less space) */}
            {showDuration && <th className="px-6 py-3 font-normal">Duration</th>}
            <th className="px-6 py-3 font-normal">Method</th>
            <th className="px-6 py-3 font-normal">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{tx.member}</td>
              <td className="px-6 py-4 text-brand-500 font-medium">{tx.amount}</td>
              {showDuration && <td className="px-6 py-4 text-gray-600">{tx.duration}</td>}
              <td className="px-6 py-4 text-gray-500 text-xs">{tx.method}</td>
              <td className="px-6 py-4 text-gray-600">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}