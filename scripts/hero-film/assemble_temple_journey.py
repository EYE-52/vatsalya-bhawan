#!/usr/bin/env python3
"""Compose reviewed reference-matched clips; outputs remain outside the repository.

python scripts/hero-film/assemble_temple_journey.py --descent-clip DESCENT.mp4 --opening-dir GEOGRAPHIC_DIR --output /absolute/path/to/review-output

24 fps: opening 84 frames, descent 120 frames, final hold 36.
The clips must already share their boundary reference images. This script reports
seam errors for review; it never conceals mismatches with blends or transitions.
"""
import argparse
import hashlib
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

FPS = 24
ROOT = Path(__file__).resolve().parents[2]


def run(*args):
    return subprocess.run([str(x) for x in args], check=True, capture_output=True).stdout


def probe(path):
    return json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_streams',
                          '-show_format', '-of', 'json', path))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def frame(path, index, width, height):
    data = run('ffmpeg', '-v', 'error', '-i', path, '-vf', f'select=eq(n\\,{index})',
               '-frames:v', 1, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
    return np.frombuffer(data, dtype=np.uint8).reshape(height, width, 3)


def encode(source, target, filters, frames):
    run('ffmpeg', '-y', '-v', 'error', '-i', source, '-an', '-vf', filters,
        '-frames:v', frames, '-r', FPS, '-c:v', 'libx264', '-preset', 'medium',
        '-crf', 18, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target)


def compose(args, mobile):
    suffix = '-mobile' if mobile else ''
    width, height = (720, 1280) if mobile else (1280, 720)
    source = args.opening_dir / f'ayodhya-continuous{suffix}.mp4'
    work = args.output / f'parts{suffix}'
    work.mkdir(exist_ok=True)
    opening, descent = [work / f'{name}.mp4' for name in ('opening', 'descent')]
    # Preserve native portrait globe. Narrow its vertical FOV 46 -> 32 degrees
    # over source seconds 8 -> 12.5, matching the desktop-derived AI crop.
    if mobile:
        u = 'min(1,max(0,(in-192)/108))'
        easing = f'(({u})*({u})*(3-2*({u})))'
        final_zoom = math.tan(math.radians(23)) / math.tan(math.radians(16))
        z = f'1+{final_zoom-1:.10f}*{easing}'
        # The flag extends left of the tower. Match a 45% desktop crop centre
        # while retaining the independently rendered portrait Earth opening.
        shift = .05 * (16 / 9) ** 2 / final_zoom
        opening_geometry = f"zoompan=z='{z}':x='iw/2-iw/zoom/2-iw*{shift:.10f}*{easing}':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=24,"
    else:
        opening_geometry = 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,'
    encode(source, opening, 'trim=end_frame=301,' + opening_geometry +
           'settb=AVTB,setpts=if(eq(N\\,0)\\,0\\,(0.5+N*82.5/300)/24/TB),tpad=stop_mode=clone:stop_duration=0.1,fps=24,setsar=1', 84)
    stream = next(s for s in probe(args.descent_clip)['streams'] if s['codec_type'] == 'video')
    assert stream['r_frame_rate'] == '24/1' and int(stream['nb_read_frames']) == 192, 'Descent must contain 192 native 24 fps frames'
    crop_x = 'iw*0.45-ow/2' if mobile else '(iw-ow)/2'
    geometry = f'scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height}:x={crop_x}:y=(ih-oh)/2,'
    encode(args.descent_clip, descent, 'trim=end_frame=192,settb=AVTB,setpts=if(eq(N\\,0)\\,0\\,(0.5+N*118.5/191)/24/TB),tpad=stop_mode=clone:stop_duration=0.1,fps=24,' + geometry + 'setsar=1', 120)
    listing = work / 'concat.txt'
    listing.write_text(''.join(f"file '{p.name}'\n" for p in (opening, descent)))
    output = args.output / f'ayodhya-shikhar-journey-v2{suffix}.mp4'
    # Padding clones the chosen actual final frame; no optical or colour effects.
    run('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', 0, '-i', listing,
        '-an', '-vf', 'tpad=stop_mode=clone:stop_duration=1.5', '-frames:v', 240,
        '-r', FPS, '-c:v', 'libx264', '-preset', 'slow', '-crf', 21,
        '-maxrate', '3.8M' if mobile else '6M', '-bufsize', '7.6M' if mobile else '12M',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output)
    metadata = probe(output)
    streams = metadata['streams']
    assert len(streams) == 1 and streams[0]['codec_type'] == 'video'
    video = streams[0]
    assert (video['width'], video['height'], int(video['nb_read_frames'])) == (width, height, 240)
    assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p'
    assert video['r_frame_rate'] == '24/1'
    binary = output.read_bytes()
    assert 0 < binary.find(b'moov') < binary.find(b'mdat'), 'Fast-start metadata missing'
    assert abs(float(metadata['format']['duration']) - 240 / FPS) < .01
    run('ffmpeg', '-v', 'error', '-i', output, '-f', 'null', '-')
    indices = [0, 24, 48, 67, 80, 82, 83, 84, 85, 108, 132, 156, 180, 202, 203, 204, 239]
    images = {n: frame(output, n, width, height) for n in indices}
    for name, index in [('globe', 0), ('arrival', 239)]:
        Image.fromarray(images[index]).save(args.output / f'ayodhya-shikhar-journey-v2-{name}{suffix}.jpg', quality=95)
    thumb_w = 240 if mobile else 320
    thumb_h = round(thumb_w * height / width)
    sheet = Image.new('RGB', (thumb_w * 4, (thumb_h + 28) * math.ceil(len(indices) / 4)), '#fffcf5')
    draw = ImageDraw.Draw(sheet)
    for i, n in enumerate(indices):
        x, y = (i % 4) * thumb_w, (i // 4) * (thumb_h + 28)
        sheet.paste(Image.fromarray(images[n]).resize((thumb_w, thumb_h)), (x, y))
        draw.text((x + 8, y + thumb_h + 5), f'{n / FPS:.3f}s / frame {n}', fill='#123c51')
    sheet.save(args.output / f'seam-contact-sheet{suffix}.jpg', quality=92)
    poster_errors = {}
    for name, index in [('globe', 0), ('arrival', 239)]:
        poster = np.asarray(Image.open(args.output / f'ayodhya-shikhar-journey-v2-{name}{suffix}.jpg').convert('RGB'))
        poster_errors[name] = float(np.abs(poster.astype(float) - images[index].astype(float)).mean())
        assert poster_errors[name] < 5, f'{name} poster differs from encoded frame'
    errors = {}
    for a, b in [(83, 84), (203, 204), (204, 239)]:
        delta = np.abs(images[a].astype(float) - images[b].astype(float))
        errors[f'{a}:{b}'] = {'mean_absolute_rgb_255': float(delta.mean()),
                             'p95_absolute_rgb_255': float(np.percentile(delta, 95))}
    assert errors['204:239']['mean_absolute_rgb_255'] < 1, 'Final hold is not stationary'
    report = {'output': str(output), 'sha256': digest(output), 'fps': FPS,
              'frames': 240, 'duration_seconds': 240 / FPS, 'arrival_seconds': 204 / FPS,
              'full_decode': 'passed', 'faststart': 'passed', 'metadata': metadata,
              'poster_pixel_errors': poster_errors, 'boundary_pixel_errors': errors,
              'source_endpoint_frame': 191, 'portrait_center': [0.45, 0.5],
              'note': 'Compare seam contact sheet; errors include real motion and compression. No automatic claim of matched source frames.'}
    (args.output / f'validation{suffix}.json').write_text(json.dumps(report, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--descent-clip', type=Path, required=True)
    parser.add_argument('--opening-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output = args.output.resolve()
    if args.output == ROOT or ROOT in args.output.parents:
        parser.error('--output must remain outside the Git repository')
    args.output.mkdir(parents=True, exist_ok=True)
    sources = [args.descent_clip.resolve()] + [args.opening_dir / f'ayodhya-continuous{s}.mp4' for s in ('', '-mobile')]
    hashes = {str(p): digest(p) for p in sources}
    for mobile in (False, True):
        compose(args, mobile)
    assert hashes == {str(p): digest(p) for p in sources}, 'Source changed during composition'
    (args.output / 'source-sha256.json').write_text(json.dumps(hashes, indent=2))
    print(f'Composed desktop and mobile films in {args.output}; inspect seam sheets before publishing.')


if __name__ == '__main__':
    main()
