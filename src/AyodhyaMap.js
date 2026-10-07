import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export const HOTEL_COORDINATES = '26.7857896,82.2032408';
const bounds = [[26.782, 82.184], [26.813, 82.218]];
const assets = `${process.env.PUBLIC_URL}/assets`;

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

  useEffect(() => {
    let cancelled = false;
    let resizeObserver;
    const mapMarkers = markers.current;
    const load = async () => {
      try {
        const [module, roadsResponse, placesResponse] = await Promise.all([
          import('leaflet'), fetch(`${assets}/ayodhya-streets.geojson`), fetch(`${assets}/ayodhya-places.json`),
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
          minZoom: 14, maxZoom: 19, zoomSnap: 0.25,
          zoomAnimation: !reducedMotion, fadeAnimation: !reducedMotion,
          maxBounds: L.latLngBounds(bounds).pad(0.12), maxBoundsViscosity: 1,
        }).fitBounds(bounds, { padding: [22, 30] });
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
        L.geoJSON(roads, { filter: feature => feature.properties.kind === 'water', style: feature => roadStyle(feature), interactive: false }).addTo(map);
        const streets = { type: 'FeatureCollection', features: roads.features.filter(feature => feature.properties.kind !== 'water') };
        const casings = L.geoJSON(streets, { style: feature => roadStyle(feature, true), interactive: false }).addTo(map);
        const lines = L.geoJSON(streets, { style: feature => roadStyle(feature), onEachFeature: (feature, layer) => {
          const p = feature.properties;
          if (p.name || restricted(p)) layer.bindTooltip(textLabel(`${p.name || 'Road'}${restricted(p) ? ' · limited access' : ''}`), { sticky: true, className: 'street-hover-label' });
        } }).addTo(map);
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
          const occupied = [];
          const landmarkMarkers = [...markers.current.entries()].sort(([a], [b]) => (b === selection.current ? 2 : b === 'hotel' ? 1 : 0) - (a === selection.current ? 2 : a === 'hotel' ? 1 : 0));
          landmarkMarkers.forEach(([id, marker]) => {
            const label = marker.getTooltip()?.getElement();
            if (!label) return;
            const pixel = map.latLngToContainerPoint(marker.getLatLng());
            const width = label.offsetWidth || 140;
            const height = label.offsetHeight || 24;
            const box = { x: pixel.x + (id === 'hotel' ? 0 : width / 2 + 20), y: pixel.y + (id === 'hotel' ? height / 2 + 23 : 0), width, height };
            const overlaps = occupied.some(other => Math.abs(other.x - box.x) < (other.width + box.width) / 2 + 8 && Math.abs(other.y - box.y) < (other.height + height) / 2 + 8);
            label.style.opacity = overlaps ? '0' : '1';
            if (!overlaps) occupied.push(box);
          });
          namedRoads.forEach(({ feature }) => {
            if (map.getZoom() < (main(feature.properties) ? 14 : 16.7)) return;
            const coordinates = feature.geometry.coordinates;
            const point = coordinates[Math.floor(coordinates.length / 2)];
            const position = [point[1], point[0]];
            if (!map.getBounds().contains(position)) return;
            const pixel = map.latLngToContainerPoint(position);
            const width = Math.min(170, (feature.properties.display_name || feature.properties.name).length * 6.2);
            if (occupied.some(box => Math.abs(box.x - pixel.x) < (box.width + width) / 2 + 15 && Math.abs(box.y - pixel.y) < (box.height + 18) / 2 + 10)) return;
            occupied.push({ x: pixel.x, y: pixel.y, width, height: 18 });
            L.marker(position, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'street-name', html: textLabel(feature.properties.display_name || feature.properties.name), iconSize: [width, 18], iconAnchor: [width / 2, 9] }) }).addTo(labels);
          });
        };
        map.on('zoomend', () => { casings.setStyle(feature => roadStyle(feature, true)); lines.setStyle(feature => roadStyle(feature)); refreshLabels(); });
        map.on('moveend', refreshLabels);
        const addMarker = (place, hotel = false) => {
          const marker = L.marker([place.lat, place.lon], {
            title: place.name, alt: place.name, riseOnHover: true,
            icon: L.divIcon({ className: `ayodhya-pin${hotel ? ' hotel-pin' : ''}`, html: hotel ? '<span aria-hidden="true" lang="hi">व</span>' : '<span aria-hidden="true"></span>', iconSize: hotel ? [34, 34] : [24, 24], iconAnchor: hotel ? [17, 17] : [12, 12] }),
          }).addTo(map).bindTooltip(textLabel(place.name), { permanent: true, direction: hotel ? 'bottom' : 'right', offset: hotel ? [0, 17] : [10, 0], className: `landmark-label${hotel ? ' hotel-label' : ''}` });
          marker.on('click', () => {
            if (hotel) map.setView([place.lat, place.lon], 17, { animate: false });
            else { setSelectedId(place.id); map.setView([place.lat, place.lon], 17, { animate: false }); }
          });
          markers.current.set(hotel ? 'hotel' : place.id, marker);
        };
        destinations.forEach(place => addMarker(place));
        addMarker({ name: 'Vatsalya Bhawan', lat: 26.7857896, lon: 82.2032408 }, true);
        refreshLabels();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => map.invalidateSize());
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
        {status === 'ready' && <div className="street-map-tools" aria-label="Map controls">
          <button type="button" onClick={() => mapRef.current.zoomIn()} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => mapRef.current.zoomOut()} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => { mapRef.current.fitBounds(bounds, { padding: [22, 30], animate: false }); setMoving(false); }}>Show all</button>
          <button type="button" aria-pressed={moving} onClick={() => setMoving(value => !value)}>{moving ? 'Done moving' : 'Move map'}</button>
        </div>}
      <div className={`street-map-frame${moving ? ' map-moving' : ''}`}>
        <div ref={container} className="ayodhya-street-map" role="region" aria-label="Ayodhya street map" aria-describedby="street-map-instructions" />
        {status !== 'ready' && <div className="street-map-fallback">
          <img src={`${assets}/ayodhya-guide.svg`} alt="Real Ayodhya streets and landmarks, with Vatsalya Bhawan marked" loading="lazy" />
          <p role="status">{status === 'error' ? 'Interactive map unavailable. Use the PDF or Google Maps.' : 'Loading street map…'}</p>
        </div>}
        <span className="map-north" aria-label="North is up">↑ N</span>
      </div>
      <div className="street-map-caption">
        <p id="street-map-instructions">{moving ? 'Drag to move. Choose Done moving to scroll the page.' : 'Zoom for lanes. Choose Move map to pan.'}</p>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
      </div>
      <div className="street-map-legend" aria-label="Map legend"><span>Streets</span><span className="path-key">Footpaths</span><span className="access-key">Limited access</span><span className="water-key">Water</span></div>
      <div className="map-destination">
        {places.length > 0 && <>
          <label htmlFor="ayodhya-destination">Choose a place</label>
          <select id="ayodhya-destination" value={selectedId} onChange={event => { const place = places.find(item => item.id === event.target.value); setSelectedId(place.id); mapRef.current?.setView([place.lat, place.lon], 17, { animate: false }); }}>{places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
          <p className="map-place-info">{selected.info}</p>
          <div className="walking-links">
            <a className="button button-primary" href={walkingDirections(selected.query, HOTEL_COORDINATES)} target="_blank" rel="noreferrer">Walk from the bhawan <ArrowUpRight size={16} /></a>
            <a className="text-link" href={walkingDirections(selected.query)} target="_blank" rel="noreferrer">Walk from my location <ArrowUpRight size={16} /></a>
            <a className="text-link" href={walkingDirections(HOTEL_COORDINATES, selected.query)} target="_blank" rel="noreferrer">Walk back to the bhawan <ArrowUpRight size={16} /></a>
          </div>
        </>}
        <p className="map-routing-note">Walking directions open in Google Maps. Check local signs and temple entry arrangements.</p>
      </div>
    </div>
    <aside className="map-stay-card" aria-label="Stay at Vatsalya Bhawan">
      <figure><img src={`${assets}/exterior-cutout.png`} alt="AI-reframed photograph of the full Vatsalya Bhawan facade" loading="lazy" /><figcaption>AI-reframed original photograph</figcaption></figure>
      <div className="map-stay-content">
        <MapPin size={20} aria-hidden="true" />
        <h3>Your stay in Ayodhya.</h3>
        <p className="map-stay-name">Vatsalya Bhawan</p>
        <p>Tarun Pura Road, Kaniganj<br />Ayodhya, Uttar Pradesh</p>
        <button className="button button-primary" type="button" onClick={onEnquire}>Enquire about a stay</button>
        <a className="text-link" href={walkingDirections(HOTEL_COORDINATES)} target="_blank" rel="noreferrer">Find the bhawan <ArrowUpRight size={16} /></a>
        <a className="map-stay-phone" href="tel:+919451338729">+91 94513 38729</a>
      </div>
    </aside>
  </div>;
}
