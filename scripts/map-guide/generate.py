"""Shared true-geographic vector drawing: A3 landscape PDF and overview SVG."""
from pathlib import Path
import html,json,math,shutil,xml.etree.ElementTree as ET
from urllib.parse import urlencode
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3,landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public/assets';DATA=ROOT/'scripts/map-guide/data'
G=json.loads((OUT/'ayodhya-streets.geojson').read_text());PLACES=json.loads((OUT/'ayodhya-places.json').read_text())
W,H=1400,990; PAGE=landscape(A3)
FONTDIR=Path('/Users/divyansh/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name,file in [('Sans','LiberationSans-Regular.ttf'),('Bold','LiberationSans-Bold.ttf'),('Serif','LiberationSerif-Regular.ttf')]:pdfmetrics.registerFont(TTFont(name,str(FONTDIR/file)))
INK='#24372C';GREEN='#315A40';PAPER='#FFFFFF';LAND='#F4F3EB';ROAD='#C7C7B9';GOLD='#AA741F';WATER='#BEDDE7';MUTED='#5F6962'
PDF=OUT/'ayodhya-guide.pdf';c=canvas.Canvas(str(PDF),pagesize=PAGE);c.setTitle('Ayodhya street and walking guide | Vatsalya Bhawan');c.setAuthor('Vatsalya Bhawan');svgs=[]
def start_page(title,desc):
 global svg
 c.saveState();c.scale(PAGE[0]/W,PAGE[1]/H);c.translate(0,H);c.scale(1,-1)
 svg=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1400" height="990" viewBox="0 0 1400 990" role="img" aria-labelledby="title desc"><title id="title">{html.escape(title)}</title><desc id="desc">{html.escape(desc)}</desc><style>.halo{{paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}}</style>']
def rect(x,y,w,h,fill,stroke=None,width=1):
 c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.setLineWidth(width);c.rect(x,y,w,h,fill=1,stroke=bool(stroke));svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="{width}"/>')
def poly(points,fill=None,stroke=None,width=1,dash=None,close=False):
 if len(points)<2:return
 p=c.beginPath();p.moveTo(*points[0]);d=f'M{points[0][0]:.2f},{points[0][1]:.2f}'
 for x,y in points[1:]:p.lineTo(x,y);d+=f'L{x:.2f},{y:.2f}'
 if close:p.close();d+='Z'
 c.setFillColor(HexColor(fill or PAPER));c.setStrokeColor(HexColor(stroke or PAPER));c.setLineWidth(width);c.setLineJoin(1);c.setLineCap(1);c.setDash(dash or []);c.drawPath(p,fill=bool(fill),stroke=bool(stroke));c.setDash([])
 svg.append(f'<path d="{d}" fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"'+(f' stroke-dasharray="{" ".join(map(str,dash))}"' if dash else '')+'/>')
def line(x1,y1,x2,y2,color=INK,width=1,dash=None):poly([(x1,y1),(x2,y2)],stroke=color,width=width,dash=dash)
def circle(x,y,r,fill,stroke=None,width=1):
 c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.setLineWidth(width);c.circle(x,y,r,fill=1,stroke=bool(stroke));svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="{width}"/>')
def text(x,y,t,size=18,font='Sans',color=INK,anchor='start',halo=False,angle=0):
 c.saveState();c.translate(x,y);c.rotate(angle);c.scale(1,-1);c.setFont(font,size)
 tx=-pdfmetrics.stringWidth(t,font,size)/2 if anchor=='middle' else -pdfmetrics.stringWidth(t,font,size) if anchor=='end' else 0
 if halo:
  c.saveState();obj=c.beginText(tx,0);obj.setFont(font,size);obj.setTextRenderMode(2);c.setLineWidth(5);c.setStrokeColor(HexColor(PAPER));obj.textOut(t);c.drawText(obj);c.restoreState()
 c.setFillColor(HexColor(color));obj=c.beginText(tx,0);obj.setFont(font,size);obj.setTextRenderMode(0);obj.textOut(t);c.drawText(obj);c.restoreState()
 family='Georgia,serif' if font=='Serif' else 'Arial,Helvetica,sans-serif'
 svg.append(f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{700 if font=="Bold" else 400}" fill="{color}" text-anchor="{anchor}"'+(' class="halo"' if halo else '')+(f' transform="rotate({angle} {x} {y})"' if angle else '')+f'>{html.escape(t)}</text>')
def link(x,y,w,h,url):
 # c is vertically flipped: explicit physical page coordinates keep annotations correct.
 scale=PAGE[0]/W;c.linkURL(url,(x*scale,(H-y-h)*scale,(x+w)*scale,(H-y)*scale),relative=0,thickness=0)
 svg.append(f'<a href="{html.escape(url,quote=True)}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="transparent"/></a>')
def walking(query):return 'https://www.google.com/maps/dir/?'+urlencode({'api':1,'destination':query,'travelmode':'walking'})
def qr(x,y,size,url):
 q=QrCodeWidget(url);q.qr.make();n=q.qr.getModuleCount();unit=size/(n+8);rect(x,y,size,size,'#FFFFFF')
 for row in range(n):
  for col in range(n):
   if q.qr.isDark(row,col):rect(x+(col+4)*unit,y+(row+4)*unit,unit,unit,INK)
 link(x,y,size,size,url)
def projection(bounds,frame):
 west,south,east,north=bounds;x,y,w,h=frame;cos=math.cos(math.radians((north+south)/2));xm=111320*cos;ym=111320;scale=min(w/((east-west)*xm),h/((north-south)*ym));ox=x+(w-(east-west)*xm*scale)/2;oy=y+(h-(north-south)*ym*scale)/2
 return lambda lon,lat:(ox+(lon-west)*xm*scale,oy+(north-lat)*ym*scale),scale
# Read real building footprints for quiet landmark context.
r=ET.parse(DATA/'osm-api-map.osm').getroot();nodes={n.attrib['id']:(float(n.attrib['lon']),float(n.attrib['lat'])) for n in r.findall('node')};ways={w.attrib['id']:w for w in r.findall('way')}
def chunks(f):
 g=f['geometry'];return [g['coordinates']] if g['type']=='LineString' else g['coordinates']
def map_draw(bounds,detail=False):
 frame=(35,133,1070,741);proj,scale=projection(bounds,frame);x,y,w,h=frame;rect(x,y,w,h,LAND)
 c.saveState();clip=c.beginPath();clip.rect(x,y,w,h);c.clipPath(clip,fill=0,stroke=0);svg.append(f'<defs><clipPath id="mapclip"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath></defs><g clip-path="url(#mapclip)">')
 for f in G['features']:
  if f['properties']['kind']=='water':
   for i,ring in enumerate(f['geometry']['coordinates']):poly([proj(*p) for p in ring],fill=WATER if i==0 else LAND,stroke='#8EB7C8',width=.8,close=True)
 for id in ['444883293','1241983860','736857581','843831315','843831292']:
  points=[proj(*nodes[n.attrib['ref']]) for n in ways[id].findall('nd')];poly(points,fill='#E4E8D5',stroke='#A8B898',width=.8,close=True)
 roads=[f for f in G['features'] if f['properties']['kind']=='road']
 for f in roads:
  p=f['properties'];cls=p['class'];restricted=p.get('access') in ('no','private') or p.get('foot')=='no';foot=cls in ('footway','path','pedestrian','steps');major=cls in ('primary','secondary','tertiary','trunk')
  width=(7 if major else 3.5) if detail else (5 if major else 2.1)
  for pts in chunks(f):
   xy=[proj(*v) for v in pts]
   if restricted:poly(xy,stroke='#B2A8AD',width=1.3,dash=[2.5,3])
   elif foot:poly(xy,stroke=GOLD,width=1.3 if detail else 1,dash=[3,2])
   else:poly(xy,stroke=ROAD,width=width+1);poly(xy,stroke='#FFFFFF',width=width)
 for f in G['features']:
  if f['properties']['kind']=='rail':
   for pts in chunks(f):poly([proj(*v) for v in pts],stroke='#7B8582',width=1.3,dash=[7,4])
 # Road labels anchor on actual mapped road segments. Deduplicate parallel ways.
 occupied=[]
 label_boxes=[]
 box_offsets={'hotel':(18,26),'ram-mandir':(-18,-18),'hanuman-garhi':(18,24),'kanak-bhawan':(-18,-18),'ram-ki-paidi':(18,25),'ayodhya-dham':(-18,-17),'dashrath-mahal':(-18,22)}
 if detail:box_offsets.update({'ram-mandir':(-18,-19),'hanuman-garhi':(18,21),'kanak-bhawan':(18,-14),'dashrath-mahal':(-18,24)})
 for place in PLACES:
  if not detail and place['id']=='dashrath-mahal':continue
  px,py=proj(place['lon'],place['lat']);dx,dy=box_offsets[place['id']];sz=21 if detail else 18
  name='Ram Mandir' if place['id']=='ram-mandir' else place['name'];tw=pdfmetrics.stringWidth(name,'Bold',sz)
  left=px+dx-(tw if dx<0 else 0);right=left+tw
  label_boxes.append((min(px-10,left-10),min(py-10,py+dy-sz-10),max(px+10,right+10),max(py+10,py+dy+12+(21 if place['id'] in ['ram-mandir','hotel'] else 0))))
 def roadlabel(name,wayid,index=None):
  f=next((f for f in roads if f['properties']['id']=='way/'+str(wayid)),None)
  if not f:return
  pts=max(chunks(f),key=len);pairs=list(zip(pts,pts[1:]));pairs.sort(key=lambda ab:math.dist(proj(*ab[0]),proj(*ab[1])),reverse=True)
  for a,b in pairs:
   ax,ay=proj(*a);bx,by=proj(*b);xx,yy=(ax+bx)/2,(ay+by)/2
   if not x+95<xx<x+w-95 or not y+45<yy<y+h-45:continue
   if any(math.dist((xx,yy),q)<95 for q in occupied):continue
   if any(math.dist((xx,yy),proj(p['lon'],p['lat']))<130 for p in PLACES if p['kind']=='temple'):continue
   angle=math.degrees(math.atan2(by-ay,bx-ax));angle=angle+180 if angle>90 or angle<-90 else angle
   rad=math.radians(angle);tw=pdfmetrics.stringWidth(name,'Sans',14 if detail else 13);bw=abs(math.cos(rad))*tw/2+abs(math.sin(rad))*14;bh=abs(math.sin(rad))*tw/2+abs(math.cos(rad))*14
   box=(xx-bw,yy-bh,xx+bw,yy+bh)
   if any(box[0]<b[2] and box[2]>b[0] and box[1]<b[3] and box[3]>b[1] for b in label_boxes):continue
   if box[0]<x+10 or box[2]>x+w-10 or box[1]<y+10 or box[3]>y+h-10:continue
   text(xx,yy-4,name,14 if detail else 13,'Sans',MUTED,'middle',True,angle);occupied.append((xx,yy));return
 if detail:
  roadlabel('Ram Path',955300713);roadlabel('Janmabhoomi Path',1241253883);roadlabel('Kanak Bhawan Road',260795565)
 else:
  roadlabel('Ram Path',955300713);roadlabel('Ram Path',1023604179);roadlabel('Kosi Parikrama Road',356630647);roadlabel('Darsan Nagar Road',954809081);roadlabel('Jhunki Ghat road',846937673)
 if not detail:
  xx,yy=proj(82.1985,26.8116);text(xx,yy,'Sarayu river',18,'Sans','#427889','middle',True)
 svg.append('</g>');c.restoreState()
 # Point labels outside the street clipping so they remain easy to read.
 offsets={'hotel':(18,26),'ram-mandir':(-18,-18),'hanuman-garhi':(18,24),'kanak-bhawan':(-18,-18),'ram-ki-paidi':(18,25),'ayodhya-dham':(-18,-17),'dashrath-mahal':(-18,22)}
 if detail:offsets.update({'ram-mandir':(-18,-19),'hanuman-garhi':(18,21),'kanak-bhawan':(18,-14),'dashrath-mahal':(-18,24)})
 for p in PLACES:
  xx,yy=proj(p['lon'],p['lat'])
  if not x+10<xx<x+w-10 or not y+10<yy<y+h-10:continue
  if not detail and p['id']=='dashrath-mahal':continue
  color=GREEN if p['kind']=='hotel' else '#33525D' if p['kind']=='station' else GOLD
  circle(xx,yy,7 if detail else 6,color,PAPER,2)
  dx,dy=offsets[p['id']];label='Ram Mandir' if p['id']=='ram-mandir' else p['name'];anchor='end' if dx<0 else 'start'
  text(xx+dx,yy+dy,label,21 if detail else 18,'Bold',INK,anchor,True)
  tw=pdfmetrics.stringWidth(label,'Bold',21 if detail else 18);link(xx+dx-(tw if dx<0 else 0),yy+dy-24,tw,30,walking(p['query']))
  if p['id']=='ram-mandir':text(xx+dx,yy+dy+21,'Temple building',13,'Sans',MUTED,anchor,True)
  if p['id']=='hotel':text(xx+dx,yy+dy+21,'Kaniganj',13,'Sans',MUTED,anchor,True)
 # North arrow and honest metric scale (local equirectangular projection).
 rect(53,151,54,83,PAPER);text(80,169,'N',14,'Bold',INK,'middle');line(80,181,80,220,INK,2);poly([(74,193),(80,180),(86,193)],fill=INK,close=True)
 distance=200 if detail else 500;bar=distance*scale;rect(55,823,bar+28,37,PAPER);line(69,844,69+bar,844,INK,3);line(69,839,69,849,INK,1);line(69+bar,839,69+bar,849,INK,1);text(69+bar/2,835,f'{distance} m',12,'Sans',INK,'middle')
 return proj

def sidebar(detail):
 rect(1130,133,235,741,'#EDF2E7');text(1150,166,'Vatsalya',32,'Serif');text(1150,201,'Bhawan',32,'Serif');text(1150,231,'Stay in Kaniganj',15,'Sans',GREEN)
 line(1150,251,1345,251,'#B7C5AB');text(1150,284,'+91 94513 38729',20,'Bold');link(1150,263,200,30,'tel:+919451338729')
 for yy,t in [(315,'Tarun Pura Road'),(337,'Kaniganj, Ayodhya'),(359,'Uttar Pradesh 224123')]:text(1150,yy,t,15)
 text(1150,400,'Walk back to your stay',17,'Bold');home=walking(PLACES[0]['query']);qr(1150,417,140,home);text(1150,579,'Scan for Google Maps',14);text(1150,600,'walking directions.',14)
 line(1150,623,1345,623,'#B7C5AB');text(1150,654,'Choose a landmark',16,'Bold')
 for yy,id in [(683,'ram-mandir'),(711,'hanuman-garhi'),(739,'kanak-bhawan'),(767,'ram-ki-paidi'),(795,'ayodhya-dham')]:
  p=next(p for p in PLACES if p['id']==id);label={'ram-mandir':'Ram Mandir','ayodhya-dham':'Ayodhya Dham station'}.get(id,p['name']);text(1150,yy,label,15,'Sans',GREEN);link(1145,yy-18,205,23,walking(p['query']))
 text(1150,846,'Tap a name in this PDF.',13,'Sans',MUTED)

def footer(detail,page):
 line(35,895,1365,895,'#BCC6BA')
 line(40,920,72,920,ROAD,6);line(40,920,72,920,PAPER,4);text(80,925,'Streets / lanes',13)
 line(232,920,264,920,GOLD,1.5,[3,2]);text(272,925,'Mapped footways / steps',13)
 line(474,920,506,920,'#B2A8AD',1.5,[2.5,3]);text(514,925,'Restricted access in OSM',13)
 text(35,951,'Follow current temple entry signs. Street data is a guide; access and Google walking routes may change.',14,'Sans',MUTED)
 text(35,975,'Map data © OpenStreetMap contributors | https://www.openstreetmap.org/copyright | ODbL 1.0 | 7 Oct 2026',12,'Sans',MUTED)
 link(125,960,380,23,'https://www.openstreetmap.org/copyright');text(1365,975,f'{page} / 2',13,'Sans',MUTED,'end')
for detail,page in [(False,1),(True,2)]:
 title='Ayodhya on foot' if not detail else 'The temple streets'
 start_page(title,'Real OpenStreetMap street, lane, footpath and water geometry. Landmark pins are geographic locations, not a drawn itinerary.')
 rect(0,0,W,H,PAPER);text(35,67,title,49,'Serif');text(37,101,'Your stay, the station and the Sarayu riverfront.' if not detail else 'A closer view of Ramkot, Hanuman Garhi and the Janmabhoomi approach.',19,'Sans',MUTED)
 text(1365,63,'Street & walking guide',17,'Sans',GREEN,'end');text(1365,98,'Print at A3 for the clearest lanes',13,'Sans',MUTED,'end')
 bounds=[82.184,26.782,82.218,26.813] if not detail else [82.188,26.7900,82.2056,26.801]
 map_draw(bounds,detail);sidebar(detail);footer(detail,page);svg.append('</svg>');svgs.append('\n'.join(svg));c.restoreState();c.showPage()
c.save();canonical=ROOT/'output/pdf';canonical.mkdir(parents=True,exist_ok=True);shutil.copy2(PDF,canonical/'ayodhya-guide.pdf');(OUT/'ayodhya-guide.svg').write_text(svgs[0]);print(PDF);print(OUT/'ayodhya-guide.svg')
