import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AyodhyaMap, { HOTEL_COORDINATES, walkingDirections } from './AyodhyaMap';
import L from 'leaflet';

jest.mock('leaflet', () => {
  const handler = () => ({ enable: jest.fn(), disable: jest.fn() });
  const map = () => ({
    fitBounds: jest.fn().mockReturnThis(), setView: jest.fn().mockReturnThis(),
    getZoom: () => 15, getBounds: () => ({ contains: () => true }),
    latLngToContainerPoint: () => ({ x: 100, y: 100 }),
    on: jest.fn().mockReturnThis(), fire: jest.fn(), remove: jest.fn(),
    zoomIn: jest.fn(), zoomOut: jest.fn(), dragging: handler(), touchZoom: handler(),
  });
  const layer = () => ({ addTo: jest.fn().mockReturnThis(), setStyle: jest.fn(), clearLayers: jest.fn() });
  return {
    map, latLngBounds: () => ({ pad: () => [] }),
    control: { scale: () => layer() }, geoJSON: layer, layerGroup: layer,
    divIcon: options => options, marker: position => {
      const element = global.document.createElement('div');
      const tooltip = { options: {}, update: jest.fn(), getElement: () => element };
      return { addTo: jest.fn().mockReturnThis(), bindTooltip: jest.fn().mockReturnThis(), on: jest.fn(), getElement: () => element, getLatLng: () => position, getTooltip: () => tooltip };
    },
  };
});

const places = [
  { id: 'hotel', name: 'Vatsalya Bhawan', lat: 26.7857896, lon: 82.2032408, query: HOTEL_COORDINATES },
  { id: 'ram-mandir', name: 'Shri Ram Janmabhoomi Mandir', lat: 26.7956, lon: 82.1945, query: 'Shri Ram Janmabhoomi Mandir Ayodhya', info: 'Follow temple entry signage.' },
  { id: 'hanuman-garhi', name: 'Hanuman Garhi', lat: 26.7951, lon: 82.2017, query: 'Hanuman Garhi Ayodhya', info: 'Entry includes stairs.' },
];

beforeEach(() => {
  jest.spyOn(L, 'map');
  window.matchMedia = jest.fn(() => ({ matches: false }));
  global.fetch = jest.fn(url => Promise.resolve({ ok: true, json: () => Promise.resolve(url.endsWith('.json') ? places : { type: 'FeatureCollection', features: [] }) }));
});

afterEach(() => { delete global.fetch; jest.restoreAllMocks(); });

test('walking links encode named destinations and distinguish hotel, current-location and return origins', async () => {
  render(<AyodhyaMap />);
  await screen.findByLabelText('Choose a place');
  const outbound = new URL(screen.getByRole('link', { name: 'Walk from the bhawan' }).href);
  expect(outbound.searchParams.get('api')).toBe('1');
  expect(outbound.searchParams.get('travelmode')).toBe('walking');
  expect(outbound.searchParams.get('origin')).toBe(HOTEL_COORDINATES);
  expect(outbound.searchParams.get('destination')).toBe(places[1].query);
  expect(new URL(screen.getByRole('link', { name: 'Walk from my location' }).href).searchParams.has('origin')).toBe(false);
  const returning = new URL(screen.getByRole('link', { name: 'Walk back to the bhawan' }).href);
  expect(returning.searchParams.get('origin')).toBe(places[1].query);
  expect(returning.searchParams.get('destination')).toBe(HOTEL_COORDINATES);
  expect(new URL(walkingDirections('Ram & Sita + Ayodhya')).searchParams.get('destination')).toBe('Ram & Sita + Ayodhya');
});

test('selection focuses real lanes and updates routes; overview and movement controls preserve page scrolling', async () => {
  const onEnquire = jest.fn();
  render(<AyodhyaMap onEnquire={onEnquire} />);
  const selector = await screen.findByLabelText('Choose a place');
  const map = L.map.mock.results[0].value;
  expect(L.map.mock.calls[0][1]).toMatchObject({ scrollWheelZoom: false, dragging: false, touchZoom: false });
  expect(screen.queryByRole('option', { name: 'Vatsalya Bhawan' })).toBeNull();
  expect(map.setView).not.toHaveBeenCalled();
  fireEvent.change(selector, { target: { value: 'hanuman-garhi' } });
  expect(map.setView).toHaveBeenLastCalledWith([26.7951, 82.2017], 17, { animate: false });
  expect(new URL(screen.getByRole('link', { name: 'Walk from the bhawan' }).href).searchParams.get('destination')).toBe('Hanuman Garhi Ayodhya');
  expect(screen.getByText('Entry includes stairs.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Move map' }));
  expect(map.dragging.enable).toHaveBeenCalled();
  expect(map.touchZoom.enable).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Done moving' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(map.fitBounds).toHaveBeenLastCalledWith([[26.7837, 82.189], [26.811, 82.212]], { padding: [30, 48], animate: false });
  expect(screen.getByRole('button', { name: 'Move map' })).toHaveAttribute('aria-pressed', 'false');
  expect(map.dragging.disable).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Enquire about a stay' }));
  expect(onEnquire).toHaveBeenCalledTimes(1);
});

test('failed street data leaves a real static map and working directions to the hotel', async () => {
  global.fetch.mockResolvedValue({ ok: false });
  render(<AyodhyaMap />);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Interactive map unavailable'));
  expect(screen.getByAltText(/Real Ayodhya streets/)).toHaveAttribute('src', expect.stringContaining('/assets/ayodhya-guide.svg'));
  expect(new URL(screen.getByRole('link', { name: 'Find the bhawan' }).href).searchParams.get('destination')).toBe(HOTEL_COORDINATES);
});
