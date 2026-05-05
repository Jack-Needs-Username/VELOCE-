#!/usr/bin/env python3
"""Download Wikimedia/Wikipedia page images and write Veloce image metadata."""

from __future__ import annotations

import html
import json
import re
import time
from urllib.error import HTTPError
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "app.js"
IMAGE_DIR = ROOT / "assets" / "images"
MANIFEST = ROOT / "image-data.js"

FALLBACK_SEARCHES = {
    "porsche-boxster-cayman-986-987": "Porsche Boxster 986",
    "porsche-911-997": "Porsche 997 Carrera",
    "porsche-cayman-gt4": "Porsche Cayman GT4",
    "porsche-930-turbo": "Porsche 930 Turbo",
}

FILE_OVERRIDES = {
    "bmw-m3-e46": "File:BMW M3 (E46) at the 2025 Shannons Adelaide Rally (028A4479).jpg",
    "toyota-supra-mk4": "File:1996 Toyota Supra A80 (front).jpg",
    "chevrolet-corvette-c5-c6-z06": "File:2004 Chevrolet Corvette C5 Z06 Le Mans Edition.jpg",
    "cadillac-ct5-v-blackwing": "File:Cadillac CT5-V Blackwing 6DC79 Black Raven (13).jpg",
    "ford-mustang-shelby-gt350": "File:2016 Ford Mustang Shelby GT350.JPG",
    "bmw-m2-cs": "File:BMW F87 M2 CS Hockenheim Silver Metallic (1).jpg",
    "porsche-911-997": "File:Porsche 997 Carrera (2004) coupes IMG 7311.jpg",
    "audi-r8-manual": "File:Audi R8-08.jpg",
    "aston-martin-v8-vantage-manual": "File:AM V8 Vantage IAA 2005.jpg",
}


def fetch_json(url: str) -> dict:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Veloce class project image attribution fetcher (educational use)"
        },
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            if exc.code != 429 or attempt == 3:
                raise
            time.sleep(20 + attempt * 20)
    raise RuntimeError("unreachable")


def download(url: str, target: Path) -> None:
    if target.exists() and target.stat().st_size > 0:
        return
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Veloce class project image attribution fetcher (educational use)"
        },
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                target.write_bytes(response.read())
            return
        except HTTPError as exc:
            if exc.code != 429 or attempt == 3:
                raise
            time.sleep(20 + attempt * 20)


def clean_html(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value or "")
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def cars_from_app() -> list[dict]:
    text = APP_JS.read_text()
    pattern = re.compile(
        r'car\("(?P<make>[^"]+)",\s*"(?P<model>[^"]+)".*?'
        r'"(?P<wiki_title>[^"]+)",\s*"(?P<wiki_slug>[^"]+)",\s*\['
    )
    cars = []
    for match in pattern.finditer(text):
        make = match.group("make")
        model = match.group("model")
        car_id = re.sub(r"[^a-z0-9]+", "-", f"{make}-{model}".lower()).strip("-")
        cars.append(
            {
                "id": car_id,
                "make": make,
                "model": model,
                "wiki_title": match.group("wiki_title"),
                "wiki_slug": match.group("wiki_slug"),
            }
        )
    return cars


def page_image_title(wiki_slug: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "titles": wiki_slug,
            "prop": "pageimages",
            "piprop": "name",
        }
    )
    data = fetch_json(f"https://en.wikipedia.org/w/api.php?{params}")
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        image_name = page.get("pageimage")
        if image_name:
            return f"File:{image_name}"
    return None


def image_info(file_title: str) -> dict | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "titles": file_title,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1400",
        }
    )
    data = fetch_json(f"https://commons.wikimedia.org/w/api.php?{params}")
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        infos = page.get("imageinfo", [])
        if infos:
            return infos[0]
    return None


def commons_search_info(query: str) -> dict | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrnamespace": "6",
            "gsrlimit": "8",
            "gsrsearch": query,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1400",
        }
    )
    data = fetch_json(f"https://commons.wikimedia.org/w/api.php?{params}")
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        infos = page.get("imageinfo", [])
        if not infos:
            continue
        info = infos[0]
        image_url = info.get("thumburl") or info.get("url") or ""
        if extension_from_url(image_url) in {".jpg", ".png", ".webp"}:
            return info
    return None


def existing_manifest() -> dict:
    if not MANIFEST.exists():
        return {}
    text = MANIFEST.read_text().strip()
    prefix = "window.veloceOwnedImages = "
    if not text.startswith(prefix):
        return {}
    text = text[len(prefix) :].rstrip(";")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


def extension_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    suffix = Path(path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp"}:
        return ".jpg" if suffix == ".jpeg" else suffix
    return ".jpg"


def build_manifest_entry(car: dict, info: dict, src_path: str) -> dict:
    metadata = info.get("extmetadata", {})
    artist = clean_html(metadata.get("Artist", {}).get("value", ""))
    credit = clean_html(metadata.get("Credit", {}).get("value", ""))
    license_name = clean_html(
        metadata.get("LicenseShortName", {}).get("value", "")
        or metadata.get("UsageTerms", {}).get("value", "")
    )
    author = artist or credit or "Wikimedia Commons contributor"
    source_url = info.get("descriptionurl") or ""
    return {
        "src": src_path,
        "alt": f"{car['make']} {car['model']} vehicle photo.",
        "credit": f"Photo: {author} / Wikimedia Commons.",
        "sourceUrl": source_url,
        "license": license_name,
    }


def main() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    manifest = existing_manifest()
    for car in cars_from_app():
        existing = manifest.get(car["id"])
        if (
            car["id"] not in FILE_OVERRIDES
            and existing
            and (ROOT / existing.get("src", "")).exists()
        ):
            print(f"Keeping {car['id']}...")
            continue
        print(f"Fetching {car['id']}...")
        try:
            file_title = FILE_OVERRIDES.get(car["id"]) or page_image_title(car["wiki_slug"])
            info = image_info(file_title) if file_title else None
            if not info and car["id"] in FALLBACK_SEARCHES:
                print(f"  searching Commons fallback")
                info = commons_search_info(FALLBACK_SEARCHES[car["id"]])
            if not info:
                print(f"  no reusable image info")
                continue
            image_url = info.get("thumburl") or info.get("url")
            if not image_url:
                print(f"  no downloadable URL")
                continue
            ext = extension_from_url(image_url)
            target = IMAGE_DIR / f"{car['id']}{ext}"
            download(image_url, target)
            manifest[car["id"]] = build_manifest_entry(
                car, info, f"assets/images/{target.name}"
            )
            time.sleep(6)
        except Exception as exc:
            print(f"  skipped: {exc}")
            time.sleep(10)

    manifest_js = "window.veloceOwnedImages = "
    manifest_js += json.dumps(manifest, indent=2, ensure_ascii=False)
    manifest_js += ";\n"
    MANIFEST.write_text(manifest_js)
    print(f"Wrote {len(manifest)} image records to {MANIFEST.name}")


if __name__ == "__main__":
    main()
