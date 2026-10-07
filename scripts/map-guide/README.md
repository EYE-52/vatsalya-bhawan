# Ayodhya street and walking guide

The old schematic has been replaced with a geographically accurate street guide. `public/assets/ayodhya-guide.pdf` is two A3 landscape pages: hotel/station/riverfront overview and a larger temple-centre street map. `public/assets/ayodhya-guide.svg` is the independently usable overview. Small roads and lanes remain visible, with mapped footways/steps and restricted access distinguished in the legend. Landmark labels, north arrows, metric scales, hotel contact panel and vector QR code are included. The hotel panel uses approximately 17% of the page width.

The shared vector drawing in `generate.py` produces the SVG and PDF. All road polylines, river/pond polygons and selected temple footprints are actual OpenStreetMap geometries. The local equirectangular projection uses the cosine of the map's centre latitude and equal horizontal/vertical metre scale; no landmark is moved to fit labels. Clipping changes only where a geometry crosses the map boundary. Rendering stroke widths express street hierarchy, not surveyed widths. There are no invented paths, straight-line itineraries, travel times, or access guarantees.

## Source snapshots and licensing

Retrieved **7 October 2026** using the public OpenStreetMap API (the Overpass endpoint rejected the original request, so it is not a source of this output):

- `data/osm-api-map.osm`: https://www.openstreetmap.org/api/0.6/map?bbox=82.184,26.782,82.218,26.813
- `data/osm-river.osm`: https://www.openstreetmap.org/api/0.6/relation/8921902/full

The full river relation supplies all its outer and inner rings before geographic clipping. Its mapped name is Ghaghara, locally labelled Sarayu. The two raw snapshots are preserved so regeneration is deterministic and offline. `fetch_osm.py` is an explicit refresh command, separate from rendering.

Map data **© OpenStreetMap contributors**. Attribution: https://www.openstreetmap.org/copyright . Data is provided under the **Open Database License 1.0**: https://opendatacommons.org/licenses/odbl/1.0/ . The clipped GeoJSON and OSM-derived landmark-position data are derivative databases supplied under ODbL 1.0; its `metadata` contains source URLs, retrieval date, attribution and licence. Keep the visible attribution in printed and online uses. No proprietary map tiles or imagery are copied.

## Landmark positions and current names

The landmark identities and geographic context were checked against district administration sources:

- Hanuman Garhi: https://ayodhya.nic.in/tourist-place/hanuman-garhi/
- Kanak Bhawan: https://ayodhya.nic.in/tourist-place/kanak-bhawan/
- Ram ki Paidi: https://ayodhya.nic.in/tourist-place/ram-ki-paidi/
- Ayodhya Dham station naming: https://ayodhya.nic.in/how-to-reach/ and https://www.pmindia.gov.in/en/news_updates/pm-inaugurates-ayodhya-dham-junction-railway-station/
- Ram Path and Janmabhoomi Path naming: Ayodhya Development Authority's 16 January 2024 Ram Path signage RFP, page 13, https://pmoay.com/ayodhyann/upload/news/2024/jan/1705492919DOC_compressed.pdf . The document identifies Ram Path from Lata Mangeshkar trijunction toward Sahadatganj, and its connections to Janmabhoomi Path and Bhakti Path. OSM still names the mapped main corridor Chowk Ayodhya Road; the raw `name` is preserved and `display_name` explicitly provides the newer name. Bhakti Path is not labelled because an exact named OSM way could not be verified.

Specific map positions come from these pinned OSM objects:

| Place | Coordinate source |
| --- | --- |
| Shri Ram Janmabhoomi Mandir | Actual current temple-building footprint centroid, https://www.openstreetmap.org/way/1241983860 |
| Hanuman Garhi | Temple footprint centroid, https://www.openstreetmap.org/way/736857581 |
| Kanak Bhawan | Building footprint centroid, https://www.openstreetmap.org/way/843831315 |
| Ram ki Paidi | Mapped water-complex centroid, https://www.openstreetmap.org/way/260795620 |
| Ayodhya Dham Junction | Station node, https://www.openstreetmap.org/node/6951223212 |
| Dashrath Mahal | Footprint centroid, https://www.openstreetmap.org/way/843831292 |

Vatsalya Bhawan's property position, latitude **26.7857896**, longitude **82.2032408**, was verified from property listings in the earlier project work, including https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9 . Address: Tarun Pura Road, Kaniganj, Ayodhya, Uttar Pradesh 224123. Phone: +91 94513 38729.

Temple pins locate buildings, **not verified public visitor gates**. A precise current visitor-entry coordinate was not available from the consulted primary sources, so none is invented. The guide displays the real Janmabhoomi Path approach but does not promise that every mapped temple path is open. PDF landmark links use named Google destinations with `travelmode=walking`, allowing Google to determine the arrival route. The hotel QR uses the verified hotel coordinates and `travelmode=walking`, with no fixed origin. Follow current entry signs. Google routes and local restrictions can change.

## Web data contract

`public/assets/ayodhya-streets.geojson` is a FeatureCollection with 804 features, including 774 road/path features. Extent is `[82.184, 26.782, 82.218, 26.813]`, in longitude/latitude order. Roads/rail use LineString or MultiLineString, water uses Polygon. Properties include `id` (OSM type/id), `kind` (`road`, `rail`, `water`), `class`, `name`, and mapped `access`, `foot`, `surface`, `oneway`, `bridge`, `tunnel`, `bicycle` where present. The river retains its real outline and any intersecting inner polygons. Roads are not a routing graph; absence of an access restriction is not evidence of public access.

`public/assets/ayodhya-places.json` is an array of `{id, name, lat, lon, kind, query, info}`. IDs are `hotel`, `ram-mandir`, `hanuman-garhi`, `kanak-bhawan`, `ram-ki-paidi`, `ayodhya-dham`, `dashrath-mahal`. `query` is the Google walking destination string. Do not replace a temple query with its building-centroid coordinate for routing.

## Reproduce and inspect

Use the bundled Python runtime (ReportLab, Pillow and pypdf already available) and system Poppler. No new dependency is required.

```sh
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/map-guide/prepare_data.py
/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/map-guide/generate.py
pdftoppm -scale-to 1800 -png public/assets/ayodhya-guide.pdf /tmp/ayodhya-guide
```

Inspect **both** rasterised pages after an edit. Fonts are embedded in the PDF; the SVG uses standard Arial/Georgia fallbacks. The QR and street network are vector content. All clickable PDF rectangles use physical page coordinates despite the drawing's vertically flipped coordinates.

The PDF skill's artifact-operation marker succeeded once before authoring: edit / one output / pdf. The canonical copy is kept in `output/pdf/ayodhya-guide.pdf`, identical to the public copy; both current page render proofs are in `output/pdf/ayodhya-guide-preview-1.png` and `output/pdf/ayodhya-guide-preview-2.png`. Latest verification checks include PDF page count/dimensions, hyperlinks using walking mode, extractable labels, standalone SVG XML validity and visual inspection of both Poppler renders.
