import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ── Types ──────────────────────────────────────────────────────────────

export interface DoctorProfile {
  id: string;
  uid: string; // Firebase Auth UID
  name: string;
  specialty: string;
  specialtyKey: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewCount: number;
  fee: number;
  available: boolean;
  gender: 'male' | 'female';
  languages: string[];
  clinicName: string;
  clinicAddress: string;
  about: string;
  services: string[];
  timings: string;
  verified: boolean;
  queueCount: number;
  phone: string;
}

export interface Booking {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorFee: number;
  date: string;
  timeSlot: string;
  visitType: 'in-person' | 'video';
  status: 'confirmed' | 'completed' | 'cancelled';
  queuePosition: number;
  patientName?: string;
  patientPhone?: string;
  createdAt: Timestamp;
}

// ── Doctor CRUD ────────────────────────────────────────────────────────

export async function getDoctorByUid(uid: string): Promise<DoctorProfile | null> {
  const q = query(collection(db, 'doctors'), where('uid', '==', uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as DoctorProfile;
}

export async function updateDoctorAvailability(doctorId: string, available: boolean) {
  await updateDoc(doc(db, 'doctors', doctorId), { available });
}

export async function updateDoctorProfile(doctorId: string, data: Partial<DoctorProfile>) {
  await updateDoc(doc(db, 'doctors', doctorId), { ...data });
}

// ── Bookings ───────────────────────────────────────────────────────────

export function listenToDoctorBookings(
  doctorId: string,
  date: string,
  callback: (bookings: Booking[]) => void
) {
  const q = query(
    collection(db, 'bookings'),
    where('doctorId', '==', doctorId),
    where('date', '==', date),
    where('status', '==', 'confirmed')
  );
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
    bookings.sort((a, b) => a.queuePosition - b.queuePosition);
    callback(bookings);
  });
}

export async function markPatientServed(bookingId: string) {
  await updateDoc(doc(db, 'bookings', bookingId), { status: 'completed' });
}

export async function cancelBookingByDoctor(bookingId: string) {
  await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
}
