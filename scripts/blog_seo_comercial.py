#!/usr/bin/env python3
"""Shop Fiel: auditoria SEO e recomendacoes comerciais, sem publicar."""
import json
import pathlib
import re
import html
import unicodedata
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
CATALOGS = ["data/shopee-links-pendentes.json", "data/mercado-livre-links-pendentes.json"]
CATEGORIES = {
    "camisas": ("camisa", "manto", "uniforme", "nike", "jogador", "escalacao", "convocacao"),
    "historicas": ("retro", "historica", "historia", "socrates", "titulo", "mundial", "memoria"),
    "souvenirs": ("torcida", "arena", "torcedor", "presente", "bandeira", "copo", "caneca"),
    "casuais": ("casual", "moda", "camiseta", "moletom", "polo"),
}
STOP = {"corinthians", "timão", "timao", "fiel", "shop", "loja", "para", "com", "uma", "das", "dos"}

def norm(value):
    value = unicodedata.normalize("NFKD", str(value)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", value).strip()

def read_catalog():
    products = []
    for filename in CATALOGS:
        path = ROOT / filename
        if not path.exists():
            continue
        for item in json.loads(path.read_text(encoding="utf-8")).get("links", []):
            url = item.get("url", "")
            host = urlparse(url).hostname
            if item.get("status") != "identified" or item.get("availability") == "out_of_stock":
                continue
            if host not in ("s.shopee.com.br", "meli.la") or not item.get("product_name"):
                continue
            products.append({"name": item["product_name"], "url": url, "category": item.get("category_id", ""), "source": filename})
    return products

def recommend(title, products, limit=3):
    words = set(norm(title).split()) - STOP
    scored = []
    for p in products:
        name = set(norm(p["name"]).split()) - STOP
        overlap = len(words & name)
        category = norm(p["category"])
        topic = sum(1 for terms in CATEGORIES.values() if any(term in words for term in terms) and any(term in name or term in category for term in terms))
        score = overlap * 3 + topic
        if score >= 3:
            scored.append((score, p))
    scored.sort(key=lambda entry: (-entry[0], entry[1]["name"]))
    return [p for _, p in scored[:limit]]

def audit_page(path):
    raw = path.read_text(encoding="utf-8", errors="replace")
    def get(pattern):
        m = re.search(pattern, raw, re.I | re.S)
        return html.unescape(re.sub(r"<[^>]*>", "", m.group(1)).strip()) if m else ""
    title = get(r"<title[^>]*>(.*?)</title>")
    h1 = get(r"<h1[^>]*>(.*?)</h1>")
    description = get(r'<meta\s+name="description"\s+content="([^"]*)"')
    canonical = get(r'<link\s+rel="canonical"\s+href="([^"]*)"')
    issues = []
    if not title or len(title) > 75: issues.append("title ausente ou maior que 75 caracteres")
    if not h1: issues.append("h1 ausente")
    if not 70 <= len(description) <= 170: issues.append("meta description ausente ou fora de 70-170 caracteres")
    if canonical != "https://www.shopfiel.com.br/blog/" + path.name: issues.append("canonical incorreta")
    if "application/ld+json" not in raw: issues.append("dados estruturados ausentes")
    return {"file": str(path.relative_to(ROOT)), "title": title, "issues": issues}

def main():
    products = read_catalog()
    pages = [audit_page(p) for p in sorted((ROOT / "blog").glob("*.html")) if p.name != "index.html"]
    result = {"mode": "DRY_RUN_ONLY", "products_eligible": len(products), "seo_pages": pages, "recommendations": [{"article": p["file"], "products": recommend(p["title"], products)} for p in pages], "published": 0, "policy": ["Links de afiliados devem ser identificados claramente.", "Nao inserir preco sem verificacao atual.", "Somente produtos reais cadastrados, identificados e disponiveis.", "Sem recomendacao se a relevancia for insuficiente.", "Nenhuma noticia pode ser publicada sem verificacao independente dos fatos e direitos da imagem."]}
    output = ROOT / "reports/blog-seo-comercial.json"
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"products_eligible": len(products), "pages": len(pages), "pages_with_seo_issues": sum(bool(p["issues"]) for p in pages), "recommendations": sum(len(p["products"]) for p in result["recommendations"]), "published": 0}))

if __name__ == "__main__":
    main()
