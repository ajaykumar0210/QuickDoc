import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateDoctorProfile } from '../firebase/firestore';

export default function ProfilePage() {
  const { doctor, setDoctor } = useAuthStore();
  const [form, setForm] = useState({
    fee: doctor?.fee ?? 200,
    timings: doctor?.timings ?? 'Mon-Sat: 9AM-6PM',
    about: doctor?.about ?? '',
    clinicName: doctor?.clinicName ?? '',
    clinicAddress: doctor?.clinicAddress ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!doctor) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateDoctorProfile(doctor!.id, {
      fee: Number(form.fee),
      timings: form.timings,
      about: form.about,
      clinicName: form.clinicName,
      clinicAddress: form.clinicAddress,
    });
    setDoctor({ ...doctor!, ...form, fee: Number(form.fee) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  }

  function field(label: string, key: keyof typeof form, type = 'text', multiline = false) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {multiline ? (
          <textarea
            rows={3}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        ) : (
          <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500">{doctor.name} · {doctor.specialty}</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Read-only info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-1">
            <p className="text-sm"><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{doctor.name}</span></p>
            <p className="text-sm"><span className="font-medium text-gray-600">Specialty:</span> <span className="text-gray-900">{doctor.specialty}</span></p>
            <p className="text-sm"><span className="font-medium text-gray-600">Qualification:</span> <span className="text-gray-900">{doctor.qualification}</span></p>
            <p className="text-sm text-gray-400 text-xs mt-1">To change name/specialty/qualification, contact admin.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {field('Consultation Fee (₹)', 'fee', 'number')}
            {field('Clinic Name', 'clinicName')}
            {field('Clinic Address', 'clinicAddress')}
            {field('Timings', 'timings')}
            {field('About / Bio', 'about', 'text', true)}

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                ✓ Profile saved successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
