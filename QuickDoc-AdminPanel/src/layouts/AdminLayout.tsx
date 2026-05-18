import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { auth } from '../firebase/config';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { to: '/bookings', label: 'Bookings', icon: '📋' },
  { to: '/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout() {
  const { adminUid, adminEmail, clearAdmin } = useAdminStore();
  const location = useLocation();

  if (!adminUid) return <Navigate to="/login" replace />;

  async function handleLogout() {
    await auth.signOut();
    clearAdmin();
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="px-5 py-6 border-b border-slate-700">
          <div className="text-2xl mb-1">⚙️</div>
          <div className="text-sm font-bold">QuickDoc Admin</div>
          <div className="text-xs text-slate-400 mt-1 truncate">{adminEmail}</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
