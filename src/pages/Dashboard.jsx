import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import { Users, UserX, DollarSign, Wallet, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    active: 0,
    expired: 0,
    todayRevenue: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        // 1. Get Active Members
        const { count: activeCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // 2. Get Expired Members
        // (We also check if the expiry date has passed just to be completely accurate)
        const today = new Date().toISOString().split('T')[0];
        const { count: expiredCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .lt('expiry_date', today);

        // 3. Get Today's Revenue
        const { data: todayTx } = await supabase
          .from('transactions')
          .select('amount')
          .eq('transaction_date', today);
        
        const todaySum = todayTx?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

        // 4. Get Total All-Time Revenue
        const { data: allTx } = await supabase
          .from('transactions')
          .select('amount');
          
        const totalSum = allTx?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

        // Update the state with all fetched numbers
        setMetrics({
          active: activeCount || 0,
          expired: expiredCount || 0,
          todayRevenue: todaySum,
          totalRevenue: totalSum
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of your gym</p>
      </div>

      {/* 4-Column Grid for Metrics Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Members Card */}
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Members</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.active}</p>
          </div>
        </Card>

        {/* Expired Members Card */}
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Expired Members</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.expired}</p>
          </div>
        </Card>

        {/* Today's Revenue Card */}
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${metrics.todayRevenue.toFixed(2)}</p>
          </div>
        </Card>

        {/* Total Money Card */}
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-lg">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</p>
          </div>
        </Card>

      </div>
    </div>
  );
}