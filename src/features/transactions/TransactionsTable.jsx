import Badge from '../../components/Badge';
import { ArrowDownLeft } from 'lucide-react';

export default function TransactionsTable({ data }) {
  // Helper to format dates cleanly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Member</th>
            <th className="px-6 py-4 font-medium">Duration</th>
            <th className="px-6 py-4 font-medium">Method</th>
            <th className="px-6 py-4 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            data.map((tx, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-gray-500">{formatDate(tx.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{tx.member}</td>
                <td className="px-6 py-4 text-gray-600">{tx.duration}</td>
                <td className="px-6 py-4">
                  <Badge status={tx.method.toLowerCase()}>{tx.method}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-medium text-green-600 flex items-center justify-end gap-1">
                  <ArrowDownLeft size={16} />
                  {tx.amount}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}