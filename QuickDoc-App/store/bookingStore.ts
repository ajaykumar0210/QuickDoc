import { create } from 'zustand';
import { Doctor } from '../firebase/firestore';

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

interface BookingState {
  selectedDoctor: Doctor | null;
  selectedDate: string;
  selectedSlot: string | null;
  visitType: 'new' | 'follow';
  activeBookingId: string | null;

  setDoctor: (doctor: Doctor | null) => void;
  setDate: (date: string) => void;
  setSlot: (slot: string | null) => void;
  setVisitType: (type: 'new' | 'follow') => void;
  setActiveBookingId: (id: string | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedDoctor: null,
  selectedDate: todayString(),
  selectedSlot: null,
  visitType: 'new',
  activeBookingId: null,

  setDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setDate: (date) => set({ selectedDate: date }),
  setSlot: (slot) => set({ selectedSlot: slot }),
  setVisitType: (visitType) => set({ visitType }),
  setActiveBookingId: (id) => set({ activeBookingId: id }),
  resetBooking: () =>
    set({
      selectedDoctor: null,
      selectedDate: todayString(),
      selectedSlot: null,
      visitType: 'new',
      activeBookingId: null,
    }),
}));