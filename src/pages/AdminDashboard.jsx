import { useEffect, useState } from 'react';
import bookingsService from '../mocks/bookingsService';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = Boolean(user?.isAdmin);

  const load = async () => {
    setLoading(true);
    try {
      const list = await bookingsService.list();
      setBookings(list);
    } catch (e) {
      console.error('Failed load bookings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markPaid = async (id) => {
    try {
      await bookingsService.pay(id, 'mpesa');
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const cancel = async (id) => {
    try {
      await bookingsService.cancel(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    try {
      await bookingsService.remove(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAdmin = () => {
    // Development-friendly toggle: persist isAdmin on the user object
    if (!user) return;
    updateUser({ isAdmin: !isAdmin });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage services, bookings and quick finance actions.</p>
        </div>
        <div>
          {user ? (
            <div className="text-right">
              <div className="text-sm text-gray-700">Signed in as <strong>{user.email || user.displayName || user.id}</strong></div>
              <button
                onClick={toggleAdmin}
                className="mt-2 inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded"
              >
                {isAdmin ? 'Revoke Admin (dev)' : 'Request Admin (dev)'}
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Please sign in to access admin features.</div>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded">
          <strong>Admin access required.</strong>
          <p className="text-sm text-gray-700">You can request admin access (development only) which toggles your user to admin locally. In production, manage roles server-side.</p>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">Bookings</h2>
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">No bookings yet</td></tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-2 align-top">{b.id}</td>
                    <td className="px-4 py-2 align-top text-sm text-gray-600">{new Date(b.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 align-top">
                      <div className="text-sm">{b.name || b.customerName || '—'}</div>
                      <div className="text-xs text-gray-500">{b.email || b.customerEmail || ''}</div>
                    </td>
                    <td className="px-4 py-2 align-top text-sm">{b.date} {b.time}</td>
                    <td className="px-4 py-2 align-top text-sm">{b.status}</td>
                    <td className="px-4 py-2 align-top text-sm">{b.paymentStatus}</td>
                    <td className="px-4 py-2 align-top text-sm">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => markPaid(b.id)} disabled={!isAdmin || b.paymentStatus === 'paid'}>Mark Paid</button>
                        <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => cancel(b.id)} disabled={!isAdmin}>Cancel</button>
                        <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => remove(b.id)} disabled={!isAdmin}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
  