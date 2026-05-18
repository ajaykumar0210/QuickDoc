import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  listenToDoctorBookings,
  updateDoctorAvailability,
  markPatientServed,
  cancelBookingByDoctor,
  type Booking,
} from '../firebase/firestore';
import {
  listenToQueueStatus,
  advanceQueue,
  setQueueActive,
  updateWaitTime,
  type QueueStatus,
} from '../firebase/realtimeQueue';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function DashboardPage() {
  const { doctor, setDoctor } = useAuthStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [waitInput, setWaitInput] = useState('10');
  const [saving, setSaving] = useState(false);
  const today = todayDate();

  // Real-time bookings listener
  useEffect(() => {
    if (!doctor) return;
    const unsub = listenToDoctorBookings(doctor.id, today, setBookings);
    return unsub;
  }, [doctor?.id, today]);

  // Real-time queue status listener
  useEffect(() => {
    if (!doctor) return;
    const unsub = listenToQueueStatus(doctor.id, today, (status) => {
      setQueueStatus(status);
      if (status) setWaitInput(String(status.estimatedWaitPerPatient));
    });
    return unsub;
  }, [doctor?.id, today]);

  async function toggleAvailability() {
    if (!doctor) return;
    setSaving(true);
    const next = !doctor.available;
    await updateDoctorAvailability(doctor.id, next);
    await setQueueActive(doctor.id, today, next);
    setDoctor({ ...doctor, available: next });
    setSaving(false);
  }

  async function handleServed(bookingId: string) {
    if (!doctor) return;
    await markPatientServed(bookingId);
    await advanceQueue(doctor.id, today);
  }

  async function handleCancel(bookingId: string) {
    await cancelBookingByDoctor(bookingId);
  }

  async function saveWaitTime() {
    if (!doctor) return;
    const mins = parseInt(waitInput) || 10;
    await updateWaitTime(doctor.id, today, mins);
  }

  async function handleLogout() {
    await auth.signOut();
    setDoctor(null);
    navigate('/login');
  }

  if (!doctor) return null;

  const served = queueStatus?.currentServing ?? 0;
  const total = bookings.length;
  const waiting = bookings.filter((b) => b.queuePosition > served).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <h1 className="text-base font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-xs text-gray-500">{doctor.specialty} · {doctor.clinicName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Availability toggle */}
          <button
            onClick={toggleAvailability}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              doctor.available
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
            {doctor.available ? 'Available' : 'Unavailable'}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Today's Bookings" value={total} icon="📋" color="sky" />
          <StatCard label="Now Serving" value={served} icon="🔔" color="green" />
          <StatCard label="Waiting" value={waiting} icon="⏳" color="yellow" />
        </div>

        {/* Queue control */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Queue Control</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Est. wait per patient (min):</label>
              <input
                type="number"
                min={1}
                max={60}
                value={waitInput}
                onChange={(e) => setWaitInput(e.target.value)}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={saveWaitTime}
                className="bg-sky-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-sky-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Today's queue */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Today's Queue — {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">No bookings yet for today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const isServed = booking.queuePosition <= served;
                const isCurrent = booking.queuePosition === served + 1;
                return (
                  <div
                    key={booking.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      isCurrent
                        ? 'border-sky-300 bg-sky-50'
                        : isServed
                        ? 'border-gray-100 bg-gray-50 opacity-60'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCurrent ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {booking.queuePosition}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.patientName || 'Patient'}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">
                              Now
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.visitType === 'video' ? '📹 Video' : '🏥 In-person'} · {booking.timeSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!isServed && (
                        <>
                          <button
                            onClick={() => handleServed(booking.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            ✓ Served
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {isServed && (
                        <span className="text-xs text-green-600 font-medium">✓ Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: 'sky' | 'green' | 'yellow';
}) {
  const bg = { sky: 'bg-sky-50', green: 'bg-green-50', yellow: 'bg-yellow-50' }[color];
  const text = { sky: 'text-sky-600', green: 'text-green-600', yellow: 'text-yellow-600' }[color];
  return (
    <div className={`${bg} rounded-2xl p-5 border border-white`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold ${text}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
