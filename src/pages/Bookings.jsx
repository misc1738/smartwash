import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle2, Loader, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import BookingDrawer from '../components/BookingDrawer';
import bookingsService from '../services/bookingsAdapter';
import BlurText from '../components/ui/BlurText';
import { getCategories, getMakesByCategory, getModelCategory } from '../data/vehicles';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30';
    case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
    default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  }
};

export default function Bookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [reschedule, setReschedule] = useState({ date: '', time: '', available: [] });
  const [editOpen, setEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const preService = params.get('service') || undefined;

  // Get preselected date/time from BookingCalendar navigation
  const preselectedDate = location.state?.preselectedDate || undefined;
  const preselectedTime = location.state?.preselectedTime || undefined;

  const refresh = async () => {
    setLoading(true);
    const items = await bookingsService.list();
    setList(items);
    setLoading(false);
  };

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterMake, setFilterMake] = useState(null);
  const categories = useMemo(() => getCategories(), []);
  const makeOptionsForCategory = useMemo(() => getMakesByCategory(filterCategory), [filterCategory]);

  const filteredList = useMemo(() => {
    return list.filter((b) => {
      if (!b) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        const found = [b.name, b.phone, b.service, b.location, b.vehicle?.make, b.vehicle?.model, b.vehicle?.plate].join(' ').toLowerCase();
        if (!found.includes(q)) return false;
      }
      if (filterCategory) {
        const cat = b.vehicle?.category || getModelCategory(b.vehicle?.make, b.vehicle?.model);
        if (cat !== filterCategory) return false;
      }
      if (filterMake) {
        if ((b.vehicle?.make || '').toLowerCase() !== filterMake.toLowerCase()) return false;
      }
      return true;
    });
  }, [list, search, filterCategory, filterMake]);

  const exportCSV = (items) => {
    if (!items || !items.length) return;
    const headers = ['id', 'name', 'phone', 'service', 'status', 'date', 'time', 'location', 'make', 'model', 'plate', 'category', 'createdAt'];
    const rows = items.map((b) => [
      b.id,
      b.name,
      b.phone,
      b.service,
      b.status,
      b.date,
      b.time,
      (b.location || '').replace(/\n/g, ' '),
      b.vehicle?.make || '',
      b.vehicle?.model || '',
      b.vehicle?.plate || '',
      b.vehicle?.category || getModelCategory(b.vehicle?.make, b.vehicle?.model) || '',
      b.createdAt || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let unsub;
    // If adapter supports subscribe (Firebase), use real-time updates
    if (bookingsService.subscribe) {
      setLoading(true);
      const start = async () => {
        unsub = await bookingsService.subscribe((items) => {
          setList(items);
          setLoading(false);
        });
      };
      start();
      return () => { if (unsub) unsub(); };
    }
    refresh();
  }, []);

  const startReschedule = async (booking) => {
    setReschedulingId(booking.id);
    const available = await bookingsService.getAvailability(booking.date || new Date().toISOString().split('T')[0]);
    setReschedule({ date: booking.date || '', time: booking.time || '', available });
  };

  const applyReschedule = async (bookingId) => {
    if (!reschedule.date || !reschedule.time) return;
    await bookingsService.update(bookingId, { date: reschedule.date, time: reschedule.time, status: 'confirmed' });
    setReschedulingId(null);
    await refresh();
  };

  const openEdit = (booking) => {
    setEditInitial(booking);
    setEditOpen(true);
  };

  const handleDelete = async (booking) => {
    const sure = window.confirm('Delete this booking permanently? This cannot be undone.');
    if (!sure) return;
    await bookingsService.remove(booking.id);
    await refresh();
  };

  return (
    <div className="min-h-screen relative bg-background transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background"></div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-xs backdrop-blur-sm mb-6 rounded-full">
            Book Your Service
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">
            <BlurText
              text="Reserve Your"
              delay={40}
              animateBy="words"
              className="block text-foreground"
            />
            <BlurText
              text="Premium Wash"
              delay={40}
              animateBy="words"
              className="block bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent"
            />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience mobile detailing at your convenience. We come to you.
          </p>
        </div>

        {/* Booking Form Section */}
        <div className="max-w-4xl mx-auto mb-20">
          {/* Prefilled Notice */}
          {(preselectedDate || preselectedTime) && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl backdrop-blur-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-foreground font-medium text-sm">
                  Your selected time has been prefilled!
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {preselectedDate && `Date: ${preselectedDate}`}
                  {preselectedDate && preselectedTime && ' • '}
                  {preselectedTime && `Time: ${preselectedTime}`}
                </p>
              </div>
            </div>
          )}

          <div className="bg-card/50 border border-border backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-xl">
            <BookingForm
              initial={{
                ...(preService && { service: String(preService) }),
                ...(preselectedDate && { date: String(preselectedDate) }),
                ...(preselectedTime && { time: String(preselectedTime) }),
                ...(location.state?.bookingData || {})
              }}
              onSaved={(booking) => {
                if (booking) {
                  navigate('/booking-confirmation', { state: { booking } });
                } else {
                  refresh();
                }
              }}
            />
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Your Bookings</h2>
              <p className="text-muted-foreground text-sm">Manage your upcoming and past bookings.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="px-3 py-2 bg-card border border-input text-foreground placeholder-muted-foreground rounded-md focus:border-primary outline-none"
              />
              <select className="px-2 py-2 bg-card border border-input text-foreground rounded-md outline-none" value={filterCategory || ''} onChange={(e) => setFilterCategory(e.target.value || null)}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="px-2 py-2 bg-card border border-input text-foreground rounded-md outline-none" value={filterMake || ''} onChange={(e) => setFilterMake(e.target.value || null)}>
                <option value="">All makes</option>
                {makeOptionsForCategory.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                onClick={refresh}
                disabled={loading}
                className="px-4 py-2 bg-card border border-input text-foreground hover:border-primary/50 transition-all backdrop-blur-sm disabled:opacity-50 rounded-md"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Refresh'}
              </button>
              <button onClick={() => exportCSV(filteredList)} className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all rounded-md">Export CSV</button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading bookings...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-20 bg-card/30 border border-border backdrop-blur-sm rounded-xl">
              <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No bookings yet.</p>
              <p className="text-muted-foreground/70 text-sm mt-2">Get started by booking a service above.</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-20 bg-card/30 border border-border backdrop-blur-sm rounded-xl">
              <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No bookings match your filters.</p>
              <p className="text-muted-foreground/70 text-sm mt-2">Try clearing the search or filters to see all bookings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredList.map((booking) => (
                <div
                  key={booking.id}
                  className="group bg-card border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300 p-6 hover:shadow-2xl hover:shadow-primary/10 rounded-xl"
                >
                  {/* Booking Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{booking.name}</h3>
                      <p className="text-muted-foreground text-sm">{booking.phone}</p>
                    </div>
                    <div className={`px-3 py-1 border text-xs font-bold uppercase rounded-full ${getStatusColor(booking.status || 'pending')}`}>
                      {booking.status || 'Pending'}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Service</div>
                        <div className="text-foreground font-semibold capitalize">{booking.service}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Location</div>
                        <div className="text-foreground">{booking.location}</div>
                      </div>
                    </div>

                    {booking.date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-muted-foreground text-xs uppercase tracking-wide">Date & Time</div>
                          <div className="text-foreground">{booking.date} at {booking.time || 'TBD'}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Created</div>
                        <div className="text-foreground/80 text-sm">
                          {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Vehicle Info */}
                    <div className="flex items-start gap-3 mt-3">
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Vehicle</div>
                        <div className="text-foreground">
                          {booking.vehicle?.make} {booking.vehicle?.model} {booking.vehicle?.plate ? `• ${booking.vehicle.plate}` : ''}
                          <span className="text-muted-foreground ml-2">{booking.vehicle?.category || getModelCategory(booking.vehicle?.make, booking.vehicle?.model)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reschedule inline UI */}
                  {reschedulingId === booking.id ? (
                    <div className="mt-6 pt-4 border-t border-border space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-muted-foreground text-xs uppercase tracking-wide">New Date</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md"
                            value={reschedule.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={async (e) => {
                              const d = e.target.value;
                              const available = await bookingsService.getAvailability(d);
                              setReschedule((s) => ({ ...s, date: d, available, time: '' }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs uppercase tracking-wide">New Time</label>
                          <select
                            className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md"
                            value={reschedule.time}
                            onChange={(e) => setReschedule((s) => ({ ...s, time: e.target.value }))}
                          >
                            <option value="">Select time</option>
                            {reschedule.available.map((t) => (
                              <option key={t} value={t} className="bg-card">{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => applyReschedule(booking.id)} className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all text-sm font-bold uppercase tracking-wide rounded-md">
                          Save
                        </button>
                        <button onClick={() => setReschedulingId(null)} className="px-4 py-2 bg-secondary border border-border text-muted-foreground hover:border-foreground/30 transition-all text-sm font-bold uppercase tracking-wide rounded-md">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        className="px-4 py-2 bg-secondary border border-border text-foreground hover:border-primary/50 transition-all text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-md"
                        onClick={() => openEdit(booking)}
                        title="Edit booking"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-sm font-bold uppercase tracking-wide rounded-md"
                        onClick={() => startReschedule(booking)}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={async () => { await bookingsService.cancel(booking.id); await refresh(); }}
                        className="px-4 py-2 bg-secondary border border-border text-muted-foreground hover:border-yellow-500/50 hover:text-yellow-500 transition-all text-sm font-bold uppercase tracking-wide rounded-md"
                        title="Cancel (mark as cancelled)"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(booking)}
                        className="px-4 py-2 bg-secondary border border-border text-muted-foreground hover:border-red-500/50 hover:text-red-500 transition-all text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-md"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editOpen && (
        <BookingDrawer
          open={editOpen}
          initial={editInitial}
          onClose={(saved) => { setEditOpen(false); setEditInitial(null); if (saved) refresh(); }}
        />
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
      `}</style>
    </div>
  );
}