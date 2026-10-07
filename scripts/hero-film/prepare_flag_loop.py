#!/usr/bin/env python3
"""Encode a reviewed native loop without reversing, blending or hiding its join."""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from assemble_temple_journey import digest, frame, probe, run


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--journey-dir', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    args.output = args.output.resolve()
    if args.output == root or root in args.output.parents:
        parser.error('Keep review output outside the repository')
    args.output.mkdir(parents=True, exist_ok=True)
    source_hash = digest(args.source)
    source_video = next(s for s in probe(args.source)['streams'] if s['codec_type'] == 'video')
    assert source_video['r_frame_rate'] == '24/1' and int(source_video['nb_read_frames']) == 192
    report = {'source_sha256': source_hash, 'outputs': []}
    for suffix, width, height in [('', 1280, 720), ('-mobile', 720, 1280)]:
        target = args.output / f'ayodhya-shikhar-flag-loop{suffix}.mp4'
        crop_x = 'iw*0.45-ow/2' if suffix else '(iw-ow)/2'
        run('ffmpeg', '-y', '-v', 'error', '-i', args.source, '-an', '-vf',
            f'scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height}:x={crop_x}:y=(ih-oh)/2,setsar=1',
            '-frames:v', 185, '-r', 24, '-c:v', 'libx264', '-preset', 'slow', '-crf', 20,
            '-maxrate', '3.8M' if suffix else '6M', '-bufsize', '7.6M' if suffix else '12M',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target)
        meta = probe(target)
        video = meta['streams'][0]
        assert len(meta['streams']) == 1 and video['codec_name'] == 'h264'
        assert (video['width'], video['height'], int(video['nb_read_frames'])) == (width, height, 185)
        assert video['r_frame_rate'] == '24/1' and abs(float(meta['format']['duration']) - 185 / 24) < .01
        binary = target.read_bytes()
        assert 0 < binary.find(b'moov') < binary.find(b'mdat')
        run('ffmpeg', '-v', 'error', '-i', target, '-f', 'null', '-')
        indices = [0, 24, 48, 72, 96, 120, 144, 168, 181, 182, 183, 184]
        images = [frame(target, n, width, height) for n in indices]
        arrival = frame(args.journey_dir / f'ayodhya-shikhar-journey-v2{suffix}.mp4', 203, width, height)
        thumb_w = 200 if suffix else 320
        thumb_h = round(thumb_w * height / width)
        sheet = Image.new('RGB', (thumb_w * 4, (thumb_h + 24) * 4), '#fffcf5')
        draw = ImageDraw.Draw(sheet)
        entries = [(a, f'loop {n/24:.3f}s') for a, n in zip(images, indices)]
        entries += [(arrival, 'journey arrival'), (images[0], 'loop start'), (images[-1], 'loop end'), (images[0], 'loop restart')]
        for i, (a, label) in enumerate(entries):
            x, y = i % 4 * thumb_w, i // 4 * (thumb_h + 24)
            sheet.paste(Image.fromarray(a).resize((thumb_w, thumb_h)), (x, y))
            draw.text((x + 6, y + thumb_h + 4), label, fill='#123c51')
        sheet.save(args.output / f'loop-review{suffix}.jpg', quality=94)
        delta = lambda a, b: float(np.abs(a.astype(float) - b.astype(float)).mean())
        report['outputs'].append({'file': target.name, 'sha256': digest(target),
            'bytes': len(binary), 'frames': 185, 'fps': 24, 'duration': 185 / 24,
            'arrival_join_mean_rgb_255': delta(arrival, images[0]),
            'loop_join_mean_rgb_255': delta(images[-1], images[0]),
            'decode': 'passed', 'faststart': 'passed'})
    assert digest(args.source) == source_hash
    (args.output / 'loop-validation.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
