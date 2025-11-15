import { normalizePhone, isValidKenyanPlate } from '../lib/utils';

describe('utils validation', () => {
  test('normalizePhone converts local Kenyan numbers to E.164', () => {
    expect(normalizePhone('0700123456')).toBe('+254700123456');
    expect(normalizePhone('700123456')).toBe('+254700123456');
    expect(normalizePhone('+254700123456')).toBe('+254700123456');
  });

  test('isValidKenyanPlate recognizes common formats', () => {
    expect(isValidKenyanPlate('KDA 123A')).toBe(true);
    expect(isValidKenyanPlate('KAB 999Z')).toBe(true);
    expect(isValidKenyanPlate('XYZ 000')).toBe(false);
  });
});
import { describe, it, expect } from 'vitest';
import { normalizePhone, isValidKenyanPlate } from '../lib/utils';

describe('utils validation', () => {
  it('normalizes Kenyan phone numbers', () => {
    expect(normalizePhone('0700000000')).toBe('+254700000000');
    expect(normalizePhone('700000000')).toBe('+254700000000');
    expect(normalizePhone('+254700000000')).toBe('+254700000000');
    expect(normalizePhone('254700000000')).toBe('+254700000000');
  });

  it('validates Kenyan plates', () => {
    expect(isValidKenyanPlate('KDA 123A')).toBe(true);
    expect(isValidKenyanPlate('KAB 999Z')).toBe(true);
    expect(isValidKenyanPlate('KDA123A')).toBe(false);
    expect(isValidKenyanPlate('ABC 123')).toBe(false);
  });
});
