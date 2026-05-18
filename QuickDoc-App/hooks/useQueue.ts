import { useState, useEffect } from 'react';
import {
  listenToQueueStatus,
  listenToAppointmentPosition,
  QueueStatus,
} from '../firebase/realtimeQueue';

export function useQueueStatus(doctorId: string, date: string) {
  const [status, setStatus] = useState<QueueStatus | null>(null);

  useEffect(() => {
    if (!doctorId || !date) return;
    return listenToQueueStatus(doctorId, date, setStatus);
  }, [doctorId, date]);

  return status;
}

export function useAppointmentPosition(
  doctorId: string,
  date: string,
  appointmentId: string
) {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    if (!doctorId || !date || !appointmentId) return;
    return listenToAppointmentPosition(doctorId, date, appointmentId, setPosition);
  }, [doctorId, date, appointmentId]);

  return position;
}