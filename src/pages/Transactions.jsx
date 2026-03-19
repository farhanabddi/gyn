import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import TransactionsTable from '../features/transactions/TransactionsTable';
import { Search, Loader2 } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    // Notice the select string: we are telling Supabase to fetch the related member's name!
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        amount,
        duration_days,
        method,
        transaction_date,
        members ( name ) 
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      // Map the data to match what our TransactionsTable expects
      const formattedData = data.map(tx => ({
        member: tx.members?.name || 'Unknown',
        amount: `$${tx.amount}`,
        duration: `${tx.duration_days} days`,
        method: tx.method.charAt(0).toUpperCase() + tx.method.slice(1), // Capitalize
        date: tx.transaction_date
      }));
      setTransactions(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    tx.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Immutable payment history</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search member or method..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <Card noPadding>
        {loading ? (
          <div className="p-12 flex justify-center items-center text-gray-400 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading ledger...</span>
          </div>
        ) : (
          <TransactionsTable data={filteredTransactions} showDuration={true} />
        )}
      </Card>
    </div>
  );
}