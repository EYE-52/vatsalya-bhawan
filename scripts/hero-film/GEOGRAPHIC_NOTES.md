# Real geographic Ayodhya journey — base film

This documents the preserved geographic source film. The website now uses a 15-second continuous geographic approach that descends further into real Ayodhya and holds the same city view; see `CONTINUOUS_NOTES.md` for the current camera and reproduction steps. The source geography and attribution below are unchanged.

The replacement uses one continuous perspective camera over a textured sphere. It shows real Earth, India, northern India, and Ayodhya at **26.799°N, 82.204°E**. There are no invented borders, embedded place names, AI ground imagery, cloud wipes, cuts, or artist-impression dissolves. The small gold locator is mathematically projected from the same city coordinates.

## Timing and framing

- **0–3 seconds:** Earth / Jambudvipe; Asia faces the camera.
- **3–5.5 seconds:** Bharatakhande; recognizable whole India, with a slow approach during the early part of the interval.
- **5.5–8 seconds:** Aryavarte; Himalayas and northern plains, approaching eastern Uttar Pradesh.
- **8–10.5 seconds:** Ayodhya; approach to the city locator. The finer actual city imagery resolves as its geographic extent contains the complete viewport.
- **10.5–13 seconds:** clear final city and Sarayu river view, held on the final camera frame. Website arrival threshold: **10.5 seconds**.

Both films are **13 seconds, 24 fps, 312 frames**. Desktop is **1280×720**; portrait is independently rendered at **720×1280**, rather than cropped or stretched. Both follow identical geographic centre, camera distance, and timing. Their vertical fields of view are 32° and 46° respectively, retaining the whole opening globe and useful whole-India framing on portrait. The final desktop footprint is approximately **15.6×8.8 km**, centred on Ayodhya; portrait retains a taller view of the city and river. This is satellite cartography rendered as a camera journey, not a street-level or actual property aerial film.

## Actual imagery and attribution

Global and broad regional imagery: **NASA Blue Marble: Next Generation, July 2004, with topography**, an equirectangular 21600×10800 satellite composite. The globe uses a reduced global texture plus a full-resolution regional inset from the identical source. The imagery is a historical monthly composite, rather than live footage.

- NASA source: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/
- Exact image: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x21600x10800.jpg
- NASA media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/

Final regional and city imagery: **Copernicus Sentinel-2 Level-2A, acquired 17 May 2026**, true-colour data with 10 m source resolution. The city scene is **S2C_T44RPQ_20260517T051310_L2A**; regional crops mosaic same-date tiles 44RNQ, 44RPQ, 44RNR, and 44RPR as needed. The patches are reprojected north-up into longitude/latitude, with bilinear resampling and JPEG encoding. The widest regional crop reads 40 m source overviews; the final city crop retains 10 m detail. Actual city ground and the river are visible; no ground detail is synthesized.

- City scene metadata: https://earth-search.aws.element84.com/v1/collections/sentinel-2-c1-l2a/items/S2C_T44RPQ_20260517T051310_L2A
- Catalog documentation: https://github.com/Element84/earth-search
- Sentinel legal notice: https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice

Required Sentinel acknowledgement: **Contains modified Copernicus Sentinel data 2026**. Suggested website film credit: **Earth imagery: NASA Blue Marble. Contains modified Copernicus Sentinel data 2026.** These credits do not imply agency endorsement of Vatsalya Bhawan.

The widest crop is 4096×3260 with pixel-centre bounds **81.55–82.87°E, 26.30–27.35°N**, approximately 132×117 km. It resolves the real city region earlier in the descent. The intermediate crop is 4096×3072 with bounds **81.956–82.466°E, 26.59–27.01°N**. The city crop is 3072×2304 with bounds **82.04–82.36°E, 26.69–26.93°N**. Crops were checked visually for clear city and river context, and against the source Scene Classification Layer for cloud and shadow at both the city and property coordinates. No clouds or cloud shadows occur in their checked immediate neighbourhoods.

Texture levels use exactly the same projected geographic coordinates. Sentinel levels enter only when their feathered bounds contain the whole visible frame; a gentle level-of-detail blend then increases resolution while the camera continues. This avoids a visible sharp tile rectangle over a blurred globe. The widest patch feathers at 6% of its bounds; the closer patches feather at 16%. NASA bounds represent pixel edges; the reprojected Sentinel bounds represent pixel centres, and the sampler accounts for that distinction.

## Assets and reproduction

Static source files and outputs stay outside the Git repository in **`/Users/divyansh/Projects/Rishabhs/hero-film/geographic/`**. Its `assets/active-sources.json` is the active provenance manifest; the renderer uses only the recent Sentinel patches listed there, plus the NASA source at `../assets/blue-marble-july-2004.jpg`. The acquisition/cropping records are also retained under `/tmp/rishabhs-satellite-assets/`.

Renderer dependencies are the existing bundled Python, NumPy, Pillow, and ffmpeg. Satellite preparation used task-local geospatial tools to reproject public data; it adds no website or renderer dependency.

```sh
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_geographic.py --preview
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_geographic.py --portrait --preview
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_geographic.py
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/hero-film/render_geographic.py --portrait
```

`--work` selects another local asset/output directory. Full encoding outputs `ayodhya-geographic.mp4` and `ayodhya-geographic-mobile.mp4`; first/last encoded-frame posters use `ayodhya-geographic-globe[-mobile].jpg` and `ayodhya-geographic-arrival[-mobile].jpg`. Timestamped preview frames and contact sheets are retained alongside the movies.

The renderer checks basis geometry, camera continuity at stage boundaries, and bilinear sampling, then fully decodes each encoded film and verifies dimensions, 312 frames, 24 fps, 13-second duration, silent H.264/yuv420p, and fast-start atom placement. Final verification metadata is written as `validation[-mobile].json` after successful production rendering.

Production verification completed on 7 October 2026 for both films. Desktop is **10,061,407 bytes**; portrait is **9,906,273 bytes**. Both decoded completely and passed all listed checks. The first and last posters were extracted from frames 0 and 311 of the encoded movies, rather than substituted raw render images. Final encoded arrival posters were visually checked for real city/river context and absence of tile margins. Website public assets are updated separately only after review.

## Discarded sources

EOX Sentinel-2 cloudless **2016**, CC BY 4.0, was investigated and downloaded locally. Its Ayodhya crop contains conspicuous real cloud cover, so **none of those EOX textures is used in the final renderer manifest**. That historical mosaic also predates the modern Ram Mandir. EOX documentation and licensing: https://cloudless.eox.at/pricing .

Rejected Veo attempt: `/Users/divyansh/Downloads/Geographical_zoom_to_Ayodhya_20261007055746.mp4`, generated in Google Flow project `27ffa8dd-66d9-4e8a-95ac-5e1ba7b1347e` using **Veo 3.1 Fast, 20 existing credits**, 8 seconds at 24 fps / 1280×720. It drifted toward East/Southeast Asia, introduced invented borders and garbled labels, then cut to the artist city. It will not be published. The geographic replacement uses no further generation credits.
