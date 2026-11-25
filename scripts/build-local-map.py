"""Cache the trip's regional OpenFreeMap vector tiles for static hosting.

Run with Python. No third-party packages are required. Cached requests are
stored in .map-cache, and OpenStreetMap attribution stays in assets/map/.
"""

import concurrent.futures
import json
import math
from pathlib import Path
import time
import urllib.error
import urllib.request
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://tiles.openfreemap.org/planet"
OUTPUT = ROOT / "assets" / "map"
REGIONS = {
    "overview": (119.5, 29.0, 141.0, 37.0, range(4, 8)),
    "tokyo": (139.48, 35.48, 140.05, 35.92, range(8, 14)),
    "chichibu": (138.96, 35.88, 139.24, 36.18, range(8, 14)),
    "kamakura": (139.43, 35.23, 139.67, 35.42, range(8, 14)),
    "kyoto": (135.56, 34.91, 135.91, 35.10, range(8, 14)),
    "osaka": (135.18, 34.35, 135.78, 34.94, range(8, 14)),
}


def tile_range(west, south, east, north, zoom):
    scale = 2**zoom
    xmin = math.floor((west + 180) / 360 * scale)
    xmax = math.floor((east + 180) / 360 * scale)
    ymin = math.floor((1 - math.asinh(math.tan(math.radians(north))) / math.pi) / 2 * scale)
    ymax = math.floor((1 - math.asinh(math.tan(math.radians(south))) / math.pi) / 2 * scale)
    return ((zoom, x, y) for x in range(xmin, xmax + 1) for y in range(ymin, ymax + 1))


def download(url):
    request = urllib.request.Request(url, headers={"User-Agent": "JPT itinerary map/1.0"})
    parts = urlparse(url)
    cache = ROOT / ".map-cache" / parts.netloc / (parts.path.strip("/").replace("/", "-") or "metadata")
    if cache.exists():
        return cache.read_bytes()
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                data = response.read()
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_bytes(data)
            return data
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))


def main():
    metadata = json.loads(download(SOURCE_URL))
    source_template = metadata["tiles"][0]
    tiles = set()
    for west, south, east, north, zooms in REGIONS.values():
        for zoom in zooms:
            tiles.update(tile_range(west, south, east, north, zoom))

    def fetch(tile):
        zoom, x, y = tile
        data = download(source_template.format(z=zoom, x=x, y=y))
        directory = OUTPUT / "tiles" / str(zoom) / str(x)
        directory.mkdir(parents=True, exist_ok=True)
        (directory / f"{y}.pbf").write_bytes(data)
        return len(data)

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        total_bytes = sum(executor.map(fetch, tiles))

    style = json.loads(download("https://tiles.openfreemap.org/styles/positron"))
    vector_source = style["sources"]["openmaptiles"]
    style["sources"] = {
        "openmaptiles": {
            "type": "vector",
            "tiles": ["./assets/map/tiles/{z}/{x}/{y}.pbf"],
            "minzoom": 0,
            "maxzoom": vector_source.get("maxzoom", 14),
            "attribution": '<a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
    }
    style["layers"] = [layer for layer in style["layers"] if layer.get("source") != "ne2_shaded"]
    (OUTPUT / "positron.json").write_text(json.dumps(style, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(tiles)} static vector tiles, {total_bytes / 1024 / 1024:.1f} MiB")

    font_families = sorted({font for layer in style["layers"] for font in layer.get("layout", {}).get("text-font", [])})

    def fetch_glyph(job):
        family, first = job
        from urllib.parse import quote
        target = OUTPUT / "fonts" / family / f"{first}-{first + 255}.pbf"
        if target.exists():
            return
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            data = download(f"https://tiles.openfreemap.org/fonts/{quote(family)}/{first}-{first + 255}.pbf")
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return
            raise
        target.write_bytes(data)

    jobs = [(family, first) for family in font_families for first in range(0, 65536, 256)]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(fetch_glyph, jobs))
    for suffix in ("", "@2x"):
        for extension in ("json", "png"):
            data = download(f"https://tiles.openfreemap.org/sprites/ofm_f384/ofm{suffix}.{extension}")
            target = OUTPUT / "sprites" / f"ofm{suffix}.{extension}"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
    print("Local map glyphs and sprites are ready")


if __name__ == "__main__":
    main()
