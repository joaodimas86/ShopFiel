#!/usr/bin/env python3
"""Validação obrigatória de imagem antes de publicar um artigo Shop Fiel."""
import argparse
import html.parser
import pathlib
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[1]
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg"}

class Images(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "img":
            self.images.append(dict(attrs))

def validate(page):
    errors = []
    parser = Images()
    parser.feed(page.read_text(encoding="utf-8"))
    if not parser.images:
        return ["matéria sem imagem"]
    for item in parser.images:
        src = item.get("src", "")
        alt = item.get("alt", "").strip()
        if not alt:
            errors.append("imagem sem texto alternativo")
        url = urllib.parse.urlsplit(src)
        if url.scheme in ("http", "https"):
            if url.netloc not in ("www.shopfiel.com.br", "shopfiel.com.br"):
                errors.append("imagem externa não validada: " + url.netloc)
                continue
            local = ROOT / url.path.lstrip("/")
        elif not url.scheme and not url.netloc and src:
            local = page.parent / urllib.parse.unquote(url.path)
        else:
            errors.append("endereço de imagem inválido")
            continue
        try:
            resolved = local.resolve()
            resolved.relative_to(ROOT.resolve())
            if not resolved.is_file() or resolved.stat().st_size == 0:
                errors.append("arquivo de imagem ausente ou vazio: " + src)
            elif resolved.suffix.lower() not in EXTENSIONS:
                errors.append("formato de imagem não permitido: " + src)
        except ValueError:
            errors.append("imagem fora do repositório: " + src)
    return errors

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pages", nargs="+", help="Caminhos das páginas HTML a publicar")
    args = ap.parse_args()
    failed = False
    for filename in args.pages:
        path = (ROOT / filename).resolve()
        try:
            path.relative_to(ROOT.resolve())
        except ValueError:
            print("BLOQUEADO: caminho fora do projeto", file=sys.stderr)
            failed = True
            continue
        if not path.is_file():
            print(f"BLOQUEADO {filename}: página ausente")
            failed = True
            continue
        errors = validate(path)
        if errors:
            print(f"BLOQUEADO {filename}: " + "; ".join(errors))
            failed = True
        else:
            print(f"OK {filename}: imagens presentes no repositório, com alt e arquivos não vazios")
    if failed:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
