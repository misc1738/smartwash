#!/usr/bin/env node
// One-off migration script to copy mock bookings into Firestore.
// Usage: node scripts/migrateBookingsToFirestore.js --dry

const { argv } = require('process');
const dry = argv.includes('--dry');

(async () => {
  try {
    // Load mock service
    const mocks = require('../src/mocks/bookingsService');
    const list = await mocks.list();
    console.log(`Found ${list.length} mock bookings`);
    if (dry) return console.log('Dry run: not writing to Firestore');

    // Initialize firebase admin SDK or client SDK depending on environment
    // For safety, we use client-side Firestore here—ensure VITE_USE_FIREBASE=true and env configured
    const { initializeApp } = require('firebase/app');
    const { getFirestore, doc, setDoc } = require('firebase/firestore');

    const app = initializeApp({
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
    });
    const db = getFirestore(app);

    for (const b of list) {
      const ref = doc(db, 'bookings', b.id?.toString() || undefined);
      await setDoc(ref, { ...b });
      console.log('Migrated', b.id);
    }
    console.log('Migration complete');
  } catch (e) {
    console.error('Migration failed', e);
  }
})();
