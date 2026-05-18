import { ref, onValue, update } from 'firebase/database';
import { rtdb } from './config';

export interface QueueStatus {
  currentServing: number;
  totalInQueue: number;
  isActive: boolean;
  estimatedWaitPerPatient: number;
}

export function listenToQueueStatus(
  doctorId: string,
  date: string,
  callback: (status: QueueStatus | null) => void
) {
  const statusRef = ref(rtdb, `queues/${doctorId}/${date}/status`);
  return onValue(statusRef, (snap) => {
    callback(snap.exists() ? (snap.val() as QueueStatus) : null);
  });
}

export async function advanceQueue(doctorId: string, date: string) {
  const statusRef = ref(rtdb, `queues/${doctorId}/${date}/status`);
  // Read current then increment
  return new Promise<void>((resolve) => {
    onValue(
      statusRef,
      async (snap) => {
        const current: QueueStatus = snap.val() ?? {
          currentServing: 0,
          totalInQueue: 0,
          isActive: true,
          estimatedWaitPerPatient: 10,
        };
        await update(statusRef, { currentServing: current.currentServing + 1 });
        resolve();
      },
      { onlyOnce: true }
    );
  });
}

export async function setQueueActive(doctorId: string, date: string, isActive: boolean) {
  const statusRef = ref(rtdb, `queues/${doctorId}/${date}/status`);
  await update(statusRef, { isActive });
}

export async function updateWaitTime(
  doctorId: string,
  date: string,
  estimatedWaitPerPatient: number
) {
  const statusRef = ref(rtdb, `queues/${doctorId}/${date}/status`);
  await update(statusRef, { estimatedWaitPerPatient });
}
