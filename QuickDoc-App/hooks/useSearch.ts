import { useState, useEffect, useCallback, useRef } from 'react';
import { getDoctors, listenToDoctors, Doctor } from '../firebase/firestore';

interface SearchState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export function useDoctors(filters?: {
  specialtyKey?: string;
  available?: boolean;
  gender?: string;
}): SearchState & { refetch: () => void } {
  const [state, setState] = useState<SearchState>({
    doctors: [],
    loading: true,
    error: null,
  });

  const filtersKey = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const doctors = await getDoctors(filters);
      setState({ doctors, loading: false, error: null });
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useDoctorsRealtime(filters?: {
  specialtyKey?: string;
  available?: boolean;
}): SearchState {
  const [state, setState] = useState<SearchState>({
    doctors: [],
    loading: true,
    error: null,
  });

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    setState(s => ({ ...s, loading: true }));
    const unsub = listenToDoctors(
      (doctors) => setState({ doctors, loading: false, error: null }),
      filters
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return state;
}