"""Draw one shared vector composition to SVG and an A4-landscape PDF."""
from pathlib import Path
import base64, io, html, shutil, re
import xml.etree.ElementTree as ET
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode.qr import QrCodeWidget

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/assets'; CANON=ROOT/'output/pdf'; CANON.mkdir(parents=True,exist_ok=True)
W,H=1200,848
FONTS=Path('/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
fonts={'Serif':'LiberationSerif-Regular.ttf','Sans':'LiberationSans-Regular.ttf','Bold':'LiberationSans-Bold.ttf'}
css=[]
for name,file in fonts.items():
 p=FONTS/file;pdfmetrics.registerFont(TTFont(name,str(p)))
 css.append(f"@font-face{{font-family:{name};src:url(data:font/ttf;base64,{base64.b64encode(p.read_bytes()).decode()})}}")
PAGE=landscape(A4);c=canvas.Canvas(str(CANON/'ayodhya-guide.pdf'),pagesize=PAGE)
c.setTitle('Ayodhya, at a glance. | Vatsalya Bhawan');c.setAuthor('Vatsalya Bhawan')
c.scale(PAGE[0]/W,PAGE[1]/H);c.translate(0,H);c.scale(1,-1)
svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="848" viewBox="0 0 1200 848" role="img" aria-labelledby="title desc"><title id="title">Ayodhya, at a glance.</title><desc id="desc">A schematic, not-to-scale guide to six Ayodhya landmarks, with Vatsalya Bhawan contact details and a QR code for directions.</desc><style>{"".join(css)}</style>']
INK='#28372D';CLAY='#A94D26';GOLD='#D99935';PAPER='#FAF8F3';MUTED='#776A59';RIVER='#BDD0CB'
MAPS='https://www.google.com/maps/search/?api=1&query=Vatsalya%20Bhawan%2C%20Q6P3%2B883%2C%20Kaniganj%2C%20Ayodhya%2C%20Uttar%20Pradesh%20224123'
SITE='https://eye-52.github.io/vatsalya-bhawan/'

def style(fill,stroke,width):
 c.setFillColor(HexColor(fill or PAPER));c.setStrokeColor(HexColor(stroke or PAPER));c.setLineWidth(width);c.setLineJoin(1);c.setLineCap(1)
 return f'fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"'

def rect(x,y,w,h,fill=None,stroke=None,width=1,r=0):
 st=style(fill,stroke,width);c.roundRect(x,y,w,h,r,stroke=bool(stroke),fill=bool(fill));svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" {st}/>')

def circle(x,y,r,fill=None,stroke=None,width=1):
 st=style(fill,stroke,width);c.circle(x,y,r,stroke=bool(stroke),fill=bool(fill));svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" {st}/>')

def path(commands,fill=None,stroke=CLAY,width=2):
 st=style(fill,stroke,width);p=c.beginPath();d=[]
 for op,*v in commands:
  d.append(op+' '.join(map(str,v)))
  if op=='M':p.moveTo(*v)
  elif op=='L':p.lineTo(*v)
  elif op=='C':p.curveTo(*v)
  elif op=='Z':p.close()
 c.drawPath(p,stroke=bool(stroke),fill=bool(fill));svg.append(f'<path d="{" ".join(d)}" {st}/>')

def line(x1,y1,x2,y2,color=CLAY,width=2):path([('M',x1,y1),('L',x2,y2)],stroke=color,width=width)

def text(x,y,t,size=20,font='Sans',color=INK,anchor='start'):
 c.saveState();c.translate(x,y);c.scale(1,-1);c.setFillColor(HexColor(color));c.setFont(font,size)
 if anchor=='middle':c.drawCentredString(0,0,t)
 elif anchor=='end':c.drawRightString(0,0,t)
 else:c.drawString(0,0,t)
 c.restoreState();svg.append(f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" fill="{color}" text-anchor="{anchor}">{html.escape(t)}</text>')

def link(x,y,w,h,url):
 c.linkURL(url,(x,y,x+w,y+h),relative=1,thickness=0)
 svg.append(f'<a href="{html.escape(url,quote=True)}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="transparent"/></a>')

def temple(x,y,s=1):
 # Abstract temple pictogram; no claim to a specific architectural plan.
 for dx,h in [(-32,22),(0,48),(32,22)]:
  xx=x+dx*s
  path([('M',xx-14*s,y),('L',xx-12*s,y-h*s*.6),('L',xx,y-h*s),('L',xx+12*s,y-h*s*.6),('L',xx+14*s,y)],fill='#F1DFC5',width=2*s)
  line(xx,y-h*s,xx,y-h*s-12*s,width=1.5*s)
  path([('M',xx,y-h*s-12*s),('L',xx+11*s,y-h*s-9*s),('L',xx,y-h*s-5*s)],fill=GOLD,stroke=GOLD,width=1)
 rect(x-48*s,y,96*s,19*s,PAPER,CLAY,2*s)
 for dx in [-30,-10,10,30]:line(x+dx*s,y+4*s,x+dx*s,y+16*s,width=1.5*s)
 line(x-53*s,y+23*s,x+53*s,y+23*s,width=2*s)

def brandmark(x,y,size):
 # Reuse the exact outlined Devanagari initial from the current favicon.
 glyph=ET.parse(OUT.parent/'favicon.svg').getroot().find('{http://www.w3.org/2000/svg}path')
 tokens=re.findall(r'[A-Z]|[-+]?(?:\d*\.\d+|\d+)',glyph.attrib['d'])
 def xy(px,py):return x+(14.154+.061093*px)*size/64,y+(51-.061093*py)*size/64
 i=0;px=py=0;commands=[]
 while i<len(tokens):
  op=tokens[i];i+=1
  if op=='Z':commands.append(('Z',));continue
  count={'M':2,'L':2,'H':1,'V':1,'Q':4}[op]
  values=list(map(float,tokens[i:i+count]));i+=count
  if op=='Q':
   qx,qy,ex,ey=values
   a=xy(px+(qx-px)*2/3,py+(qy-py)*2/3)
   b=xy(ex+(qx-ex)*2/3,ey+(qy-ey)*2/3)
   commands.append(('C',*a,*b,*xy(ex,ey)));px,py=ex,ey
  else:
   if op in ['M','L']:px,py=values
   elif op=='H':px=values[0]
   elif op=='V':py=values[0]
   commands.append(('M' if op=='M' else 'L',*xy(px,py)))
 rect(x,y,size,size,INK)
 path(commands,fill=PAPER,stroke=None)

rect(0,0,W,H,PAPER)
text(48,68,'Ayodhya, at a glance.',49,'Serif')
text(51,99,'A few familiar landmarks. A place to come home to.',17,'Sans',MUTED)
# River is schematic only; no street, route or distance is drawn.
river=[('M',-45,179),('C',98,110,220,212,350,176),('C',505,131,648,135,795,173),('C',857,190,883,184,928,171)]
path(river,stroke=RIVER,width=64)
path(river,stroke='#E2EEEA',width=2)
text(267,152,'SARAYU',14,'Bold','#557B73','middle')
# North arrow
text(840,54,'N',13,'Bold',MUTED,'middle')
line(840,66,840,106,MUTED,1.5)
path([('M',833,78),('L',840,64),('L',847,78)],fill=MUTED,stroke=MUTED,width=1)
# Ram Ki Paidi / riverfront, northeast of the historic temple core.
for i in range(5):line(591-i*4,190+i*6,651+i*4,190+i*6,'#557B73',2)
path([('M',593,194),('C',606,190,614,199,627,195),('C',635,192,644,198,653,194)],stroke='#557B73',width=1.5)
text(609,232,'Ram Ki Paidi',23,'Serif')
text(609,255,'Sarayu riverfront',16,'Sans',MUTED)
# Ram Mandir west of the other temple core; Kanak Bhawan is northeast.
temple(230,380,1.28);
text(230,449,'Shri Ram Janmabhoomi',25,'Serif',anchor='middle')
text(230,477,'Mandir',25,'Serif',anchor='middle')
temple(435,290,.86);
text(435,346,'Kanak Bhawan',25,'Serif',anchor='middle')
# Hanuman Garhi abstract fort / steps pictogram.
rect(480,413,65,37,'#F1DFC5',CLAY,2)
for xx in [473,505,537]:rect(xx,401,14,49,PAPER,CLAY,2);rect(xx-1,396,16,7,'#F1DFC5',CLAY,1.5)
for i in range(4):line(488-i*6,456+i*6,538+i*6,456+i*6,CLAY,1.5)
text(514,519,'Hanuman Garhi',25,'Serif',anchor='middle')
# Railway station lies south of the temple core.
rect(407,597,56,46,'#F1DFC5',INK,2,r=8)
rect(415,605,40,17,PAPER,INK,1.5,r=3)
circle(418,634,3,INK);circle(452,634,3,INK)
line(421,647,414,657,INK,2);line(449,647,456,657,INK,2)
text(436,685,'Ayodhya Dham',24,'Serif',anchor='middle')
text(436,710,'Railway station',16,'Sans',MUTED,'middle')
# Property is southeast of the station, not at the temple.
circle(683,677,47,'#EEE9DA')
brandmark(647,641,72)
text(684,742,'Vatsalya Bhawan',25,'Serif',INK,'middle')
text(684,769,'Kaniganj',16,'Sans',MUTED,'middle')
link(605,631,157,146,MAPS)
# Decorative diya and minimal guide disclosure.
path([('M',66,734),('C',73,754,102,754,109,734),('Z',)],fill='#F1DFC5',stroke=CLAY,width=2)
path([('M',88,733),('C',73,719,83,708,88,700),('C',96,712,103,724,88,733)],fill=GOLD,stroke=GOLD,width=1)
text(51,813,'SCHEMATIC / NOT TO SCALE',13,'Bold',MUTED)
text(510,813,'District Ayodhya / © OpenStreetMap contributors',12,'Sans',MUTED)
# Sidebar ad, painted over the river overshoot for a clean map/ad boundary.
rect(908,0,292,H,'#EFE3D2')
line(908,0,908,H,'#D4BFA5',1)
brandmark(937,31,52)
text(937,117,'Vatsalya',37,'Serif')
text(937,153,'Bhawan',37,'Serif')
text(937,185,'Your place in Kaniganj.',17,'Sans',CLAY)
# Alpha image thumbnail is embedded, so the SVG is independently downloadable.
im=Image.open(OUT/'exterior-cutout.png').convert('RGBA');im.thumbnail((420,500),Image.Resampling.LANCZOS)
buf=io.BytesIO();im.save(buf,format='PNG',optimize=True);png=buf.getvalue()
x,y,iw,ih=945,214,222,277
c.saveState();c.translate(x,y+ih);c.scale(1,-1);c.drawImage(ImageReader(io.BytesIO(png)),0,0,width=iw,height=ih,mask='auto');c.restoreState()
svg.append(f'<image x="{x}" y="{y}" width="{iw}" height="{ih}" href="data:image/png;base64,{base64.b64encode(png).decode()}"/>')
text(947,509,'Building image: AI-reframed',10,'Sans',MUTED)
line(937,529,1171,529,'#CBB89B',1)
text(937,560,'+91 94513 38729',22,'Bold')
link(936,541,235,29,'tel:+919451338729')
text(937,590,'Tarun Pura Road',16)
text(937,613,'Kaniganj, Ayodhya',16)
text(937,636,'Uttar Pradesh 224123',16)
# Native ReportLab QR matrix, rendered as shared vector rectangles.
qr=QrCodeWidget(MAPS);qr.qr.make();n=qr.qr.getModuleCount();q=109/(n+8)
rect(937,658,109,109,'#FFFFFF')
for row in range(n):
 for col in range(n):
  if qr.qr.isDark(row,col):rect(937+(col+4)*q,658+(row+4)*q,q,q,INK)
text(1060,696,'Scan for',16)
text(1060,719,'directions',16)
link(936,657,111,111,MAPS)
text(937,801,'eye-52.github.io/',14)
text(937,822,'vatsalya-bhawan/',14)
link(935,780,238,46,SITE)
svg.append('</svg>');(OUT/'ayodhya-guide.svg').write_text('\n'.join(svg))
c.showPage();c.save();shutil.copy2(CANON/'ayodhya-guide.pdf',OUT/'ayodhya-guide.pdf')
print(OUT/'ayodhya-guide.svg');print(OUT/'ayodhya-guide.pdf')
