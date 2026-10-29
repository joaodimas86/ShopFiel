#!/usr/bin/env python3
"""Cria fila de pautas para revisão humana. Não publica notícias."""
import argparse
import datetime as dt
import html
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

def build(report):
    candidates = report.get("candidates", [])
    queue = []
    for index, item in enumerate(candidates, 1):
        url = item.get("url", "")
        if urlparse(url).scheme != "https":
            continue
        queue.append({
            "id": f"pauta-{index:02d}",
            "headline_from_feed": item.get("title", ""),
            "source_url": url,
            "source_name": item.get("source", ""),
            "source_published_utc": item.get("published_utc", ""),
            "status": "PENDENTE_DE_APURACAO",
            "fact_check": "Confirmar no conteúdo da fonte e, quando possível, em fonte independente ou primária.",
            "photo": {"status": "PENDENTE", "note": "Selecionar foto correspondente, com origem, data e condições de uso verificadas."},
            "article": {"status": "NAO_REDIGIDO", "note": "Não transformar título de RSS em notícia sem ler e confirmar fatos."},
            "seo": {"status": "PENDENTE"},
            "approval": {"status": "NAO_APROVADO", "approved_by": None, "approved_at": None},
            "publish": False
        })
    return {"mode": "APPROVAL_REQUIRED", "generated_utc": dt.datetime.now(dt.timezone.utc).isoformat(), "count": len(queue), "items": queue, "published": 0}

def render(data):
    cards = []
    for item in data["items"]:
        title = html.escape(item["headline_from_feed"])
        url = html.escape(item["source_url"], quote=True)
        cards.append(f'<article><span class="status">AGUARDANDO APURAÇÃO</span><h2>{title}</h2><p><a href="{url}" target="_blank" rel="noopener noreferrer">Abrir fonte original</a></p><p>Antes de aprovar: conferir os fatos, preparar texto original, selecionar foto correspondente e revisar SEO.</p></article>')
    body = "\n".join(cards) or "<p>Nenhuma pauta elegível nesta execução.</p>"
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Fila editorial | Shop Fiel</title><style>body{{margin:0;background:#101010;color:#f7f7f7;font:16px system-ui,sans-serif}}main{{max-width:780px;margin:auto;padding:32px 18px}}h1{{font-size:2rem}}article{{background:#202020;padding:22px;border:1px solid #444;border-radius:12px;margin:18px 0}}h2{{font-size:1.2rem}}a{{color:#fff}}.status{{font-size:.7rem;letter-spacing:.1em;color:#ffcd74}}small{{color:#aaa}}</style></head><body><main><h1>Shop Fiel — fila editorial</h1><p>Prévia interna para revisão. <strong>Nenhuma notícia é publicada automaticamente.</strong></p><small>Gerado em {html.escape(data["generated_utc"])}</small>{body}</main></body></html>'''

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="reports/blog-editorial-dry-run.json")
    parser.add_argument("--json-output", default="reports/blog-fila-aprovacao.json")
    parser.add_argument("--html-output", default="reports/blog-fila-aprovacao.html")
    args = parser.parse_args()
    source = json.loads(Path(args.input).read_text(encoding="utf-8"))
    queue = build(source)
    for target, content in ((args.json_output, json.dumps(queue, ensure_ascii=False, indent=2)+"\n"), (args.html_output, render(queue))):
        path = Path(target)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    print(f"Fila gerada: {queue['count']} pautas; publicadas: 0; aprovação obrigatória.")

if __name__ == "__main__":
    main()
