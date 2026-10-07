"""Build a real, broad Sentinel TCI texture using HTTP-range 80m COG overviews.

Run with the existing satellite rasterio venv. Outputs stay outside public assets.
The saved STAC snapshots make scene selection and attribution reproducible.
"""
from pathlib import Path
import argparse
import json
import urllib.request
from datetime import datetime, timezone

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.vrt import WarpedVRT
from affine import Affine
from PIL import Image

BBOX = (80.18, 25.22, 84.23, 28.38)
SIZE = (4096, 3584)
DEFAULT_OUTPUT = Path(__file__).resolve().parents[3] / 'hero-film/continuous/assets'


def prepare(output):
    snapshot = output / 'wide-candidates.json'
    if not snapshot.exists():
        query = {'collections': ['sentinel-2-c1-l2a'], 'bbox': list(BBOX),
                 'datetime': '2026-05-15T00:00:00Z/2026-05-19T23:59:59Z', 'limit': 1000}
        request = urllib.request.Request('https://earth-search.aws.element84.com/v1/search',
                                         data=json.dumps(query).encode(), headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=60) as response:
            snapshot.write_text(json.dumps(json.load(response)))
    candidates = json.loads(snapshot.read_text())['features']
    scenes = [scene for scene in candidates
              if any(date in scene['id'] for date in ('20260515', '20260516', '20260517'))]
    # Broad fallback first; same-day central imagery has priority. Cloud-free pixels
    # beat cloudy pixels in real overlapping scenes without inventing image detail.
    scenes.sort(key=lambda scene: scene['properties']['datetime'])
    width, height = SIZE
    west, south, east, north = BBOX
    dx, dy = (east - west) / (width - 1), (north - south) / (height - 1)
    transform = Affine(dx, 0, west - dx / 2, 0, -dy, north + dy / 2)
    rgb = np.zeros((3, height, width), dtype=np.uint8)
    classification = np.zeros((height, width), dtype=np.uint8)
    score = np.full((height, width), np.inf, dtype=np.float32)
    ownership = np.full((height, width), -1, dtype=np.int16)
    records = []
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif',
                      GDAL_HTTP_MAX_RETRY=3, GDAL_HTTP_TIMEOUT=40, VSI_CACHE=True):
        for index, scene in enumerate(scenes):
            print(f'{index + 1}/{len(scenes)} {scene["id"]}', flush=True)
            arrays, reads = {}, {}
            for key in ('visual', 'scl'):
                url = scene['assets'][key]['href']
                with rasterio.open(url) as header:
                    native_gsd = abs(header.transform.a)
                    overviews = header.overviews(1)
                    factor = min(overviews, key=lambda item: abs(native_gsd * item - 80))
                    overview = overviews.index(factor)
                with rasterio.open(url, overview_level=overview) as source:
                    reads[key] = {'url': url, 'overview_factor': factor, 'overview_level': overview,
                                  'source_overview_size': [source.width, source.height],
                                  'overview_ground_sampling_m': abs(source.transform.a)}
                    with WarpedVRT(source, crs='EPSG:4326', transform=transform, width=width, height=height,
                                   resampling=Resampling.bilinear if key == 'visual' else Resampling.nearest) as vrt:
                        arrays[key] = vrt.read((1, 2, 3) if key == 'visual' else 1)
            data, scl = arrays['visual'], arrays['scl']
            valid = (np.max(data, axis=0) > 0) & (scl > 0)
            date = scene['properties']['datetime'][:10]
            distance = abs((datetime.fromisoformat(date) - datetime(2026, 5, 17)).days)
            candidate_score = distance + np.isin(scl, (3, 8, 9, 10)).astype(np.float32) * 100
            choose = valid & (candidate_score < score)
            rgb[:, choose] = data[:, choose]
            classification[choose] = scl[choose]
            ownership[choose] = index
            score[choose] = candidate_score[choose]
            records.append({'id': scene['id'], 'acquired': scene['properties']['datetime'],
                            'bbox': scene['bbox'], 'scene_cloud_cover_pct': scene['properties']['eo:cloud_cover'],
                            'stac_url': f'https://earth-search.aws.element84.com/v1/collections/sentinel-2-c1-l2a/items/{scene["id"]}',
                            'overview_reads': reads})
    missing = int(np.count_nonzero(ownership < 0))
    if missing:
        Image.fromarray(((ownership < 0) * 255).astype(np.uint8)).resize((1200, 1050), Image.Resampling.NEAREST).save(output / 'missing-coverage.png')
    assert missing == 0, f'Mosaic has {missing} uncovered pixels'
    assert np.count_nonzero(np.max(rgb, axis=0) == 0) == 0, 'Mosaic contains black gaps'
    picture = Image.fromarray(rgb.transpose(1, 2, 0))
    picture.save(output / 'ayodhya-broad-real.jpg', quality=94, subsampling=0)
    picture.resize((1200, 1050), Image.Resampling.LANCZOS).save(output / 'ayodhya-broad-preview.jpg', quality=93)
    clouds = np.isin(classification, (8, 9, 10))
    Image.fromarray((clouds * 255).astype(np.uint8)).resize((1200, 1050), Image.Resampling.NEAREST).save(output / 'ayodhya-broad-cloud-mask.png')
    rows = np.linspace(north, south, height)[:, None]
    columns = np.linspace(west, east, width)[None, :]
    # Actual geographic camera footprint at t=8, conservatively rounded.
    approach = (rows > 26.06) & (rows < 27.54) & (columns > 80.73) & (columns < 83.68)
    used = []
    for index, record in enumerate(records):
        record['mosaic_pixel_count'] = int(np.count_nonzero(ownership == index))
        if record['mosaic_pixel_count']:
            used.append(record)
    manifest = {'file': 'ayodhya-broad-real.jpg', 'bbox': list(BBOX), 'crs': 'EPSG:4326', 'size': list(SIZE),
                'north_up': True, 'pixel_mapping': 'u=(lon-west)/(east-west)*(width-1); v=(north-lat)/(north-south)*(height-1)',
                'feather': 0.03, 'source': 'Copernicus Sentinel-2 L2A true-colour imagery via Element 84 Earth Search / AWS Open Data',
                'retrieved': datetime.now(timezone.utc).isoformat(), 'source_url': [r['overview_reads']['visual']['url'] for r in used],
                'acquisition_datetimes': sorted(set(r['acquired'] for r in used)), 'scene': [r['id'] for r in used],
                'sources': used, 'candidate_snapshot': 'wide-candidates.json',
                'processing': 'HTTP-range reads of real 80 m TCI/SCL overviews. North-up EPSG:4326 mosaic with bilinear TCI and nearest SCL reprojection; nearest May 17 acquisition preferred, clear actual pixels preferred in overlaps. No AI sharpening, generated features or scene colour adjustments. JPEG quality 94, no chroma subsampling.',
                'attribution': 'Contains modified Copernicus Sentinel data 2026',
                'license': 'Copernicus Sentinel free, full and open use',
                'license_url': 'https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice',
                'validation': {'missing_pixels': missing, 'black_gap_pixels': 0, 'pixel_count': width * height,
                               'cloud_pixels': int(clouds.sum()), 'cloud_fraction': float(clouds.mean()),
                               'approach_8_desktop_cloud_fraction': float(clouds[approach].mean()),
                               'cloud_shadow_pixels': int(np.count_nonzero(classification == 3)),
                               'same_may17_clear_pixel_fraction': float(np.mean(score == 0))}}
    (output / 'broad-sources.json').write_text(json.dumps([manifest], indent=2) + '\n')
    print(json.dumps(manifest['validation']), flush=True)
    print(output / 'broad-sources.json', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    prepare(args.output)
