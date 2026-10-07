import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VatsalyaBhawan, { ARRIVAL_TIME } from './VatsalyaBhawan';

// Street-map interactions have their own tests; page tests do not request map assets.
jest.mock('./AyodhyaMap', () => ({
  ...jest.requireActual('./AyodhyaMap'),
  __esModule: true,
  default: () => null,
}));

let reducedMotion = false;
let mobileFilm = false;
let play;
let pause;

beforeEach(() => {
  reducedMotion = false;
  mobileFilm = false;
  window.localStorage.clear();
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn(query => ({
    matches: (query.includes('prefers-reduced-motion') && reducedMotion) || (query.includes('max-width: 640px') && mobileFilm),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
});

afterEach(() => jest.restoreAllMocks());

function hero() {
  return document.getElementById('home');
}

function expectPosterAndBooking() {
  expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(within(hero()).getByAltText('AI interpretation of Ram Mandir’s shikhar and saffron flag in Ayodhya')).toHaveAttribute('src', expect.stringContaining(`ayodhya-shikhar-journey-v2-arrival${mobileFilm ? '-mobile' : ''}.jpg`));
  fireEvent.click(within(hero()).getByRole('button', { name: /Plan your stay/ }));
  expect(screen.getByRole('dialog', { name: 'Plan your stay' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Prepare enquiry/ })).toBeEnabled();
}

test.each([['desktop', false], ['phone', true]])('reduced motion shows the %s temple poster with a usable booking flow, without mounting video', (viewport, mobile) => {
  reducedMotion = true;
  mobileFilm = mobile;
  render(<VatsalyaBhawan />);
  expect(hero().querySelector('video')).toBeNull();
  expect(play).not.toHaveBeenCalled();
  expectPosterAndBooking();
});

test('failed media falls back to the poster and keeps the booking flow available', () => {
  render(<VatsalyaBhawan />);
  fireEvent.error(hero().querySelector('video'));
  expect(hero().querySelector('video')).toBeNull();
  expectPosterAndBooking();
});

test('pause and resume call native playback, and replay restarts an ended film without looping', () => {
  render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  expect(video).toHaveAttribute('src', expect.stringContaining('ayodhya-shikhar-journey-v2.mp4'));
  expect(video).toHaveAttribute('aria-label', 'Journey from Earth through India to an AI interpretation of Ram Mandir’s shikhar and saffron flag in Ayodhya');
  expect(video.loop).toBe(false);
  expect(play).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Pause journey film' }));
  expect(pause).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Resume journey film' })).toBeInTheDocument();
  const callsBeforeResume = play.mock.calls.length;
  fireEvent.click(screen.getByRole('button', { name: 'Resume journey film' }));
  expect(play.mock.calls.length).toBeGreaterThan(callsBeforeResume);
  video.currentTime = 10;
  fireEvent.ended(video);
  expect(video).toHaveStyle({ visibility: 'hidden' });
  expect(within(hero()).getByAltText('AI interpretation of Ram Mandir’s shikhar and saffron flag in Ayodhya')).toHaveAttribute('src', expect.stringContaining('ayodhya-shikhar-journey-v2-arrival.jpg'));
  const callsBeforeReplay = play.mock.calls.length;
  fireEvent.click(screen.getByRole('button', { name: 'Replay journey film' }));
  expect(video.currentTime).toBe(0);
  expect(play.mock.calls.length).toBeGreaterThan(callsBeforeReplay);
  expect(screen.getByRole('button', { name: 'Pause journey film' })).toBeInTheDocument();
});


test('all four bilingual captions follow media time while navigation and booking remain available throughout playback', () => {
  render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  expect(ARRIVAL_TIME).toBe(8.5);
  const stages = [
    [0, 'जम्बूद्वीपे', 'Jambudvīpe'],
    [.9, 'भारतखण्डे', 'Bhāratakhaṇḍe'],
    [1.8, 'आर्यावर्ते', 'Āryāvarte'],
    [2.8, 'अयोध्या नगरी', 'Ayodhya Nagari'],
  ];
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-shikhar-journey-v2-globe.jpg'));
  stages.forEach(([start, hindi, english], index) => {
    if (index > 0) {
      video.currentTime = start - 0.01;
      fireEvent.timeUpdate(video);
      expect(screen.getByText(stages[index - 1][2])).toBeInTheDocument();
    }
    video.currentTime = start;
    fireEvent.timeUpdate(video);
    expect(screen.getByText(hindi)).toHaveAttribute('lang', 'hi');
    expect(hero().querySelector('.hero-eyebrow-slot')).toContainElement(screen.getByText(hindi));
    expect(screen.queryByText('In the city of Ram. A place of your own.')).toBeNull();
    expect(screen.getByText(english)).toHaveAttribute('lang', 'en');
    if (index > 0) expect(screen.queryByText(stages[index - 1][2])).toBeNull();
    expect(screen.getByRole('banner')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
    expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
    expect(within(hero()).getByRole('button', { name: /Plan your stay/ })).toBeEnabled();
    expect(hero().querySelector('.hero-location')).not.toHaveAttribute('inert');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole('button', { name: 'Pause journey film' }));
  expect(screen.getByText('Ayodhya Nagari')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Resume journey film' }));
  video.currentTime = ARRIVAL_TIME - .01;
  fireEvent.timeUpdate(video);
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(screen.getByText('Ayodhya Nagari')).toBeInTheDocument();
  video.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(video);
  expect(screen.getByText('In the city of Ram. A place of your own.')).toBeInTheDocument();
  expect(screen.queryByText('Ayodhya Nagari')).toBeNull();
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-shikhar-journey-v2-arrival.jpg'));
  expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(within(hero()).getByRole('button', { name: /Plan your stay/ })).toBeEnabled();
  const footer = within(screen.getByRole('contentinfo'));
  fireEvent.click(footer.getByText('Image credits', { selector: 'summary' }));
  expect(footer.getByRole('link', { name: 'NASA Blue Marble' })).toHaveAttribute('href', 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/');
  expect(footer.getByRole('link', { name: 'Copernicus Sentinel data 2026' })).toBeInTheDocument();
  expect(footer.getByText(/shikhar and flag arrival is an AI-generated interpretation/)).toBeInTheDocument();
  expect(footer.getByRole('link', { name: 'GODL-India' })).toHaveAttribute('href', 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf');
  expect(footer.getByText(/Shri Ram artwork is an original AI-generated illustration/)).toBeInTheDocument();
  fireEvent.ended(video);
  fireEvent.click(screen.getByRole('button', { name: 'Replay journey film' }));
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(screen.getByText('Jambudvīpe')).toBeInTheDocument();
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-shikhar-journey-v2-globe.jpg'));
  expect(screen.queryByText('Ayodhya Nagari')).toBeNull();
  fireEvent.click(within(hero()).getByRole('button', { name: /Plan your stay/ }));
  expect(screen.getByRole('dialog', { name: 'Plan your stay' })).toBeInTheDocument();
  expect(video.currentTime).toBe(0);
});

test('blocked autoplay reveals the normal page immediately', async () => {
  play.mockRejectedValue(new DOMException('Autoplay blocked', 'NotAllowedError'));
  render(<VatsalyaBhawan />);
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  await waitFor(() => expect(hero().querySelector('video')).toBeNull());
  expectPosterAndBooking();
});

test('Diwali mode persists without interrupting the film and can return to everyday Ayodhya', () => {
  const { unmount } = render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  video.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(video);
  const lights = screen.getByRole('button', { name: 'Diwali mode' });
  fireEvent.click(lights);
  expect(lights).toHaveAttribute('aria-pressed', 'true');
  expect(document.querySelector('.bhawan-site')).toHaveClass('festival-mode');
  expect(document.querySelector('.booking-river-art')).toHaveAttribute('src', expect.stringContaining('ayodhya-deepotsav-art.svg'));
  expect(video.currentTime).toBe(ARRIVAL_TIME);
  expect(window.localStorage.getItem('vatsalya-festival-mode')).toBe('diwali');
  unmount();
  render(<VatsalyaBhawan />);
  expect(document.querySelector('.bhawan-site')).toHaveClass('festival-mode');
  const restartedVideo = hero().querySelector('video');
  restartedVideo.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(restartedVideo);
  fireEvent.click(screen.getByRole('button', { name: 'Diwali mode' }));
  expect(document.querySelector('.bhawan-site')).not.toHaveClass('festival-mode');
  expect(document.querySelector('.booking-river-art')).toHaveAttribute('src', expect.stringContaining('ayodhya-river-art.svg'));
});

test('Watch the journey recovers blocked autoplay and restarts the bilingual opening', async () => {
  play.mockRejectedValue(new DOMException('Autoplay blocked', 'NotAllowedError'));
  render(<VatsalyaBhawan />);
  await waitFor(() => expect(hero().querySelector('video')).toBeNull());
  play.mockResolvedValue();
  fireEvent.click(screen.getByRole('button', { name: 'Watch the journey film' }));
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  await waitFor(() => expect(hero().querySelector('video')).not.toBeNull());
  expect(hero().querySelector('video').currentTime).toBe(0);
  expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
  expect(screen.getByText('Jambudvīpe')).toBeInTheDocument();
  fireEvent.ended(hero().querySelector('video'));
  expect(hero().querySelector('video')).toHaveStyle({ visibility: 'hidden' });
});

test('choosing a family room preserves dates and the full group when reopening an enquiry', () => {
  reducedMotion = true;
  render(<VatsalyaBhawan />);
  const arrival = `${new Date().getFullYear() + 1}-03-12`;
  const departure = `${new Date().getFullYear() + 1}-03-15`;
  const strip = within(document.querySelector('.enquiry-strip'));
  fireEvent.change(strip.getByLabelText('Arrival'), { target: { value: arrival } });
  expect(strip.getByLabelText('Departure')).toHaveValue(`${new Date().getFullYear() + 1}-03-13`);
  fireEvent.change(strip.getByLabelText('Departure'), { target: { value: departure } });
  fireEvent.change(strip.getByLabelText('Guests'), { target: { value: '6' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enquire about Family room' }));

  let dialog = screen.getByRole('dialog', { name: 'Plan your stay' });
  expect(within(dialog).getByLabelText('Arrival')).toHaveValue(arrival);
  expect(within(dialog).getByLabelText('Departure')).toHaveValue(departure);
  expect(within(dialog).getByLabelText('Guests')).toHaveValue('6');
  expect(within(dialog).getByLabelText('Room preference')).toHaveValue('Family room');
  expect(within(dialog).getByRole('status')).toHaveTextContent('arrange rooms for all 6 guests');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Change' }));
  expect(within(dialog).getByLabelText('Room preference')).toHaveFocus();
  fireEvent.click(within(dialog).getByText(/Add your name or a request/, { selector: 'summary' }));
  fireEvent.change(within(dialog).getByLabelText(/Your name/), { target: { value: 'Asha' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close dialog' }));
  expect(screen.queryByRole('dialog')).toBeNull();

  fireEvent.click(strip.getByRole('button', { name: 'Enquire' }));
  dialog = screen.getByRole('dialog', { name: 'Plan your stay' });
  expect(within(dialog).getByLabelText('Arrival')).toHaveValue(arrival);
  expect(within(dialog).getByLabelText('Departure')).toHaveValue(departure);
  expect(within(dialog).getByLabelText('Guests')).toHaveValue('6');
  expect(within(dialog).getByLabelText('Room preference')).toHaveValue('Family room');
  expect(within(dialog).getByLabelText(/Your name/)).toHaveValue('Asha');
});

test('the reviewed enquiry exactly matches WhatsApp and keeps details through edits', () => {
  reducedMotion = true;
  render(<VatsalyaBhawan />);
  fireEvent.click(screen.getByRole('button', { name: 'Enquire about Family room' }));
  const dialog = screen.getByRole('dialog', { name: 'Plan your stay' });
  const booking = within(dialog);
  const name = 'Asha + Ravi & family';
  const message = 'Early arrival?\nBags & tea #1';
  fireEvent.click(booking.getByText(/Add your name or a request/, { selector: 'summary' }));
  fireEvent.change(booking.getByLabelText(/Your name/), { target: { value: name } });
  fireEvent.change(booking.getByLabelText(/Anything we should know/), { target: { value: message } });
  fireEvent.click(booking.getByRole('button', { name: 'Prepare enquiry' }));
  expect(booking.getByRole('heading', { name: 'Your enquiry is ready.' })).toHaveFocus();

  const firstPreview = dialog.querySelector('pre').textContent;
  expect(firstPreview).toBe(new URL(booking.getByRole('link', { name: 'Continue to WhatsApp' }).href).searchParams.get('text'));
  expect(firstPreview).toContain(`Name: ${name}`);
  expect(firstPreview).toContain(`Message: ${message}`);
  expect(firstPreview).toContain('Room: Family room');
  expect(booking.getByText(/Your enquiry has not been sent yet/)).toBeInTheDocument();

  fireEvent.click(booking.getByRole('button', { name: 'Edit details' }));
  expect(booking.getByLabelText('Arrival')).toHaveFocus();
  expect(booking.getByText(/Add your name or a request/, { selector: 'summary' }).closest('details')).toHaveAttribute('open');
  expect(booking.getByLabelText(/Your name/)).toHaveValue(name);
  expect(booking.getByLabelText(/Anything we should know/)).toHaveValue(message);
  expect(booking.getByLabelText('Room preference')).toHaveValue('Family room');
  const revisedMessage = `${message}\nWe are six guests.`;
  fireEvent.change(booking.getByLabelText('Guests'), { target: { value: '6' } });
  fireEvent.change(booking.getByLabelText(/Anything we should know/), { target: { value: revisedMessage } });
  fireEvent.click(booking.getByRole('button', { name: 'Prepare enquiry' }));
  const revisedPreview = dialog.querySelector('pre').textContent;
  expect(revisedPreview).toBe(new URL(booking.getByRole('link', { name: 'Continue to WhatsApp' }).href).searchParams.get('text'));
  expect(revisedPreview).toContain('Guests: 6');
  expect(revisedPreview).toContain(`Name: ${name}`);
  expect(revisedPreview).toContain(`Message: ${revisedMessage}`);
  expect(revisedPreview).not.toBe(firstPreview);
});

test('gallery filters show original bathroom and exterior photos and contain navigation', () => {
  reducedMotion = true;
  render(<VatsalyaBhawan />);
  const filters = within(screen.getByRole('group', { name: 'Filter photographs' }));
  const gallery = within(document.getElementById('gallery-photos'));
  fireEvent.click(filters.getByRole('button', { name: 'Bathrooms' }));
  expect(filters.getByRole('button', { name: 'Bathrooms' })).toHaveAttribute('aria-pressed', 'true');
  expect(gallery.getAllByRole('img')).toHaveLength(1);
  expect(gallery.getByRole('img')).toHaveAttribute('src', expect.stringContaining('washroom-image-1.webp'));
  fireEvent.click(gallery.getByRole('button', { name: 'View original photograph: Private bathroom' }));
  let dialog = screen.getByRole('dialog', { name: 'Gallery: Private bathroom' });
  expect(within(dialog).getByRole('img')).toHaveAttribute('src', expect.stringContaining('washroom-image-1.webp'));
  expect(within(dialog).queryByRole('button', { name: /Next photograph/ })).toBeNull();
  fireEvent.keyDown(dialog, { key: 'ArrowRight' });
  fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
  expect(dialog).toHaveAccessibleName('Gallery: Private bathroom');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close dialog' }));

  fireEvent.click(filters.getByRole('button', { name: 'Around the bhawan' }));
  expect(gallery.getAllByRole('img')).toHaveLength(4);
  fireEvent.click(gallery.getByRole('button', { name: 'View original photograph: Building exterior' }));
  dialog = screen.getByRole('dialog', { name: 'Gallery: Building exterior' });
  expect(within(dialog).getByRole('img')).toHaveAttribute('src', expect.stringContaining('vatsalya-bhawan-front-view.webp'));
  fireEvent.click(within(dialog).getByRole('button', { name: 'Previous photograph in Around the bhawan' }));
  expect(dialog).toHaveAccessibleName('Gallery: Prayer space');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Next photograph in Around the bhawan' }));
  expect(dialog).toHaveAccessibleName('Gallery: Building exterior');
  for (const label of ['Guest corridor', 'Reception and sitting area', 'Prayer space', 'Building exterior']) {
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next photograph in Around the bhawan' }));
    expect(dialog).toHaveAccessibleName(`Gallery: ${label}`);
  }
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close dialog' }));

  fireEvent.click(filters.getByRole('button', { name: 'Rooms' }));
  expect(gallery.getAllByRole('img')).toHaveLength(3);
  expect(within(gallery.getByRole('button', { name: 'View original photograph: Standard room' })).getByRole('img')).toHaveAttribute('src', expect.stringContaining('room-image-8.webp'));
  fireEvent.click(screen.getByRole('button', { name: 'View original photograph' }));
  dialog = screen.getByRole('dialog', { name: 'Gallery: Building exterior' });
  expect(filters.getByRole('button', { name: 'Around the bhawan' })).toHaveAttribute('aria-pressed', 'true');
  expect(within(dialog).getByRole('img')).toHaveAttribute('src', expect.stringContaining('vatsalya-bhawan-front-view.webp'));
  expect(within(dialog).getByText(/Around the bhawan · 4 of 4 photographs/)).toBeInTheDocument();
});


test('an initial guide fragment scrolls to the mounted section immediately', () => {
  const initialUrl = window.location.href;
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  const scrollIntoView = jest.fn();
  Element.prototype.scrollIntoView = scrollIntoView;
  window.history.replaceState(null, '', '#ayodhya-guide');
  try {
    render(<VatsalyaBhawan />);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('ayodhya-guide'));
  } finally {
    window.history.replaceState(null, '', initialUrl);
    Element.prototype.scrollIntoView = originalScrollIntoView;
  }
});
