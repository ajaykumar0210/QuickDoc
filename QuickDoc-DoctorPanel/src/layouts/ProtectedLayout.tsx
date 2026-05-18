import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Link, useLocation } from 'react-router-dom';

export default function ProtectedLayout() {
  const doctor = useAuthStore((s) => s.doctor);
  const location = useLocation();

  if (!doctor) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/dashboard', label: '📋 Dashboard' },
    { to: '/profile', label: '⚙️ Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bottom tab nav on mobile, side nav on desktop */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-200 py-6 px-3 gap-1">
          <div className="px-3 mb-6">
            <div className="text-2xl mb-1">🏥</div>
            <p className="text-xs font-bold text-gray-900">QuickDoc</p>
            <p className="text-xs text-gray-400">Doctor Panel</p>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              location.pathname === item.to ? 'text-sky-600' : 'text-gray-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
