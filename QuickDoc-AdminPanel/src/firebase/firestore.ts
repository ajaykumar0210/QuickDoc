import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { db, auth } from './config';

// ── Types ──────────────────────────────────────────────────────────────

export interface DoctorProfile {
  id: string;
  uid: string;
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
  email?: string;
  createdAt?: Timestamp;
}

export interface UserProfile {
  id: string;
  uid: string;
  phoneNumber: string;
  displayName?: string;
  age?: number;
  gender?: string;
  profileComplete: boolean;
  createdAt?: Timestamp;
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

// ── Admin check ────────────────────────────────────────────────────────

export async function isAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

// ── Stats ──────────────────────────────────────────────────────────────

export async function getStats() {
  const [doctorsSnap, usersSnap, bookingsSnap] = await Promise.all([
    getDocs(collection(db, 'doctors')),
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'bookings')),
  ]);

  const bookings = bookingsSnap.docs.map((d) => d.data() as Booking);
  const today = new Date().toISOString().split('T')[0];

  return {
    totalDoctors: doctorsSnap.size,
    activeDoctors: doctorsSnap.docs.filter((d) => d.data().available).length,
    totalUsers: usersSnap.size,
    totalBookings: bookingsSnap.size,
    todayBookings: bookings.filter((b) => b.date === today).length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
  };
}

// ── Doctors ────────────────────────────────────────────────────────────

export function listenToDoctors(callback: (doctors: DoctorProfile[]) => void) {
  return onSnapshot(collection(db, 'doctors'), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DoctorProfile)));
  });
}

export async function createDoctor(
  data: Omit<DoctorProfile, 'id' | 'uid'> & { email: string; password: string }
): Promise<string> {
  // Create Firebase Auth account for doctor
  const { email, password, ...profileData } = data;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  // Create Firestore document
  const docRef = await addDoc(collection(db, 'doctors'), {
    ...profileData,
    uid,
    email,
    createdAt: serverTimestamp(),
  });

  // Send password reset so doctor sets their own password
  await sendPasswordResetEmail(auth, email);

  return docRef.id;
}

export async function updateDoctor(id: string, data: Partial<DoctorProfile>) {
  await updateDoc(doc(db, 'doctors', id), data);
}

export async function deleteDoctor(id: string) {
  await deleteDoc(doc(db, 'doctors', id));
}

export async function toggleDoctorVerified(id: string, verified: boolean) {
  await updateDoc(doc(db, 'doctors', id), { verified });
}

// ── Users ──────────────────────────────────────────────────────────────

export function listenToUsers(callback: (users: UserProfile[]) => void) {
  return onSnapshot(collection(db, 'users'), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile)));
  });
}

// ── Bookings ───────────────────────────────────────────────────────────

export function listenToAllBookings(callback: (bookings: Booking[]) => void) {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
  });
}

export async function cancelBooking(id: string) {
  await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
}
