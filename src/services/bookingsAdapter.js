import mocks from '../mocks/bookingsService';
import firebaseBookingsService from './firebaseBookingsService';

const useFirebase = String(import.meta.env.VITE_USE_FIREBASE).toLowerCase() === 'true';

const impl = useFirebase ? firebaseBookingsService : mocks;

export const bookingsAdapter = {
  create: (...args) => impl.create(...args),
  list: (...args) => impl.list(...args),
  getById: (...args) => impl.getById(...args),
  update: (...args) => impl.update(...args),
  remove: (...args) => impl.remove(...args),
  cancel: (...args) => impl.cancel(...args),
  getAvailability: (...args) => impl.getAvailability(...args),
  pay: (...args) => impl.pay(...args),
  // subscribe(cb, filter) -> returns unsubscribe
  subscribe: (...args) => (impl.subscribe ? impl.subscribe(...args) : (() => {})),
};

export default bookingsAdapter;
