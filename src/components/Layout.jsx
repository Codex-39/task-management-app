import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface border-b border-white/5 p-4 flex items-center justify-between z-30">
          <h1 className="text-xl font-bold text-primary">TaskMan</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-textMuted hover:text-text rounded-lg bg-white/5"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
