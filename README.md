# Fiel Shop 🖤🤍

Vitrine **independente** para torcedores do Corinthians, publicada em [GitHub Pages](https://joaodimas86.github.io/ShopFiel/). **Não é uma loja oficial do clube.**

## Loja / versão atual
- Identidade preta, branca e cinza, com logo aprovado.
- Departamentos: **Camisas Atuais 2026/27**, **Moda Casual**, **Camisas Históricas** e **Souvenirs e Acessórios**.
- Vitrine responsiva, busca, ordenação, contagem de itens e botões levando diretamente à Shopee.
- Catálogo em `data/shopee-links-pendentes.json`: **25 fichas de produtos identificados** a partir das capturas de 15/10/2026; 25 links curtos em uso e um link alternativo preservado.
- **Correção de correspondência feita em 15/10/2026:** o usuário confirmou que `4fwtN9zlPK`, anteriormente no SHP-007, abre a camisa do SHP-006 e que `7ptv923tBM`, anteriormente no SHP-008, abre a polo feminina SHP-007. O primeiro foi preservado como link alternativo no SHP-006, que mantém seu link principal `3g4Te0vNd1`. Para SHP-007 a SHP-025, os links principais foram realocados uma posição para cima. O último link `qkGdbShJi` passou para SHP-025.
- **Estado da conferência:** a associação SHP-007 foi confirmada pelo usuário; os destinos dos links SHP-008 a SHP-025 foram *inferidos pelo deslocamento* e requerem testes pontuais, especialmente no início e no final da série. A numeração e a unicidade dos links no JSON, por si, não confirmam o redirecionamento.
- Os oito modelos 2026/27 são apenas referências editoriais, sem ofertas de compra associadas.
- SHP-003 aparece esgotado na captura de 15/10/2026 e fica sem botão de compra ativo até nova verificação.
- Os 13 links Mercado Livre seguem preservados separadamente, sem comissão confirmada.
- Sem checkout próprio: compra e pagamento ocorrem no marketplace parceiro.

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
1. Conferir se os destinos realocados correspondem aos produtos, com prioridade para SHP-008 e SHP-025.
2. Concluir conferência de preços, estoques, originalidade e direitos de uso das imagens.
3. Testar manualmente os links curtos em navegador/app para conferir rastreamento do afiliado.
4. Adicionar políticas e formas de contato adequadas; revisar necessidades de LGPD.
5. Identificar ofertas reais da temporada 2026/27 e dos demais marketplaces.

A página continua com `noindex,nofollow` enquanto está em revisão.
