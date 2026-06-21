import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { Receipt, Loader2 } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Notice 'category' is completely removed from the initial state
  const [form, setForm] = useState({ 
    amount: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  const fetchExpenses = async () => {
    setFetching(true);
    const { data } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (data) setExpenses(data);
    setFetching(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Notice 'category' is completely removed from the insert payload
    const { error } = await supabase.from('expenses').insert([{
      amount: parseFloat(form.amount),
      description: form.description,
      expense_date: form.date
    }]);

    if (error) {
      alert(error.message);
    } else {
      setForm({ ...form, amount: '', description: '' }); 
      fetchExpenses(); 
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Receipt size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Track money going out</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <Card className="md:col-span-1 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amount ($)</label>
              <input 
                required 
                type="number" 
                min="0.1" 
                step="0.01" 
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Date</label>
              <input 
                required 
                type="date" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <input 
                required 
                type="text" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
              />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Expense'}</Button>
          </form>
        </Card>

        {/* Expense List */}
        <Card noPadding className="md:col-span-2 overflow-hidden">
          {fetching ? (
             <div className="p-10 flex justify-center text-gray-400"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No expenses recorded.</td>
                    </tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-6 py-3 text-gray-500">{exp.expense_date}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{exp.description}</td>
                        <td className="px-6 py-3 text-right text-red-600 font-medium flex items-center justify-end gap-1">
                          -${exp.amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}