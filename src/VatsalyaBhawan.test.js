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
let play;
let pause;

beforeEach(() => {
  reducedMotion = false;
  window.localStorage.clear();
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn(query => ({
    matches: query.includes('prefers-reduced-motion') && reducedMotion,
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
  expect(within(hero()).getByAltText('Satellite view of Ayodhya and the Saryu River')).toBeInTheDocument();
  fireEvent.click(within(hero()).getByRole('button', { name: /Plan your stay/ }));
  expect(screen.getByRole('dialog', { name: 'Plan your stay' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Prepare enquiry/ })).toBeEnabled();
}

test('reduced motion shows a static poster with a usable booking flow, without mounting video', () => {
  reducedMotion = true;
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
  expect(video.loop).toBe(false);
  expect(play).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Pause journey film' }));
  expect(pause).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Resume journey film' })).toBeInTheDocument();
  const callsBeforeResume = play.mock.calls.length;
  fireEvent.click(screen.getByRole('button', { name: 'Resume journey film' }));
  expect(play.mock.calls.length).toBeGreaterThan(callsBeforeResume);
  video.currentTime = 15;
  fireEvent.ended(video);
  const callsBeforeReplay = play.mock.calls.length;
  fireEvent.click(screen.getByRole('button', { name: 'Replay journey film' }));
  expect(video.currentTime).toBe(0);
  expect(play.mock.calls.length).toBeGreaterThan(callsBeforeReplay);
  expect(screen.getByRole('button', { name: 'Pause journey film' })).toBeInTheDocument();
});


test('all four bilingual captions follow media time while header and hero actions wait for arrival', () => {
  render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  const stages = [
    [0, 'जम्बूद्वीपे', 'Jambudvīpe'],
    [3, 'भारतखण्डे', 'Bhāratakhaṇḍe'],
    [5.5, 'आर्यावर्ते', 'Āryāvarte'],
    [8, 'अयोध्या', 'Ayodhyā'],
  ];
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-geographic-globe.jpg'));
  stages.forEach(([start, hindi, english], index) => {
    if (index > 0) {
      video.currentTime = start - 0.01;
      fireEvent.timeUpdate(video);
      expect(screen.getByText(stages[index - 1][2])).toBeInTheDocument();
    }
    video.currentTime = start;
    fireEvent.timeUpdate(video);
    expect(screen.getByText(hindi)).toHaveAttribute('lang', 'hi');
    expect(screen.getByText(english)).toHaveAttribute('lang', 'en');
    if (index > 0) expect(screen.queryByText(stages[index - 1][2])).toBeNull();
    expect(document.querySelector('header')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('header')).toHaveAttribute('inert');
    expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
    expect(within(hero()).queryByRole('button', { name: /Plan your stay/ })).toBeNull();
    expect(hero().querySelector('.hero-location')).toHaveAttribute('inert');
    expect(hero().querySelector('.film-credits')).toHaveAttribute('inert');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Pause journey film' }));
  expect(screen.getByText('Ayodhyā')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Resume journey film' }));
  video.currentTime = ARRIVAL_TIME - 0.1;
  fireEvent.timeUpdate(video);
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
  video.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(video);
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-geographic-arrival.jpg'));
  expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(within(hero()).getByRole('button', { name: /Plan your stay/ })).toBeEnabled();
  expect(within(hero()).getByRole('link', { name: 'NASA Blue Marble' })).toHaveAttribute('href', 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/');
  expect(within(hero()).getByRole('link', { name: 'Copernicus Sentinel data 2026' })).toBeInTheDocument();
  fireEvent.ended(video);
  fireEvent.click(screen.getByRole('button', { name: 'Replay journey film' }));
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
  expect(screen.getByText('Jambudvīpe')).toBeInTheDocument();
  expect(hero().querySelector('.cinema-poster')).toHaveAttribute('src', expect.stringContaining('ayodhya-geographic-globe.jpg'));
  expect(screen.queryByText('Ayodhyā')).toBeNull();
});

test('blocked autoplay reveals the normal page immediately', async () => {
  play.mockRejectedValue(new DOMException('Autoplay blocked', 'NotAllowedError'));
  render(<VatsalyaBhawan />);
  await waitFor(() => expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument());
  expect(hero().querySelector('video')).toBeNull();
  expectPosterAndBooking();
});

test('Diwali mode persists without interrupting the film and can return to everyday Ayodhya', () => {
  const { unmount } = render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  video.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(video);
  const lights = screen.getByRole('button', { name: 'Diwali lights' });
  fireEvent.click(lights);
  expect(lights).toHaveAttribute('aria-pressed', 'true');
  expect(document.querySelector('.bhawan-site')).toHaveClass('festival-mode');
  expect(video.currentTime).toBe(ARRIVAL_TIME);
  expect(window.localStorage.getItem('vatsalya-festival-mode')).toBe('diwali');
  unmount();
  render(<VatsalyaBhawan />);
  expect(document.querySelector('.bhawan-site')).toHaveClass('festival-mode');
  const restartedVideo = hero().querySelector('video');
  restartedVideo.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(restartedVideo);
  fireEvent.click(screen.getByRole('button', { name: 'Diwali lights' }));
  expect(document.querySelector('.bhawan-site')).not.toHaveClass('festival-mode');
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
  expect(document.querySelector('header')).toHaveAttribute('inert');
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
