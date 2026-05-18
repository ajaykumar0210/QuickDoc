import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Module-level storage — avoids JSON.stringify losing methods when passing via route params
let _pendingConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export function getPendingConfirmation(): FirebaseAuthTypes.ConfirmationResult | null {
  return _pendingConfirmation;
}

export function clearPendingConfirmation(): void {
  _pendingConfirmation = null;
}

// Send OTP to phone number (India: +91XXXXXXXXXX)
export async function sendOTP(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  _pendingConfirmation = confirmation;
  return confirmation;
}

// Verify OTP code entered by user
export async function verifyOTP(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential> {
  const credential = await confirmation.confirm(code);
  if (!credential) throw new Error('OTP verification failed');
  return credential;
}

// Sign out current user
export async function signOut(): Promise<void> {
  await auth().signOut();
}

// Get current user
export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

// Auth state listener
export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  return auth().onAuthStateChanged(callback);
}