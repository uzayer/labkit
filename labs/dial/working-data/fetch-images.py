"""Download the Google Sites images the DIAL records reference, into data/dial-images/.

The records in ../dial-test-full-data/ keep the image URLs of the 2026-09-12
capture. Google has since moved Sites images to short-lived, per-page-load
`sitesv-images-rt` URLs, so the captured ones return 403. The page text is
unchanged since that capture (re-scraped 2026-09-27), so the Nth image of a
captured page is the Nth image of the live page. The script refuses a page
whose image count no longer matches, rather than guessing.

Writes data/dial-images/<sha1>.<ext> and index.json (captured URL → file name),
which write-dial-confirmed.ts reads. data/ is ignored by Git.

    python3 labs/dial/working-data/fetch-images.py
"""

import glob
import hashlib
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CAPTURES = ROOT / "labs/dial/scraped-data"
OUT = ROOT / "data/dial-images"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
NSU = "https://sites.google.com/view/nsuhci/"
NOVA = "https://sites.google.com/site/novaahmednorthsouthnva/"
# Captured image hosts: the 2026-09-12 capture mostly has lh*.googleusercontent.com
# URLs, and a few pages already had the newer, equally expired sitesv-images-rt ones.
IMAGE = r"https://(?:lh\d\.googleusercontent\.com/|sites\.google\.com/sitesv-images-rt/)"
EXTENSIONS = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}


def live_url(site, name):
    if site == "nsu-hci-current-website":
        return NSU + name
    if name == "home":
        return NOVA
    if name.startswith("home-"):
        return NOVA + name.replace("home-", "home/", 1).replace("home/alias", "home")
    if name.startswith("research-"):
        return NOVA + name.replace("research-", "research/", 1)
    return NOVA + name


def get(url, referer=None):
    headers = {"User-Agent": UA}
    if referer:
        headers["Referer"] = referer
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        return response.read(), response.headers.get_content_type()


def main():
    referenced = set()
    for path in glob.glob(str(ROOT / "labs/dial/dial-test-full-data/*.ts")):
        referenced |= set(re.findall(IMAGE + r"[^'\"\s]+", Path(path).read_text()))

    OUT.mkdir(parents=True, exist_ok=True)
    index_path = OUT / "index.json"
    index = json.loads(index_path.read_text()) if index_path.exists() else {}

    for capture in sorted(CAPTURES.glob("*/*.md")):
        captured = re.findall(r"!\[[^\]]*\]\((" + IMAGE + r"[^)\s]+)", capture.read_text())
        wanted = [i for i, url in enumerate(captured) if url in referenced and url not in index]
        if not wanted:
            continue
        page = live_url(capture.parent.name, capture.stem)
        live = None
        for i in wanted:
            for attempt in range(3):
                if live is None or attempt:
                    # Tokens expire within minutes: reload the page for fresh ones.
                    html = get(page)[0].decode()
                    live = [u.replace("&amp;", "&") for u in re.findall(r'src="(https://sites\.google\.com/sitesv-images-rt/[^"]+)"', html)]
                    if len(live) != len(captured):
                        break
                try:
                    data, content_type = get(live[i], referer=page)
                    break
                except urllib.error.HTTPError as error:
                    if error.code != 403 or attempt == 2:
                        raise
            if len(live) != len(captured):
                print(f"SKIP {page}: {len(captured)} captured images, {len(live)} live; the page has changed")
                break
            name = f"{hashlib.sha1(captured[i].encode()).hexdigest()[:16]}.{EXTENSIONS.get(content_type, 'jpg')}"
            (OUT / name).write_bytes(data)
            index[captured[i]] = name
        index_path.write_text(json.dumps(index, indent=2) + "\n")
        print(f"{page}: {len(wanted)} images")

    index_path.write_text(json.dumps(index, indent=2) + "\n")
    missing = referenced - index.keys()
    print(f"{len(index)} of {len(referenced)} referenced images cached; missing {len(missing)}")
    for url in sorted(missing):
        print(f"  {url[:100]}")


if __name__ == "__main__":
    main()
