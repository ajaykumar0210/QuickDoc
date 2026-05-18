import {
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from 'firebase/auth';
import { auth } from './config';

// Module-level storage — avoids JSON.stringify losing methods when passing via route params
let _pendingConfirmation: ConfirmationResult | null = null;

export function getPendingConfirmation(): ConfirmationResult | null {
  return _pendingConfirmation;
}

export function clearPendingConfirmation(): void {
  _pendingConfirmation = null;
}

function getRecaptchaVerifier(): RecaptchaVerifier {
  let container = document.getElementById('firebase-recaptcha-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'firebase-recaptcha-container';
    document.body.appendChild(container);
  }
  return new RecaptchaVerifier(auth, container, { size: 'invisible' });
}

export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const verifier = getRecaptchaVerifier();
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  _pendingConfirmation = confirmation;
  return confirmation;
}

export async function verifyOTP(
  confirmation: ConfirmationResult,
  code: string
): Promise<{ user: User }> {
  const credential = await confirmation.confirm(code);
  if (!credential) throw new Error('OTP verification failed');
  return credential;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  return firebaseOnAuthStateChanged(auth, callback);
}
