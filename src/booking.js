export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Vatsalya Bhawan, Q6P3+883, Kaniganj, Ayodhya, Uttar Pradesh 224123')}`;

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  return localDate(date) === iso ? date : null;
}

export function nextDay(iso) {
  const date = parseDate(iso);
  if (!date) return '';
  date.setDate(date.getDate() + 1);
  return localDate(date);
}

export function validateStay({ checkIn, checkOut, guests }, today = localDate()) {
  if (!parseDate(checkIn)) return 'Please choose a valid arrival date.';
  if (checkIn < today) return 'Your arrival date must be today or later.';
  if (!parseDate(checkOut)) return 'Please choose a valid departure date.';
  if (checkOut <= checkIn) return 'Your departure date must be after your arrival date.';
  if (!((typeof guests === 'number' && Number.isInteger(guests)) || (typeof guests === 'string' && /^\d+$/.test(guests))) || Number(guests) < 1 || Number(guests) > 12) {
    return 'Please choose between 1 and 12 guests.';
  }
  return '';
}

export function buildWhatsAppMessage({ checkIn, checkOut, guests, room, name = '', message = '' }) {
  return [
    'Hello Vatsalya Bhawan, I would like to enquire about a stay in Ayodhya.',
    `Arrival: ${checkIn}`,
    `Departure: ${checkOut}`,
    `Guests: ${guests}`,
    `Room: ${room}`,
    name && `Name: ${name}`,
    message && `Message: ${message}`,
  ].filter(Boolean).join('\n');
}

export function buildWhatsAppUrl(stay) {
  return `https://wa.me/919451338729?text=${encodeURIComponent(buildWhatsAppMessage(stay))}`;
}
