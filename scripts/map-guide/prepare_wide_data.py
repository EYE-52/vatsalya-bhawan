"""Export separate extended web-map context; original guide/data are untouched.
Use --refresh to explicitly fetch a new wide OSM snapshot before export.
All polylines and polygons retain the actual OSM geometry; no route is inferred.
"""
from pathlib import Path
import json, math, sys, hashlib, xml.etree.ElementTree as ET
from urllib.request import Request, urlopen
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'scripts/map-guide/data'; OUT=ROOT/'public/assets'
BBOX=[82.148,26.771,82.255,26.824]
SOURCE_URL='https://www.openstreetmap.org/api/0.6/map?bbox=82.148,26.771,82.255,26.824'
if '--refresh' in sys.argv:
 payload=urlopen(Request(SOURCE_URL,headers={'User-Agent':'VatsalyaBhawanVisitorMap/1.0 (attributed visitor guide)'}),timeout=100).read()
 ET.fromstring(payload)
 (DATA/'osm-wide-map.osm').write_bytes(payload)
r=ET.parse(DATA/'osm-wide-map.osm').getroot()
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
collection={'type':'FeatureCollection','bbox':BBOX,'metadata':{
 'source':'OpenStreetMap API 0.6 extended bounding-box extract and full river relation',
 'source_url':SOURCE_URL,'water_source_url':'https://www.openstreetmap.org/api/0.6/relation/8921902/full',
 'retrieved':'2026-10-07','copyright':'© OpenStreetMap contributors',
 'attribution_url':'https://www.openstreetmap.org/copyright','license':'ODbL 1.0',
 'license_url':'https://opendatacommons.org/licenses/odbl/1.0/',
 'note':'Extended geographic context for the web map. Not a route or a guarantee of public access. Temple entry arrangements may change.'},'features':features}
output=OUT/'ayodhya-streets-wide.geojson'
output.write_text(json.dumps(collection,separators=(',',':'),ensure_ascii=False))
(DATA/'osm-wide-map.sha256').write_text(hashlib.sha256((DATA/'osm-wide-map.osm').read_bytes()).hexdigest()+'  osm-wide-map.osm\n')
print('Exported',len(features),'features;',sum(f['properties']['kind']=='road' for f in features),'road/path features;',output.stat().st_size,'bytes')
print('Bounds',BBOX)
