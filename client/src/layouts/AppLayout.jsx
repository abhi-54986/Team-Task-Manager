import { ClipboardList, FolderKanban, LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList }
];

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-emerald-600 text-white">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink">Team Task Manager</h1>
              <p className="text-sm text-slate-500">
                {user?.name} · {user?.role}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <nav className="flex items-center gap-1 rounded border border-line bg-slate-50 p-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `focus-ring inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={logout}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-line bg-white text-slate-600 hover:text-ink"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
