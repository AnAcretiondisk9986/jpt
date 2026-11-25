import concurrent.futures
import re
from pathlib import Path
import time
import urllib.request
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
FONT_ROOT = ROOT / "assets" / "fonts"
CACHE = ROOT / ".map-cache" / "webfonts"
FONT_ROOT.mkdir(parents=True, exist_ok=True)
CACHE.mkdir(parents=True, exist_ok=True)
SOURCES = {
    "biz-udpmincho-400": "https://fonts.gstatic.com/s/bizudpmincho/v11/ypvfbXOBrmYppy7oWWTg1_58nhg.ttf",
    "biz-udpmincho-700": "https://fonts.gstatic.com/s/bizudpmincho/v11/ypvCbXOBrmYppy7oWWTg1_58pqR3kU4.ttf",
    "noto-sans-sc-900": "https://fonts.gstatic.com/s/notosanssc/v41/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG3bCnYw.ttf",
}

def download(url, target):
    if target.exists():
        return target.read_bytes()
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                data = response.read()
            target.write_bytes(data)
            return data
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))

text = "\n".join((ROOT / filename).read_text(encoding="utf-8") for filename in ("index.html", "app.js", "data.js"))
characters = sorted(set(text) - set("\n\r\t"))

def build_font(item):
    name, url = item
    source = CACHE / f"{name}.ttf"
    download(url, source)
    target = FONT_ROOT / f"{name}.woff2"
    options = subset.Options()
    options.flavor = "woff2"
    font = subset.load_font(str(source), options)
    sub = subset.Subsetter(options=options)
    sub.populate(text="".join(characters))
    sub.subset(font)
    subset.save_font(font, str(target), options)
    return name, target.stat().st_size

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for name, size in pool.map(build_font, SOURCES.items()):
        print(f"{name}: {size / 1024:.1f} KiB", flush=True)
for family in ("bizudpmincho", "notosanssc"):
    download(f"https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/OFL.txt", FONT_ROOT / f"{family}-OFL.txt")
