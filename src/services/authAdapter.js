import * as mock from './authService';
import firebaseAuthService from './firebaseAuthService';
import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const useFirebase = String(import.meta.env.VITE_USE_FIREBASE).toLowerCase() === 'true';

const normalizeFirebaseUser = (u) => {
  if (!u) return null;
  return { id: u.uid, email: u.email || null, displayName: u.displayName || null };
};

async function register(payload) {
  if (useFirebase) {
    const user = await firebaseAuthService.signUp(payload.email, payload.password);
    // Persist a minimal user profile document in Firestore
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        uid: user.uid,
        email: payload.email,
        firstName: payload.firstName || null,
        lastName: payload.lastName || null,
        displayName: payload.firstName ? `${payload.firstName} ${payload.lastName || ''}`.trim() : user.displayName || null,
        role: 'user',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      // non-fatal; registration succeeded even if profile write fails
      console.warn('Failed to persist user profile:', e.message || e);
    }
    return normalizeFirebaseUser(user);
  }
  return mock.register(payload);
}

async function login(payload) {
  if (useFirebase) {
    const user = await firebaseAuthService.signIn(payload.email, payload.password);
    return normalizeFirebaseUser(user);
  }
  return mock.login(payload);
}

async function logout() {
  if (useFirebase) return firebaseAuthService.signOut();
  return Promise.resolve();
}

async function resetPassword(email) {
  if (useFirebase) return firebaseAuthService.resetPassword(email);
  // mock: pretend success
  return Promise.resolve();
}

function onAuthChange(cb) {
  if (useFirebase) return firebaseAuthService.onAuthChange(cb);
  return () => {};
}

export const authAdapter = { register, login, logout, onAuthChange, resetPassword };
export default authAdapter;
