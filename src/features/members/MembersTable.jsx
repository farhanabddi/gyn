import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import Badge from '../../components/Badge';
import { Pause, Play, Edit2, Trash2, Loader2 } from 'lucide-react';

export default function MembersTable({ data, onRefresh }) {
  // We use this state to show a loading spinner only on the specific row being clicked
  const [processingId, setProcessingId] = useState(null);

  const handlePause = async (id) => {
    if (!window.confirm('Are you sure you want to pause this membership?')) return;
    setProcessingId(id);
    const { error } = await supabase.rpc('pause_membership', { p_member_id: id });
    
    if (error) alert(error.message);
    else if (onRefresh) onRefresh(); // Refresh the list to show the new status
    
    setProcessingId(null);
  };

  const handleResume = async (id) => {
    setProcessingId(id);
    const { error } = await supabase.rpc('resume_membership', { p_member_id: id });
    
    if (error) alert(error.message);
    else if (onRefresh) onRefresh();
    
    setProcessingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        {/* ... Keep the <thead> exactly the same ... */}
        <thead>
          <tr className="border-b border-gray-100 text-gray-500">
            <th className="px-6 py-4 font-normal">Name</th>
            <th className="px-6 py-4 font-normal">Phone</th>
            <th className="px-6 py-4 font-normal">Start Date</th>
            <th className="px-6 py-4 font-normal">Expiry Date</th>
            <th className="px-6 py-4 font-normal">Status</th>
            <th className="px-6 py-4 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((member) => (
            <tr key={member.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
              <td className="px-6 py-4 text-gray-600">{member.phone}</td>
              <td className="px-6 py-4 text-gray-600">{member.start_date}</td>
              <td className="px-6 py-4 text-gray-600">{member.expiry_date}</td>
              <td className="px-6 py-4">
                <Badge status={member.status}>{member.status}</Badge>
              </td>
              <td className="px-6 py-4 flex items-center justify-end gap-4 text-gray-400">
                
                {processingId === member.id ? (
                  <Loader2 size={16} className="animate-spin text-brand-500" />
                ) : (
                  <>
                    {member.status === 'paused' ? (
                      <button onClick={() => handleResume(member.id)} className="hover:text-green-600 transition-colors" title="Resume"><Play size={16} /></button>
                    ) : member.status === 'active' ? (
                       <button onClick={() => handlePause(member.id)} className="hover:text-amber-600 transition-colors" title="Pause"><Pause size={16} /></button>
                    ) : (
                      <span className="w-4"></span>
                    )}
                  </>
                )}

                <button className="hover:text-brand-500 transition-colors" title="Edit"><Edit2 size={16} /></button>
                <button className="hover:text-red-500 transition-colors" title="Delete"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}