import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import { Users, DollarSign, Loader2, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeMembers, setActiveMembers] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      // 1. Get total active members
      const { count } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      setActiveMembers(count || 0);

      // 2. Get Reconciliation Report for the current month
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
      const today = date.toISOString().split('T')[0];

      const { data: report, error } = await supabase.rpc('get_reconciliation_report', {
        p_start_date: firstDay,
        p_end_date: lastDay
      });

      if (!error && report) {
        setReportData(report);
        // Find today's total from the report
        const todayData = report.find(r => r.report_date === today);
        setTodayTotal(todayData ? todayData.daily_total : 0);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Members</p>
            <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${todayTotal}</p>
          </div>
        </Card>
      </div>

      {/* Monthly Reconciliation Table (No Charts, Just Data) */}
      <Card noPadding>
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Calendar className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Monthly Payment Reconciliation</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Zaad</th>
                <th className="px-6 py-3 font-medium text-right">eDahab</th>
                <th className="px-6 py-3 font-medium text-right">Cash</th>
                <th className="px-6 py-3 font-bold text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions this month yet.</td>
                </tr>
              ) : (
                reportData.map((day) => (
                  <tr key={day.report_date} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{day.report_date}</td>
                    <td className="px-6 py-3 text-right text-gray-600">${day.zaad_total}</td>
                    <td className="px-6 py-3 text-right text-gray-600">${day.edahab_total}</td>
                    <td className="px-6 py-3 text-right text-gray-600">${day.cash_total}</td>
                    <td className="px-6 py-3 text-right font-medium text-brand-600">${day.daily_total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}