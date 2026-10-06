# Ayodhya visitor guide

A4 landscape, one-page schematic, with roughly 75% landmark map and 25% Vatsalya Bhawan contact panel. The PDF and standalone SVG are drawn from the same geometry in `generate.py`. The current outlined Devanagari initial व is read directly from `public/favicon.svg` and converted losslessly from quadratic to cubic vector curves for both formats. No Roman V, itinerary numbering, roads, travel distances or navigation routes are drawn.

## Verified context

Primary government sources inspected 7 October 2026:

- District Ayodhya, Kanak Bhawan: https://ayodhya.nic.in/tourist-place/kanak-bhawan/ — explicitly places Kanak Bhawan northeast of Ram Janam Bhumi / Ramkot.
- District Ayodhya, Hanuman Garhi: https://ayodhya.nic.in/tourist-place/hanuman-garhi/ — landmark and railway-station context.
- District Ayodhya, Ram Ki Paidi: https://ayodhya.nic.in/tourist-place/ram-ki-paidi/ — confirms the ghats on the Saryu/Sarayu riverfront.
- Ministry of Tourism, Incredible India: https://www.incredibleindia.gov.in/en/uttar-pradesh/ayodhya/72-hours-in-ayodhya — identifies the pilgrimage landmarks and riverfront context.

Supplemental cartographic orientation check: https://mapcarta.com/W736857581 — OpenStreetMap-based Hanuman Garhi position, Kanak Bhavan to its northwest, and Ayodhya Dham railway station to its south. Underlying feature: https://www.openstreetmap.org/way/736857581 . OpenStreetMap attribution: https://www.openstreetmap.org/copyright . No map tiles, street geometry or government photographs were copied.

Property location supplied and verified by the owner task: latitude 26.7857896, longitude 82.2032408, southeast of Ayodhya Dham railway station; Tarun Pura Road, Kaniganj, Ayodhya, Uttar Pradesh 224123. The guide never prints precise coordinates or a distance scale. Geographic relationships are deliberately spread apart for readable labels and the river curve is illustrative.

Property listing: https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9

Directions, encoded in the QR and PDF map links: https://www.google.com/maps/search/?api=1&query=Vatsalya%20Bhawan%2C%20Q6P3%2B883%2C%20Kaniganj%2C%20Ayodhya%2C%20Uttar%20Pradesh%20224123

Website, confirmed by parent after repository creation: https://eye-52.github.io/vatsalya-bhawan/

The sidebar image comes from the authorized existing `public/assets/exterior-cutout.png`; it is an AI-reframed actual building image, explicitly labelled. The original image is unchanged. A proportional alpha thumbnail is embedded for a self-contained SVG and PDF. The QR uses ReportLab's native QR implementation, rendered as vector squares.

## Generate and inspect

Bundled Python with ReportLab and Pillow is sufficient. No dependencies were installed. Generator uses existing Liberation fonts from the bundled runtime; these are embedded/subset for standalone consistency.

```sh
python3 scripts/map-guide/generate.py
pdftoppm -scale-to 1600 -png -singlefile output/pdf/ayodhya-guide.pdf output/pdf/ayodhya-guide-preview
```

Canonical PDF: `output/pdf/ayodhya-guide.pdf`; website delivery copies: `public/assets/ayodhya-guide.pdf` and `public/assets/ayodhya-guide.svg`. Render proof: `output/pdf/ayodhya-guide-preview.png`. Checked all six labels, readable contact information, A4 landscape dimensions, one-page PDF, vector links within page bounds, and valid standalone SVG XML. All links are public Google Maps, the confirmed website or the owner's telephone.

The PDF skill's artifact-operation-start command succeeded exactly once immediately before authoring began, using its bundled `container_tools/mark_artifact_operation_started.mjs` with create / one output / pdf.
