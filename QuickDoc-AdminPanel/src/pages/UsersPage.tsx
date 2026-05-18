import { useEffect, useState } from 'react';
import { listenToUsers, type UserProfile } from '../firebase/firestore';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToUsers((data) => {
      setUsers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber?.includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} registered patients</p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or phone..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
      />

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
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Age / Gender</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Profile</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">UID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      {search ? 'No users match your search.' : 'No users yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{u.displayName || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{u.phoneNumber}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {u.age ? `${u.age} yrs` : '—'} {u.gender ? `· ${u.gender}` : ''}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.profileComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {u.profileComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">{u.uid.slice(0, 12)}…</td>
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
