import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileBarChart, Download, Loader2 } from 'lucide-react';

export default function Report() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    
    // Fetch Income (Transactions)
    const { data: income } = await supabase
      .from('transactions')
      .select('amount, transaction_date')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    // Fetch Expenses - Category is removed from the query here
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount, description, expense_date')
      .gte('expense_date', startDate)
      .lte('expense_date', endDate);

    const totalIncome = income?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
    const totalExpense = expenses?.reduce((sum, ex) => sum + Number(ex.amount), 0) || 0;

    setReportData({
      income: income || [],
      expenses: expenses || [],
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense
    });
    setLoading(false);
  };

  const exportToWord = () => {
    if (!reportData) return;
    const reportHtml = document.getElementById("printable-report").innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Gym Report</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + reportHtml + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Gym_Report_${startDate}_to_${endDate}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><FileBarChart size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download custom reports</p>
        </div>
      </div>

      <Card className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500/20 outline-none" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500/20 outline-none" />
        </div>
        <Button onClick={generateReport} disabled={loading} className="w-full md:w-auto px-8">
          {loading ? <Loader2 className="animate-spin" /> : 'Generate Data'}
        </Button>
      </Card>

      {reportData && (
        <Card>
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900">Report Summary</h2>
            <Button variant="secondary" onClick={exportToWord} className="flex gap-2">
              <Download size={18} /> Download Word .doc
            </Button>
          </div>

          <div id="printable-report">
            <h1 style={{ fontFamily: 'sans-serif', textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>Financial Summary Report</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Period: <strong>{startDate}</strong> to <strong>{endDate}</strong></p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontFamily: 'sans-serif' }} border="1" cellPadding="12">
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th align="left" style={{ padding: '12px' }}>Summary Description</th>
                <th align="right" style={{ padding: '12px' }}>Amount ($)</th>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Total Membership Revenue (Income)</td>
                <td align="right" style={{ color: '#16a34a', padding: '12px' }}><strong>+${reportData.totalIncome.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Total Business Expenses (Outgoings)</td>
                <td align="right" style={{ color: '#dc2626', padding: '12px' }}><strong>-${reportData.totalExpense.toFixed(2)}</strong></td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={{ padding: '12px' }}><strong>Net Business Balance</strong></td>
                <td align="right" style={{ padding: '12px' }}>
                  <strong style={{ color: reportData.net >= 0 ? '#16a34a' : '#dc2626' }}>
                    ${reportData.net.toFixed(2)}
                  </strong>
                </td>
              </tr>
            </table>

            <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                Report generated on {new Date().toLocaleDateString()} via GymPro Management System
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}