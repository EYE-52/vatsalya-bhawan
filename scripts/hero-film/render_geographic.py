"""Render one real geographic camera journey, using NASA and Copernicus imagery."""
from pathlib import Path
import argparse
import json
import math
import subprocess

import numpy as np
from PIL import Image, ImageDraw

FPS, DURATION = 24, 13
TARGET = (26.799, 82.204)
Image.MAX_IMAGE_PIXELS = 300_000_000
DEFAULT_WORK = Path(__file__).resolve().parents[3] / 'hero-film/geographic'


def ease(value):
    value = np.clip(value, 0, 1)
    return value * value * (3 - 2 * value)


def basis(lat, lon):
    lat, lon = map(math.radians, (lat, lon))
    return (np.array([math.cos(lat) * math.cos(lon), math.sin(lat), math.cos(lat) * math.sin(lon)], dtype=np.float32),
            np.array([-math.sin(lon), 0, math.cos(lon)], dtype=np.float32),
            np.array([-math.sin(lat) * math.cos(lon), math.cos(lat), -math.sin(lat) * math.sin(lon)], dtype=np.float32))


def trajectory(t):
    # Altitude interpolates logarithmically: an unbroken approach over four scales.
    keys = [(0, 20, 98, 5.4), (3, 21.5, 82, 2.08),
            (4.4, 22, 82, 2.02), (5.5, 27, 82.204, 1.40),
            (8, 26.799, 82.204, 1.045), (10.5, *TARGET, 1.0024)]
    if t >= keys[-1][0]:
        return keys[-1][1:]
    for a, b in zip(keys, keys[1:]):
        if a[0] <= t < b[0]:
            s = float(ease((t - a[0]) / (b[0] - a[0])))
            lat, lon = a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s
            altitude = math.exp(math.log(a[3] - 1) * (1 - s) + math.log(b[3] - 1) * s)
            return lat, lon, 1 + altitude
    raise ValueError(t)


def sample(texture, u, v):
    u = np.clip(u, 0, texture.shape[1] - 1.001).astype(np.float32)
    v = np.clip(v, 0, texture.shape[0] - 1.001).astype(np.float32)
    ix, iy = u.astype(np.int32), v.astype(np.int32)
    dx, dy = (u - ix).astype(np.float32)[:, None], (v - iy).astype(np.float32)[:, None]
    return ((texture[iy, ix] * (1 - dx) + texture[iy, ix + 1] * dx) * (1 - dy)
            + (texture[iy + 1, ix] * (1 - dx) + texture[iy + 1, ix + 1] * dx) * dy)


class Renderer:
    def __init__(self, work, portrait=False):
        self.work, self.portrait = work, portrait
        self.width, self.height = (720, 1280) if portrait else (1280, 720)
        self.suffix = '-mobile' if portrait else ''
        with Image.open(work.parent / 'assets/blue-marble-july-2004.jpg') as source:
            self.world = np.asarray(source.resize((5400, 2700), Image.Resampling.LANCZOS).convert('RGB'))
            regional = np.asarray(source.crop((13500, 1800, 18000, 6000)).convert('RGB'))
        self.patches = [(regional, (45, -10, 120, 60), True, .16)]
        for item in json.loads((work / 'assets/active-sources.json').read_text()):
            with Image.open(work / 'assets' / item['file']) as source:
                self.patches.append((np.asarray(source.convert('RGB')), item['bbox'], False, item.get('feather', .16)))
        self.y, self.x = np.mgrid[:self.height, :self.width].astype(np.float32)
        self.f = self.height / (2 * math.tan(math.radians(46 if portrait else 32) / 2))
        self.rx = (self.x - (self.width - 1) / 2) / self.f
        self.ry = -(self.y - (self.height - 1) / 2) / self.f
        self.A = self.rx ** 2 + self.ry ** 2 + 1
        self.background = np.zeros((self.height, self.width, 3), dtype=np.float32)
        self.background[:] = [3, 8, 14]
        rng = np.random.default_rng(48)
        for _ in range(100):
            sx, sy = int(rng.integers(self.width)), int(rng.integers(self.height))
            self.background[sy, sx] = rng.uniform(19, 54)
        self.hold = None

    def texture(self, lon, lat):
        # Feather only at geographic patch boundaries; imagery never changes location.
        color = np.zeros((len(lon), 3), dtype=np.float32)
        remaining = np.ones(len(lon), dtype=np.float32)
        for texture, (west, south, east, north), pixel_edges, feather in reversed(self.patches):
            # Introduce a finer Sentinel level only when its feathered interior
            # contains the entire viewport. This prevents a floating tile rectangle.
            lod = 1.
            if not pixel_edges:
                coverage = min((float(lon.min()) - west) / (east - west),
                               (east - float(lon.max())) / (east - west),
                               (float(lat.min()) - south) / (north - south),
                               (north - float(lat.max())) / (north - south))
                lod = float(ease((coverage - feather) / .10))
                if lod <= 0:
                    continue
            inside = (lon > west) & (lon < east) & (lat > south) & (lat < north) & (remaining > .0001)
            if not np.any(inside):
                continue
            lo, la = lon[inside], lat[inside]
            edge = np.minimum.reduce([(lo - west) / (east - west), (east - lo) / (east - west),
                                      (la - south) / (north - south), (north - la) / (north - south)])
            alpha = ease(edge / feather).astype(np.float32) * lod
            # NASA bounds are pixel edges; reprojected Sentinel bounds are centres.
            offset = .5 if pixel_edges else 0
            scale_x = texture.shape[1] if pixel_edges else texture.shape[1] - 1
            scale_y = texture.shape[0] if pixel_edges else texture.shape[0] - 1
            pixels = sample(texture, (lo - west) / (east - west) * scale_x - offset,
                            (north - la) / (north - south) * scale_y - offset)
            color[inside] += pixels * (remaining[inside] * alpha)[:, None]
            remaining[inside] *= 1 - alpha
        inside = remaining > .0001
        if np.any(inside):
            pixels = sample(self.world, (lon[inside] + 180) / 360 * self.world.shape[1] - .5,
                            (90 - lat[inside]) / 180 * self.world.shape[0] - .5)
            color[inside] += pixels * remaining[inside, None]
        return color

    def frame(self, t):
        if t >= 10.5 and self.hold is not None:
            return self.hold
        lat, lon, dist = trajectory(t)
        normal, east, north = basis(lat, lon)
        discriminant = dist * dist - self.A * (dist * dist - 1)
        mask = discriminant > 0
        k = (dist - np.sqrt(np.maximum(discriminant, 0))) / self.A
        px, py, pz = k * self.rx, k * self.ry, dist - k
        vx = px[mask] * east[0] + py[mask] * north[0] + pz[mask] * normal[0]
        vy = px[mask] * east[1] + py[mask] * north[1] + pz[mask] * normal[1]
        vz = px[mask] * east[2] + py[mask] * north[2] + pz[mask] * normal[2]
        longitude = np.degrees(np.arctan2(vz, vx))
        latitude = np.degrees(np.arcsin(np.clip(vy, -1, 1)))
        color = self.texture(longitude, latitude)
        lambert = np.clip(-.18 * px[mask] + .22 * py[mask] + .96 * pz[mask], 0, 1)
        color *= (.48 + .54 * lambert)[:, None]
        fresnel = np.clip(1 - pz[mask], 0, 1) ** 3
        color += fresnel[:, None] * np.array([5, 19, 31], dtype=np.float32)
        out = self.background.copy()
        silhouette = self.f / math.sqrt(dist * dist - 1)
        radius = np.sqrt((self.x - self.width / 2) ** 2 + (self.y - self.height / 2) ** 2)
        halo = np.exp(-((radius - silhouette) / 8) ** 2) * .25
        out += halo[:, :, None] * np.array([18, 74, 116], dtype=np.float32)
        out[mask] = color
        im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
        if t > 7.5:
            target, _, _ = basis(*TARGET)
            sx = (self.width - 1) / 2 + self.f * float(target @ east) / (dist - float(target @ normal))
            sy = (self.height - 1) / 2 - self.f * float(target @ north) / (dist - float(target @ normal))
            alpha = int(230 * ease((t - 7.5) / .6))
            layer = Image.new('RGBA', im.size)
            draw = ImageDraw.Draw(layer)
            draw.ellipse((sx - 8, sy - 8, sx + 8, sy + 8), outline=(255, 224, 161, alpha), width=2)
            draw.ellipse((sx - 2, sy - 2, sx + 2, sy + 2), fill=(255, 236, 190, alpha))
            im = Image.alpha_composite(im.convert('RGBA'), layer).convert('RGB')
        if t >= 10.5:
            self.hold = im
        return im

    def preview(self):
        folder = self.work / ('previews' + self.suffix)
        folder.mkdir(parents=True, exist_ok=True)
        times = [0, 1.5, 3, 4.4, 5.5, 6.7, 8, 9, 9.7, 10.5, 11.5, 12.95]
        tile_width = 320 if not self.portrait else 180
        tile_height = round(tile_width * self.height / self.width)
        sheet = Image.new('RGB', (tile_width * 4, (tile_height + 27) * 3), '#FAF8F3')
        for i, time in enumerate(times):
            im = self.frame(time)
            im.save(folder / f'{time:05.2f}.jpg', quality=94)
            col, row = i % 4, i // 4
            sheet.paste(im.resize((tile_width, tile_height), Image.Resampling.LANCZOS), (col * tile_width, row * (tile_height + 27)))
            ImageDraw.Draw(sheet).text((col * tile_width + 8, row * (tile_height + 27) + tile_height + 6), f'{time:05.2f} seconds', fill='#28372D')
        sheet.save(self.work / ('contact-sheet' + self.suffix + '.jpg'), quality=95)
        print(self.work / ('contact-sheet' + self.suffix + '.jpg'), flush=True)

    def render(self):
        path = self.work / ('ayodhya-geographic' + self.suffix + '.mp4')
        command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                   '-s', f'{self.width}x{self.height}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264',
                   '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(path)]
        process = subprocess.Popen(command, stdin=subprocess.PIPE)
        try:
            for index in range(FPS * DURATION):
                im = self.frame(index / FPS)
                process.stdin.write(im.tobytes())
                if index % 24 == 0:
                    print(f'{path.name}: {index}/{FPS * DURATION}', flush=True)
            process.stdin.close()
            if process.wait():
                raise RuntimeError('ffmpeg encoding failed')
        finally:
            if process.poll() is None:
                process.terminate()
        for index, name in [(0, 'globe'), (FPS * DURATION - 1, 'arrival')]:
            subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(path), '-vf',
                            f'select=eq(n\\,{index})', '-frames:v', '1', '-q:v', '2',
                            str(self.work / f'ayodhya-geographic-{name}{self.suffix}.jpg')], check=True)
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(path), '-f', 'null', '-'], check=True)
        metadata = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
            'stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration', '-of', 'json', str(path)]))
        assert len(metadata['streams']) == 1 and metadata['streams'][0]['codec_type'] == 'video'
        stream = metadata['streams'][0]
        assert (stream['width'], stream['height']) == (self.width, self.height)
        assert stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p'
        assert stream['r_frame_rate'] == '24/1' and int(stream['nb_frames']) == FPS * DURATION
        assert abs(float(metadata['format']['duration']) - DURATION) < .001
        data = path.read_bytes()
        assert data.find(b'moov') < data.find(b'mdat')
        (self.work / ('validation' + self.suffix + '.json')).write_text(json.dumps(metadata, indent=2) + '\n')
        print(f'{path}: full decode, frames, timing, silent H.264, and fast-start passed', flush=True)


def check_geometry():
    normal, east, north = basis(*TARGET)
    assert np.allclose(normal @ east, 0, atol=1e-6) and np.allclose(normal @ north, 0, atol=1e-6)
    assert np.allclose(np.linalg.norm(normal), 1)
    assert np.allclose(trajectory(10.5), (*TARGET, 1.0024))
    for boundary in (3, 4.4, 5.5, 8, 10.5):
        assert np.allclose(trajectory(boundary - 1e-5), trajectory(boundary + 1e-5), atol=1e-4)
    test = np.array([[[0, 0, 0], [100, 100, 100]], [[200, 200, 200], [240, 240, 240]]], dtype=np.uint8)
    assert np.allclose(sample(test, np.array([.5]), np.array([.5])), 135)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--work', type=Path, default=DEFAULT_WORK)
    parser.add_argument('--portrait', action='store_true')
    parser.add_argument('--preview', action='store_true')
    args = parser.parse_args()
    check_geometry()
    args.work.mkdir(parents=True, exist_ok=True)
    renderer = Renderer(args.work, args.portrait)
    renderer.preview() if args.preview else renderer.render()
