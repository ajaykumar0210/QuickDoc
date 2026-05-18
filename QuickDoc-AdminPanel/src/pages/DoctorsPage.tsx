import { useEffect, useState } from 'react';
import {
  listenToDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorVerified,
  type DoctorProfile,
} from '../firebase/firestore';

const SPECIALTIES = [
  { key: 'general', label: 'General Physician' },
  { key: 'cardiologist', label: 'Cardiologist' },
  { key: 'dermatologist', label: 'Dermatologist' },
  { key: 'dentist', label: 'Dentist' },
  { key: 'orthopedic', label: 'Orthopedic' },
  { key: 'gynecologist', label: 'Gynecologist' },
  { key: 'pediatrician', label: 'Pediatrician' },
  { key: 'ent', label: 'ENT Specialist' },
  { key: 'neurologist', label: 'Neurologist' },
  { key: 'psychiatrist', label: 'Psychiatrist' },
];

const BLANK_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  specialty: 'General Physician',
  specialtyKey: 'general',
  qualification: '',
  experience: '',
  fee: 200,
  gender: 'male' as 'male' | 'female',
  languages: 'Hindi, English',
  clinicName: '',
  clinicAddress: '',
  about: '',
  services: '',
  timings: 'Mon-Sat: 9AM-6PM',
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<DoctorProfile | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => listenToDoctors(setDoctors), []);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.clinicName?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditDoctor(null);
    setForm(BLANK_FORM);
    setError('');
    setShowModal(true);
  }

  function openEdit(doctor: DoctorProfile) {
    setEditDoctor(doctor);
    setForm({
      name: doctor.name,
      email: doctor.email ?? '',
      password: '',
      phone: doctor.phone ?? '',
      specialty: doctor.specialty,
      specialtyKey: doctor.specialtyKey,
      qualification: doctor.qualification,
      experience: doctor.experience,
      fee: doctor.fee,
      gender: doctor.gender,
      languages: doctor.languages.join(', '),
      clinicName: doctor.clinicName,
      clinicAddress: doctor.clinicAddress,
      about: doctor.about,
      services: doctor.services.join(', '),
      timings: doctor.timings,
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    setError('');
    if (!form.name || !form.specialty || !form.clinicName) {
      setError('Name, specialty and clinic name are required.');
      return;
    }
    if (!editDoctor && (!form.email || !form.password)) {
      setError('Email and password are required for new doctors.');
      return;
    }
    setSaving(true);
    try {
      const profileData = {
        name: form.name,
        specialty: form.specialty,
        specialtyKey: form.specialtyKey,
        qualification: form.qualification,
        experience: form.experience,
        fee: Number(form.fee),
        gender: form.gender,
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        clinicName: form.clinicName,
        clinicAddress: form.clinicAddress,
        about: form.about,
        services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
        timings: form.timings,
        phone: form.phone,
        rating: 0,
        reviewCount: 0,
        available: false,
        verified: false,
        queueCount: 0,
      };

      if (editDoctor) {
        await updateDoctor(editDoctor.id, profileData);
      } else {
        await createDoctor({ ...profileData, uid: '', email: form.email, password: form.password });
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(doctor: DoctorProfile) {
    if (!confirm(`Delete ${doctor.name}? This cannot be undone.`)) return;
    await deleteDoctor(doctor.id);
  }

  function setSpec(key: string) {
    const found = SPECIALTIES.find((s) => s.key === key);
    setForm((f) => ({ ...f, specialtyKey: key, specialty: found?.label ?? key }));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">{doctors.length} registered doctors</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          + Add Doctor
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, specialty, clinic..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Doctor</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Specialty</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Clinic</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Fee</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Verified</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {search ? 'No doctors match your search.' : 'No doctors yet. Click + Add Doctor.'}
                  </td>
                </tr>
              ) : (
                filtered.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{doctor.name}</div>
                      <div className="text-xs text-gray-400">{doctor.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{doctor.specialty}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-[160px] truncate">{doctor.clinicName}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">₹{doctor.fee}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {doctor.available ? 'Active' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleDoctorVerified(doctor.id, !doctor.verified)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${doctor.verified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                      >
                        {doctor.verified ? '✓ Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => openEdit(doctor)}
                        className="text-slate-600 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field('Full Name', 'name', 'text', form, setForm)}
                {field('Phone', 'phone', 'tel', form, setForm)}
              </div>

              {!editDoctor && (
                <div className="grid grid-cols-2 gap-4">
                  {field('Email (login)', 'email', 'email', form, setForm)}
                  {field('Temp Password', 'password', 'password', form, setForm)}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <select
                    value={form.specialtyKey}
                    onChange={(e) => setSpec(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field('Qualification', 'qualification', 'text', form, setForm)}
                {field('Experience (e.g. 8 yrs)', 'experience', 'text', form, setForm)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field('Consultation Fee (₹)', 'fee', 'number', form, setForm)}
                {field('Languages (comma-sep)', 'languages', 'text', form, setForm)}
              </div>

              {field('Clinic Name', 'clinicName', 'text', form, setForm)}
              {field('Clinic Address', 'clinicAddress', 'text', form, setForm)}
              {field('Timings (e.g. Mon-Sat: 9AM-6PM)', 'timings', 'text', form, setForm)}
              {field('Services (comma-sep)', 'services', 'text', form, setForm)}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About / Bio</label>
                <textarea
                  rows={3}
                  value={form.about}
                  onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl py-3 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
              >
                {saving ? 'Saving...' : editDoctor ? 'Save Changes' : 'Create Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function field(
  label: string,
  key: string,
  type: string,
  form: Record<string, any>,
  setForm: React.Dispatch<React.SetStateAction<any>>
) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  );
}
