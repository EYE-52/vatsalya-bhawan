import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, Phone, Mail, Menu, X, Wifi, Users, Bath, Snowflake, MessageCircle, Pause, Play, Download, ChevronLeft, ChevronRight, Instagram, Facebook, Star } from 'lucide-react';
import { localDate, nextDay, validateStay, buildWhatsAppUrl, MAPS_URL } from './booking';
import originalDeluxe from './assets/room-image-6.webp';
import deluxe from './assets/room-refined-deluxe.jpg';
import originalFamily from './assets/room-image-5.webp';
import family from './assets/room-refined-family.jpg';
import originalStandard from './assets/room-image-8.webp';
import standard from './assets/room-refined-standard.jpg';
import corridor from './assets/galary-1.webp';
import bathroom from './assets/washroom-image-1.webp';
import altar from './assets/god-image.webp';
import reception from './assets/common-room-2.webp';
const rooms = [{
  name: 'Deluxe room',
  image: deluxe,
  original: originalDeluxe,
  guests: 2,
  text: 'A comfortable place to rest after a day exploring Ayodhya.',
  features: ['Air conditioning', 'Private bathroom', 'Wi-Fi']
}, {
  name: 'Family room',
  image: family,
  original: originalFamily,
  guests: 4,
  text: 'Space to settle in together, with room for the whole family.',
  features: ['Air conditioning', 'Private bathroom', 'Wi-Fi']
}, {
  name: 'Standard room',
  image: standard,
  original: originalStandard,
  guests: 2,
  text: 'A simple, welcoming room for a restful stay.',
  features: ['Private bathroom', 'Wi-Fi']
}];
const photos = [{
  src: originalDeluxe,
  label: 'A place to unwind',
  alt: 'Double bedroom with a padded headboard and seating'
}, {
  src: corridor,
  label: 'Around the bhawan',
  alt: 'Interior corridor with doors leading to guest rooms'
}, {
  src: reception,
  label: 'A warm welcome',
  alt: 'Reception and sitting area at Vatsalya Bhawan'
}, {
  src: originalFamily,
  label: 'Room for your family',
  alt: 'Family bedroom with two beds'
}, {
  src: bathroom,
  label: 'Private bathrooms',
  alt: 'Private bathroom with tiled walls and shower fittings'
}, {
  src: altar,
  label: 'A quiet moment',
  alt: 'Small devotional altar inside Vatsalya Bhawan'
}];
photos.push({ src: `${process.env.PUBLIC_URL}/vatsalya-bhawan-front-view.webp`, label: 'The original facade', alt: 'Original photograph of the Vatsalya Bhawan building exterior and entrance' });
// The city-arrival point in the selected film, in media seconds.
export const ARRIVAL_TIME = 3.6;
const googleListing = 'https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9';
const places = [
  { name: 'Ram Mandir', kind: 'Darshan', text: 'Visit Shri Ram Janmabhoomi Mandir for darshan of Ram Lalla. Check current visitor arrangements with the temple trust before travelling.', info: 'https://srjbtkshetra.org/', query: 'Shri Ram Janmabhoomi Mandir Ayodhya' },
  { name: 'Hanuman Garhi', kind: 'Temple', text: 'A temple dedicated to Hanuman, with the young Hanuman seated in Maa Anjani’s lap in the main shrine.', info: 'https://ayodhya.nic.in/tourist-place/hanuman-garhi/', query: 'Hanuman Garhi Ayodhya' },
  { name: 'Kanak Bhawan', kind: 'Temple', text: 'A temple dedicated to Ram and Sita in Ramkot, northeast of Ram Janmabhoomi.', info: 'https://ayodhya.nic.in/tourist-place/kanak-bhawan/', query: 'Kanak Bhawan Ayodhya' },
  { name: 'Ram ki Paidi', kind: 'Riverfront', text: 'Explore the ghats along the Saryu and the illuminated riverfront after dusk.', info: 'https://ayodhya.nic.in/tourist-place/ram-ki-paidi/', query: 'Ram ki Paidi Ayodhya' },
];
function Diya({ className = '' }) {
  return <svg className={`diya-icon ${className}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path className="diya-flame" d="M24 5c-1 7-7 9-7 15a7 7 0 0 0 14 0c0-5-4-8-7-15Z" fill="currentColor" />
    <path d="M7 29h34c-2 9-8 14-17 14S9 38 7 29Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M10 33c8 3 20 3 28 0M24 24v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>;
}
function Logo() {
  return <span className="brand">
    <svg className="brand-emblem" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill="#28372D" />
      <path d="M584.2194213867188 538.9404907226562H484.45928955078125V0H387V193.68017578125L419.21978759765625 173.90032958984375Q388.85980224609375 141.80029296875 344.5898132324219 124.62030029296875Q300.31982421875 107.4403076171875 244.599853515625 107.4403076171875Q186.3599853515625 107.4403076171875 140.83004760742188 128.12030029296875Q95.30010986328125 148.80029296875 69.03012084960938 188.34027099609375Q42.7601318359375 227.8802490234375 42.7601318359375 283.960205078125Q42.7601318359375 372.240234375 100.7601318359375 415.960205078125Q158.7601318359375 459.68017578125 252.46002197265625 459.68017578125Q281.3599853515625 459.68017578125 306.3099670410156 456.68017578125Q331.25994873046875 453.68017578125 352.61993408203125 448.68017578125L345.82000732421875 365.70062255859375Q326.0799560546875 370.34063720703125 305.5699157714844 372.66064453125Q285.05987548828125 374.98065185546875 260.49981689453125 374.98065185546875Q207.73968505859375 374.98065185546875 174.38955688476562 351.0905456542969Q141.0394287109375 327.200439453125 141.0394287109375 281.42022705078125Q141.0394287109375 240.56005859375 168.239501953125 216.02993774414062Q195.4395751953125 191.49981689453125 246.93975830078125 191.49981689453125Q293.9598388671875 191.49981689453125 333.7398681640625 213.72982788085938Q373.5198974609375 235.9598388671875 397.17999267578125 272.41986083984375L387 213.70025634765625V538.9404907226562H0V622H584.2194213867188Z" transform="translate(14.154 51.000) scale(0.061093 -0.061093)" fill="#FAF8F3" />
    </svg>
    <span>
      <span className="brand-name">Vatsalya Bhawan</span>
      <span className="brand-place">Ayodhya</span>
    </span>
  </span>;
}
function Modal({
  children,
  label,
  onClose,
  className = '',
  onKeyDown
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const active = document.activeElement;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      if (active?.isConnected) active.focus();
    };
  }, []);
  return <dialog ref={ref} aria-label={label} className={`modal ${className}`} onCancel={e => {
    e.preventDefault();
    onClose();
  }} onClick={e => {
    if (e.target === e.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
    }
  }} onKeyDown={onKeyDown}>
    <button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog">
      <X size={22} />
    </button>
    {children}
  </dialog>;
}
export default function VatsalyaBhawan() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(false);
  const [motionEnded, setMotionEnded] = useState(false);
  const [modal, setModal] = useState(null);
  const [room, setRoom] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [festival, setFestival] = useState(() => {
    try {
      const theme = new URLSearchParams(window.location.search).get('theme');
      if (theme === 'diwali' || theme === 'everyday') return theme === 'diwali';
      return window.localStorage.getItem('vatsalya-festival-mode') === 'diwali';
    }
    catch { return false; }
  });
  const videoRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [videoFailed, setVideoFailed] = useState(false);
  const [mobileFilm, setMobileFilm] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches);
  const [filmTime, setFilmTime] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const introActive = filmTime < ARRIVAL_TIME && !motionEnded && !reducedMotion && !videoFailed && !autoplayBlocked && !scrolled;
  const [stay, setStay] = useState({
    checkIn: localDate(),
    checkOut: nextDay(localDate()),
    guests: '2',
    room: 'Any room',
    name: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  useEffect(() => {
    try { window.localStorage.setItem('vatsalya-festival-mode', festival ? 'diwali' : 'everyday'); }
    catch { /* The theme still works when browser storage is unavailable. */ }
  }, [festival]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener('scroll', scroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const key = e => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [menu]);
  useEffect(() => {
    const screen = window.matchMedia('(max-width: 640px)');
    const resize = () => { setMobileFilm(screen.matches); setFilmTime(0); setPaused(false); setAutoplayBlocked(false); };
    screen.addEventListener('change', resize);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => { preference.removeEventListener('change', update); screen.removeEventListener('change', resize); };
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = true;
    const sync = () => {
      if (paused || reducedMotion || motionEnded || videoFailed || document.hidden || !visible) video.pause();
      else video.play().catch(error => {
        if (error.name !== 'AbortError') { setPaused(true); setAutoplayBlocked(true); }
      });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [paused, reducedMotion, motionEnded, videoFailed, mobileFilm]);
  function toggleFilm() {
    if (motionEnded) {
      watchJourney();
    } else setPaused(value => !value);
  }
  function watchJourney() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrolled(false);
    if (videoRef.current) videoRef.current.currentTime = 0;
    setFilmTime(0);
    setMotionEnded(false);
    setAutoplayBlocked(false);
    setPaused(false);
  }
  function enquire(selected) {
    if (selected) setStay(s => ({
      ...s,
      room: selected.name,
      guests: String(selected.guests)
    }));
    setPrepared(false);
    setError('');
    setMenu(false);
    setModal('booking');
  }
  function field(e) {
    const {
      name,
      value
    } = e.target;
    setStay(s => ({
      ...s,
      [name]: value
    }));
    setError('');
  }
  const preview = `Hello, I would like to enquire about a stay at Vatsalya Bhawan.\nArrival: ${stay.checkIn}\nDeparture: ${stay.checkOut}\nGuests: ${stay.guests}\nRoom: ${stay.room}${stay.name ? `\nName: ${stay.name}` : ''}${stay.message ? `\n${stay.message}` : ''}`;
  return <div className={`bhawan-site ${festival ? 'festival-mode' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled || menu ? 'solid' : ''} ${introActive ? 'intro-suppressed' : ''}`} aria-hidden={introActive} inert={introActive}>
      <a href="#home" aria-label="Vatsalya Bhawan home">
        <Logo />
      </a>
      <nav id="mobile-navigation" className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        {[['The stay', 'stay'], ['Rooms', 'rooms'], ['Ayodhya', 'ayodhya-guide'], ['Gallery', 'gallery'], ['Location', 'location']].map(([name, id]) => <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>
          {name}
        </a>)}
        <button className="festival-toggle" aria-pressed={festival} aria-label="Diwali lights" onClick={() => setFestival(value => !value)}>
          <Diya /><span>{festival ? 'Everyday Ayodhya' : 'Diwali lights'}</span>
        </button>
        <button className="button header-cta" onClick={() => enquire()}>
          Plan your stay
          <Diya />
        </button>
      </nav>
      <button className="menu-toggle icon-button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>
        {menu ? <X /> : <Menu />}
      </button>
    </header>
    <main id="main">
      <section className={`hero cinema-hero ${introActive ? 'intro-active' : 'intro-complete'}`} id="home">
        <img className="cinema-poster" src={`${process.env.PUBLIC_URL}/assets/ayodhya-arrival${mobileFilm ? '-mobile' : ''}.jpg`} alt="Cinematic impression of Ayodhya’s temples and river at sunrise" fetchPriority="high" />
        {!reducedMotion && !videoFailed && !autoplayBlocked && <video
          key={mobileFilm ? 'mobile' : 'desktop'}
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/assets/ayodhya-journey${mobileFilm ? '-mobile' : ''}.mp4`}
          className="journey-film"
          style={motionEnded ? { visibility: 'hidden' } : undefined}
          muted
          playsInline
          autoPlay
          preload="auto"
          poster={`${process.env.PUBLIC_URL}/assets/ayodhya-globe${mobileFilm ? '-mobile' : ''}.jpg`}
          aria-label="A cinematic journey from Earth into an artist’s impression of Ayodhya"
          onTimeUpdate={event => setFilmTime(event.currentTarget.currentTime)}
          onEnded={() => setMotionEnded(true)}
          onError={() => setVideoFailed(true)}
        />}
        <div className="hero-shade" />
        <div className="festival-lights" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <span className="festival-light" key={i} style={{ '--light-index': i }} />)}
        </div>
        <div className={`intro-title ${introActive ? 'present' : ''}`} aria-hidden={!introActive}>
          <p lang="hi">जम्बूद्वीपे</p>
          <p>Jambu Dvepe</p>
        </div>
        <div className={`hero-content hero-chrome ${introActive ? 'intro-suppressed' : ''}`} aria-hidden={introActive} inert={introActive}>
          <p className="hero-intro">{festival ? 'Ayodhya, in the warmth of Diwali.' : 'In the city of Ram. A place of your own.'}</p>
          <h1>Arrive in Ayodhya.<br />Feel at home.</h1>
          <p className="hero-description">A welcoming place to pause, come together, and begin your Ayodhya stay.</p>
          <div className="hero-actions">
            <button className="button" onClick={() => enquire()}>Plan your stay <Diya /></button>
            {!reducedMotion && !videoFailed && <button className="journey-watch" onClick={watchJourney} aria-label="Watch the journey film"><Play size={15} fill="currentColor" />Watch the journey</button>}
          </div>
        </div>
        <a className={`hero-location hero-chrome ${introActive ? 'intro-suppressed' : ''}`} href="#location" aria-hidden={introActive} inert={introActive}><MapPin size={20} /><span>Vatsalya Bhawan<span>Kaniganj, Ayodhya</span></span><ArrowUpRight size={18} /></a>
        <div className="hero-bottom">
          <span className={`film-credits hero-chrome ${introActive ? 'intro-suppressed' : ''}`} aria-hidden={introActive} inert={introActive}>Cinematic impression of Ayodhya</span>
          {!reducedMotion && !videoFailed && !autoplayBlocked && <button className="film-control" onClick={toggleFilm} aria-label={motionEnded ? 'Replay journey film' : paused ? 'Resume journey film' : 'Pause journey film'}>{motionEnded || paused ? <Play size={13} /> : <Pause size={13} />}<span>{motionEnded ? 'Replay film' : paused ? 'Resume film' : 'Pause film'}</span></button>}
        </div>
      </section>
      <div className="enquiry-strip">
        <div className="strip-intro">
          <span>Your Ayodhya stay</span>
          <strong>Let’s make room for you.</strong>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          enquire();
        }}>
          <label>
            Arrival
            <input type="date" name="checkIn" value={stay.checkIn} min={localDate()} onChange={field} required />
          </label>
          <label>
            Departure
            <input type="date" name="checkOut" value={stay.checkOut} min={nextDay(stay.checkIn || localDate())} onChange={field} required />
          </label>
          <label>
            Guests
            <select name="guests" value={stay.guests} onChange={field}>
              {Array.from({
                length: 12
              }, (_, i) => <option key={i} value={i + 1}>
                {`${i + 1} ${i === 0 ? 'guest' : 'guests'}`}
              </option>)}
            </select>
          </label>
          <button className="button" type="submit">
            Enquire
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
      <div className="reassurance container">
        {[[Users, 'Family stays'], [Bath, 'Private bathrooms'], [Wifi, 'Wi-Fi'], [MessageCircle, 'Direct enquiries']].map(([Icon, label]) => <span key={label}>
          <Icon size={20} strokeWidth={1.4} />
          {label}
        </span>)}
      </div>
      <section className="welcome container section" id="stay">
        <div className="welcome-image">
          <div className="exterior-frame">
            <img src={`${process.env.PUBLIC_URL}/assets/exterior-cutout.png`} alt="AI-reframed cutout of Vatsalya Bhawan’s full facade and ground-floor entrance, based on a photograph of the actual building" loading="lazy" />
          </div>
          <div className="exterior-disclosure"><span>AI-reframed cutout of the actual building.</span><button className="text-link" onClick={() => { setPhoto(photos.length - 1); setModal('gallery'); }}>View original photograph <ArrowUpRight size={14} /></button></div>
        </div>
        <div className="welcome-copy">
          <p className="eyebrow">Vatsalya Bhawan · Kaniganj</p>
          <h2>Your stay in Ayodhya.</h2>
          <p>Private rooms for couples and families, with Wi-Fi and private bathrooms. Air-conditioned options are available.</p>
          <p>Find us on Tarun Pura Road. Use the city guide below to plan your temple visits and time by the Saryu.</p>
          <a className="text-link" href="#rooms">
            Find your room
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
      <section className="ayodhya-guide container section" id="ayodhya-guide" aria-labelledby="ayodhya-guide-title">
        <div className="ayodhya-guide-heading">
          <h2 id="ayodhya-guide-title">Places to visit in Ayodhya.</h2>
          <a className="text-link" href={`${process.env.PUBLIC_URL}/assets/ayodhya-guide.pdf`} download="Ayodhya-guide-by-Vatsalya-Bhawan.pdf"><Download size={18} />Download the map</a>
        </div>
        <div className="ayodhya-guide-map" tabIndex={0} role="region" aria-label="Ayodhya sightseeing map. Scroll sideways on smaller screens to explore.">
          <img src={`${process.env.PUBLIC_URL}/assets/ayodhya-guide.svg`} alt="Illustrated Ayodhya guide showing Ram Mandir, Hanuman Garhi, Kanak Bhawan, Ram ki Paidi, Ayodhya Dham railway station and Vatsalya Bhawan in Kaniganj, with the bhawan’s contact details alongside." loading="lazy" />
        </div>
        <p className="map-disclaimer">Schematic guide · not to scale.<span className="map-pan-hint"> Swipe to explore.</span></p>
        <div className="place-guides">
          {places.map(place => <details key={place.name}>
            <summary>
              <span className="place-kind">{place.kind}</span>
              <h3>{place.name}</h3>
              <span className="place-expand" aria-hidden="true">+</span>
            </summary>
            <div className="place-guide-content">
              <p>{place.text}</p>
              <div className="place-guide-links">
                <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={16} /></a>
                <a className="text-link" href={place.info} target="_blank" rel="noreferrer">{place.name === 'Ram Mandir' ? 'Temple trust' : 'District guide'} <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </details>)}
        </div>
      </section>
      <section className="rooms-section section" id="rooms">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Rest comes naturally</p>
              <h2>A room for your kind of stay.</h2>
            </div>
            <p>
              Simple comforts. Your own space.
              <br />
              Choose a room, and enquire with us directly.
            </p>
          </div>
          <div className="rooms-grid">
            {rooms.map(r => <article className="room-card" key={r.name}>
              <button className="room-image-button" aria-label={`Explore ${r.name}`} onClick={() => {
                setRoom(r);
                setShowOriginal(false);
                setModal('room');
              }}>
                <img src={r.image} alt={`${r.name} at Vatsalya Bhawan`} loading="lazy" />
                <span className="image-action">
                  <ArrowUpRight size={22} />
                </span>
              </button>
              <div className="room-card-content">
                <div className="room-title">
                  <h3>
                    {r.name}
                  </h3>
                  <span>
                    <Users size={15} />
                    {`${r.guests} guests`}
                  </span>
                </div>
                <p>
                  {r.text}
                </p>
                <div className="room-rate">
                  <span>Enquire for rates</span>
                  <button className="text-link" onClick={() => {
                    setRoom(r);
                    setShowOriginal(false);
                    setModal('room');
                  }}>
                    View room
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
            </article>)}
          </div>
          <p className="photo-note">Room photos digitally reframed with AI. View the original photographs in room details.</p>
          <div className="amenities-row">
            <span>Comfort in the details</span>
            <span>
              <Snowflake size={19} />
              Air-conditioned options
            </span>
            <span>
              <Bath size={19} />
              Private bathrooms
            </span>
            <span>
              <Wifi size={19} />
              Wi-Fi
            </span>
            <span>
              <Users size={19} />
              Family rooms
            </span>
          </div>
        </div>
      </section>
      <section className="gallery-section container section" id="gallery">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Take a look around</p>
            <h2>Everyday spaces. A welcoming place.</h2>
          </div>
          <span className="gallery-hint">A glimpse of life at the bhawan</span>
        </div>
        <div className="gallery-grid">
          {photos.map((p, i) => <button key={p.src} className={`gallery-photo photo-${i}`} onClick={() => {
            setPhoto(i);
            setModal('gallery');
          }} aria-label={`View photograph: ${p.label}`}>
            <img src={p.src} alt={p.alt} loading="lazy" />
            <span>
              {p.label}
              <ArrowUpRight size={18} />
            </span>
          </button>)}
        </div>
      </section>
      <section className="location-section section" id="location">
        <div className="container location-layout">
          <div>
            <p className="eyebrow">Your place in Ayodhya</p>
            <h2>
              Find your way
              <br />
              to the bhawan.
            </h2>
            <p>Based in Kaniganj, near Ayodhya Dham railway station. Plan your visits around the city, then come back to a familiar welcome.</p>
            <address>
              <MapPin size={21} />
              <span>
                Tarun Pura Road, Kaniganj
                <br />
                Ayodhya, Uttar Pradesh 224123
                <br />
                <small>Map reference: Q6P3+883</small>
              </span>
            </address>
            <a className="button outline" href={MAPS_URL} target="_blank" rel="noreferrer">
              Get directions
              <ArrowUpRight size={17} />
            </a>
            <p className="location-note">
              Need help getting here?{' '}
              <a href="tel:+919451338729">Call us before you travel.</a>
            </p>
          </div>
          <div className="map-panel">
            <iframe title="Vatsalya Bhawan location in Kaniganj, Ayodhya" src={`https://maps.google.com/maps?q=${encodeURIComponent('Vatsalya Bhawan Q6P3+883 Kaniganj Ayodhya')}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>
      <section className="reviews container">
        <div>
          <p className="eyebrow">From our guests</p>
          <h2>A welcome worth sharing.</h2>
          <p>Read travellers’ experiences and explore our listing on Google.</p>
        </div>
        <a href={googleListing} target="_blank" rel="noreferrer" className="rating-link">
          <div>
            <strong>4.7</strong>
            <div className="rating-stars" aria-hidden="true">
              {Array.from({
                length: 5
              }, (_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>
          <span>
            on Google
            <ArrowUpRight size={18} />
          </span>
        </a>
      </section>
      <section className="faq container section">
        <div>
          <p className="eyebrow">Before you arrive</p>
          <h2>A few helpful answers.</h2>
          <p>
            Something else on your mind?
            <br />
            <a className="text-link" href="tel:+919451338729">
              Talk to our team
              <ArrowUpRight size={17} />
            </a>
          </p>
        </div>
        <div className="faq-list">
          {[['How do I book a room?', 'Share your dates, guest count and preferred room through our enquiry form. Continue to WhatsApp to send your enquiry; our team will confirm availability and the room rate directly.'], ['Can I stay with my family?', 'Yes, our family room accommodates up to four guests. Tell us your group size so we can help you choose a suitable arrangement.'], ['What are the check-in and check-out times?', 'Please confirm arrival and departure times directly with our team when enquiring. If you are arriving early or travelling late, include that in your message.'], ['What facilities are available?', 'Rooms have private bathrooms and Wi-Fi. Air-conditioned room options are available. Please confirm your preferred facilities with the team before booking.'], ['Where is Vatsalya Bhawan?', 'We are on Tarun Pura Road in Kaniganj, Ayodhya, Uttar Pradesh 224123. Use the directions link above for the property’s location, or call us for help reaching the bhawan.']].map(([q, a]) => <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              {a}
            </p>
          </details>)}
        </div>
      </section>
      <section className="booking-cta">
        <div className="container">
          <div className="diya-row" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <Diya key={i} />)}</div>
          <p className="eyebrow">We’ll be happy to welcome you</p>
          <h2>
            Your Ayodhya journey
            <br />
            starts with a place to stay.
          </h2>
          <p>Tell us when you’re coming. We’ll help with the rest.</p>
          <button className="button" onClick={() => enquire()}>
            Plan your stay
            <Diya />
          </button>
          <a className="cta-phone" href="tel:+919451338729">Or call +91 94513 38729</a>
        </div>
      </section>
    </main>
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home">
            <Logo />
          </a>
          <p>
            A welcoming place to stay.
            <br />
            In the city that brings us together.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/vatsalyabhawan/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/vatsalyabhawan" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href={googleListing} target="_blank" rel="noreferrer" aria-label="Google listing">
              <MapPin size={20} />
            </a>
          </div>
        </div>
        <div>
          <h3>Explore</h3>
          <a href="#stay">The stay</a>
          <a href="#rooms">Our rooms</a>
          <a href="#ayodhya-guide">Ayodhya guide</a>
          <a href="#gallery">Gallery</a>
          <a href="#location">Find us</a>
        </div>
        <div className="footer-contact">
          <h3>Get in touch</h3>
          <a href="tel:+919451338729">
            <Phone size={16} />
            +91 94513 38729
          </a>
          <a href="mailto:vatsalya.bhawan.april@gmail.com">
            <Mail size={16} />
            vatsalya.bhawan.april@gmail.com
          </a>
          <button onClick={() => enquire()}>
            <MessageCircle size={16} />
            Enquire on WhatsApp
          </button>
        </div>
        <div>
          <h3>Visit us</h3>
          <address>
            Tarun Pura Road, Kaniganj
            <br />
            Ayodhya, Uttar Pradesh 224123
          </address>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            Get directions
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          {`© ${new Date().getFullYear()} Vatsalya Bhawan`}
        </span>
        <span>With warmth, from Ayodhya.</span>
      </div>
    </footer>
    <div className={`mobile-actions ${scrolled ? 'visible' : 'at-top'}`}>
      <a href="tel:+919451338729">
        <Phone size={17} />
        Call us
      </a>
      <button onClick={() => enquire()}>
        <MessageCircle size={18} />
        Enquire
      </button>
    </div>
    {modal === 'room' && room && <Modal label={room.name} onClose={() => setModal(null)} className="room-modal">
      <img src={showOriginal ? room.original : room.image} alt={`${room.name} — ${showOriginal ? 'original photograph' : 'AI-reframed view'}`} />
      <div className="room-modal-copy">
        <button className="text-link original-toggle" onClick={() => setShowOriginal(!showOriginal)}>
          {showOriginal ? 'View reframed photo' : 'View original photo'}
        </button>
        <p className="eyebrow">Your space to settle in</p>
        <h2>
          {room.name}
        </h2>
        <p>
          {room.text}
        </p>
        <div className="room-features">
          <span>
            <Users size={18} />
            {`${room.guests} guests`}
          </span>
          {room.features.map(f => <span key={f}>
            {f}
          </span>)}
        </div>
        <p>Enquire for rates. Our team will confirm availability, facilities and pricing for your dates.</p>
        <button className="button" onClick={() => enquire(room)}>
          Enquire about this room
          <ArrowUpRight size={17} />
        </button>
      </div>
    </Modal>}
    {modal === 'gallery' && <Modal label={`Gallery: ${photos[photo].label}`} onClose={() => setModal(null)} className="gallery-modal" onKeyDown={e => {
      if (e.key === 'ArrowRight') setPhoto(p => (p + 1) % photos.length);
      if (e.key === 'ArrowLeft') setPhoto(p => (p + photos.length - 1) % photos.length);
    }}>
      <img src={photos[photo].src} alt={photos[photo].alt} />
      <div className="gallery-controls">
        <button className="icon-button" aria-label="Previous photo" onClick={() => setPhoto(p => (p + photos.length - 1) % photos.length)}>
          <ChevronLeft />
        </button>
        <p aria-live="polite">
          {photos[photo].label}
          <span>
            {`${photo + 1} / ${photos.length}`}
          </span>
        </p>
        <button className="icon-button" aria-label="Next photo" onClick={() => setPhoto(p => (p + 1) % photos.length)}>
          <ChevronRight />
        </button>
      </div>
    </Modal>}
    {modal === 'booking' && <Modal label="Plan your stay" onClose={() => setModal(null)} className="booking-modal">
      <p className="eyebrow">A warm welcome awaits</p>
      <h2>
        {prepared ? 'Your enquiry is ready.' : 'Plan your stay.'}
      </h2>
      {prepared ? <><p>Review your details, then continue to WhatsApp to send them to our team.</p><pre className="message-preview">
          {preview}
        </pre><p className="booking-note">The team will confirm availability and price. Your enquiry has not been sent yet.</p><a className="button" href={buildWhatsAppUrl(stay)} target="_blank" rel="noreferrer">
          Continue to WhatsApp
          <ArrowUpRight size={17} />
        </a><button className="text-link edit-details" onClick={() => setPrepared(false)}>Edit details</button></> : <><p>Share a few details. Our team will confirm availability and price directly.</p><form className="booking-form" onSubmit={e => {
          e.preventDefault();
          const issue = validateStay(stay);
          setError(issue);
          if (!issue) setPrepared(true);
        }}>
          <div className="form-pair">
            <label>
              Arrival
              <input autoFocus type="date" name="checkIn" value={stay.checkIn} min={localDate()} onChange={field} required />
            </label>
            <label>
              Departure
              <input type="date" name="checkOut" value={stay.checkOut} min={nextDay(stay.checkIn || localDate())} onChange={field} required />
            </label>
          </div>
          <div className="form-pair">
            <label>
              Guests
              <select name="guests" value={stay.guests} onChange={field}>
                {Array.from({
                  length: 12
                }, (_, i) => <option key={i} value={i + 1}>
                  {`${i + 1} ${i === 0 ? 'guest' : 'guests'}`}
                </option>)}
              </select>
            </label>
            <label>
              Room preference
              <select name="room" value={stay.room} onChange={field}>
                <option>Any room</option>
                {rooms.map(r => <option key={r.name}>
                  {r.name}
                </option>)}
              </select>
            </label>
          </div>
          <label>
            Your name{' '}
            <span>(optional)</span>
            <input name="name" autoComplete="name" value={stay.name} onChange={field} maxLength={100} />
          </label>
          <label>
            Anything we should know?{' '}
            <span>(optional)</span>
            <textarea name="message" placeholder="Arrival plans, room preferences, or a question…" value={stay.message} onChange={field} maxLength={1000} rows={3} />
          </label>
          {error && <p role="alert" className="form-error">
            {error}
          </p>}
          <button className="button" type="submit">
            Prepare enquiry
            <ArrowRight size={17} />
          </button>
          <p className="booking-note">You’ll review your message before opening WhatsApp.</p>
        </form></>}
    </Modal>}
  </div>;
}
