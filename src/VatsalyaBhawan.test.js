import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VatsalyaBhawan, { ARRIVAL_TIME } from './VatsalyaBhawan';

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
  expect(within(hero()).getByAltText(/Cinematic impression of Ayodhya/)).toBeInTheDocument();
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


test('the bilingual opening hides header and hero actions until the film reaches Ayodhya', () => {
  render(<VatsalyaBhawan />);
  const video = hero().querySelector('video');
  expect(screen.getByText('जम्बूद्वीपे')).toBeInTheDocument();
  expect(screen.getByText('Jambu Dvepe')).toBeInTheDocument();
  expect(document.querySelector('header')).toHaveAttribute('aria-hidden', 'true');
  expect(document.querySelector('header')).toHaveAttribute('inert');
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
  expect(within(hero()).queryByRole('button', { name: /Plan your stay/ })).toBeNull();
  video.currentTime = ARRIVAL_TIME - 0.1;
  fireEvent.timeUpdate(video);
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
  video.currentTime = ARRIVAL_TIME;
  fireEvent.timeUpdate(video);
  expect(screen.getByRole('banner')).not.toHaveAttribute('inert');
  expect(screen.getByRole('heading', { name: /Arrive in Ayodhya/ })).toBeInTheDocument();
  expect(within(hero()).getByRole('button', { name: /Plan your stay/ })).toBeEnabled();
  fireEvent.ended(video);
  fireEvent.click(screen.getByRole('button', { name: 'Replay journey film' }));
  expect(screen.queryByRole('heading', { name: /Arrive in Ayodhya/ })).toBeNull();
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
  expect(screen.getByText('Jambu Dvepe')).toBeInTheDocument();
  fireEvent.ended(hero().querySelector('video'));
  expect(hero().querySelector('video')).toHaveStyle({ visibility: 'hidden' });
});
