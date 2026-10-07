# Vatsalya Bhawan redesign

The new homepage is in `src/VatsalyaBhawan.js`, with styling in `src/index.css` and shared booking validation in `src/booking.js`. Run `npm start`, `npm run build`, or `CI=true npm test -- --watchAll=false`.

## Identity and imagery

- The brand uses the real Devanagari initial “व” as a minimal vector mark, paired with Lora for English display type and Manrope for body text. The glyph is outlined from Noto Sans Devanagari to avoid font-loading changes in the logo.
- `public/assets/ayodhya-aerial.jpg` is an AI-generated artist impression, not geographically accurate aerial footage. It has no invented property pin.
- The hero is a single eight-second Veo 3.1 Fast shot made in Google Flow with the globe and approved Ayodhya artwork assigned as first and last frames. It passes through clouds into the city, then holds a consistent composition. The opening globe reference used NASA Blue Marble imagery; the generated film is cinematic artwork, not accurate satellite or drone footage. The earlier procedural NASA renderer and the first Veo Quality candidate are superseded.
- During the opening, only “जम्बूद्वीपे / Jambu Dvepe” is visible. At 3.6 media seconds the logo, navigation, headline and actions fade in over 0.9 seconds together with the background shading. Scrolling, reduced motion, blocked autoplay and failed media reveal the normal page immediately. The film is silent, plays once, and provides pause/replay controls. Mobile uses continuous digital reframing of the same shot. Opening and arrival posters come from the encoded film so there is no scene change at completion.
- “Watch the journey” provides an explicit restart, including recovery after blocked autoplay. Completed films reveal the matching arrival poster so a preference change cannot leave a paused globe over the normal interface.
- The everyday palette uses ivory and forest green. Buttons have softly arched corners, brass edges and diya accents. The optional “Diwali lights” toggle remembers the guest's choice locally and adds static warm lamp glows while preserving the everyday palette. Festival decoration stays hidden during the opening film; reduced motion remains respected.
- The city guide uses a schematic illustration and downloadable PDF with Vatsalya Bhawan's contact details alongside. It is not a routing map or a distance guide. The separate Google Maps embed and directions link provide actual navigation. Source data and regeneration instructions are in `scripts/map-guide/`.
- The guide adds four compact native disclosures for Ram Mandir, Hanuman Garhi, Kanak Bhawan and Ram ki Paidi. The latter three descriptions come from the District Ayodhya tourist-place pages; Ram Mandir's description is supported by the Press Information Bureau's “The Story of Ram Mandir” (24 November 2025). Each place links to Google Maps and the temple trust or district guide. No opening hours, tickets or journey times are invented. Visible place headings, updated metadata, a no-JavaScript map link and `public/sitemap.xml` support discovery without a separate content framework.
- `public/assets/exterior-refined.jpg` is an AI-reframed architectural view based on the actual exterior photo, using `exterior-v5-clean.png`. The camera perspective is level and compressed, with the ground floor and two balcony levels, shutter, entry, blue columns and warm lighting retained. Wires were cleaned up. This JPEG is retained as the source for the transparent cutout. Fine details remain reconstructed; the original photograph is available on the page.
- The welcome section now uses `public/assets/exterior-cutout.png`, a transparent RGBA extraction of that refined facade. Sky, neighbouring buildings and road were removed; the rooftop, balconies, entrance, gates and steps remain. It displays at native proportions on the page background with a subtle CSS shadow. The JPEG remains as the source variant. The cutout was made with the built-in ImageGen tool; its prompt is saved in `public/assets/exterior-cutout-prompt.txt`.
- `src/assets/room-refined-{deluxe,family,standard}.jpg` use `deluxe-v4.png`, `family-v3.png` and `standard-v3.png`. They were generated from the actual original room photos. The deluxe view is a tighter foot-of-bed composition; family and standard use level views with straighter verticals. Natural framing crops peripheral amenities rather than forcing an ultrawide field of view.
- These are AI perspective reconstructions. Floral textile details, small shelf objects, fine headboard lines and cooler branding can differ from the originals. Original-photo comparisons remain available and the images are labelled.
- Source and intermediate PNGs remain in `/Users/divyansh/Projects/Rishabhs/photo-polish/`. Photo generation used the built-in ImageGen tool. Final film preparation and provenance are documented in `scripts/hero-film/VEO_NOTES.md`; the original procedural renderer is documented in its `README.md`.

## Property information

The Google/Booking listings identify the property as Q6P3+883, Kaniganj, Ayodhya, Uttar Pradesh 224123. Directions query that property, not the temple. The older site’s 500m temple distance and exact arrival times conflict with the listings and were removed. Room names and occupancy are provisional categories based on the previous site; confirm them with the owner. Prices are available by direct enquiry.

- Google listing: https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9
- Booking listing: https://www.booking.com/hotel/in/vatsalya-bhawan.html
- Primary contact: +91 94513 38729 / vatsalya.bhawan.april@gmail.com

## Enquiries

The form prepares an encoded WhatsApp message. It neither sends a message nor claims a booking has been received. The guest reviews the text, opens WhatsApp, and sends it themselves; the hotel confirms availability and pricing. No payment or live inventory integration is implied.

The homepage puts room choices and the gallery before the city guide. Each room displays its existing occupancy guidance and amenities, a direct enquiry action and separate photo details. Selecting a room preserves the guest's dates and group size; larger groups receive a multiple-room note. Moving arrival beyond the selected departure advances departure by one day, while later departures are preserved. The review and WhatsApp link share one message builder.

The gallery exposes eight original photos in Rooms, Around the bhawan and Bathrooms, including all three room types. The viewer and arrow keys stay within the selected category. Room details retain the AI-reframed/original comparison. Native dialogs, 44px controls and explicit review-heading focus support touch and keyboard use.

The redesign is published separately at https://eye-52.github.io/vatsalya-bhawan/ from EYE-52/vatsalya-bhawan. The original RT-1904129 repository and website are preserved. Public asset paths use a relative deployment base; `npm run deploy` targets the new repository explicitly.
