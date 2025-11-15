// Persist bookings in localStorage for demo purposes
const STORAGE_KEY = 'smartwash.bookings';

let store = [];
let id = 1;

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      store = parsed.store || [];
      id = parsed.id || (store.at(-1)?.id + 1) || 1;
    }
  } catch (_) {
    // ignore
  }
};

const persist = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ store, id })
    );
  } catch (_) {
    // ignore
  }
};

// initialize from storage eagerly if environment supports it
try { load(); } catch (_) {}

const create = async (data) => {
  // simulate network
  await new Promise((r) => setTimeout(r, 250));
  const now = new Date().toISOString();
  const item = {
    id: id++,
    createdAt: now,
    status: 'pending', // pending | confirmed | completed | cancelled
    paymentStatus: 'unpaid', // unpaid | paid | refunded
    ...data,
  };
  store.push(item);
  persist();
  return item;
};

const list = async () => {
  await new Promise((r) => setTimeout(r, 80));
  return [...store].reverse();
};

const getById = async (bookingId) => {
  await new Promise((r) => setTimeout(r, 50));
  return store.find((b) => String(b.id) === String(bookingId)) || null;
};

const update = async (bookingId, patch) => {
  await new Promise((r) => setTimeout(r, 150));
  let idx = store.findIndex((b) => String(b.id) === String(bookingId));
  if (idx === -1) throw new Error('Booking not found');
  store[idx] = { ...store[idx], ...patch, updatedAt: new Date().toISOString() };
  persist();
  return store[idx];
};

const cancel = async (bookingId) => update(bookingId, { status: 'cancelled' });

// Availability helpers (simple demo): define slots 08:00-17:00 hourly; exclude cancelled bookings
const dailySlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const getAvailability = async (date) => {
  await new Promise((r) => setTimeout(r, 60));
  if (!date) return [];
  const taken = new Set(
    store
      .filter((b) => b.date === date && b.status !== 'cancelled')
      .map((b) => b.time)
  );
  return dailySlots.filter((t) => !taken.has(t));
};

// Mock payment: mark as paid after small delay
const pay = async (bookingId, method = 'mpesa') => {
  await new Promise((r) => setTimeout(r, 800));
  return update(bookingId, { paymentStatus: 'paid', status: 'confirmed', paymentMethod: method });
};

const remove = async (bookingId) => {
  await new Promise((r) => setTimeout(r, 120));
  const before = store.length;
  store = store.filter((b) => String(b.id) !== String(bookingId));
  persist();
  return store.length < before;
};

const bookingsService = { create, list, getById, update, cancel, remove, getAvailability, pay };

export default bookingsService;
