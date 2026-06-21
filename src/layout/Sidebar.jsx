import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, LogOut, Dumbbell, Receipt, FileBarChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { signOut, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: UserPlus, label: 'Register', path: '/register' },
    { icon: Users, label: 'Members', path: '/members' },
    { icon: FileText, label: 'Transactions', path: '/transactions' },
    { icon: Receipt, label: 'Expenses', path: '/expenses' },
    { icon: FileBarChart, label: 'Report', path: '/report' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
          <Dumbbell size={20} />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">GymPro</span>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-3 px-2 truncate">Admin: {user?.email || 'Admin'}</p>
        <button 
          onClick={() => signOut()} 
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}