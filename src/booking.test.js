import { buildWhatsAppMessage, buildWhatsAppUrl, localDate, MAPS_URL, nextDay, validateStay } from './booking';

test('stay enquiry handles calendar dates, local time, guest limits and encoded contact details', () => {
  const stay = { checkIn: '2028-02-29', checkOut: '2028-03-01', guests: '2' };
  expect(validateStay(stay, '2028-02-28')).toBe('');
  for (const checkIn of ['2027-02-29', '2028-04-31', '2028-13-01', '2028-2-29', '']) {
    expect(validateStay({ ...stay, checkIn }, '2028-02-28')).toMatch(/valid arrival/);
  }
  expect(validateStay(stay, '2028-03-01')).toMatch(/today or later/);
  expect(validateStay({ ...stay, checkOut: '2028-02-30' }, '2028-02-28')).toMatch(/valid departure/);
  expect(validateStay({ ...stay, checkOut: stay.checkIn }, '2028-02-28')).toMatch(/after/);
  for (const guests of ['', ' ', '1e1', '2.0', '2abc', 0, 13, 1.5, null]) {
    expect(validateStay({ ...stay, guests }, '2028-02-28')).toMatch(/1 and 12/);
  }
  expect(validateStay({ ...stay, guests: 12 }, '2028-02-28')).toBe('');
  expect(nextDay('2028-02-28')).toBe('2028-02-29');
  expect(nextDay('2028-12-31')).toBe('2029-01-01');
  expect(nextDay('2027-02-29')).toBe('');
  const nearMidnight = new Date(2028, 1, 29, 0, 5);
  expect(localDate(nearMidnight)).toBe('2028-02-29');
  expect(localDate({ getFullYear: () => 2028, getMonth: () => 1, getDate: () => 29, toISOString: () => '2028-02-28T18:35:00.000Z' })).toBe('2028-02-29');
  const enquiry = { ...stay, room: 'Family & friends', name: 'Asha + Ravi', message: 'Can we bring bags?\nThanks & regards #1' };
  const url = new URL(buildWhatsAppUrl(enquiry));
  expect(url.origin + url.pathname).toBe('https://wa.me/919451338729');
  expect(url.searchParams.get('text')).toContain('Family & friends');
  expect(url.searchParams.get('text')).toContain('Asha + Ravi');
  expect(url.searchParams.get('text')).toContain('Can we bring bags?\nThanks & regards #1');
  expect(url.searchParams.get('text')).toContain('Arrival: 2028-02-29');
  expect(url.searchParams.get('text')).toBe(buildWhatsAppMessage(enquiry));
  expect(new URL(MAPS_URL).searchParams.get('query')).toBe('Vatsalya Bhawan, Q6P3+883, Kaniganj, Ayodhya, Uttar Pradesh 224123');
});
