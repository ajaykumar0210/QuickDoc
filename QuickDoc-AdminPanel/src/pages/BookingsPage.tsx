import { useEffect, useState } from 'react';
import { listenToAllBookings, cancelBooking, type Booking } from '../firebase/firestore';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-sky-100 text-sky-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToAllBookings((data) => {
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientPhone?.includes(search);
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchDate = !filterDate || b.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  async function handleCancel(id: string) {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Last 100 bookings (newest first)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor, patient, phone..."
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {(filterDate || filterStatus !== 'all' || search) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterDate(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2.5 rounded-xl hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">{filtered.length} bookings shown</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Patient</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Doctor</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Date & Slot</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Fee</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">No bookings match the filters.</td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{b.patientName || '—'}</div>
                        <div className="text-xs text-gray-400">{b.patientPhone || b.userId.slice(0, 8)}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{b.doctorName}</div>
                        <div className="text-xs text-gray-400">{b.doctorSpecialty}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-gray-900">{b.date}</div>
                        <div className="text-xs text-gray-400">{b.timeSlot}</div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 capitalize">{b.visitType}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">₹{b.doctorFee}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
