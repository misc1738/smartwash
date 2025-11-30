import { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, Phone, User, Sparkles, Car, Hash, Navigation, CloudRain } from 'lucide-react';
import bookingsService from '../services/bookingsAdapter';
import { getUserLocationByIP, reverseGeocode, getBrowserLocation } from '../services/geolocationService';
import { getWeatherForSlot } from '../services/weatherService';
import Input from './ui/Input';
import Button from './ui/Button';
import { VEHICLE_MAKES, findModelsByMake, getCategories, getMakesByCategory, getModelCategory } from '../data/vehicles';
import SearchSelect from './ui/SearchSelect';
import { normalizePhone, isValidKenyanPlate, validateBookingForm } from '../lib/utils';

const services = [
  { value: 'express', label: 'Express Wash', price: 'KSh 1,500', duration: '30 min' },
  { value: 'premium', label: 'Premium Detail', price: 'KSh 3,500', duration: '1.5 hrs' },
  { value: 'ultimate', label: 'Ultimate Protection', price: 'KSh 6,000', duration: '3 hrs' },
  { value: 'interior', label: 'Interior Deep Clean', price: 'KSh 2,500', duration: '1 hr' },
];

import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookingForm({ initial = {}, onSaved, onDirtyChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(initial && initial.id);
  const [form, setForm] = useState({
    name: initial.name || '',
    phone: initial.phone || '',
    service: initial.service || 'express',
    location: initial.location || '',
    // locationCoords stores { latitude, longitude } when available
    locationCoords: initial.locationCoords || null,
    date: initial.date || '',
    time: initial.time || '',
    vehicle: initial.vehicle || { make: '', model: '', plate: '' },
    addOns: initial.addOns || [],
  });
  const [status, setStatus] = useState({ saving: false, error: null, success: false });
  const [fieldErrors, setFieldErrors] = useState({});

  const handlePhoneBlur = () => {
    try {
      const norm = normalizePhone(form.phone);
      setForm((s) => ({ ...s, phone: norm }));
    } catch (_) { }
  };
  const [availableTimes, setAvailableTimes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [saveVehicle, setSaveVehicle] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const makeOptions = useMemo(() => VEHICLE_MAKES.map((m) => m.make), []);
  const modelOptions = useMemo(() => {
    const list = findModelsByMake(form.vehicle.make);
    // Ensure current model appears in options if coming from saved/initial values
    return form.vehicle.model && !list.includes(form.vehicle.model)
      ? [form.vehicle.model, ...list]
      : list;
  }, [form.vehicle.make, form.vehicle.model]);
  const [plateTouched, setPlateTouched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const normalizePlate = (raw) => {
    const cleaned = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Build KXX 123X progressively
    let out = '';
    if (cleaned.length === 0) return '';
    // Ensure starts with K
    if (cleaned[0] !== 'K') {
      out = 'K';
    } else {
      out = 'K';
    }
    const rest = cleaned[0] === 'K' ? cleaned.slice(1) : cleaned;
    const letters = rest.replace(/[^A-Z]/g, '').slice(0, 3); // up to 3 letters total after K (2 pre, 1 post)
    const digits = rest.replace(/[^0-9]/g, '').slice(0, 3);
    const pre = letters.slice(0, 2);
    const post = letters.slice(2, 3);
    if (pre) out += pre;
    if (pre.length === 2) out += ' ';
    if (digits) out += digits;
    if (digits.length === 3 && post) out += post;
    return out;
  };
  const isPlateValid = isValidKenyanPlate(form.vehicle.plate || '');

  // Dirty tracking for unsaved changes (edit mode)
  useEffect(() => {
    if (!onDirtyChange) return;
    const pick = (b) => ({
      name: b.name || '',
      phone: b.phone || '',
      service: b.service || 'express',
      location: b.location || '',
      date: b.date || '',
      time: b.time || '',
      vehicle: {
        make: b.vehicle?.make || '',
        model: b.vehicle?.model || '',
        plate: b.vehicle?.plate || '',
      },
      addOns: Array.isArray(b.addOns) ? [...b.addOns].sort() : [],
    });
    const a = pick(form);
    const b = pick(initial || {});
    const dirty = JSON.stringify(a) !== JSON.stringify(b);
    onDirtyChange(dirty);
  }, [form, initial, onDirtyChange]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = validateBookingForm(form);
    setFieldErrors(errs);
    return errs && Object.keys(errs).length ? errs : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auth Check
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          bookingData: form
        }
      });
      return;
    }

    const err = validate();
    if (err) return setStatus({ saving: false, error: err, success: false });
    setStatus({ saving: true, error: null, success: false });
    try {
      // Save vehicle if opted in
      if (saveVehicle) {
        try {
          const saved = JSON.parse(localStorage.getItem('smartwash.vehicles') || '[]');
          const exists = saved.some(v => v.plate.trim().toUpperCase() === form.vehicle.plate.trim().toUpperCase());
          // Ensure category is present when saving
          const toSave = { ...form.vehicle };
          if (!toSave.category && toSave.make && toSave.model) {
            toSave.category = getModelCategory(toSave.make, toSave.model) || 'Unknown';
          }
          const next = exists ? saved : [...saved, toSave];
          localStorage.setItem('smartwash.vehicles', JSON.stringify(next));
          setVehicles(next);
        } catch (_) { }
      }

      if (isEdit) {
        const updated = await bookingsService.update(initial.id, {
          ...form,
          totalPrice: computeTotal,
        });
        setStatus({ saving: false, error: null, success: true });
        onSaved && onSaved(updated);
      } else {
        const created = await bookingsService.create({
          ...form,
          totalPrice: computeTotal,
        });
        setStatus({ saving: false, error: null, success: true });
        onSaved && onSaved(created);
      }
    } catch (err) {
      setStatus({ saving: false, error: err.message || 'Failed to save booking', success: false });
    }
  };

  const selectedService = services.find(s => s.value === form.service);

  // Add-ons
  const addOns = useMemo(() => ([
    { key: 'engine', label: 'Engine Bay Detailing', price: 1000 },
    { key: 'headlights', label: 'Headlight Restoration', price: 800 },
    { key: 'petHair', label: 'Pet Hair Removal', price: 700 },
    { key: 'odor', label: 'Odor Elimination Treatment', price: 600 },
  ]), []);

  const toggleAddon = (key) => {
    setForm((s) => ({
      ...s,
      addOns: s.addOns.includes(key) ? s.addOns.filter((k) => k !== key) : [...s.addOns, key],
    }));
  };

  const addonsTotal = form.addOns.reduce((sum, key) => sum + (addOns.find(a => a.key === key)?.price || 0), 0);
  const computeTotal = useMemo(() => {
    const base = selectedService ? parseInt(selectedService.price.replace(/\D/g, ''), 10) : 0;
    return base + addonsTotal;
  }, [selectedService, addonsTotal]);

  // Load saved vehicles and detect location on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smartwash.vehicles') || '[]');
      // Ensure saved vehicles have category field (derive if missing)
      const enriched = saved.map((v) => {
        if (!v.category && v.make && v.model) {
          const cat = getModelCategory(v.make, v.model);
          return { ...v, category: cat || 'Unknown' };
        }
        return v;
      });
      setVehicles(enriched);
    } catch (_) { }

    // Auto-detect location by IP
    const detectLocation = async () => {
      const ipLocation = await getUserLocationByIP();
      setGeoLocation(ipLocation);

      // If in Nairobi area, suggest location and coords
      if (ipLocation && ipLocation.isNairobi && !form.location) {
        setForm((s) => ({ ...s, location: `${ipLocation.city}, ${ipLocation.country}`, locationCoords: { latitude: ipLocation.latitude, longitude: ipLocation.longitude } }));
      }
      // if we have coords but no explicit location string, still store coords
      if (ipLocation && !form.location && ipLocation.latitude && ipLocation.longitude) {
        setForm((s) => ({ ...s, locationCoords: { latitude: ipLocation.latitude, longitude: ipLocation.longitude } }));
      }
    };
    detectLocation();
  }, []);

  // If the form was initialized with make+model but no category, derive it
  useEffect(() => {
    if (form.vehicle && form.vehicle.make && form.vehicle.model && !form.vehicle.category) {
      const cat = getModelCategory(form.vehicle.make, form.vehicle.model);
      if (cat) setForm((s) => ({ ...s, vehicle: { ...s.vehicle, category: cat } }));
    }
  }, [form.vehicle.make, form.vehicle.model]);

  // Fetch availability when date changes
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!form.date) return setAvailableTimes([]);
      const times = await bookingsService.getAvailability(form.date);
      if (active) setAvailableTimes(times);
      // if selected time is no longer available, clear it
      if (form.time && !times.includes(form.time)) {
        setForm((s) => ({ ...s, time: '' }));
      }
    };
    run();
    return () => { active = false; };
  }, [form.date]);

  // Fetch weather when date and time are selected
  useEffect(() => {
    let active = true;
    const checkWeather = async () => {
      if (!form.date || !form.time || !geoLocation) return;

      const weatherData = await getWeatherForSlot(
        geoLocation.latitude,
        geoLocation.longitude,
        form.date,
        form.time
      );
      if (active) setWeather(weatherData);
    };
    checkWeather();
    return () => { active = false; };
  }, [form.date, form.time, geoLocation]);

  // Handler for "Use My Location" button
  const handleUseMyLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await getBrowserLocation();
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      setForm((s) => ({ ...s, location: address.formatted || address.address, locationCoords: { latitude: coords.latitude, longitude: coords.longitude } }));
      setGeoLocation({ ...geoLocation, latitude: coords.latitude, longitude: coords.longitude });
    } catch (error) {
      console.error('Location error:', error);
      alert('Unable to get your location. Please enter manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-primary" />
          Select Service
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <label
              key={service.value}
              className={`relative cursor-pointer group transition-all duration-300 ${form.service === service.value
                ? 'bg-primary/20 border-primary/50'
                : 'bg-card border-border hover:border-primary/30'
                } border-2 backdrop-blur-sm p-4 flex flex-col rounded-xl`}
            >
              <input
                type="radio"
                name="service"
                value={service.value}
                checked={form.service === service.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-start justify-between mb-2">
                <span className="font-bold text-foreground text-lg">{service.label}</span>
                {form.service === service.value && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-bold">{service.price}</span>
                <span className="text-muted-foreground">{service.duration}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <User className="w-4 h-4 text-primary" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => { if (!form.name.trim()) setFieldErrors(f => ({ ...f, name: 'Please enter your full name.' })); else setFieldErrors(f => { const copy = { ...f }; delete copy.name; return copy; }); }}
            placeholder="John Doe"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            className={`w-full px-4 py-3 bg-input border ${fieldErrors.name ? 'border-red-500' : 'border-border'} text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg`}
          />
          {fieldErrors.name && <div id="err-name" className="text-xs text-red-300 mt-1">{fieldErrors.name}</div>}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
            onBlur={() => {
              const norm = normalizePhone(form.phone);
              setForm(s => ({ ...s, phone: norm }));
              if (!norm || !norm.startsWith('+')) setFieldErrors(f => ({ ...f, phone: 'Please enter a valid phone number (e.g. +254700000000).' }));
              else setFieldErrors(f => { const copy = { ...f }; delete copy.phone; return copy; });
            }}
            placeholder="+254 700 000 000"
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
            className={`w-full px-4 py-3 bg-input border ${fieldErrors.phone ? 'border-red-500' : 'border-border'} text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg`}
          />
          {fieldErrors.phone && <div id="err-phone" className="text-xs text-red-300 mt-1">{fieldErrors.phone}</div>}
        </div>
      </div>

      {/* Vehicle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Car className="w-4 h-4 text-primary" />
            Make
          </label>
          <div className="space-y-2">
            <SearchSelect
              value={form.vehicle.make}
              onChange={(v) => setForm((s) => ({ ...s, vehicle: { ...s.vehicle, make: v, model: '', category: null } }))}
              options={makeOptions}
              placeholder="Select make"
              className="w-full"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Car className="w-4 h-4 text-primary" />
            Model
          </label>
          <SearchSelect
            value={form.vehicle.model}
            onChange={(v) => {
              const cat = getModelCategory(form.vehicle.make, v);
              setForm((s) => ({ ...s, vehicle: { ...s.vehicle, model: v, category: cat || s.vehicle.category } }));
              // If a category was selected filter, keep it in sync
              if (cat && selectedCategory !== cat) setSelectedCategory(cat);
            }}
            options={findModelsByMake(form.vehicle.make, selectedCategory)}
            placeholder={form.vehicle.make ? 'Select model' : 'Select make first'}
            disabled={!form.vehicle.make}
            className="w-full"
          />
          {/* Show derived category below the model input to avoid pushing the model dropdown */}
          {form.vehicle.category && (
            <div className="mt-2">
              <span className="inline-block text-xs px-2 py-1 bg-secondary text-muted-foreground rounded">{form.vehicle.category}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Hash className="w-4 h-4 text-primary" />
            Plate
          </label>
          <input
            type="text"
            name="vehicle.plate"
            value={form.vehicle.plate}
            onChange={(e) => {
              const next = normalizePlate(e.target.value);
              setForm((s) => ({ ...s, vehicle: { ...s.vehicle, plate: next } }));
            }}
            onBlur={() => setPlateTouched(true)}
            placeholder="KDA 123A"
            aria-invalid={!!fieldErrors.vehiclePlate}
            aria-describedby={fieldErrors.vehiclePlate ? 'err-plate' : undefined}
            className={`w-full px-4 py-3 bg-input border text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg ${(fieldErrors.vehiclePlate || (!isPlateValid && plateTouched)) ? 'border-red-500' : 'border-border'
              }`}
          />
          {fieldErrors.vehiclePlate ? (
            <div id="err-plate" className="text-xs text-red-300 mt-1">{fieldErrors.vehiclePlate}</div>
          ) : (
            <p className={`text-xs mt-1 ${isPlateValid ? 'text-muted-foreground' : 'text-red-300'}`}>
              {isPlateValid ? 'Format: KDA 123A' : 'Please use the format KDA 123A'}
            </p>
          )}
        </div>
      </div>

      {/* Saved Vehicles */}
      {vehicles.length > 0 && (
        <div className="space-y-2">
          <label className="text-foreground font-semibold text-sm">Saved Vehicles</label>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v, idx) => (
              <button
                type="button"
                key={`${v.plate}-${idx}`}
                onClick={() => setForm((s) => ({ ...s, vehicle: { ...v } }))}
                className={`px-3 py-1 text-sm border rounded-full ${form.vehicle.plate === v.plate ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
              >
                <span className="font-semibold">{v.make} {v.model}</span>
                <span className="text-xs text-muted-foreground/70 ml-2">{v.category ? `• ${v.category}` : ''}</span>
                <span className="text-muted-foreground/50 ml-3">{v.plate}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save vehicle toggle */}
      <label className="flex items-center gap-3 text-foreground/80 text-sm cursor-pointer">
        <input type="checkbox" checked={saveVehicle} onChange={(e) => setSaveVehicle(e.target.checked)} className="accent-primary" />
        Save this vehicle for faster booking next time
      </label>

      {/* Location */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          Service Location
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. 12 Riverside Drive, Westlands, Nairobi"
            className="flex-1 px-4 py-3 bg-input border border-border text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locationLoading}
            className="px-4 py-3 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all backdrop-blur-sm disabled:opacity-50 flex items-center gap-2 rounded-lg"
            title="Use my current location"
          >
            <Navigation className={`w-5 h-5 ${locationLoading ? 'animate-spin' : ''}`} />
            {locationLoading ? 'Getting...' : 'Use My Location'}
          </button>
        </div>
        {geoLocation && !geoLocation.fallback && (
          <p className="text-xs text-muted-foreground">
            📍 Detected: {geoLocation.city}, {geoLocation.country}
          </p>
        )}
        {/* location coords are stored in the form for backend use but no preview is shown */}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            Preferred Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="+254 700 000 000"
            onBlur={handlePhoneBlur}
            className="w-full px-4 py-3 bg-input border border-border text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
          />
          {fieldErrors.phone && <p className="text-xs text-red-300 mt-1">{fieldErrors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            Preferred Time
          </label>
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input border border-border text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
          >
            <option value="" className="bg-card">{form.date ? 'Select time' : 'Select a date first'}</option>
            {availableTimes.map((t) => (
              <option key={t} value={t} className="bg-card">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weather Warning */}
      {weather && weather.warning && !weather.fallback && (
        <div className="bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-sm p-4 flex items-start gap-3 rounded-lg">
          <CloudRain className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-yellow-300 font-bold text-sm mb-1">Weather Advisory</div>
            <div className="text-foreground/80 text-sm">
              {weather.icon} {weather.warning}. We recommend choosing an alternative time for the best service quality.
            </div>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-primary" />
          Add-ons
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addOns.map((a) => (
            <label key={a.key} className={`flex items-center justify-between gap-3 border p-4 backdrop-blur-sm cursor-pointer rounded-lg ${form.addOns.includes(a.key) ? 'bg-primary/20 border-primary/40' : 'bg-card border-border hover:border-primary/30'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.addOns.includes(a.key)} onChange={() => toggleAddon(a.key)} className="accent-primary" />
                <span className="text-foreground">{a.label}</span>
              </div>
              <span className="text-primary font-bold">KSh {a.price.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Booking Summary */}
      {selectedService && form.date && form.time && (
        <div className="bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm p-6 space-y-3 rounded-xl">
          <h4 className="text-foreground font-bold text-lg mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="text-foreground font-semibold">{selectedService.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-foreground font-semibold">{selectedService.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="text-foreground font-semibold">{form.date} at {form.time}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-bold">Total:</span>
                <span className="text-2xl font-black text-primary">KSh {computeTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div aria-live="polite">
        {status.error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 backdrop-blur-sm rounded-lg">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 backdrop-blur-sm rounded-lg">
            {isEdit ? 'Changes saved.' : "Booking confirmed! We'll contact you shortly."}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status.saving}
        className="w-full px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-400 text-white font-bold uppercase tracking-wider transition-all duration-500 shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl"
      >
        {status.saving ? (isEdit ? 'Saving Changes...' : 'Confirming Booking...') : (isEdit ? 'Save Changes' : 'Confirm Booking')}
      </button>
    </form>
  );
}
