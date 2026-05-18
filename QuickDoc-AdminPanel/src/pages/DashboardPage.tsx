import { useEffect, useState } from 'react';
import { getStats } from '../firebase/firestore';

interface Stats {
  totalDoctors: number;
  activeDoctors: number;
  totalUsers: number;
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of all QuickDoc activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Doctors" value={stats.totalDoctors} icon="👨‍⚕️" color="blue" />
            <StatCard label="Active Now" value={stats.activeDoctors} icon="🟢" color="green" />
            <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="purple" />
            <StatCard label="Total Bookings" value={stats.totalBookings} icon="📋" color="sky" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Today's Bookings" value={stats.todayBookings} icon="📅" color="orange" />
            <StatCard label="Completed" value={stats.completedBookings} icon="✅" color="green" />
            <StatCard label="Cancelled" value={stats.cancelledBookings} icon="❌" color="red" />
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Booking Breakdown</h2>
            <div className="space-y-3">
              {[
                { label: 'Completion Rate', value: stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0, color: 'bg-green-500' },
                { label: 'Cancellation Rate', value: stats.totalBookings > 0 ? Math.round((stats.cancelledBookings / stats.totalBookings) * 100) : 0, color: 'bg-red-400' },
                { label: 'Doctor Availability', value: stats.totalDoctors > 0 ? Math.round((stats.activeDoctors / stats.totalDoctors) * 100) : 0, color: 'bg-sky-500' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-semibold text-gray-900">{row.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-2 ${row.color} rounded-full transition-all`} style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    sky: 'bg-sky-50 text-sky-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className={`${styles[color]} rounded-2xl p-5`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1 opacity-80">{label}</div>
    </div>
  );
}
