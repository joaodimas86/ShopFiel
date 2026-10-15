# Fiel Shop 🖤🤍

Vitrine **independente** para torcedores do Corinthians, publicada em [GitHub Pages](https://joaodimas86.github.io/ShopFiel/). **Não é uma loja oficial do clube.**

## Loja / versão atual
- Identidade preto, branco e cinza, com o logo escolhido pelo responsável.
- Navegação por **Camisas Atuais 2026/27**, **Moda Casual**, **Camisas Históricas** e **Souvenirs e Acessórios**.
- Cards por produto, busca por nome, ordenação, contagem por categoria e layout responsivo.
- Catálogo Shopee em `data/shopee-links-pendentes.json`: **24 links identificados**, de **25 links curtos recebidos**; há agora **26 posições numeradas** porque o SHP-006 ficou reservado a partir de capturas enviadas pelo responsável em 15/10/2026.
- A coleção 2026/27 apresenta 8 modelos **apenas como referência**, ainda sem ofertas associadas; nenhuma compra é simulada.
- Shopee: os botões de compra **usam apenas as URLs curtas originais `s.shopee.com.br/...`**, pois são os links fornecidos pelo afiliado.
- O SHP-003 foi marcado **esgotado em 15/10/2026** e não tem botão de compra ativo até nova verificação.
- `SHP-006` é uma posição **reservada**, sem link enviado ainda; não deve aparecer como produto público.
- `SHP-026` contém o link originalmente cadastrado como SHP-025, mas ainda **não foi identificado**; não deve aparecer como produto público.
- **Correção de numeração em 15/10/2026:** os antigos SHP-006 até SHP-025 foram renomeados como SHP-007 até SHP-026. **Nenhuma URL de afiliado foi alterada.**
- Os 13 links recebidos do Mercado Livre ficam em `data/mercado-livre-links-pendentes.json` para conferência posterior. Não há comissão confirmada no Mercado Livre.
- Sem checkout próprio: compra e pagamento são realizados no marketplace.

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
1. Receber o link encurtado ausente do SHP-006 e identificar o anúncio ligado ao SHP-026.
2. Concluir conferência de preços, estoques, originalidade e direitos de uso das imagens.
3. Testar manualmente os links curtos em navegador/app para conferir rastreamento do afiliado.
4. Adicionar políticas e formas de contato adequadas; revisar necessidades de LGPD.
5. Identificar ofertas reais da temporada 2026/27 e dos demais marketplaces.

A página continua com `noindex,nofollow` enquanto está em revisão.
