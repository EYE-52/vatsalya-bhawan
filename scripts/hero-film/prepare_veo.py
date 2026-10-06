"""Prepare the chosen eight-second Veo shot and matching first/last-frame posters."""
import argparse
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
repository = ROOT.parents[1] if (ROOT.parents[1] / 'package.json').exists() else ROOT.parent / 'vatsalya-bhawan'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source',type=Path,default=Path('/Users/divyansh/Downloads/Camera_descending_through_clouds…_20261007042337.mp4'))
parser.add_argument('--output',type=Path,default=repository / 'public/assets')
parser.add_argument('--mobile-only',action='store_true',help='Regenerate only the mobile film and posters')
args = parser.parse_args()
SOURCE,OUT = args.source,args.output
FRAMES = 192 # full eight-second shot: source frames 0–191 at 24fps
OUT.mkdir(parents=True,exist_ok=True)

def run(*options):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*options],check=True)

common=['-an','-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart']
trim=f'trim=end_frame={FRAMES},setpts=PTS-STARTPTS'
if not args.mobile_only:
    run('-i',str(SOURCE),'-vf',trim,*common,str(OUT/'ayodhya-journey.mp4'))
# Reframe the same uninterrupted shot, with no inserted still, dissolve or stretch.
s='min(t/1.2,1)'
ease=f'({s})*({s})*(3-2*({s}))'
pan_s='min(max((t-2)/1.2,0),1)'
pan_ease=f'({pan_s})*({pan_s})*(3-2*({pan_s}))'
# Shift from source x640 to x840 while opaque clouds conceal the reframe.
mobile=f"{trim},scale=w='trunc((960+1316*({ease}))/2)*2':h=-2:eval=frame:flags=lanczos,pad=2276:1280:(ow-iw)/2:(oh-ih)/2:color=0x020A0D:eval=frame,crop=720:1280:x='(iw-ow)/2+355.625*({pan_ease})':y='(ih-oh)/2',setsar=1"
run('-i',str(SOURCE),'-vf',mobile,*common,str(OUT/'ayodhya-journey-mobile.mp4'))
for suffix in (['-mobile'] if args.mobile_only else ['', '-mobile']):
    video=OUT/f'ayodhya-journey{suffix}.mp4'
    # Extract from each final encoded video, so completion has no framing jump.
    run('-i',str(video),'-vf',"select='eq(n,0)'",'-frames:v','1','-q:v','2',str(OUT/f'ayodhya-globe{suffix}.jpg'))
    run('-i',str(video),'-vf',f"select='eq(n,{FRAMES-1})'",'-frames:v','1','-q:v','2',str(OUT/f'ayodhya-arrival{suffix}.jpg'))
    run('-i',str(video),'-f','null','-')
    metadata=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration','-of','json',str(video)]))
    assert len(metadata['streams'])==1,'Unexpected audio stream'
    stream=metadata['streams'][0]
    assert stream['codec_name']=='h264' and stream['pix_fmt']=='yuv420p'
    assert stream['nb_frames']==str(FRAMES) and stream['r_frame_rate']=='24/1'
    assert abs(float(metadata['format']['duration'])-8)<.001
    assert (OUT/f'ayodhya-arrival{suffix}.jpg').stat().st_size>0,'Missing final frame'
    data=video.read_bytes()
    assert data.find(b'moov')<data.find(b'mdat'),'Fast start missing'
    print(f'{video.name}: {len(data):,} bytes; full decode, 192 frames, 8s, silent and fast-start passed',flush=True)
