import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  phoneNumber: string | null;
  displayName: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  photoURL: string | null;
  profileComplete: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Doctor {
  id: string;
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
}

export interface Booking {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorFee: number;
  date: string;           // 'YYYY-MM-DD'
  timeSlot: string;       // '10:00 AM'
  visitType: 'new' | 'follow';
  status: 'confirmed' | 'completed' | 'cancelled';
  queuePosition: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<UserProfile | null> {
  const doc = await firestore().collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as UserProfile;
}

export async function createUser(uid: string, data: Partial<UserProfile>): Promise<void> {
  await firestore().collection('users').doc(uid).set({
    uid,
    phoneNumber: data.phoneNumber ?? null,
    displayName: null,
    age: null,
    gender: null,
    photoURL: null,
    profileComplete: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
    ...data,
  });
}

export async function updateUser(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>): Promise<void> {
  await firestore().collection('users').doc(uid).update(data);
}

// ─── Doctor helpers ───────────────────────────────────────────────────────────

export async function getDoctors(filters?: {
  specialtyKey?: string;
  available?: boolean;
  gender?: string;
}): Promise<Doctor[]> {
  let query: FirebaseFirestoreTypes.Query = firestore().collection('doctors');

  if (filters?.available === true) {
    query = query.where('available', '==', true);
  }
  if (filters?.specialtyKey) {
    query = query.where('specialtyKey', '==', filters.specialtyKey);
  }
  if (filters?.gender) {
    query = query.where('gender', '==', filters.gender);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
}

export async function getDoctor(doctorId: string): Promise<Doctor | null> {
  const doc = await firestore().collection('doctors').doc(doctorId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Doctor;
}

export function listenToDoctors(
  onUpdate: (doctors: Doctor[]) => void,
  filters?: { specialtyKey?: string; available?: boolean }
): () => void {
  let query: FirebaseFirestoreTypes.Query = firestore().collection('doctors');

  if (filters?.available === true) {
    query = query.where('available', '==', true);
  }
  if (filters?.specialtyKey) {
    query = query.where('specialtyKey', '==', filters.specialtyKey);
  }

  return query.onSnapshot((snapshot) => {
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    onUpdate(doctors);
  });
}

// ─── Booking helpers ──────────────────────────────────────────────────────────

export async function createBooking(
  data: Omit<Booking, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await firestore().collection('bookings').add({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export function listenToUserBookings(
  userId: string,
  onUpdate: (bookings: Booking[]) => void
): () => void {
  return firestore()
    .collection('bookings')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      onUpdate(bookings);
    });
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  const doc = await firestore().collection('bookings').doc(bookingId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Booking;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await firestore().collection('bookings').doc(bookingId).update({ status: 'cancelled' });
}

// ─── Queue count helpers ──────────────────────────────────────────────────────

export async function getDoctorQueueCount(doctorId: string, date: string): Promise<number> {
  const snapshot = await firestore()
    .collection('bookings')
    .where('doctorId', '==', doctorId)
    .where('date', '==', date)
    .where('status', '==', 'confirmed')
    .get();
  return snapshot.size;
}