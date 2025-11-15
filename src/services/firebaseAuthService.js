import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';

function ensureAuth() {
  if (!auth) throw new Error('Firebase is not initialized. Check your VITE_FIREBASE_* env variables.');
}

async function signUp(email, password) {
  ensureAuth();
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

async function signIn(email, password) {
  ensureAuth();
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

async function signOut() {
  if (!auth) return Promise.resolve();
  return firebaseSignOut(auth);
}

async function resetPassword(email) {
  ensureAuth();
  return firebaseSendPasswordResetEmail(auth, email);
}

function onAuthChange(callback) {
  if (!auth) {
    // No Firebase; return noop unsubscribe
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export const firebaseAuthService = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  onAuthChange,
};

export default firebaseAuthService;
