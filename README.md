# Fiel Shop 🖤🤍

Vitrine **independente** para torcedores do Corinthians, publicada em [GitHub Pages](https://joaodimas86.github.io/ShopFiel/). **Não é uma loja oficial do clube.**

## Loja / versão atual
- Identidade preto, branco e cinza, com logo aprovado.
- Categorias: **Camisas Atuais 2026/27**, **Moda Casual**, **Camisas Históricas** e **Souvenirs e Acessórios**.
- Cards individuais, busca por nome, ordenação e layout responsivo.
- Catálogo Shopee em `data/shopee-links-pendentes.json`: **25 links encurtados originais, numerados em sequência de SHP-001 a SHP-025**; **24 anúncios identificados** em 15/10/2026, **SHP-025 ainda sem identificação**.
- **Numeração revisada em 15/10/2026** por solicitação do responsável: a posição SHP-006 em branco havia sido criada por engano e foi excluída. Assim, o link `https://s.shopee.com.br/4fwtN9zlPK` corresponde ao **SHP-006**, e todos os seguintes voltaram à numeração de SHP-007 até SHP-025. **Nenhuma URL encurtada original foi alterada.**
- A coleção 2026/27 contém 8 modelos apenas como referência, sem ofertas associadas.
- Todos os botões de compra Shopee utilizam as URLs `s.shopee.com.br/...` originais fornecidas pelo afiliado.
- SHP-003 foi marcado esgotado na captura de 15/10/2026 e não tem botão de compra ativo até revisão.
- 13 links Mercado Livre arquivados em `data/mercado-livre-links-pendentes.json`, ainda sem comissão confirmada.
- Não há checkout próprio: as compras são realizadas no marketplace parceiro.

## Política de dados de anúncios
- **Valores de capturas não são preços ao vivo**. Quando exibidos, aparecem como valores históricos de 15/10/2026; cupons, variações, estoque e frete podem mudar.
- Não afirmar que o produto é original, oficial ou licenciado com base somente no texto do anúncio. Isso requer validação independente.
- **Imagens dos cards são ilustrações genéricas**, não fotografias dos anúncios; obter direito de uso das fotografias originais antes de colocá-las na vitrine.
- A marca Fiel Shop e sua identidade não representam afiliação oficial ao Corinthians.
- Dados e links são publicados em um repositório público; nunca inserir segredos, credenciais ou dados privados.

## Como rodar localmente
Site HTML/CSS/JavaScript estático sem etapa de build. É necessário um servidor local para carregar JSON:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/`.

## GitHub Pages
Configuração: Settings → Pages → Deploy from a branch → `main` → `/(root)`.
Endereço: https://joaodimas86.github.io/ShopFiel/

## Antes do lançamento comercial
1. Identificar o anúncio do SHP-025 por meio do link encurtado original.
2. Concluir conferência de preços, estoques, originalidade e direitos de uso das imagens.
3. Testar manualmente os links curtos em navegador/app para conferir rastreamento do afiliado.
4. Adicionar políticas e formas de contato adequadas; revisar necessidades de LGPD.
5. Identificar ofertas reais da temporada 2026/27 e dos demais marketplaces.

A página continua com `noindex,nofollow` enquanto está em revisão.
