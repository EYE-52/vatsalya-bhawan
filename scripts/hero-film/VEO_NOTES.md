# Final Ayodhya hero film

## Chosen generation and provenance

Final source: `/Users/divyansh/Downloads/Camera_descending_through_clouds…_20261007042337.mp4`.

Generated through Google Flow, **Veo 3.1 Fast, 20 existing credits**, in the project identified by prefix `27ffa…` (generation details supplied by the parent task). The first Veo 3.1 Quality candidate cost 100 existing credits and was discarded because its globe descent showed a double exposure and its tail dissolved into a second city composition. **Total generation spend: 120 existing credits.** No extra generation occurs in preparation.

Original chosen download: 8.000 seconds, 192 frames, 1280×720, 24fps, H.264 with AAC audio, 5,124,396 bytes. Original download remains unchanged and outside the repository.

This is **AI cinematic artwork**, not actual satellite navigation, geographically reliable footage, a documentary city view or an actual property view. Dense clouds hide the generated change in scale and geography. The eventual city follows the approved aerial mood/reference. No NASA/Google Maps accuracy or endorsement is implied by this generated film. The existing small Veo mark is preserved where the desktop frame includes it; no new text or branding is embedded.

## Inspection and retained duration

Inspected the cloud passage at quarter-second intervals from 0.8–2.55 seconds. Opaque clouds conceal the problematic globe-to-ground transformation. The city becomes visible around 2.6–3 seconds; use **3.6 seconds** as the interface's clear arrival threshold.

Inspected the tail at quarter-second intervals from 6.5–7.75 seconds and the exact final encoded frame. No unwanted late dissolve or second-scene outline appears. **Retain the full eight seconds, source frames 0–191.** Source frame 191 occurs at 7.9583333 seconds. The film is one generated shot; preparation adds no cuts, crossfades, still frames, speed changes or extra footage.

## Website assets

Prepared files under `public/assets/`:

- `ayodhya-journey.mp4`: 1280×720 desktop film, full eight seconds.
- `ayodhya-journey-mobile.mp4`: 720×1280, same shot/timing with continuous portrait reframing.
- `ayodhya-globe.jpg` and `ayodhya-globe-mobile.jpg`: first frames extracted from the respective final encoded films.
- `ayodhya-arrival.jpg` and `ayodhya-arrival-mobile.jpg`: exact final frame selections extracted from the respective final encoded films. Hold the video's last frame or display the matching arrival poster on completion.

Both videos are silent H.264 CRF 21, yuv420p, 24fps, fast-start MP4. Play once; replay can restart explicitly. Native `object-fit: cover` preserves proportions.

Mobile starts with a proportionally scaled 960×540 source frame centered in portrait space, preserving the full opening globe. A smoothstep scale continuously expands to 2276×1280 over the first 1.2 seconds, then a 720×1280 crop follows the original cloud passage and city shot. During the opaque clouds from 2.0–3.2 seconds, its source center smoothly shifts from x640 (50%) to x840 (65.625%), keeping the complete main temple spire inside the portrait window. The near-black padding matches the median opening source edge (#020A0D), preventing an obvious rectangular inset. No new shot or generated mobile material is used.

Approved `ayodhya-aerial.jpg` remains unchanged. The final hold is selected from the chosen video's last encoded frame, so it matches the movie's final framing.

## Reproduction and validation

Requires Python 3 and ffmpeg/ffprobe with libx264; no new dependency was installed.

```sh
python3 scripts/hero-film/prepare_veo.py --source /path/to/chosen-flow-download.mp4
```

Optional `--output /path/to/assets` selects another output directory. `--mobile-only` updates only the mobile video and its first/last-frame posters, preserving desktop files. The script extracts frame 0 and frame 191 after encoding, fully decodes both films and checks 192 frames, eight-second duration, H.264/yuv420p, 24fps, absence of audio and fast-start atom placement. Raw source clips, source textures and inspection frames are not committed; local work lives outside the repository under `hero-film/`.
