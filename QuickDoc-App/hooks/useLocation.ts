import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  loading: boolean;
  error: string | null;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    city: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled)
          setState(s => ({ ...s, loading: false, error: 'Location permission denied' }));
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (cancelled) return;

      const { latitude, longitude } = location.coords;
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (!cancelled) {
        setState({
          latitude,
          longitude,
          city: address?.city ?? address?.district ?? null,
          loading: false,
          error: null,
        });
      }
    }

    fetchLocation().catch((err) => {
      if (!cancelled)
        setState(s => ({ ...s, loading: false, error: err.message }));
    });

    return () => { cancelled = true; };
  }, []);

  return state;
}