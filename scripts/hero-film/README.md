# Ayodhya atmospheric journey

15 seconds, 24fps, no audio, titles, logos or embedded captions. `journey.mp4` is 1280×720; `journey-mobile.mp4` is a separately rendered 720×1080 perspective view, not a stretched desktop video. H.264, yuv420p, fast-start MP4.

## Timeline for interface stage labels

- 0–2 seconds: Earth, with Asia facing the camera.
- 2–4.2 seconds: Asia; slow orbit and approach.
- 4.2–7.4 seconds: India. Locator begins appearing at 6 seconds.
- 7.4–9.7 seconds: Ayodhya. Camera converges on latitude 26.7857896, longitude 82.2032408.
- 9.7–11.7 seconds: soft atmospheric dissolve from geographic satellite context into the approved artist impression.
- 11.7–15 seconds: Ayodhya artist impression, gentle crop drift and hold.

`poster.jpg` and `poster-mobile.jpg` match the final artwork framing. Use them for the final hold and reduced-motion display. `globe-poster.jpg` and `globe-poster-mobile.jpg` match the opening view. `contact-sheet.jpg` shows representative desktop frames.

Playback should run once and hold the last frame; replay can restart explicitly. Desktop and portrait videos share timings. Use native `object-fit: cover`; never scale width and height independently. The portrait composition retains the full globe in the opening shot and centers the final locator.

## Sources and attribution

Earth texture: NASA Earth Observatory, Blue Marble: Next Generation, July 2004 with topography. Monthly satellite composite, not live imagery. The renderer maps longitude/latitude onto a perspective ray-intersected sphere with bilinear sampling, light shading and a thin atmospheric rim. Regional imagery comes from the same 21600×10800 source. No political borders or city-level map detail is implied.

Primary source and download listing: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/

Exact source asset: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x21600x10800.jpg

NASA media usage guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/

NASA should be acknowledged as the source of Earth imagery. Do not imply NASA endorsement of the property. No NASA marks or identifiable people appear. Suggested factual website credit: **Earth imagery: NASA Blue Marble. Ayodhya aerial: artist impression.**

Final aerial source: existing approved website asset `public/assets/ayodhya-aerial.jpg`, copied here under `assets/ayodhya-aerial.jpg`. This image is an artist impression and is deliberately introduced by a dissolve; it is not georeferenced satellite imagery, a true city map or an actual property view.

## Reproduction

Requires existing Python with NumPy and Pillow, plus ffmpeg with libx264. No additional dependency was installed for production.

```sh
python3 render.py --preview
python3 render.py
python3 render.py --portrait
```

Production Python used: `/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.

To prepare the source files, run from this directory:

```sh
mkdir -p assets
curl -L 'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x21600x10800.jpg' -o assets/blue-marble-july-2004.jpg
cp ../../public/assets/ayodhya-aerial.jpg assets/ayodhya-aerial.jpg
```

Generated films are published as `public/assets/ayodhya-journey.mp4` and `public/assets/ayodhya-journey-mobile.mp4`. Source textures and intermediate render outputs are deliberately excluded from Git.

The renderer streams frames into ffmpeg and saves posters. Edit the trajectory only when location and timings are intentionally changed. Texture source dimensions and regional crop are fixed to the referenced equirectangular source. A black space background and restrained stars are procedural motion-graphic elements.
