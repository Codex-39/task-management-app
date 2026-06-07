import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const sidebarClass = clsx(
    'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0',
    mobileOpen ? 'translate-x-0' : '-translate-x-full'
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={sidebarClass}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              TaskMan
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-textMuted hover:bg-white/5 hover:text-text'
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-textMuted truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
