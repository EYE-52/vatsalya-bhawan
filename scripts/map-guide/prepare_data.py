"""Convert the pinned OSM API extract to clipped, lightweight navigation context.
All polylines and polygons retain the actual OSM geometry; no route is inferred.
"""
from pathlib import Path
import json, math, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'scripts/map-guide/data'; OUT=ROOT/'public/assets'
BBOX=[82.184,26.782,82.218,26.813]
r=ET.parse(DATA/'osm-api-map.osm').getroot()
nodes={n.attrib['id']:[float(n.attrib['lon']),float(n.attrib['lat'])] for n in r.findall('node')}
ways={w.attrib['id']:w for w in r.findall('way')}
river=ET.parse(DATA/'osm-river.osm').getroot()
nodes.update({n.attrib['id']:[float(n.attrib['lon']),float(n.attrib['lat'])] for n in river.findall('node')})
ways.update({w.attrib['id']:w for w in river.findall('way')})
def tags(e):return {t.attrib['k']:t.attrib['v'] for t in e.findall('tag')}
def coords(w):return [nodes[n.attrib['ref']] for n in w.findall('nd')]
def clip_segment(a,b):
 dx,dy=b[0]-a[0],b[1]-a[1];t0,t1=0,1
 for p,q in [(-dx,a[0]-BBOX[0]),(dx,BBOX[2]-a[0]),(-dy,a[1]-BBOX[1]),(dy,BBOX[3]-a[1])]:
  if p==0:
   if q<0:return
  else:
   v=q/p
   if p<0:t0=max(t0,v)
   else:t1=min(t1,v)
   if t0>t1:return
 return [[a[0]+t0*dx,a[1]+t0*dy],[a[0]+t1*dx,a[1]+t1*dy]]
def clip_lines(points):
 chunks=[];part=[]
 for a,b in zip(points,points[1:]):
  s=clip_segment(a,b)
  if not s:
   if len(part)>1:chunks.append(part)
   part=[];continue
  if not part:part=s
  elif all(abs(part[-1][i]-s[0][i])<1e-8 for i in (0,1)):part.append(s[1])
  else:
   if len(part)>1:chunks.append(part)
   part=s
 if len(part)>1:chunks.append(part)
 return chunks
def clip_polygon(points):
 points=points[:-1] if points[0]==points[-1] else points
 for axis,limit,greater in [(0,BBOX[0],True),(0,BBOX[2],False),(1,BBOX[1],True),(1,BBOX[3],False)]:
  result=[]
  if not points:return []
  prev=points[-1];pin=prev[axis]>=limit if greater else prev[axis]<=limit
  for point in points:
   inside=point[axis]>=limit if greater else point[axis]<=limit
   if inside!=pin:
    k=(limit-prev[axis])/(point[axis]-prev[axis]);result.append([prev[0]+k*(point[0]-prev[0]),prev[1]+k*(point[1]-prev[1])])
   if inside:result.append(point)
   prev,pin=point,inside
  points=result
 return points+[points[0]] if len(points)>2 else []
def rounded(obj):
 if isinstance(obj,list):return [rounded(v) for v in obj]
 return round(obj,7) if isinstance(obj,float) else obj
features=[]
def feature(id,kind,cls,name,geometry,t={}):
 props={'id':id,'kind':kind,'class':cls,'name':name}
 for key in ['access','foot','surface','oneway','bridge','tunnel','bicycle']:
  if key in t:props[key]=t[key]
 if kind=='road' and name=='Chowk Ayodhya Road':props['display_name']='Ram Path (Chowk Ayodhya Road)'
 features.append({'type':'Feature','properties':props,'geometry':{'type':geometry[0],'coordinates':rounded(geometry[1])}})
for id,w in ways.items():
 t=tags(w);p=coords(w);name=t.get('name:en',t.get('name',''))
 if t.get('highway') and t['highway'] not in ['construction','proposed','rest_area','services']:
  chunks=clip_lines(p)
  if chunks:feature('way/'+id,'road',t['highway'],name,('LineString',chunks[0]) if len(chunks)==1 else ('MultiLineString',chunks),t)
 elif t.get('railway')=='rail':
  chunks=clip_lines(p)
  if chunks:feature('way/'+id,'rail','rail',name,('LineString',chunks[0]) if len(chunks)==1 else ('MultiLineString',chunks),t)
 elif t.get('natural')=='water' and p[0]==p[-1]:
  ring=clip_polygon(p)
  if ring:feature('way/'+id,'water',t.get('water','water'),name,('Polygon',[ring]),t)
# The full OSM river relation is pinned separately, so every outer and inner
# polygon is available before geographic clipping.
rel=next(x for x in r.findall('relation') if x.attrib['id']=='8921902');outer=[];inners=[]
for m in rel.findall('member'):
 if m.attrib['type']=='way' and m.attrib['ref'] in ways:
  p=coords(ways[m.attrib['ref']]);ring=clip_polygon(p)
  if ring:(outer if m.attrib['role']=='outer' else inners).append(ring)
for ring in outer:feature('relation/8921902','water','river','Sarayu (Ghaghara)',('Polygon',[ring]+inners),tags(rel))
collection={'type':'FeatureCollection','bbox':BBOX,'metadata':{'source':'OpenStreetMap API 0.6 bounding-box extract and full river relation','source_url':'https://www.openstreetmap.org/api/0.6/map?bbox=82.184,26.782,82.218,26.813','water_source_url':'https://www.openstreetmap.org/api/0.6/relation/8921902/full','retrieved':'2026-10-07','copyright':'© OpenStreetMap contributors','attribution_url':'https://www.openstreetmap.org/copyright','license':'ODbL 1.0','license_url':'https://opendatacommons.org/licenses/odbl/1.0/','note':'Geographic context only. Not a route or a guarantee of public access. Temple entry arrangements may change.'},'features':features}
(OUT/'ayodhya-streets.geojson').write_text(json.dumps(collection,separators=(',',':'),ensure_ascii=False))
def centroid(id):
 p=coords(ways[id]);p=p[:-1] if p[0]==p[-1] else p
 # Polygon centroid, rather than a bounding box or drawing approximation.
 area=0;x=y=0
 for a,b in zip(p,p[1:]+p[:1]):
  cross=a[0]*b[1]-b[0]*a[1];area+=cross;x+=(a[0]+b[0])*cross;y+=(a[1]+b[1])*cross
 return [x/(3*area),y/(3*area)]
entries=[('hotel','Vatsalya Bhawan',82.2032408,26.7857896,'hotel','26.7857896,82.2032408','Tarun Pura Road, Kaniganj. Verified property-listing location.'),
 ('ram-mandir','Shri Ram Janmabhoomi Mandir',*centroid('1241983860'),'temple','Shri Ram Janmabhoomi Mandir Ayodhya','Follow the current entry signs.'),
 ('hanuman-garhi','Hanuman Garhi',*centroid('736857581'),'temple','Hanuman Garhi entrance Ayodhya','Temple in the historic centre. Entry includes stairs.'),
 ('kanak-bhawan','Kanak Bhawan',*centroid('843831315'),'temple','Kanak Bhawan Ayodhya','Ramkot temple, northeast of Shri Ram Janmabhoomi.'),
 ('ram-ki-paidi','Ram ki Paidi',*centroid('260795620'),'riverfront','Ram ki Paidi Ayodhya','Ghats beside the Sarayu river.'),
 ('ayodhya-dham','Ayodhya Dham Junction',82.2010025,26.7879374,'station','Ayodhya Dham Junction railway station','Railway station south of the historic temple centre.'),
 ('dashrath-mahal','Dashrath Mahal',*centroid('843831292'),'temple','Dashrath Mahal Ayodhya','Landmark between Hanuman Garhi and Kanak Bhawan.')]
places=[dict(id=id,name=name,lat=round(lat,7),lon=round(lon,7),kind=kind,query=query,info=info) for id,name,lon,lat,kind,query,info in entries]
(OUT/'ayodhya-places.json').write_text(json.dumps(places,indent=2,ensure_ascii=False)+'\n')
print('Exported',len(features),'features;',sum(f['properties']['kind']=='road' for f in features),'streets and paths')
print(json.dumps(places,indent=2))
