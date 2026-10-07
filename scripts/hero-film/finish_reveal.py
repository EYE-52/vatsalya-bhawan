"""Append an eased skyline reveal to the approved geographic film; no new globe render."""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
FPS, DURATION = 24, 15
REVEAL_START, ARRIVAL = 10.5, 12.5
DEFAULT_QA = ROOT.parent / 'hero-film/reveal'


def run(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)


def inspect(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
        'stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration', '-of', 'json', str(path)]))


def decoded_frame(video, frame):
    metadata = inspect(video)['streams'][0]
    data = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(video),
        '-vf', f'select=eq(n\\,{frame})', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
    return np.frombuffer(data, dtype=np.uint8).reshape(metadata['height'], metadata['width'], 3)


def source_crop(image, width, height, portrait):
    ratio = width / height
    crop_width = min(image.width, image.height * ratio)
    crop_height = crop_width / ratio
    # Temple at source x≈1130 remains on the right; river context stays on the left.
    cx = 1070 if portrait else image.width / 2
    cy = image.height / 2
    return image.crop((cx - crop_width / 2, cy - crop_height / 2,
                       cx + crop_width / 2, cy + crop_height / 2)).resize((width, height), Image.Resampling.LANCZOS)


def finish(portrait, qa):
    suffix = '-mobile' if portrait else ''
    width, height = (720, 1280) if portrait else (1280, 720)
    source = ROOT / f'public/assets/ayodhya-geographic{suffix}.mp4'
    output = ROOT / f'public/assets/ayodhya-reveal{suffix}.mp4'
    skyline = ROOT / 'public/assets/ayodhya-aerial.jpg'
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    qa.mkdir(parents=True, exist_ok=True)
    with Image.open(skyline) as image:
        crop = source_crop(image.convert('RGB'), width, height, portrait)
    still = qa / f'skyline-crop{suffix}.png'
    crop.save(still)
    q = f'clip((T-{REVEAL_START})/{ARRIVAL-REVEAL_START},0,1)'
    weight = f'({q})*({q})*(3-2*({q}))'
    filters = (f'[0:v]tpad=stop_mode=clone:stop_duration=2,trim=end_frame={FPS*DURATION},'
               'setpts=PTS-STARTPTS,format=yuv420p,setsar=1[geography];'
               f'[1:v]trim=end_frame={FPS*DURATION},setpts=PTS-STARTPTS,format=yuv420p,setsar=1[skyline];'
               f"[geography][skyline]blend=all_expr='A*(1-({weight}))+B*({weight})':shortest=1[film]")
    run('-i', source, '-loop', '1', '-framerate', FPS, '-i', still, '-filter_complex', filters,
        '-map', '[film]', '-an', '-frames:v', FPS * DURATION, '-r', FPS, '-c:v', 'libx264',
        '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output)
    for frame, name in [(0, 'globe'), (FPS * DURATION - 1, 'arrival')]:
        run('-i', output, '-vf', f'select=eq(n\\,{frame})', '-frames:v', '1', '-q:v', '2',
            ROOT / f'public/assets/ayodhya-reveal-{name}{suffix}.jpg')
    run('-i', output, '-f', 'null', '-')
    metadata = inspect(output)
    assert len(metadata['streams']) == 1
    stream = metadata['streams'][0]
    assert stream['codec_type'] == 'video' and stream['codec_name'] == 'h264'
    assert (stream['width'], stream['height']) == (width, height)
    assert stream['r_frame_rate'] == '24/1' and stream['pix_fmt'] == 'yuv420p'
    assert int(stream['nb_frames']) == FPS * DURATION
    assert abs(float(metadata['format']['duration']) - DURATION) < .001
    data = output.read_bytes()
    assert 0 <= data.find(b'moov') < data.find(b'mdat')
    assert hashlib.sha256(source.read_bytes()).hexdigest() == source_hash
    # Both samples are from the fully settled hold. JPEG adds only encoding error.
    final = decoded_frame(output, FPS * DURATION - 1)
    first_hold = decoded_frame(output, round(ARRIVAL * FPS))
    hold_error = float(np.abs(final.astype(np.int16) - first_hold.astype(np.int16)).mean())
    assert hold_error < 1, hold_error
    with Image.open(ROOT / f'public/assets/ayodhya-reveal-arrival{suffix}.jpg') as poster:
        poster_error = float(np.abs(final.astype(np.int16) - np.asarray(poster.convert('RGB')).astype(np.int16)).mean())
        assert poster.size == (width, height) and poster_error < 5, poster_error
    previews = qa / f'frames{suffix}'
    previews.mkdir(exist_ok=True)
    times = [0, 3, 5.5, 8, 10.5, 11, 11.5, 12, 12.5, 14.958333]
    tile_width = 320 if not portrait else 180
    tile_height = round(tile_width * height / width)
    sheet = Image.new('RGB', (tile_width * 5, (tile_height + 27) * 2), '#FAF8F3')
    for i, time in enumerate(times):
        frame = min(FPS * DURATION - 1, round(time * FPS))
        array = decoded_frame(output, frame)
        image = Image.fromarray(array)
        image.save(previews / f'{time:06.3f}.jpg', quality=94)
        col, row = i % 5, i // 5
        sheet.paste(image.resize((tile_width, tile_height), Image.Resampling.LANCZOS), (col * tile_width, row * (tile_height + 27)))
        ImageDraw.Draw(sheet).text((col * tile_width + 8, row * (tile_height + 27) + tile_height + 6), f'{time:.3f} seconds', fill='#28372D')
    sheet.save(qa / f'contact-sheet{suffix}.jpg', quality=95)
    metadata['validation'] = {'source_sha256': source_hash, 'source_unchanged': True,
        'full_decode': True, 'fast_start': True, 'hold_mean_rgb_error': hold_error,
        'last_frame_poster_mean_rgb_error': poster_error, 'size_bytes': len(data),
        'reveal_start': REVEAL_START, 'settled_arrival': ARRIVAL}
    (qa / f'validation{suffix}.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print(f'{output}: {len(data):,} bytes, full decode and poster validation passed', flush=True)
    print(qa / f'contact-sheet{suffix}.jpg', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--portrait', action='store_true')
    parser.add_argument('--qa', type=Path, default=DEFAULT_QA)
    args = parser.parse_args()
    finish(args.portrait, args.qa)
