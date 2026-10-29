#!/usr/bin/env python3
"""Shop Fiel: monitor editorial em modo seguro (somente leitura)."""
import argparse
import datetime as dt
import email.utils
import html
import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
FEEDS = [
    ("Google Notícias / Corinthians", "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": "Corinthians futebol when:2d", "hl": "pt-BR", "gl": "BR", "ceid": "BR:pt-419"})),
]
EXCLUDED = ("palpite", "aposta", "cassino", "bet365", "odds", "prognóstico")
MAX_AGE_HOURS = 48

def normalize(value):
    return re.sub(r"[^a-z0-9]+", " ", __import__("unicodedata").normalize("NFKD", value).encode("ascii", "ignore").decode().lower()).strip()

def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "ShopFielEditorialMonitor/1.0 (+https://www.shopfiel.com.br/)", "Accept": "application/rss+xml, application/xml, text/xml"})
    with urllib.request.urlopen(request, timeout=18) as response:
        return response.read(2_000_000)

def published_titles():
    titles = []
    for page in (ROOT / "blog").glob("*.html"):
        if page.name == "index.html":
            continue
        data = page.read_text(encoding="utf-8", errors="replace")
        m = re.search(r"<h1[^>]*>(.*?)</h1>", data, re.I | re.S)
        if m:
            titles.append(normalize(html.unescape(re.sub(r"<[^>]+>", " ", m.group(1)))))
    return titles

def near_duplicate(title, existing):
    words = set(normalize(title).split()) - {"do", "da", "de", "para", "no", "na", "com", "e", "o", "a"}
    for old in existing:
        other = set(old.split()) - {"do", "da", "de", "para", "no", "na", "com", "e", "o", "a"}
        if words and other and len(words & other) / len(words | other) >= 0.65:
            return True
    return False

def collect(now):
    items, errors = [], []
    for source, url in FEEDS:
        try:
            xml = ET.fromstring(fetch(url))
            for node in xml.findall(".//item"):
                title = html.unescape((node.findtext("title") or "").strip())
                link = (node.findtext("link") or "").strip()
                date = (node.findtext("pubDate") or "").strip()
                try:
                    published = email.utils.parsedate_to_datetime(date).astimezone(dt.timezone.utc)
                except (TypeError, ValueError, IndexError):
                    continue
                age = (now - published).total_seconds() / 3600
                if not (0 <= age <= MAX_AGE_HOURS) or "corinthians" not in normalize(title):
                    continue
                if any(term in normalize(title) for term in EXCLUDED) or not link.startswith("https://"):
                    continue
                items.append({"title": title, "url": link, "source": source, "published_utc": published.isoformat(), "age_hours": round(age, 1)})
        except Exception as exc:
            errors.append({"source": source, "error": str(exc)[:300]})
    return items, errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="reports/blog-editorial-dry-run.json")
    parser.add_argument("--fixture", help="JSON local com itens de teste; não acessa a internet")
    args = parser.parse_args()
    now = dt.datetime.now(dt.timezone.utc)
    if args.fixture:
        items = json.loads(pathlib.Path(args.fixture).read_text(encoding="utf-8"))
        errors = []
    else:
        items, errors = collect(now)
    existing = published_titles()
    seen = set()
    accepted, rejected = [], []
    for item in items:
        key = normalize(item["title"])
        reason = "duplicata" if key in seen or near_duplicate(item["title"], existing) else None
        if reason:
            rejected.append({"title": item["title"], "reason": reason})
        else:
            accepted.append(item)
            seen.add(key)
    report = {"mode": "DRY_RUN_ONLY", "generated_utc": now.isoformat(), "source_errors": errors, "candidates": accepted[:15], "rejected": rejected, "total_fetched": len(items), "published": 0, "notes": ["Nenhum arquivo do site foi alterado.", "RSS e títulos não confirmam os fatos: antes de publicar será preciso verificar fonte primária, conteúdo, licença de imagem e qualidade editorial.", "Geração automática de texto e publicação estão desabilitadas."]}
    path = pathlib.Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "dry-run", "fetched": len(items), "candidates": len(accepted), "source_errors": len(errors), "published": 0}, ensure_ascii=False))
    if errors and not items and not args.fixture:
        print("AVISO: nenhuma fonte disponível; revisar RSS antes de avançar.", file=sys.stderr)

if __name__ == "__main__":
    main()
