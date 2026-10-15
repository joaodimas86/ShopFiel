# Fiel Shop 🖤🤍

Vitrine **independente** para torcedores do Corinthians, publicada em [GitHub Pages](https://joaodimas86.github.io/ShopFiel/). **Não é uma loja oficial do clube.**

## Loja / versão atual
- Identidade preta, branca e cinza, com logo aprovado.
- Departamentos: **Camisas Disponíveis**, **Moda Casual**, **Camisas Históricas** e **Souvenirs e Acessórios**.
- Vitrine responsiva, busca, ordenação, contagem de itens e **cards clicáveis que abrem páginas individuais** em `produto.html?id=SHP-XXX`. O visitante lê a descrição e só então pode seguir pelo botão **COMPRAR NA SHOPEE**.
- Catálogo em `data/shopee-links-pendentes.json`: **25 fichas de produtos identificados** a partir das capturas de 15/10/2026; 25 links curtos em uso e um link alternativo preservado.
- **Correção concluída:** o SHP-006 usa `3g4Te0vNd1`, o SHP-007 usa `7ptv923tBM` e os seguintes utilizam a sequência confirmada pelo responsável. O outro link `4fwtN9zlPK` está preservado como alternativa histórica do SHP-006, fora dos botões principais.
- **Conferência do responsável em 15/10/2026:** os 25 produtos e seus respectivos links da última lista foram confirmados como corretos. O link principal de cada produto continua sendo sua URL encurtada no JSON; nenhuma foi substituída por URL longa.
- **Correção de 15/10/2026:** a coleção de camisas antes mostrava oito modelos Nike 2026/27 sem anúncios e sem links clicáveis. Para não confundir visitantes, agora apresenta somente **SHP-005** (Camisa Invasão 2026) e **SHP-006** (Camisa Corinthians Nike Total 90 preta/laranja), ambos com links Shopee verificados pelo responsável. A categoria mantém a chave interna `camisas-atuais`, mas agora é identificada publicamente como **Camisas Disponíveis**. Os oito modelos de referência seguem preservados em `data/vitrine-mantos-2026.json` para uma futura coleção, sem simular ofertas nem dizer que os dois anúncios são uniformes oficiais 2026/27.
- As fichas SHP-005 e SHP-006 permanecem também em Moda Casual, com uma única URL principal de afiliado cada.
- **SHP-003** teve o selo de esgotado removido por solicitação do responsável em 15/10/2026. Seu estado é `pending_new_link`: a ficha segue visível, com botão de compra desabilitado enquanto aguarda o novo link ativo de afiliado. O link antigo foi preservado no registro mas não é oferecido ao visitante.
- Os 13 links Mercado Livre seguem preservados separadamente, sem comissão confirmada.
- Sem checkout próprio: compra e pagamento ocorrem no marketplace parceiro.


**Auditoria de comissão:** os 25 links principais são encurtados em `s.shopee.com.br`. O botão **COMPRAR NA SHOPEE**, situado exclusivamente em cada página de produto, usa `product.url` do JSON sem substituí-lo por `shopee.com.br/product/...`. A vitrine utiliza apenas links internos para `produto.html?id=...`. O SHP-003 continua sem botão de compra porque aguarda novo link de afiliado; o link antigo não é exibido como CTA. A comissão efetiva deve ser verificada no painel Shopee Afiliados; o formato de URL sozinho não a garante.


## Páginas de produto e descrições
- `produto.html` + `produto.js` + `produto.css` criam a página individual responsiva de cada anúncio, carregada a partir do ID na URL. **Não é necessário cadastrar 25 arquivos HTML separados.**
- Exemplo: `produto.html?id=SHP-002` apresenta a galeria com 5 fotos, as informações e o botão externo utilizando **exatamente** a URL curta de `links[].url`. O SHP-003 mostra 7 fotos mas mantém a compra desabilitada enquanto aguarda um novo link.
- **Como editar a descrição:** no arquivo `data/shopee-links-pendentes.json`, encontre o produto pelo `id` e atualize `description` (parágrafo principal) e `highlights` (lista de destaques). Nome, categoria e preço de referência continuam em seus campos existentes.
- As 25 fichas já receberam texto editorial inicial, sem presumir estoque, material, licenciamento ou autenticidade não comprovados.
- **Fotos reais integradas para SHP-001 (6), SHP-002 (5), SHP-003 (7), SHP-004 (7), SHP-005 (5) e SHP-006 (8)**, hospedadas em `assets/produtos/SHP-XXX/`. A vitrine mostra a imagem principal e as páginas de detalhe mostram miniaturas clicáveis. Outros produtos continuam com ilustrações genéricas, até envio e conferência de suas fotografias.
- Se o ID não existir ou o JSON estiver indisponível, a página mostra um aviso e caminho para retornar à loja.
- O link de retorno para a coleção usa `?categoria=historicas#mantos` (ou a categoria do item) para restaurar a navegação. Produtos em destaque na seção Camisas passam também `&colecao=camisas-atuais` na página individual, de modo que o retorno volte para a seção de origem.


- **SHP-006:** título editorial fornecido pelo responsável: “Camisa Masculina Corinthians Preta Nike Total 90 com Detalhes Laranja”. Oito imagens reais foram enviadas para sua galeria; a capa é a frente recortada. O anúncio anteriormente identificado mencionava “azul”, então é necessário conferir a variante preta/laranja no destino antes da compra. O link encurtado principal e eventual alternativo foram preservados. O nome Nike/Total 90 descreve a apresentação visual, sem comprovação de licenciamento/autenticidade.

## Política de dados de anúncios
- **Valores de capturas não são preços ao vivo**. Quando exibidos, aparecem como valores históricos de 15/10/2026; cupons, variações, estoque e frete podem mudar.
- Não afirmar que o produto é original, oficial ou licenciado com base somente no texto do anúncio. Isso requer validação independente.
- **Imagens:** SHP-001, SHP-002, SHP-003, SHP-004 e SHP-005 usam fotografias compartilhadas pelo responsável; confirmar autorização/licença de uso e atribuição quando aplicável. O SHP-005 usa cinco fotos específicas da versão branca fornecidas diretamente pelo responsável; os demais cards ainda exibem ilustrações genéricas.
- A marca Fiel Shop e sua identidade não representam afiliação oficial ao Corinthians.
- Dados e links são publicados em um repositório público; nunca inserir segredos, credenciais ou dados privados.

## Blog e SEO orgânico (15/10/2026)
- **Arquibancada Fiel** em `blog/index.html`, integrado à home, menus e rodapé. Os artigos são HTML estático, legíveis sem JavaScript.
- **Quatro artigos:** `blog/como-escolher-tamanho-camisa-de-futebol.html`, `blog/camisas-retro-corinthians.html`, `blog/presentes-para-corinthianos.html`, `blog/como-lavar-camisa-de-futebol.html`.
- Fonte editorial mantida em `data/blog-artigos.json`; alterações no JSON também precisam ser refletidas no HTML público de cada artigo.
- Cada artigo tem `title`, `description`, canonical, OG, cabeçalhos, sumário com âncoras, links para posts/produtos e marcação JSON-LD `BlogPosting` + `BreadcrumbList`. Artigos indicam a Fiel Shop como organização autora, sem alegar experiências de teste não realizadas.
- **A home teve a meta `noindex` removida** e tem canonical e `index,follow`. O blog também está indexável.
- **Páginas de produto ainda têm `noindex`**: template dinâmico em JS, metadata por produto ainda requer versão pré-renderizada/canonical próprio e auditoria editorial. Não colocá-las no sitemap até a revisão.
- `sitemap.xml` lista a home, o índice do blog e os quatro artigos. Enviar manualmente `https://joaodimas86.github.io/ShopFiel/sitemap.xml` no Google Search Console após verificar a propriedade.
- Em GitHub Pages de projeto, `/ShopFiel/robots.txt` **não** funciona como robots.txt na raiz do host `joaodimas86.github.io`; a configuração correta de robots.txt fica para quando houver domínio próprio.
- Antes da divulgação ampla, revisar direitos de uso das fotos, afirmações sobre produto oficial/licenciado e conteúdo editorial, além de verificar desempenho e indexação no Search Console.
- Ao criar artigo novo: gerar HTML estático com SEO e JSON-LD, inserir no índice, adicionar links internos e atualizar `sitemap.xml` após publicação.
- Tráfego, posicionamento e snippets do Google não são garantidos; conteúdo útil precisa de manutenção e acompanhamento.

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
1. Verificar o rastreamento das comissões no painel Shopee Afiliados em uma compra elegível; os destinos dos 25 links foram confirmados pelo responsável.
2. Concluir conferência de preços, estoques, originalidade e direitos de uso das imagens.
3. Testar manualmente os links curtos em navegador/app para conferir rastreamento do afiliado.
4. Adicionar políticas e formas de contato adequadas; revisar necessidades de LGPD.
5. Identificar ofertas reais da temporada 2026/27 e dos demais marketplaces.

A página continua com `noindex,nofollow` enquanto está em revisão.
