import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export const HOTEL_COORDINATES = '26.7857896,82.2032408';
const bounds = [[26.7837, 82.189], [26.811, 82.212]];
const coverage = [[26.771, 82.148], [26.824, 82.255]];
const overviewOptions = { padding: [30, 48], animate: false };
const labelDirections = { 'ram-mandir': 'left', 'hanuman-garhi': 'right', 'kanak-bhawan': 'top', 'dashrath-mahal': 'left', 'ayodhya-dham': 'left', hotel: 'bottom' };
const labelOffsets = { left: [-16, 0], right: [16, 0], top: [0, -18], bottom: [0, 18] };
const assets = `${process.env.PUBLIC_URL}/assets`;
const motionOptions = () => ({ animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches, duration: 0.65 });

export function walkingDirections(destination, origin) {
  const params = new URLSearchParams({ api: '1', destination, travelmode: 'walking' });
  if (origin) params.set('origin', origin);
  return `https://www.google.com/maps/dir/?${params}`;
}

function textLabel(text) {
  const label = document.createElement('span');
  label.textContent = text;
  return label;
}

export default function AyodhyaMap({ onEnquire }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const markers = useRef(new Map());
  const selection = useRef('');
  const [places, setPlaces] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('loading');
  const [moving, setMoving] = useState(false);
  const selected = places.find(place => place.id === selectedId);
  const zoomBy = delta => {
    const map = mapRef.current;
    const zoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), map.getZoom() + delta));
    map.flyTo(map.getCenter(), zoom, motionOptions());
  };

  useEffect(() => {
    let cancelled = false;
    let resizeObserver;
    const mapMarkers = markers.current;
    const load = async () => {
      try {
        const [module, roadsResponse, placesResponse] = await Promise.all([
          import('leaflet'), fetch(`${assets}/ayodhya-streets-wide.geojson`), fetch(`${assets}/ayodhya-places.json`),
        ]);
        if (!roadsResponse.ok || !placesResponse.ok) throw new Error('Map data unavailable');
        const [roads, allPlaces] = await Promise.all([roadsResponse.json(), placesResponse.json()]);
        const destinations = allPlaces.filter(place => place.id !== 'hotel');
        if (cancelled) return;
        const L = module.default || module;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const map = L.map(container.current, {
          zoomControl: false, attributionControl: false, scrollWheelZoom: false,
          dragging: false, touchZoom: false, doubleClickZoom: false,
          minZoom: 14, maxZoom: 19, zoomSnap: 0, zoomDelta: 0.5, bounceAtZoomLimits: false,
          zoomAnimation: !reducedMotion, fadeAnimation: !reducedMotion,
          maxBounds: L.latLngBounds(coverage), maxBoundsViscosity: 1,
        }).fitBounds(bounds, overviewOptions);
        mapRef.current = map;
        L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
        const restricted = p => ['private', 'no'].includes(p.access) || ['private', 'no'].includes(p.foot);
        const path = p => ['footway', 'path', 'pedestrian', 'steps'].includes(p.class);
        const main = p => ['primary', 'secondary', 'tertiary', 'trunk'].includes(p.class);
        const roadStyle = (feature, casing = false) => {
          const p = feature.properties;
          const factor = Math.max(0.8, (map.getZoom() - 13) / 2.4);
          if (p.kind === 'water') return { color: 'var(--map-water-edge)', weight: 0.7, fillColor: 'var(--map-water)', fillOpacity: 1 };
          if (p.kind === 'rail') return { color: 'var(--map-rail)', weight: 1.1, dashArray: '4 5' };
          if (restricted(p)) return { color: 'var(--map-restricted)', weight: 1.5 * factor, dashArray: '2 5', opacity: casing ? 0 : 0.8 };
          if (path(p)) return { color: 'var(--map-path)', weight: 1.3 * factor, dashArray: p.class === 'steps' ? '1 3' : '3 3', opacity: casing ? 0 : 0.9 };
          return { color: casing ? 'var(--map-road-edge)' : '#ffffff', weight: (main(p) ? 5.5 : 2.8) * factor + (casing ? 1.8 : 0), opacity: 1 };
        };
        const streets = { type: 'FeatureCollection', features: roads.features.filter(feature => feature.properties.kind !== 'water') };
        // Project the complete geometry once so native flyTo can reveal roads outside the viewport.
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const overlayBounds = L.latLngBounds(coverage);
        const origin = map.project(overlayBounds.getNorthWest(), 19);
        const extent = map.project(overlayBounds.getSouthEast(), 19).subtract(origin);
        svg.setAttribute('viewBox', `0 0 ${extent.x} ${extent.y}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        const paintedPaths = [];
        const drawFeatures = (features, casing = false) => features.forEach(feature => {
          const { type, coordinates } = feature.geometry;
          const polygon = type.includes('Polygon');
          const rings = type === 'LineString' ? [coordinates] : type === 'MultiPolygon' ? coordinates.flat() : coordinates;
          const element = document.createElementNS(svg.namespaceURI, 'path');
          element.setAttribute('d', rings.map(ring => ring.map((point, index) => {
            const pixel = map.project([point[1], point[0]], 19).subtract(origin);
            return `${index ? 'L' : 'M'}${pixel.x} ${pixel.y}`;
          }).join(' ') + (polygon ? ' Z' : '')).join(' '));
          element.setAttribute('fill-rule', 'evenodd');
          element.setAttribute('vector-effect', 'non-scaling-stroke');
          element.setAttribute('stroke-linecap', 'round');
          element.setAttribute('stroke-linejoin', 'round');
          const p = feature.properties;
          if (!casing && (p.name || restricted(p))) {
            const title = document.createElementNS(svg.namespaceURI, 'title');
            title.textContent = `${p.name || 'Road'}${restricted(p) ? ' · limited access' : ''}`;
            element.appendChild(title);
          }
          svg.appendChild(element);
          paintedPaths.push({ element, feature, casing, polygon });
        });
        drawFeatures(roads.features.filter(feature => feature.properties.kind === 'water'));
        drawFeatures(streets.features, true);
        drawFeatures(streets.features);
        const refreshRoadStyles = () => paintedPaths.forEach(({ element, feature, casing, polygon }) => {
          const style = roadStyle(feature, casing);
          Object.entries({ stroke: style.color, 'stroke-width': style.weight, 'stroke-opacity': style.opacity ?? 1, 'stroke-dasharray': style.dashArray || 'none', fill: polygon ? style.fillColor || style.color : 'none', 'fill-opacity': style.fillOpacity ?? 0.2 }).forEach(([name, value]) => element.setAttribute(name, value));
        });
        refreshRoadStyles();
        L.svgOverlay(svg, overlayBounds, { interactive: true }).addTo(map);
        const labels = L.layerGroup().addTo(map);
        // One label per named road; the longest mapped segment carries its name.
        const namedRoads = new Map();
        streets.features.forEach(feature => {
          const p = feature.properties;
          if (!p.name || restricted(p) || feature.geometry.type !== 'LineString') return;
          const coordinates = feature.geometry.coordinates;
          const length = coordinates.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - coordinates[index][0], point[1] - coordinates[index][1]), 0);
          if (!namedRoads.has(p.name) || namedRoads.get(p.name).length < length) namedRoads.set(p.name, { feature, length });
        });
        const refreshLabels = () => {
          labels.clearLayers();
          const mapBox = container.current.getBoundingClientRect();
          const occupied = [...markers.current.entries()].map(([id, marker]) => {
            const pixel = map.latLngToContainerPoint(marker.getLatLng());
            return { id, x: mapBox.left + pixel.x, y: mapBox.top + pixel.y, width: id === 'hotel' ? 34 : 22, height: id === 'hotel' ? 34 : 22 };
          });
          const overlaps = (box, other, gap = 6) => Math.abs(other.x - box.x) < (other.width + box.width) / 2 + gap && Math.abs(other.y - box.y) < (other.height + box.height) / 2 + gap;
          const landmarkMarkers = [...markers.current.entries()].sort(([a], [b]) => (b === selection.current ? 2 : b === 'hotel' ? 1 : 0) - (a === selection.current ? 2 : a === 'hotel' ? 1 : 0));
          landmarkMarkers.forEach(([id, marker]) => {
            const tooltip = marker.getTooltip();
            const label = tooltip?.getElement();
            if (!label) return;
            let placed = false;
            for (const direction of new Set([labelDirections[id] || 'right', 'right', 'left', 'top', 'bottom'])) {
              tooltip.options.direction = direction;
              tooltip.options.offset = labelOffsets[direction];
              tooltip.update();
              const rect = label.getBoundingClientRect();
              const box = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
              const inside = rect.left >= mapBox.left + 6 && rect.right <= mapBox.right - 6 && rect.top >= mapBox.top + 6 && rect.bottom <= mapBox.bottom - 6;
              if (inside && !occupied.some(other => other.id !== id && overlaps(box, other))) {
                occupied.push(box);
                placed = true;
                break;
              }
            }
            label.style.opacity = placed ? '1' : '0';
          });
          namedRoads.forEach(({ feature }) => {
            if (map.getZoom() < (main(feature.properties) ? 14 : 16.7)) return;
            const coordinates = feature.geometry.coordinates;
            const point = coordinates[Math.floor(coordinates.length / 2)];
            const position = [point[1], point[0]];
            if (!map.getBounds().contains(position)) return;
            const pixel = map.latLngToContainerPoint(position);
            const width = Math.min(170, (feature.properties.display_name || feature.properties.name).length * 6.2);
            const box = { x: mapBox.left + pixel.x, y: mapBox.top + pixel.y, width, height: 18 };
            if (box.x - width / 2 < mapBox.left + 6 || box.x + width / 2 > mapBox.right - 6 || box.y - 9 < mapBox.top + 6 || box.y + 9 > mapBox.bottom - 6) return;
            if (occupied.some(other => overlaps(box, other, 14))) return;
            occupied.push(box);
            L.marker(position, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'street-name', html: textLabel(feature.properties.display_name || feature.properties.name), iconSize: [width, 18], iconAnchor: [width / 2, 9] }) }).addTo(labels);
          });
        };
        map.on('zoomend', refreshRoadStyles);
        map.on('moveend', refreshLabels);
        const addMarker = (place, hotel = false) => {
          const marker = L.marker([place.lat, place.lon], {
            title: place.name, alt: place.name, riseOnHover: true,
            icon: L.divIcon({ className: `ayodhya-pin${hotel ? ' hotel-pin' : ''}`, html: hotel ? '<span aria-hidden="true" lang="hi">व</span>' : '<span aria-hidden="true"></span>', iconSize: [44, 44], iconAnchor: [22, 22] }),
          }).addTo(map).bindTooltip(textLabel(place.id === 'ram-mandir' ? 'Ram Mandir' : place.name), { permanent: true, direction: labelDirections[hotel ? 'hotel' : place.id] || 'right', offset: [0, 0], className: `landmark-label${hotel ? ' hotel-label' : ''}` });
          marker.on('click', () => {
            if (!hotel) setSelectedId(place.id);
            map.flyTo([place.lat, place.lon], 17, motionOptions());
          });
          markers.current.set(hotel ? 'hotel' : place.id, marker);
        };
        destinations.forEach(place => addMarker(place));
        addMarker({ name: 'Vatsalya Bhawan', lat: 26.7857896, lon: 82.2032408 }, true);
        refreshLabels();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
            if (map.getZoom() < 16) map.fitBounds(bounds, overviewOptions);
            refreshLabels();
          });
          resizeObserver.observe(container.current);
        }
        setPlaces(destinations);
        setSelectedId(destinations[0]?.id || '');
        setStatus('ready');
      } catch {
        if (!cancelled) { mapRef.current?.remove(); mapRef.current = null; setStatus('error'); }
      }
    };
    load();
    return () => { cancelled = true; resizeObserver?.disconnect(); mapRef.current?.remove(); mapRef.current = null; mapMarkers.clear(); };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (moving) { map.dragging.enable(); map.touchZoom.enable(); }
    else { map.dragging.disable(); map.touchZoom.disable(); }
  }, [moving, status]);

  useEffect(() => {
    selection.current = selectedId;
    markers.current.forEach((marker, id) => marker.getElement()?.classList.toggle('selected-pin', id === selectedId));
    mapRef.current?.fire('moveend');
  }, [selectedId, selected]);

  return <div className="street-map-layout">
    <div className="street-map-main">
      <div className={`street-map-frame${moving ? ' map-moving' : ''}`}>
        {status === 'ready' && <div className="street-map-tools" aria-label="Map controls">
          <button type="button" onClick={() => zoomBy(0.5)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => zoomBy(-0.5)} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => { mapRef.current.flyToBounds(bounds, { ...overviewOptions, ...motionOptions() }); setMoving(false); }}>Show all</button>
          <button type="button" aria-pressed={moving} onClick={() => setMoving(value => !value)}>{moving ? 'Done moving' : 'Move map'}</button>
        </div>}
        <div ref={container} className="ayodhya-street-map" role="region" aria-label="Ayodhya street map" aria-describedby="street-map-instructions" />
        {status !== 'ready' && <div className="street-map-fallback">
          <img src={`${assets}/ayodhya-guide.svg`} alt="Real Ayodhya streets and landmarks, with Vatsalya Bhawan marked" loading="lazy" />
          <p role="status">{status === 'error' ? 'Interactive map unavailable. Use the PDF or Google Maps.' : 'Loading street map…'}</p>
        </div>}
        <span className="map-north" aria-label="North is up">↑ N</span>
      </div>
      <div className="street-map-meta container">
        <div className="street-map-caption">
          <p id="street-map-instructions">{moving ? 'Drag to move. Choose Done moving to scroll the page.' : 'Zoom for lanes. Choose Move map to pan.'}</p>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
        </div>
        <div className="street-map-legend" aria-label="Map legend"><span>Streets</span><span className="path-key">Footpaths</span><span className="access-key">Limited access</span><span className="water-key">Water</span></div>
      </div>
    </div>
    <div className="street-map-footer container">
      <div className="map-destination">
        {places.length > 0 && <>
          <label htmlFor="ayodhya-destination">Choose a place</label>
          <select id="ayodhya-destination" value={selectedId} onChange={event => { const place = places.find(item => item.id === event.target.value); setSelectedId(place.id); mapRef.current?.flyTo([place.lat, place.lon], 17, motionOptions()); }}>{places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
          <p className="map-place-info">{selected.info}</p>
          <div className="walking-links">
            <a className="button button-primary" href={walkingDirections(selected.query, HOTEL_COORDINATES)} target="_blank" rel="noreferrer">Walk from the bhawan <ArrowUpRight size={16} /></a>
            <a className="text-link" href={walkingDirections(selected.query)} target="_blank" rel="noreferrer">Walk from my location <ArrowUpRight size={16} /></a>
            <a className="text-link" href={walkingDirections(HOTEL_COORDINATES, selected.query)} target="_blank" rel="noreferrer">Walk back to the bhawan <ArrowUpRight size={16} /></a>
          </div>
        </>}
        <p className="map-routing-note">Walking directions open in Google Maps. Check local signs and temple entry arrangements.</p>
      </div>
      <aside className="map-stay-card" aria-label="Stay at Vatsalya Bhawan">
        <figure><img src={`${assets}/exterior-cutout.png`} alt="Vatsalya Bhawan facade" loading="lazy" /></figure>
        <div className="map-stay-content">
          <h3>Vatsalya Bhawan</h3>
          <p>Tarun Pura Road, Kaniganj<br />Ayodhya, Uttar Pradesh</p>
          <button className="button button-primary" type="button" onClick={onEnquire}>Enquire about a stay</button>
          <a className="text-link" href={walkingDirections(HOTEL_COORDINATES)} target="_blank" rel="noreferrer">Find the bhawan <ArrowUpRight size={16} /></a>
          <a className="map-stay-phone" href="tel:+919451338729">+91 94513 38729</a>
        </div>
      </aside>
    </div>
  </div>;
}
