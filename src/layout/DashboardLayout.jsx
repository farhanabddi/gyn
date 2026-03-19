import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Outlet is where the current page (Dashboard, Members, etc.) will be injected */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}