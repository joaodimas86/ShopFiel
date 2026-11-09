# Auditoria do blog — 9 de novembro de 2026

Base: commit e6a57de22833bf4e7d74b186c01eee4c6508eb8d de joaodimas86/ShopFiel.

## Implementado

- Canonical no domínio HTTPS com www, robots index/follow e max-image-preview:large nas 32 páginas do blog.
- Sitemap com todas as 32 páginas do blog, quatro páginas de transparência e as URLs existentes de loja/categorias/produtos: 79 URLs. Antes, 23 páginas do blog estavam ausentes.
- Links internos para todas as matérias, incluindo as que faltavam na listagem.
- NewsArticle/BlogPosting com autoria institucional Shop Fiel, página de autoria, URL principal, imagem e dimensões. Datas de publicação existentes preservadas; precisão de dia mantida onde não há horário comprovado. Horários artificiais de meio-dia removidos dos metadados sociais inconsistentes.
- Páginas Sobre e autoria, Política editorial, Contato e correções, Transparência sobre afiliados e imagens. Canal de contato usado: perfil público @shopfiel já divulgado no site.
- Fotos existentes preservadas em conteúdo, com cópias WebP locais mais leves, sem ampliação ou corte. Originais mantidos. Imagens com dimensões reais, carregamento adiado nas secundárias e prioridade na principal. Uma foto existente do catálogo foi adicionada ao guia de presentes, que não tinha imagem.
- Ajustes de quebra de texto/navegação no celular. Conteúdo editorial e destinos afiliados preservados.
- Verificação automática de SEO e metadados nas próximas alterações via GitHub Actions.

## Verificado antes da publicação

- `node scripts/check-seo.mjs`: 79 URLs, 38 produtos e 2.197 referências locais válidas.
- `node scripts/check-discover.cjs`: 32 páginas com canonical, robots, schema, datas, imagem e navegação conferidos. Datas originais e destinos afiliados comparados com o commit base.
- Navegador Chrome: 36 páginas em larguras de 360, 390 e 1.440 pixels, total de 108 verificações, sem rolagem horizontal, imagens quebradas ou H1 duplicado.
- Inspeção visual de matéria no celular. As verificações locais de desempenho não são uma medição de Core Web Vitals em usuários reais.

## Pendências reais

- Das 31 matérias, somente seis têm capa com largura de pelo menos 1.200 px. As outras 25 precisam de arquivos originais maiores e pertinentes; ampliar artificialmente não resolve a qualidade. O relatório JSON lista cada página e suas dimensões. A capa da listagem também é menor que 1.200 px.
- Direitos de uso não comprovados para as imagens nesta auditoria. O responsável informou que vieram da internet e pediu para mantê-las. Nenhuma licença foi inventada. Disponibilidade pública não foi tratada como autorização.
- As datas de publicação foram reconciliadas com as informações existentes no site, sem afirmar uma verificação histórica independente. A auditoria técnica não certifica retrospectivamente os fatos de todas as notícias.
- Robots, canonical, links e sitemap permitem descoberta e rastreamento; não provam indexação efetiva. Não foi acessado o Search Console, nem enviada solicitação de indexação. Core Web Vitals de campo e indexação devem ser acompanhados nessa ferramenta.
- Elegibilidade e exibição no Discover dependem do Google. Schema especial não é requisito e não garante recomendação.

## Referências oficiais

- https://developers.google.com/search/docs/appearance/google-discover
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://support.google.com/websearch/answer/9982767

## Manutenção

`scripts/prepare-discover.cjs` prepara metadados e cópias otimizadas usando Node.js e o pacote sharp. Revise o resultado antes de publicar. Não invente datas, créditos ou licenças. `scripts/build-seo.mjs` preserva as páginas de transparência no sitemap ao reconstruir o site. O workflow editorial de pautas continua sem publicar notícias automaticamente.
