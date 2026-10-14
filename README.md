# Fiel Shop 🖤🤍

Vitrine independente de links de produtos para torcedores. **Não é loja oficial do Corinthians**.

## Status da primeira versão
- Layout de e-commerce responsivo: página inicial, catálogo, pesquisa, detalhes e informações sobre compras externas.
- 25 links Shopee cadastrados em `data/shopee-links-pendentes.json`.
- 13 links Mercado Livre cadastrados em `data/mercado-livre-links-pendentes.json`, **sem afiliação/ganho de comissão validado**.
- Produtos ainda sem identificação confirmada. O catálogo mostra códigos e **não inventa fotos, preços ou avaliações**.
- Nenhum checkout ou pagamento dentro da Fiel Shop. Compras, envios, suporte a pedidos e preços ficam com o marketplace.

## Publicação sem hospedagem paga: GitHub Pages
1. Abra `Settings` deste repositório no GitHub.
2. Na barra lateral, clique em `Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Em `Branch`, selecione `main` e `/(root)`, depois clique em `Save`.
5. Aguarde a conclusão da publicação. A URL esperada após a ativação é `https://joaodimas86.github.io/ShopFiel/`. **Não significa que a URL já esteja ativa.**

O GitHub Pages precisa permanecer público se usar o repositório público atual. Não publique chaves, senhas, dados de clientes ou informações confidenciais neste repositório.

## Como testar localmente
O site é HTML + CSS + JavaScript e não precisa de Node.js. Como o catálogo é carregado com `fetch()`, **não** abra `index.html` diretamente pelo sistema de arquivos: sirva a pasta por um servidor local.

Por exemplo:
```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/`.

## Estrutura
- `index.html`: página e diálogos.
- `style.css`: identidade visual responsiva.
- `app.js`: pesquisa, listagem, detalhes e saídas para marketplaces.
- `data/*.json`: arquivos de links recebidos, aguardando verificação.

## Próximas etapas
- Identificar produtos reais pelos links, com autorização de uso das imagens e atualização de preços.
- Confirmar a validade de rastreamento dos links da Shopee.
- Concluir afiliação Mercado Livre antes de anunciar comissões.
- Criar painel administrativo com autenticação segura.
- Revisar acessibilidade, testes em celular, identidade e documentação legal antes de campanha pública.

Nenhum link deve ser interpretado automaticamente como comissão garantida. A confirmação depende do programa de afiliados e das regras de atribuição.
