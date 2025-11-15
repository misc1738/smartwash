import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Normalize a phone number into a best-effort E.164-like format for Kenya.
 * - +254XXXXXXXXX (preferred)
 * - converts leading 0 (07XXXXXXXX) to +2547XXXXXXXX
 * - if already starts with +, returns as-is (after stripping spaces)
 */
export function normalizePhone(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.startsWith('+')) return s.replace(/\s+/g, '');
  const digits = s.replace(/\D/g, '');
  // Kenya common patterns: 07XXXXXXXX (10 digits), 7XXXXXXXX (9 digits), 2547XXXXXXXX (12 digits)
  if (digits.startsWith('254') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `+254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith('7')) return `+254${digits}`;
  // fallback: if plausible international length
  if (digits.length >= 9 && digits.length <= 15) return `+${digits}`;
  return s;
}

export const kenyanPlateRegex = /^K[A-Z]{2} [0-9]{3}[A-Z]$/;
export function isValidKenyanPlate(plate) {
  return kenyanPlateRegex.test(String(plate || '').trim());
}

/**
 * Basic inline validation for booking forms. Returns an object mapping field -> message or null.
 */
export function validateBookingForm(form) {
  const errors = {};
  if (!form.name || !String(form.name).trim()) errors.name = 'Please enter your name.';
  if (!form.phone || !String(form.phone).trim()) errors.phone = 'Please enter a phone number.';
  if (!form.location || !String(form.location).trim()) errors.location = 'Please provide a location.';
  if (!form.date) errors.date = 'Please select a date.';
  if (!form.time) errors.time = 'Please select a time.';
  if (!form.vehicle || !form.vehicle.make || !String(form.vehicle.make).trim()) errors.vehicleMake = 'Please enter vehicle make.';
  if (!form.vehicle || !form.vehicle.model || !String(form.vehicle.model).trim()) errors.vehicleModel = 'Please enter vehicle model.';
  if (!form.vehicle || !form.vehicle.plate || !String(form.vehicle.plate).trim()) errors.vehiclePlate = 'Please enter vehicle plate.';
  else if (!isValidKenyanPlate(form.vehicle.plate)) errors.vehiclePlate = 'Enter plate in the Kenyan format, e.g., KDA 123A.';
  return errors;
}
