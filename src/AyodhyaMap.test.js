import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AyodhyaMap, { HOTEL_COORDINATES, walkingDirections } from './AyodhyaMap';
import L from 'leaflet';

jest.mock('leaflet', () => {
  const handler = () => ({ enable: jest.fn(), disable: jest.fn() });
  const point = (x, y) => ({ x, y, subtract: other => point(x - other.x, y - other.y) });
  const map = () => ({
    fitBounds: jest.fn().mockReturnThis(), setView: jest.fn().mockReturnThis(),
    flyTo: jest.fn().mockReturnThis(), flyToBounds: jest.fn().mockReturnThis(),
    getZoom: jest.fn(() => 15), getMinZoom: () => 14, getMaxZoom: () => 19,
    getCenter: () => [26.8, 82.2], getBounds: () => ({ contains: () => true }),
    latLngToContainerPoint: () => ({ x: 100, y: 100 }),
    project: position => point(position[1] * 1000, -position[0] * 1000),
    on: jest.fn().mockReturnThis(), fire: jest.fn(), remove: jest.fn(),
    zoomIn: jest.fn(), zoomOut: jest.fn(), dragging: handler(), touchZoom: handler(),
  });
  const layer = () => ({ addTo: jest.fn().mockReturnThis(), setStyle: jest.fn(), clearLayers: jest.fn() });
  return {
    map, latLngBounds: bounds => ({ pad: () => [], getNorthWest: () => [bounds[1][0], bounds[0][1]], getSouthEast: () => [bounds[0][0], bounds[1][1]] }),
    control: { scale: () => layer() }, svgOverlay: jest.fn(layer), layerGroup: layer,
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
  L.svgOverlay.mockClear();
  L.svgOverlay.mockImplementation(() => ({ addTo: jest.fn().mockReturnThis() }));
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
  expect(map.flyTo).not.toHaveBeenCalled();
  fireEvent.change(selector, { target: { value: 'hanuman-garhi' } });
  expect(map.flyTo).toHaveBeenLastCalledWith([26.7951, 82.2017], 17, { animate: true, duration: 0.65 });
  expect(new URL(screen.getByRole('link', { name: 'Walk from the bhawan' }).href).searchParams.get('destination')).toBe('Hanuman Garhi Ayodhya');
  expect(screen.getByText('Entry includes stairs.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Move map' }));
  expect(map.dragging.enable).toHaveBeenCalled();
  expect(map.touchZoom.enable).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Done moving' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(map.flyToBounds).toHaveBeenLastCalledWith([[26.7837, 82.189], [26.811, 82.212]], { padding: [30, 48], animate: true, duration: 0.65 });
  expect(screen.getByRole('button', { name: 'Move map' })).toHaveAttribute('aria-pressed', 'false');
  expect(map.dragging.disable).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Enquire about a stay' }));
  expect(onEnquire).toHaveBeenCalledTimes(1);
});

test('zoom controls ease through half steps, stay within coverage limits and respect reduced motion', async () => {
  render(<AyodhyaMap />);
  await screen.findByLabelText('Choose a place');
  const map = L.map.mock.results[0].value;
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(map.flyTo).toHaveBeenLastCalledWith([26.8, 82.2], 15.5, { animate: true, duration: 0.65 });
  fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
  expect(map.flyTo).toHaveBeenLastCalledWith([26.8, 82.2], 14.5, { animate: true, duration: 0.65 });
  map.getZoom.mockReturnValue(18.9);
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(map.flyTo.mock.lastCall[1]).toBe(19);
  map.getZoom.mockReturnValue(14.1);
  window.matchMedia.mockReturnValue({ matches: true });
  fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
  expect(map.flyTo).toHaveBeenLastCalledWith([26.8, 82.2], 14, { animate: false, duration: 0.65 });
  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(map.flyToBounds.mock.lastCall[1].animate).toBe(false);
});

test('failed street data leaves a real static map and working directions to the hotel', async () => {
  global.fetch.mockResolvedValue({ ok: false });
  render(<AyodhyaMap />);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Interactive map unavailable'));
  expect(screen.getByAltText(/Real Ayodhya streets/)).toHaveAttribute('src', expect.stringContaining('/assets/ayodhya-guide.svg'));
  expect(new URL(screen.getByRole('link', { name: 'Find the bhawan' }).href).searchParams.get('destination')).toBe(HOTEL_COORDINATES);
});

test('roads outside the focused destination stay in the complete SVG during zoom out', async () => {
  const roads = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { kind: 'road', class: 'residential', name: 'Remote lane' }, geometry: { type: 'LineString', coordinates: [[82.15, 26.78], [82.16, 26.79]] } }] };
  global.fetch.mockImplementation(url => Promise.resolve({ ok: true, json: () => Promise.resolve(url.endsWith('.json') ? places : roads) }));
  render(<AyodhyaMap />);
  const selector = await screen.findByLabelText('Choose a place');
  const svg = L.svgOverlay.mock.calls[0][0];
  const paths = [...svg.querySelectorAll('path')];
  expect(paths).toHaveLength(2);
  expect(paths[1].getAttribute('d')).toMatch(/^M.+ L.+/);
  expect(paths[1]).toHaveAttribute('vector-effect', 'non-scaling-stroke');
  expect(paths[1].querySelector('title')).toHaveTextContent('Remote lane');
  const geometry = paths[1].getAttribute('d');
  fireEvent.change(selector, { target: { value: 'hanuman-garhi' } });
  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(svg.querySelectorAll('path')).toHaveLength(2);
  expect(paths[1]).toHaveAttribute('d', geometry);
});
