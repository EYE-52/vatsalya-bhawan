# Earth to Ram Mandir — 7 October 2026

The user requested a continuous-feeling journey from space, through real Ayodhya geography, into an AI aerial and a temple-focused final view. The existing real satellite sequence is retained as the opening; the lower views are AI interpretations guided by real location and architectural references. This is not documentary drone footage or a survey-accurate camera path. Generated roof details and temple geometry can differ from reality.

## Frames and sample selection

1. The geographic opening uses frames 0–300 of `ayodhya-continuous[-mobile].mp4`, retimed to 240 frames / 10 seconds. NASA Blue Marble and modified Copernicus Sentinel imagery provenance remains in `CONTINUOUS_NOTES.md` and `GEOGRAPHIC_NOTES.md`.
2. An ImageGen oblique city frame was created from the final overhead satellite view. Native Flow Video → Frames controls bind the real satellite arrival to Start and the generated wide aerial to End. The 8-second Veo 3.1 Fast result is `ayodhya-native-descent-source.mp4` (asset `d8244a54-b0d0-4064-a57c-f409034d2ddf`). All 192 frames are retimed to 120 output frames / 5 seconds. The roof detail is visibly AI reconstructed during the descent.
3. The exact decoded frame 191 of that clip becomes the next Start. An ImageGen temple-focused reference becomes End. That reference used a Google Maps footprint screenshot and two completed-temple photographs from 25 November 2025, credited to the Prime Minister's Office under GODL-India. Exact image prompts are in `TEMPLE_IMAGE_PROMPTS.md`; URLs, licenses and source hashes are in `TEMPLE_REFERENCE_SOURCES.txt`. The map screenshot itself is not published in the hero.
4. The second native Veo result is `ayodhya-native-temple-source.mp4` (asset `57a6adf2-56f2-4e11-ad84-b4b1d50ef125`). Only source frames **0–96 inclusive** are used. Source frame 108 shows a duplicated river band, so that later footage is rejected. Frame 96 is a clear temple-focused composition. Its clean prefix is retimed to 120 frames / 5 seconds with source progress `2u − u²`, decelerating to the selected endpoint. It is followed by 36 held frames / 1.5 seconds.

The resulting film is **21.5 seconds, 516 frames, 24 fps**, with interface arrival at 20 seconds. There are no editorial crossfades or portal masks. The model's start-frame reconstruction is close but not pixel-identical; validation records the actual join errors. Do not describe the film as geographically exact or free from AI morphing. The native source watermark is preserved in the desktop view; portrait uses a normal subject-following crop.

Portrait opening retains the independently rendered Earth view and gradually narrows its field of view to match the AI clip. The aerial crop moves from centre .50 to .30, then follows the temple to .49. Both dimensions preserve natural proportions: desktop 1280×720, portrait 720×1280. Encoded opening and arrival posters are extracted from their own film rather than the generated target image.

## Generation cost and rejected material

Three 20-credit Flow generations used 60 existing subscription credits. The first Agent-mode attempt reversed the requested direction and is rejected in full (`ayodhya-aligned-descent-source.mp4`). The native Frames interface corrected that assignment. The two accepted native samples cost 40 of those credits. No credit purchase or plan change was made. The latter half of the second native sample is also rejected as described above. No further generation was needed to finish this edit.

## Assembly and verification

`assemble_temple_journey.py` uses FFmpeg for frame trimming, retiming, cropping, silent H.264 encoding and a stationary end hold. NumPy/Pillow inspect decoded frames and make review sheets. It does not invent new scene content. Final encoding is CRF 21 / preset slow, with 6 Mbit/s desktop and 3.8 Mbit/s phone ceilings, yuv420p and fast-start metadata. Sources are hash checked before/after.

Run with Python containing NumPy/Pillow and FFmpeg on PATH:

```sh
python3 scripts/hero-film/assemble_temple_journey.py \
  --wide-clip /path/to/ayodhya-native-descent-source.mp4 \
  --temple-clip /path/to/ayodhya-native-temple-source.mp4 \
  --output /path/outside/repository/composed-clean
```

Local review sources and outputs are preserved at `/Users/divyansh/Projects/Rishabhs/hero-film/aerial-arrival/`. Only the selected six final media files are copied into `public/assets/` under `ayodhya-temple-journey*`. The older public films and rendering scripts remain unchanged.

Validation covers complete decode, dimensions, 24 fps, 516 frames, duration, silent single stream, codec, fast-start atom order, source hashes, boundary frame pixel differences and stationary hold. A synthetic frame counter verifies endpoint retention under retiming. Human review checks dense source prefix frames, both join sheets and responsive live page playback. Four captions use times 0 / 2.4 / 4.4 / 6.4; the page controls appear at 20 seconds. Reduced motion, failed media, blocked autoplay and scrolling retain immediate access to the page.

## Exact submitted native video prompts

### Satellite → wide aerial

One continuous physical camera descent over Ayodhya. Start exactly on first satellite frame. Immediately move downward towards the same city while gently pitching from nadir to the elevated oblique view of the final frame. Camera keeps northward heading, perfectly level horizon, zero roll, no banking, no orbit. The Saryu's river bends and right-side bridge stay continuously tracked in the same landscape; buildings resolve in place as camera approaches. Maintain steady smooth forward/down motion to finish at second frame; natural warm late-afternoon light. Single solid scene, not a map graphic. No cut, dissolve, crossfade, overlay, portal, wipe, marker, text or cloud concealment.

### Wide aerial → temple

One continuous calm physical camera approach over Ayodhya. Start exactly on the first wide aerial frame and immediately move forward and downward, gently tracking laterally toward the temple campus visible in the lower-left city, until the campus becomes prominent in the second frame. Keep the northward heading, level horizon, zero roll, no banking, no spin and no orbit. Saryu remains behind the city in the same upper band; the right-side bridge changes scale gradually. Buildings stay rooted in the landscape; approach the existing temple, do not grow or materialize it out of the ground. Preserve the final frame's architecture with one principal shikhara and surrounding mandapas. Finish with the temple at right-center, arrive at the supplied final view by seven seconds, then ease into a near-still final second. Natural warm late-afternoon light. Single solid scene. No cut, dissolve, crossfade, overlay, portal, wipe, marker, text or cloud concealment.

## Encoded output checks

- Desktop: 13,808,972 bytes; SHA-256 `345cb5cef53bfe34324c431b3a002a982de9fefa5c9f989607fd7967def8f047`. Seam mean RGB errors: 4.046 and 8.443/255. Held-frame difference: 0.147/255.
- Phone: 9,039,190 bytes; SHA-256 `d2726e58c215841c017714c279da74d63304f22ffac2017dda61d9a59d4a3118`. Seam mean RGB errors: 17.450 and 9.000/255. Held-frame difference: 0.125/255.

Both passed full decode, fast-start, dimensions, frame-count and stationary-hold checks. Mobile first-join pixel error is higher because the portrait opening and desktop-derived aerial are independently resampled; the geographic framing was visually reviewed.
