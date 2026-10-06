"""Render a geographic, perspective-correct globe journey; no map tiles or AI globe."""
from pathlib import Path
import math, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
Image.MAX_IMAGE_PIXELS = 300_000_000
W,H,FPS,DURATION=960,540,24,15
PORTRAIT = '--portrait' in sys.argv
if PORTRAIT: W,H=480,720
FINAL=(720,1080) if PORTRAIT else (1280,720)
SUFFIX='-mobile' if PORTRAIT else ''
source=Image.open(ROOT/'assets/blue-marble-july-2004.jpg').convert('RGB')
# Global context plus full-resolution regional inset, all from the same composite.
world=np.asarray(source.resize((5400,2700),Image.Resampling.LANCZOS))
region=np.asarray(source.crop((13500,1800,18000,6000))) # 45–120E, 60–10S
source.close()
aerial=Image.open(ROOT/'assets/ayodhya-aerial.jpg').convert('RGB')
y,x=np.mgrid[:H,:W].astype(np.float32)
f=H/(2*math.tan(math.radians(46 if PORTRAIT else 32)/2))
rx=(x-(W-1)/2)/f; ry=-(y-(H-1)/2)/f
A=rx*rx+ry*ry+1
rng=np.random.default_rng(48)
background=np.zeros((H,W,3),dtype=np.float32)
background[:]=[3,8,14]
for _ in range(115):
 sx=int(rng.integers(W)); sy=int(rng.integers(H)); background[sy,sx]=rng.uniform(25,75)


def ease(v):
 v=np.clip(v,0,1); return v*v*(3-2*v)


def basis(lat,lon):
 la,lo=map(math.radians,(lat,lon))
 return np.array([math.cos(la)*math.cos(lo),math.sin(la),math.cos(la)*math.sin(lo)],np.float32),np.array([-math.sin(lo),0,math.cos(lo)],np.float32),np.array([-math.sin(la)*math.cos(lo),math.cos(la),-math.sin(la)*math.sin(lo)],np.float32)


def sample(tex,u,v):
 # Bilinear texture filtering avoids crawling / nearest-neighbour flicker.
 u=np.clip(u,0,tex.shape[1]-1.001); v=np.clip(v,0,tex.shape[0]-1.001)
 ix=u.astype(np.int32); iy=v.astype(np.int32); dx=(u-ix)[...,None]; dy=(v-iy)[...,None]
 return (tex[iy,ix]*(1-dx)+tex[iy,ix+1]*dx)*(1-dy)+(tex[iy+1,ix]*(1-dx)+tex[iy+1,ix+1]*dx)*dy


def trajectory(t):
 # Continuous camera, with slow initial orbit and a deliberate geographic approach.
 if t<4.2:
  s=ease(t/4.2); return 20+3*s,112-24*s,5.4-2.15*s
 if t<7.4:
  s=ease((t-4.2)/3.2); return 23+2.2*s,88-6.8*s,3.25-1.82*s
 s=ease((t-7.4)/3.0)
 return 25.2+(26.7857896-25.2)*s,81.2+(82.2032408-81.2)*s,1.43-.335*s


def globe(t):
 lat,lon,dist=trajectory(t)
 normal,east,north=basis(lat,lon)
 disc=dist*dist-A*(dist*dist-1)
 mask=disc>0
 k=(dist-np.sqrt(np.maximum(disc,0)))/A
 px=k*rx; py=k*ry; pz=dist-k
 vx=px*east[0]+py*north[0]+pz*normal[0]
 vy=px*east[1]+py*north[1]+pz*normal[1]
 vz=px*east[2]+py*north[2]+pz*normal[2]
 longitude=np.degrees(np.arctan2(vz,vx)); latitude=np.degrees(np.arcsin(np.clip(vy,-1,1)))
 u=(longitude+180)/360*5400; v=(90-latitude)/180*2700
 color=sample(world,u,v)
 if t>4:
  regional=(longitude>45)&(longitude<120)&(latitude<60)&(latitude>-10)
  hi=sample(region,(longitude-45)*60,(60-latitude)*60)
  color[regional]=hi[regional]
 # Directional daylight in camera space, with subtle atmospheric limb scatter.
 lambert=np.clip(-.28*px+.32*py+.9*pz,0,1)
 shading=.35+.68*lambert
 color=color*shading[...,None]
 fresnel=np.clip(1-pz,0,1)**3
 color+=fresnel[...,None]*np.array([5,19,31])
 out=background.copy()
 # Thin softly glowing atmosphere outside the geometric globe.
 silhouette=f/math.sqrt(dist*dist-1)
 radius=np.sqrt((x-W/2)**2+(y-H/2)**2)
 halo=np.exp(-((radius-silhouette)/8)**2)*.28
 out+=halo[...,None]*np.array([18,74,116])
 out[mask]=color[mask]
 out=np.clip(out,0,255).astype(np.uint8)
 im=Image.fromarray(out)
 if 6<t<10.65:
  target,_,_=basis(26.7857896,82.2032408)
  pxx=float(target@east); pyy=float(target@north); pzz=float(target@normal)
  sx=W/2+f*pxx/(dist-pzz); sy=H/2-f*pyy/(dist-pzz)
  alpha=float(ease((t-6)/.7)*(1-ease((t-10.1)/.55)))
  layer=Image.new('RGBA',(W,H)); draw=ImageDraw.Draw(layer)
  ring=8+3*math.sin((t-6)*1.8)**2
  draw.ellipse((sx-ring,sy-ring,sx+ring,sy+ring),outline=(239,194,121,int(210*alpha)),width=1)
  draw.ellipse((sx-3,sy-3,sx+3,sy+3),fill=(255,227,176,int(255*alpha)))
  im=Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
 return im


def city(t):
 s=float(ease((t-9.7)/(DURATION-9.7)))
 # True crop drift, no nonuniform image stretch.
 ratio=W/H; aw,ah=aerial.size
 basew=min(aw,ah*ratio); baseh=basew/ratio
 scale=1.025+.026*s
 cw=basew/scale; ch=baseh/scale
 cx=aw*.5+basew*.008*s; cy=ah*.51-baseh*.006*s
 return aerial.crop((cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2)).resize((W,H),Image.Resampling.LANCZOS)


def frame(t):
 if t<=9.7: im=globe(t)
 elif t>=11.7: im=city(t)
 else:
  alpha=float(ease((t-9.7)/2))
  im=Image.blend(globe(min(t,10.4)),city(t),alpha)
  # Soft mist bridge makes the imagery change intentionally atmospheric.
  mist=Image.new('RGB',(W,H),(187,193,185))
  im=Image.blend(im,mist,.17*math.sin(math.pi*alpha))
 return im.resize(FINAL,Image.Resampling.LANCZOS)

if __name__=='__main__':
 if '--preview' in sys.argv:
  ROOT.joinpath('previews'+SUFFIX).mkdir(exist_ok=True)
  for t in [0,2,4.2,6.5,8,9.7,10.7,11.7,14.9]:
   frame(t).save(ROOT/f'previews{SUFFIX}/{t:04.1f}.jpg',quality=92)
 else:
  cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{FINAL[0]}x{FINAL[1]}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','24','-maxrate','2800k','-bufsize','5600k','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/f'journey{SUFFIX}.mp4')]
  proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
  for i in range(FPS*DURATION):
   im=frame(i/FPS)
   proc.stdin.write(im.tobytes())
   if i==0: im.save(ROOT/f'globe-poster{SUFFIX}.jpg',quality=91)
   if i==FPS*DURATION-1: im.save(ROOT/f'poster{SUFFIX}.jpg',quality=91)
   if i%48==0: print(f'{i}/{FPS*DURATION} frames',flush=True)
  proc.stdin.close()
  if proc.wait(): raise SystemExit('ffmpeg failed')
