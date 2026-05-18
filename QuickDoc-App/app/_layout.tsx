import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { onAuthStateChanged } from '../firebase/auth';
import { getUser, createUser } from '../firebase/firestore';
import "../global.css";

export default function RootLayout() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Check / create Firestore profile
        let profile = await getUser(firebaseUser.uid);
        if (!profile) {
          await createUser(firebaseUser.uid, {
            phoneNumber: firebaseUser.phoneNumber,
          });
          profile = await getUser(firebaseUser.uid);
        }
        setUser({
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: profile?.displayName ?? firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          profileComplete: profile?.profileComplete ?? false,
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPatientGroup = segments[0] === '(patient)';

    if (!user) {
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else if (!user.profileComplete) {
      if (segments[1] !== 'onboarding') router.replace('/(auth)/onboarding');
    } else {
      if (inAuthGroup) router.replace('/(patient)/home');
    }
  }, [user, isLoading, segments]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}