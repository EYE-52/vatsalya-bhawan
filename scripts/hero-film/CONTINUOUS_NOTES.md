# Continuous zoom into real Ayodhya

This documents the satellite-only version, retained as the geographic opening of the newer temple journey. The user subsequently requested an AI aerial continuation and a temple-focused ending; see `TEMPLE_NOTES.md`. This archived film remains over actual registered satellite geography from Earth to the final overhead Ayodhya view. It contains no artistic skyline, generated passage, dissolve, cut, portal, FPV flight, roll, orbit, map markers, or embedded labels. No further generation credits were used.

## Camera and timing

`render_continuous.py` reuses the original geographic renderer's textures, perspective sphere projection, lighting, and portrait field of view. The original `render_geographic.py` and its 13-second public media remain unchanged and reproducible. The opening camera coordinates and distance are identical through 8 seconds; the former locator drawing is omitted throughout the new film.

Caption stage times remain **0 / 3 / 5.5 / 8 seconds** for Jambudvipe, Bharatakhande, Aryavarte, and Ayodhya. From 8 to **12.5 seconds**, one fixed-heading, level, north-up nadir camera continues approaching **26.799°N, 82.204°E**. Its altitude follows an eased logarithmic curve from 0.045 to 0.0013 Earth radii. There is no pause at the old 10.5-second arrival. The camera decelerates smoothly and is completely stationary from **12.5–15 seconds**. Frontend arrival threshold: **12.5 seconds**.

The final desktop view covers approximately **8.4 × 4.7 km**. The independently rendered portrait view covers approximately **4.0 × 7.0 km**. These footprints retain the Saryu, its sand bars, and central Ayodhya rather than pushing into unsupported building detail. Desktop is 1280×720; portrait is 720×1280, with identical camera timing and geographic centre. Both are silent H.264/yuv420p, **24 fps, 360 frames, exactly 15 seconds**, with fast-start metadata.

## Source imagery and credits

Sources retain NASA Blue Marble July 2004 for Earth and broad India, and clear Copernicus Sentinel-2 Level-2A true colour acquired **17 May 2026** for the closer Ayodhya region and city. An additional real **15–17 May 2026** regional mosaic resolves the previously soft 8–9.5-second section. Its 4096×3584 output covers approximately **402 × 351 km**, with endpoint pixel-centre bounds **80.18–84.23°E, 25.22–28.38°N**. It uses actual **80 m TCI overviews**, prefers clear May 17 core pixels, and fills swath overlap with May 15/16 acquisitions. Validation found **zero uncovered and zero black-gap pixels**. No AI sharpening, generated features, or scene colour adjustment was applied. Sparse clouds at the outer Himalayan edge are actual source imagery.

The existing closer regional mosaic uses 40 m source overviews; the final city patch retains **10 m source detail**, bilinearly resampled. Individual roofs and buildings are not invented or enhanced. This is a rendered geographic camera journey, not surveyed low-altitude flight footage or live imagery.

Full source URLs, licensing and crop provenance remain in `GEOGRAPHIC_NOTES.md`, the external `hero-film/geographic/assets/active-sources.json`, and the new separate `hero-film/continuous/assets/broad-sources.json`. An audit copy of the broad provenance is checked in beside this note as `scripts/hero-film/broad-sources.json`. It records all exact acquisition times, scene IDs, overview URLs, coverage and cloud checks, without changing the legacy source manifest. The city scene is `S2C_T44RPQ_20260517T051310_L2A`, with north-up pixel-centre bounds 82.04–82.36°E, 26.69–26.93°N. All texture levels sample the same longitude/latitude. Finer levels resolve gently only after their feathered interiors contain the full viewport; no scene is replaced and no tile rectangle is exposed. The broad mosaic uses a 3% feather, entering before the 8-second Ayodhya stage.

Website credit: **Earth imagery: NASA Blue Marble. Contains modified Copernicus Sentinel data 2026.**

## Reproduction and verification

Run from the website repository using the bundled Python with NumPy and Pillow, plus ffmpeg:

```sh
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_continuous.py --preview
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_continuous.py --portrait --preview
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_continuous.py
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_continuous.py --portrait
```

Default output and visual evidence stay outside Git at `/Users/divyansh/Projects/Rishabhs/hero-film/continuous/`. `--output` selects another output directory. `--broad-manifest` can select the separate broad texture manifest; its default is `hero-film/continuous/assets/broad-sources.json`, loaded when present. Public assets are copied separately after review: `ayodhya-continuous[-mobile].mp4`, plus `ayodhya-continuous-{globe,arrival}[-mobile].jpg`. The verified initial render without the broader mosaic is preserved locally under `baseline/`.

Verification checks the original basis/sampler, camera continuity at 8 seconds, fixed city coordinates, strictly decreasing camera distance through 12.5, and a stationary final pose. Each encoded film is fully decoded and checked for a single video stream, dimensions, frame count, duration, codec, pixel format, and fast-start atom order. Posters come from decoded encoded frames **0 and 359**. Frames **300 and 359** are compared to verify the settled hold; validation JSON records the pixel error, film size, and SHA-256. Timestamped desktop and portrait contact sheets and full-size final preview frames document the source geography and city/river context.

Production verification completed on 7 October 2026. Desktop is **17,865,571 bytes**; portrait is **16,871,936 bytes**. Both passed full decode and all listed checks. Held encoded frames differ by only **0.399/255** and **0.369/255** mean pixel value respectively because of lossy H.264 quantization. Arrival posters differ from the final decoded frame by less than **1.3/255** mean pixel value after JPEG encoding. All six public copies were SHA-256 compared with the validated local outputs. Actual encoded QA is retained as `encoded-contact-sheet[-mobile].jpg`, with a denser `resolution-approach-sheet.jpg` covering the new regional texture's entry. Source/renderer hashes are in `source-sha256.json`; validation metadata is in `validation[-mobile].json`.
