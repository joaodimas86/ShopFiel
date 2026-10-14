# Fiel Shop 🖤🤍

Primeira versão da vitrine independente para torcedores do Corinthians. Não há vínculo oficial com o clube.

## Entregue
- Página inicial responsiva com identidade preta e branca e monograma FS inspirado na terceira opção de logo aprovada.
- Seção **Mantos da Temporada 2026/27**: oito modelos de referência em `data/vitrine-mantos-2026.json`, com ilustrações genéricas e detalhes. Os modelos **não** têm anúncios associados nem preços confirmados.
- Área recolhível de conferência com **25 links da Shopee** em `data/shopee-links-pendentes.json` e **13 links do Mercado Livre** em `data/mercado-livre-links-pendentes.json`.
- Pesquisa e visualização dos registros; saída para o marketplace somente quando o usuário selecionar um endereço recebido.
- Sem checkout próprio. As compras são realizadas nos marketplaces.

## Status comercial
- Shopee: cadastro de afiliado aprovado segundo informação do responsável; links individuais ainda precisam de identificação e validação.
- Mercado Livre: a afiliação não está aprovada; links recebidos **não** têm comissão confirmada.
- Amazon: futura possibilidade, sem ofertas cadastradas.
- **Não mostramos preços, avaliações, estoque, imagens oficiais ou promessas de comissão sem verificar.**

## Como abrir localmente
O projeto atual usa HTML/CSS/JavaScript simples e JSON estático. Não é necessário instalar Node.js.

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/` — abrir `index.html` diretamente pelo explorador de arquivos não carregará o JSON de modo confiável.

## Publicar uma prévia no GitHub Pages
1. No GitHub, acesse **Settings → Pages** do repositório `joaodimas86/ShopFiel`.
2. Escolha **Deploy from a branch**, branch `main`, pasta `/(root)`.
3. Salve e aguarde a publicação.
4. Após ativação, a URL esperada é `https://joaodimas86.github.io/ShopFiel/`.

**A URL acima não significa que a publicação já está ativa.** A página contém `noindex,nofollow` para impedir indexação antes da revisão final.

## Pendências essenciais
- Identificar produtos associados aos 38 links; conferir fotos, originalidade, preços e permissão de utilização dos dados.
- Mapear anúncios verificados de múltiplos marketplaces para o mesmo produto.
- Validar rastreamento e regras dos programas de afiliados.
- Criar painel protegido com autenticação; o repositório público **não** é área segura para credenciais.
- Concluir páginas legais e revisar a marca antes do lançamento comercial.

Projeto em pré-lançamento. Não inserir segredos, CPF ou dados de clientes no repositório.
