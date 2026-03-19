import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import MembersTable from '../features/members/MembersTable';
import { Search, Loader2, UserPlus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Function to fetch members from Supabase
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error.message);
      alert('Failed to load members. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Run fetch on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter logic for the search bar
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Updating...' : `Showing ${filteredMembers.length} of ${members.length} members`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={fetchMembers} 
            disabled={loading}
            className="hidden md:flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            className="flex items-center gap-2"
          >
            <UserPlus size={18} />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or phone number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
        />
      </div>

      {/* Members Table Card */}
      <Card noPadding className="overflow-hidden">
        {loading && members.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="animate-spin text-brand-500" size={32} />
            <p className="text-sm font-medium">Connecting to database...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">No members found matching "{searchTerm}"</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-brand-600 text-sm font-medium mt-2 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <MembersTable 
            data={filteredMembers} 
            onRefresh={fetchMembers} 
          />
        )}
      </Card>
    </div>
  );
}