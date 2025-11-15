import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

const COLLECTION = 'bookings';

function ensureDb() {
  if (!db) throw new Error('[firebaseBookingsService] Firestore `db` is not initialized.');
}

function convertDoc(d) {
  const data = d.data() || {};
  const out = { id: d.id, ...data };
  // Convert Firestore Timestamps to ISO strings for createdAt/updatedAt
  ['createdAt', 'updatedAt'].forEach((k) => {
    if (out[k] && typeof out[k].toDate === 'function') {
      try { out[k] = out[k].toDate().toISOString(); } catch (e) { /* ignore */ }
    }
  });
  return out;
}

export async function create(payload) {
  ensureDb();
  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, {
    ...payload,
    status: payload.status || 'confirmed',
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(docRef);
  return convertDoc(snap);
}

export async function list(filter = {}) {
  ensureDb();
  let q;
  const colRef = collection(db, COLLECTION);
  if (filter.userId) q = query(colRef, where('userId', '==', filter.userId), orderBy('createdAt', 'desc'));
  else q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(convertDoc);
}

export async function getById(id) {
  ensureDb();
  if (!id) return null;
  const d = doc(db, COLLECTION, id);
  const snap = await getDoc(d);
  if (!snap.exists()) return null;
  return convertDoc(snap);
}

export async function update(id, patch) {
  ensureDb();
  if (!id) throw new Error('Missing id');
  const d = doc(db, COLLECTION, id);
  await updateDoc(d, { ...patch, updatedAt: serverTimestamp() });
  const snap = await getDoc(d);
  return convertDoc(snap);
}

export async function remove(id) {
  ensureDb();
  if (!id) throw new Error('Missing id');
  await deleteDoc(doc(db, COLLECTION, id));
  return { id };
}

export async function cancel(id, reason = 'cancelled') {
  return update(id, { status: 'cancelled', cancelReason: reason });
}

export async function getAvailability(/* date */) {
  // stub
  return [];
}

export async function pay(id, paymentInfo) {
  return update(id, { paid: true, paymentInfo });
}

export function subscribe(cb, filter = {}) {
  ensureDb();
  const colRef = collection(db, COLLECTION);
  const q = filter.userId ? query(colRef, where('userId', '==', filter.userId), orderBy('createdAt', 'desc')) : query(colRef, orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(convertDoc);
    cb(items);
  }, (err) => {
    console.error('Bookings subscription error', err);
  });
  return unsub;
}

export default {
  create,
  list,
  getById,
  update,
  remove,
  cancel,
  getAvailability,
  pay,
  subscribe,
};
