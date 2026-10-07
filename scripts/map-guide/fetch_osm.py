"""Refresh pinned OSM snapshots explicitly. Building outputs never needs network."""
from pathlib import Path
from urllib.request import Request,urlopen
import xml.etree.ElementTree as ET
DATA=Path(__file__).resolve().parent/'data'
SOURCES={
 'osm-api-map.osm':'https://www.openstreetmap.org/api/0.6/map?bbox=82.184,26.782,82.218,26.813',
 'osm-river.osm':'https://www.openstreetmap.org/api/0.6/relation/8921902/full',
}
for filename,url in SOURCES.items():
 payload=urlopen(Request(url,headers={'User-Agent':'VatsalyaBhawanVisitorMap/1.0 (OpenStreetMap attributed visitor guide)'}),timeout=60).read()
 ET.fromstring(payload) # Never replace a snapshot with an HTTP error page.
 (DATA/filename).write_bytes(payload)
 print(filename,len(payload))
