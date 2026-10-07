# Earth to the shikhara — 7 October 2026

The current hero is a 7.292-second journey from Earth through real Ayodhya satellite geography into an AI interpretation of Ram Mandir's upper shikhara and saffron flag. The user requested a faster geographic section, a straight approach and a close architectural finish. The previous long, sideways temple approach is superseded.

## Selected frames and timing

1. `render_temple_geographic.py` retains the registered NASA/Copernicus camera trajectory and targets the actual temple at 26.7957774°N, 82.1942075°E. Source attribution remains in `CONTINUOUS_NOTES.md` and `GEOGRAPHIC_NOTES.md`. The native render is 15 seconds; frames 0–300 (ending at 12.5 seconds) are retimed to 55 output frames, or 2.292 seconds. Its last desktop footprint is 2.53 × 1.42 km. The final overhead reference is `temple-centered-geographic/temple-centered-end.jpg`.
2. The close endpoint was generated from the completed-temple shikhara photograph credited to the Prime Minister's Office via PIB, GODL-India. It focuses on the ribbed sandstone summit, gold crown and saffron flag, with the lower temple outside the frame. Exact prompt and saved file are in `TEMPLE_IMAGE_PROMPTS.md`; reference details are in `TEMPLE_REFERENCE_SOURCES.txt`.
3. Flow's native Video → Frames interface explicitly assigned the geographic endpoint to Start and `ayodhya-shikhar-flag-final.png` to End. Veo 3.1 Fast generated one 8-second, 192-frame clip: `ayodhya-shikhar-final-native-source.mp4`. All source frames are retimed into 84 output frames (3.5 seconds). Both exact source endpoints are retained.
4. Another 36 frames (1.5 seconds) hold the actual decoded final frame. Arrival begins at frame 139 / 5.792 seconds. No additional optical zoom, crossfade, portal or overlay is applied.

Total: 175 frames, 24 fps, 7.292 seconds. Both desktop 1280×720 and portrait 720×1280 use the same timing. The portrait opening preserves its independent Earth composition, then narrows its field of view to match a central crop of the native video. It does not pan sideways to follow the temple. Posters are extracted from each encoded film. Media begins below the header and uses top alignment so the flag remains visible on phones and wide screens.

## Scope of realism and review

This is an AI artistic transition, not real drone footage or surveyed 3D geometry. Early satellite detail resolves into reconstructed buildings; roof, temple and surrounding city details may differ from reality. The final flag moves while the generated camera settles. Full-frame and dense early/middle/late review found a centred approach with a gradual tilt toward the horizon, without the previous sideways entrance, roll, portal, duplicate landscape band or abrupt scene replacement. Native reference errors were 3.40/255 at the start and 2.90/255 at the end. These do not establish geographic accuracy.

The source watermark remains in the desktop frame. Portrait framing uses a normal central crop. Footer credits identify the AI interpretation, NASA/Copernicus geography, Google Maps references and completed-temple architectural reference.

## Interface

Navigation, headline, enquiry buttons and other content remain visible and interactive during playback. The short background film is silent and plays once, with pause/replay and a direct restart. Media-time captions are: 0 seconds “जम्बूद्वीपे / Jambudvīpe”; 0.65 “भारतखण्डे / Bhāratakhaṇḍe”; 1.15 “आर्यावर्ते / Āryāvarte”; 1.7 “अयोध्या नगरी / Ayodhya Nagari”. Captions finish at 139/24 seconds. Reduced motion, blocked autoplay, media failure and scrolling retain immediate access to the page. The end poster matches the final encoded frame.

## Assembly and verification

`assemble_temple_journey.py` uses FFmpeg to retime, crop and encode silent H.264 with a stationary end hold. NumPy/Pillow inspect decoded frames and produce contact sheets. It does not generate new scene content. Encoding uses CRF 21 / preset slow, 6 Mbit/s desktop and 3.8 Mbit/s phone ceilings, yuv420p and fast-start metadata. Sources are hash checked before and after.

```sh
python3 scripts/hero-film/assemble_temple_journey.py \
  --descent-clip /path/to/ayodhya-shikhar-final-native-source.mp4 \
  --opening-dir /path/to/temple-centered-geographic \
  --output /path/outside/repository/shikhar-composed
```

Local sources are preserved under `/Users/divyansh/Projects/Rishabhs/hero-film/`. Six selected delivery assets are copied into `public/assets/` under `ayodhya-shikhar-journey*`. Older media and renderers remain available as historical assets but are not referenced by the homepage.

Verification covers complete decode, dimensions, frame rate/count, duration, silent single stream, codec, fast-start atom order, source hashes, encoded-poster match, boundary differences and stationary hold. Synthetic frame counters verify that both exact source endpoints survive fast retiming. Source motion and desktop/portrait seam sheets receive visual review; local and deployed pages are checked at desktop and phone sizes.

## Exact submitted native video prompt

One continuous straight forward push toward the existing central temple. Start exactly on the first overhead satellite view of its white campus. Keep the principal temple axis centered from the first resolvable view. Steadily descend the camera and gently tilt toward the horizon, approaching the upper ribbed shikhara, golden crown and full saffron flag until the close view exactly matches the final frame. The temple gains detail in place and remains the same solid structure. Fixed heading, level horizon, no lateral movement or entry, no yaw, roll or orbit. Preserve the ribbed shikhara, golden kalash and saffron flag. Arrive by seven seconds, then settle almost still. No ghost image, wipe, cut, crossfade or superimposed building.

## Cost and rejected attempts

This revision used 40 existing subscription credits: 20 for the rejected `ayodhya-centered-v2-native-source.mp4`, which rolled and swapped scenes, and 20 for the selected shikhara clip. No credit purchase or plan change was made. The earlier three trials used 60 credits in the preceding revision. Their long two-clip assembly and sideways temple entry are superseded; source material is preserved. The larger whole-facade endpoint was also rejected in favour of the shikhara and flag.

## Encoded results

- Desktop: 4,292,329 bytes; SHA-256 `294460ead84970ebe30235328dfa99450ceda864aadb4a86da2adb38ef5846d6`. Geographic-to-AI seam mean RGB difference 1.030/255; stationary hold difference 0.067/255.
- Phone: 3,091,025 bytes; SHA-256 `a1d422956292bb4869635859a7a522f8251c95576a67201e02147821ea959040`. Geographic-to-AI seam mean RGB difference 5.429/255; stationary hold difference 0.240/255.
