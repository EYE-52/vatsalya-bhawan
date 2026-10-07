"""Continue the registered satellite camera into real Ayodhya; no scene change."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import subprocess

import numpy as np
from PIL import Image, ImageDraw

import render_geographic as geo

FPS, DURATION, ARRIVAL = 24, 15, 12.5
FINAL_DISTANCE = 1.0013
DEFAULT_OUTPUT = geo.DEFAULT_WORK.parent / 'continuous'
DEFAULT_BROAD_MANIFEST = DEFAULT_OUTPUT / 'assets/broad-sources.json'


def trajectory(t):
    if t < 8:
        return geo.trajectory(t)
    s = float(geo.ease((t - 8) / (ARRIVAL - 8)))
    altitude = math.exp(math.log(.045) * (1 - s) + math.log(FINAL_DISTANCE - 1) * s)
    return (*geo.TARGET, 1 + altitude)


class Renderer(geo.Renderer):
    def __init__(self, output, portrait=False, broad_manifest=DEFAULT_BROAD_MANIFEST):
        super().__init__(geo.DEFAULT_WORK, portrait)
        if broad_manifest.exists():
            broad = []
            for item in json.loads(broad_manifest.read_text()):
                with Image.open(broad_manifest.parent / item['file']) as source:
                    broad.append((np.asarray(source.convert('RGB')), item['bbox'], False, item.get('feather', .03)))
            # Between NASA and the closer original Sentinel crops; legacy untouched.
            self.patches[1:1] = broad
        self.output = output
        self.output.mkdir(parents=True, exist_ok=True)
        self.final_hold = None

    def frame(self, t):
        if t >= ARRIVAL and self.final_hold is not None:
            return self.final_hold
        # Reuse the original sphere, lighting and georeferenced texture sampling.
        # Only the city camera curve and hold time differ from the legacy film.
        lat, lon, dist = trajectory(t)
        normal, east, north = geo.basis(lat, lon)
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
        if t >= ARRIVAL:
            self.final_hold = im
        return im

    def preview(self):
        folder = self.output / ('previews' + self.suffix)
        folder.mkdir(parents=True, exist_ok=True)
        times = [0, 1.5, 3, 4.4, 5.5, 6.7, 8, 9.5, 10.5, 11.5, 12.5, 14.958333]
        tw = 180 if self.portrait else 320
        th = round(tw * self.height / self.width)
        sheet = Image.new('RGB', (tw * 4, (th + 27) * 3), '#FAF8F3')
        for i, t in enumerate(times):
            image = self.frame(t)
            image.save(folder / f'{t:05.2f}.jpg', quality=95)
            col, row = i % 4, i // 4
            sheet.paste(image.resize((tw, th), Image.Resampling.LANCZOS), (col * tw, row * (th + 27)))
            ImageDraw.Draw(sheet).text((col * tw + 8, row * (th + 27) + th + 6), f'{t:05.2f} seconds', fill='#28372D')
        path = self.output / ('contact-sheet' + self.suffix + '.jpg')
        sheet.save(path, quality=95)
        print(path, flush=True)

    def render(self):
        path = self.output / ('ayodhya-continuous' + self.suffix + '.mp4')
        process = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo',
            '-pix_fmt', 'rgb24', '-s', f'{self.width}x{self.height}', '-r', str(FPS), '-i', '-', '-an',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(path)], stdin=subprocess.PIPE)
        try:
            for index in range(FPS * DURATION):
                process.stdin.write(self.frame(index / FPS).tobytes())
                if index % FPS == 0:
                    print(f'{path.name}: {index}/{FPS * DURATION}', flush=True)
            process.stdin.close()
            if process.wait():
                raise RuntimeError('ffmpeg encoding failed')
        finally:
            if process.poll() is None:
                process.terminate()
        validate(path, self.width, self.height, self.output, self.suffix)


def validate(path, width, height, output, suffix):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(path), '-f', 'null', '-'], check=True)
    metadata = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
        'stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration', '-of', 'json', str(path)]))
    stream, = metadata['streams']
    assert stream['codec_type'] == 'video' and stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p'
    assert (stream['width'], stream['height']) == (width, height)
    assert stream['r_frame_rate'] == '24/1' and int(stream['nb_frames']) == 360
    assert abs(float(metadata['format']['duration']) - DURATION) < .001
    data = path.read_bytes()
    assert data.find(b'moov') < data.find(b'mdat')
    decoded, poster_errors = {}, {}
    for index, label in [(0, 'globe'), (300, 'settled'), (359, 'arrival')]:
        raw = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(path),
            '-vf', f'select=eq(n\\,{index})', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
        decoded[label] = np.frombuffer(raw, dtype=np.uint8).reshape(height, width, 3)
        if label != 'settled':
            poster = output / f'ayodhya-continuous-{label}{suffix}.jpg'
            Image.fromarray(decoded[label]).save(poster, quality=95, subsampling=0)
            poster_errors[label] = float(np.abs(np.asarray(Image.open(poster)).astype(float) - decoded[label]).mean())
            assert poster_errors[label] < 3
    hold_error = float(np.abs(decoded['settled'].astype(float) - decoded['arrival']).mean())
    # Lossy H.264 can quantize identical held source frames slightly differently.
    assert hold_error < 1, hold_error
    metadata.update(full_decode='passed', faststart=True, arrival_time=ARRIVAL, hold_mean_pixel_error=hold_error,
                    poster_mean_pixel_errors=poster_errors,
                    bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
    (output / ('validation' + suffix + '.json')).write_text(json.dumps(metadata, indent=2) + '\n')
    print(f'{path}: full decode, 360 frames, 15 seconds, silent H.264, fast-start, stationary hold passed', flush=True)


def check_geometry():
    geo.check_geometry()
    for t in np.linspace(0, 7.999, 50):
        assert trajectory(t) == geo.trajectory(t)
    poses = np.array([trajectory(t) for t in np.linspace(8, ARRIVAL, 1000)])
    assert np.all(np.diff(poses[:, 2]) < 0)
    assert np.allclose(poses[:, :2], geo.TARGET)
    assert np.allclose(trajectory(ARRIVAL), (*geo.TARGET, FINAL_DISTANCE))
    assert trajectory(15) == trajectory(ARRIVAL)
    assert np.allclose(trajectory(8 - 1e-6), trajectory(8 + 1e-6), atol=1e-6)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--portrait', action='store_true')
    parser.add_argument('--preview', action='store_true')
    parser.add_argument('--broad-manifest', type=Path, default=DEFAULT_BROAD_MANIFEST)
    args = parser.parse_args()
    check_geometry()
    renderer = Renderer(args.output, args.portrait, args.broad_manifest)
    renderer.preview() if args.preview else renderer.render()
