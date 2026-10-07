# Ayodhya skyline arrival reveal

The 15-second film retains the approved real geographic journey, then makes one restrained, eased dissolve into the earlier warm Ayodhya skyline image. The first 252 frames (0–10.5 seconds) are taken from the existing geographic movie without changing its camera, geography, crop, or stage timing. The source movie is decoded for composition and the result encoded once; the original geographic asset remains unchanged.

## Timeline

- **0–3 seconds:** Jambudvipe / Earth.
- **3–5.5 seconds:** Bharatakhande / India.
- **5.5–8 seconds:** Aryavarte / northern India.
- **8–10.5 seconds:** the real Ayodhya satellite approach.
- **10.5–12.5 seconds:** smoothstep dissolve from the final geographic view to the warm skyline.
- **12.5–15 seconds:** completely settled skyline hold. Website arrival threshold: **12.5 seconds**.

No new globe render, generated image, inserted text, cloudy wipe, map tile overlay, geometric morph, or black intermediary is used. The final scene is an **artist impression**, introduced as an editorial dissolve rather than claimed as a continuation of real satellite photography. Geographic-source provenance remains in `GEOGRAPHIC_NOTES.md`. Image disclosure/credits belong in provenance and the footer rather than additional headline copy.

## Existing source and crops

Geographic sources: `public/assets/ayodhya-geographic.mp4` and `ayodhya-geographic-mobile.mp4`, 13 seconds, 24 fps. Their file hashes are checked before and after composition to confirm no source mutation.

Skyline source: the existing approved **`public/assets/ayodhya-aerial.jpg`**, 1672×941. It is reused without new generation or alterations to its architecture.

Desktop is a natural central 16:9 cover crop at 1280×720. Portrait is an independently composed 720×1280 movie using a proportional full-height image crop centred at source x1070: approximately **x805.34–1334.66**, y0–941. This retains the dominant temple near x1130 on the right and river context on the left. Both final crops are static, so the final movie hold and matching poster have the same framing.

## Output and reproduction

New website assets:

- `ayodhya-reveal.mp4`, `ayodhya-reveal-mobile.mp4`
- `ayodhya-reveal-globe.jpg`, `ayodhya-reveal-globe-mobile.jpg`
- `ayodhya-reveal-arrival.jpg`, `ayodhya-reveal-arrival-mobile.jpg`

Movies are **15 seconds, 24 fps, 360 frames**, silent H.264/yuv420p with fast-start MP4 layout. First and arrival posters are extracted from the encoded movies at frames **0** and **359**.

```sh
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/finish_reveal.py
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/finish_reveal.py --portrait
```

The composer uses the existing bundled Python/Pillow/NumPy and ffmpeg; no dependency is installed. QA files default to **`/Users/divyansh/Projects/Rishabhs/hero-film/reveal/`**, outside the repository. `--qa` selects another local QA directory.

The composer fully decodes each movie and checks dimensions, one video stream with no audio, 360 frames, 24 fps, 15-second duration, H.264/yuv420p, fast-start layout, and source hashes. It compares the first settled frame with the last frame and the last encoded frame with its JPEG poster, allowing only normal codec/JPEG error. Validation records include measured errors, byte sizes, and source hashes.

Contact sheets show Earth, India, northern India, the Ayodhya approach and five transition points at **10.5, 11, 11.5, 12, 12.5 seconds**, followed by the last encoded frame. Timestamped desktop and portrait frames and the final skyline crops are retained for visual review alongside `validation.json` and `validation-mobile.json`.

## Verified output

Both completed films passed the listed checks and visual review of the contact sheets, five transition points, and final portrait framing. Desktop is **10,654,546 bytes**; portrait is **10,219,966 bytes**. The five transition frames show the expected brief double exposure of an eased editorial dissolve, with neither a hard cut nor a black frame. Final holds are completely settled on the original warm skyline crop.

Mean RGB difference between the first settled frame and last frame is **0.412/255 desktop**, **0.377/255 portrait**, reflecting normal predictive codec error. The final JPEG poster differs from the decoded last frame by only **2.108/255 desktop**, **1.897/255 portrait**. Posters were extracted directly from their final encoded movie frames. Original geographic movie hashes remain unchanged.
