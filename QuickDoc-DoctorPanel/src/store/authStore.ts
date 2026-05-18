import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DoctorProfile } from '../firebase/firestore';

interface AuthState {
  doctor: DoctorProfile | null;
  setDoctor: (doctor: DoctorProfile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      setDoctor: (doctor) => set({ doctor }),
    }),
    { name: 'qd-doctor-auth' }
  )
);
