import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Loader2, ChevronLeft, ChevronRight, Pause, Play, Edit } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      
      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Fetch only what we need, including the new start_date and paused_date
      const { data, count, error } = await supabase
        .from('members')
        .select('id, name, phone, start_date, expiry_date, status, paused_date', { count: 'exact' })
        .order('name', { ascending: true })
        .range(from, to);

      if (!error && data) {
        setMembers(data);
        if (count !== null) setTotalCount(count);
      }
      
      setLoading(false);
    }

    fetchMembers();
  }, [page]);

  const handleTogglePause = async (member) => {
    const today = new Date().toISOString().split('T')[0];

    if (member.status === 'active') {
      // Action: PAUSE
      const { error } = await supabase
        .from('members')
        .update({ 
          status: 'paused', 
          paused_date: today 
        })
        .eq('id', member.id);

      if (!error) {
        setMembers(members.map(m => m.id === member.id ? { ...m, status: 'paused', paused_date: today } : m));
      }
    } 
    else if (member.status === 'paused') {
      // Action: RESUME (PLAY)
      const pauseDate = new Date(member.paused_date || today); // Fallback to today if paused_date is missing
      const currentDate = new Date(today);
      
      // Calculate missing days
      const diffTime = Math.abs(currentDate - pauseDate);
      const pausedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Add missing days to the existing expiry date
      const currentExpiry = new Date(member.expiry_date);
      currentExpiry.setDate(currentExpiry.getDate() + pausedDays);
      const newExpiryDate = currentExpiry.toISOString().split('T')[0];

      const { error } = await supabase
        .from('members')
        .update({ 
          status: 'active', 
          expiry_date: newExpiryDate, 
          paused_date: null 
        })
        .eq('id', member.id);

      if (!error) {
        setMembers(members.map(m => m.id === member.id ? { ...m, status: 'active', expiry_date: newExpiryDate, paused_date: null } : m));
      }
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
            <p className="text-sm text-gray-500 mt-1">Showing {members.length} of {totalCount} members</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.location.reload()} className="flex items-center gap-2">
             Refresh
          </Button>
          <Button onClick={() => window.location.href='/register'} className="flex items-center gap-2">
            + Add Member
          </Button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center text-brand-500"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">Expiry Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No members found.</td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-3 text-gray-500">{member.phone}</td>
                      <td className="px-6 py-3 text-gray-500">{member.start_date}</td>
                      <td className="px-6 py-3 text-gray-500">{member.expiry_date}</td>
                      
                      {/* Status Column with Paused Date */}
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active' ? 'bg-green-100 text-green-700' : 
                            member.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {member.status}
                          </span>
                          {member.status === 'paused' && member.paused_date && (
                            <span className="text-[10px] text-gray-400 font-medium">
                              Paused on {member.paused_date}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Actions Column (Delete Removed) */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button 
                            onClick={() => handleTogglePause(member)}
                            className="hover:text-brand-600 transition-colors"
                            title={member.status === 'paused' ? "Resume Membership" : "Pause Membership"}
                          >
                            {member.status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
                          </button>
                          
                          <button className="hover:text-brand-600 transition-colors" title="Edit Member">
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button 
            variant="secondary" 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0 || loading}
            className="flex gap-1 items-center px-3 py-1.5 text-sm"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages || 1}
          </span>
          
          <Button 
            variant="secondary" 
            onClick={() => setPage(p => p + 1)} 
            disabled={page >= totalPages - 1 || loading}
            className="flex gap-1 items-center px-3 py-1.5 text-sm"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}