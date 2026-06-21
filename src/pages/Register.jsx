import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Notice duration defaults to 30 right here
  const [form, setForm] = useState({
    name: '',
    phone: '',
    amount: '',
    duration: 30, 
    method: 'cash',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMessage(null);
    setSuccess(false);
    
    try {
      // 1. Calculate the exact expiry date based on the custom days written
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(startDate.getDate() + parseInt(form.duration));

      // 2. Insert the Member
      const { data: member, error: mError } = await supabase
        .from('members')
        .insert([{
          name: form.name,
          phone: form.phone,
          start_date: startDate.toISOString().split('T')[0],
          expiry_date: expiryDate.toISOString().split('T')[0],
          notes: form.notes,
          status: 'active'
        }])
        .select()
        .single();

      if (mError) throw new Error(`Member Error: ${mError.message}`);

      // 3. Insert the initial Transaction tied to this member
      const { error: tError } = await supabase
        .from('transactions')
        .insert([{
          member_id: member.id,
          amount: parseFloat(form.amount),
          duration_days: parseInt(form.duration),
          method: form.method
        }]);

      if (tError) throw new Error(`Payment Error: ${tError.message}`);

      // 4. Success! Reset the form back to defaults (duration goes back to 30)
      setSuccess(true);
      setForm({ name: '', phone: '', amount: '', duration: 30, method: 'cash', notes: '' });
      
      setTimeout(() => setSuccess(false), 4000); 

    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto md:mx-0">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register Member</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new profile and log the initial payment.</p>
        </div>
      </div>

      <Card>
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} /> 
            <span className="font-medium">Member registered successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3 animate-in fade-in">
            <AlertCircle size={20} className="mt-0.5 shrink-0" /> 
            <div>
              <span className="font-medium block">Failed to save data</span>
              <span className="text-sm opacity-90">{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Ahmed Ali"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input 
                required
                type="tel" 
                placeholder="e.g. 063 123 4567"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-5 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Paid ($)</label>
              <input 
                required
                type="number" 
                min="1"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
              />
            </div>
            
            {/* HERE IS THE CHANGED DURATION FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (Days)</label>
              <input 
                required
                type="number" 
                min="1"
                placeholder="e.g. 30"
                value={form.duration}
                onChange={(e) => setForm({...form, duration: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
              <select 
                value={form.method}
                onChange={(e) => setForm({...form, method: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all bg-white"
              >
                <option value="cash">Cash</option>
                <option value="zaad">Zaad</option>
                <option value="edahab">eDahab</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes (Optional)</label>
            <textarea 
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              rows="2" 
              placeholder="Any medical conditions or special requests..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button type="submit" disabled={loading} className="w-full py-3 text-base">
              {loading ? 'Saving to Database...' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}