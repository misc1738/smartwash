// Firebase initialization. Reads config from Vite env vars (recommended).
// If you prefer, put your values in a .env.local file (see .env.local.example).
// Firebase initialization for Vite + React
// Fill these environment variables in .env.local (see .env.local.example)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Basic guard so developer sees a helpful warning if env vars missing
if (!firebaseConfig.projectId) {
  // eslint-disable-next-line no-console
  console.warn('[firebase] VITE_FIREBASE_PROJECT_ID is not set. Firebase will not be initialized.');
}

let app = null;
let auth = null;
let db = null;
let analytics = null;

if (firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      // analytics may fail in non-browser or if measurementId isn't provided
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] failed to initialize Firebase app:', e && e.message ? e.message : e);
    app = null;
    auth = null;
    db = null;
    analytics = null;
  }
}

// Export named references so other modules can import without runtime errors
export { app, auth, db, analytics };
export default app;
