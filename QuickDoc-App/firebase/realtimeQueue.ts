import database from '@react-native-firebase/database';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QueueStatus {
  currentServing: number;
  totalInQueue: number;
  isActive: boolean;
  estimatedWaitPerPatient: number; // minutes
}

export interface QueueSlot {
  queueNumber: number;
  userId: string;
  status: 'waiting' | 'serving' | 'done';
}

// ─── Listen helpers ───────────────────────────────────────────────────────────

export function listenToQueueStatus(
  doctorId: string,
  date: string,
  onUpdate: (status: QueueStatus | null) => void
): () => void {
  const ref = database().ref(`queues/${doctorId}/${date}/status`);
  const handler = ref.on('value', (snapshot) => {
    onUpdate(snapshot.exists() ? (snapshot.val() as QueueStatus) : null);
  });
  return () => ref.off('value', handler);
}

export function listenToAppointmentPosition(
  doctorId: string,
  date: string,
  appointmentId: string,
  onUpdate: (position: number) => void
): () => void {
  const ref = database().ref(`queues/${doctorId}/${date}/slots/${appointmentId}/queueNumber`);
  const handler = ref.on('value', (snapshot) => {
    if (snapshot.exists()) onUpdate(snapshot.val() as number);
  });
  return () => ref.off('value', handler);
}

// ─── Write helpers ────────────────────────────────────────────────────────────

export async function addToQueue(
  doctorId: string,
  date: string,
  appointmentId: string,
  userId: string
): Promise<number> {
  const statusRef = database().ref(`queues/${doctorId}/${date}/status`);

  // Atomically increment totalInQueue and get the new position
  let queueNumber = 1;
  await statusRef.transaction((current: QueueStatus | null) => {
    if (!current) {
      queueNumber = 1;
      return {
        currentServing: 0,
        totalInQueue: 1,
        isActive: true,
        estimatedWaitPerPatient: 10,
      };
    }
    queueNumber = (current.totalInQueue ?? 0) + 1;
    return { ...current, totalInQueue: queueNumber };
  });

  // Save this appointment's slot
  await database()
    .ref(`queues/${doctorId}/${date}/slots/${appointmentId}`)
    .set({ queueNumber, userId, status: 'waiting' });

  return queueNumber;
}

export async function removeFromQueue(
  doctorId: string,
  date: string,
  appointmentId: string
): Promise<void> {
  await database()
    .ref(`queues/${doctorId}/${date}/slots/${appointmentId}`)
    .remove();
}