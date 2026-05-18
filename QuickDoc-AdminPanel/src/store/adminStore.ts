import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  adminUid: string | null;
  adminEmail: string | null;
  setAdmin: (uid: string, email: string) => void;
  clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminUid: null,
      adminEmail: null,
      setAdmin: (uid, email) => set({ adminUid: uid, adminEmail: email }),
      clearAdmin: () => set({ adminUid: null, adminEmail: null }),
    }),
    { name: 'qd-admin-auth' }
  )
);
