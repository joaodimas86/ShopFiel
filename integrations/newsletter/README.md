# Cadastro por e-mail — Blog da Fiel

## Situação

Implementação visual preparada nesta branch de desenvolvimento, **não publicada** na página principal. O formulário só deve ir para `main` quando houver uma conta de newsletter da Shop Fiel e um teste real de inscrição.

## Provedor: Buttondown

- Cadastro de usuários via HTML `POST` tradicional, compatível com GitHub Pages (não enviar o formulário por `fetch`, pois há validação/CAPTCHA com possíveis redirecionamentos).
- Confirmação de inscrição por e-mail (double opt-in).
- Lista de assinantes e gerenciamento de cancelamentos na plataforma.
- Primeiros 100 assinantes sem custo, conforme página de preços consultada em 22/10/2026; conferir valores antes de contratar conforme crescimento.
- Referência: https://docs.buttondown.com/building-your-subscriber-base

## Para ativar

1. Criar uma conta de newsletter em https://buttondown.com/ para a **Shop Fiel** e verificar o e-mail administrativo.
2. Anotar o nome de usuário da newsletter (exemplo: `shopfiel`, somente se estiver disponível — não supor nem usar um usuário alheio).
3. Em `blog/index.html`, substituir `CONFIGURAR_USUARIO_SHOPFIEL` pelo nome real confirmado na conta. Não usar chave secreta no HTML.
4. Revisar se a publicação e os links de cancelamento estão ativos na conta.
5. Testar inscrição com e-mail de teste próprio, receber confirmação, clicar no link e conferir se o contato apareceu como assinante.
6. Testar o cancelamento/descadastro; conferir visual em celular e computador.
7. Somente depois: publicar os arquivos revisados da branch `feature/newsletter-arquibancada-fiel` em `main`.

## Dados e consentimento

O formulário solicita apenas o endereço de e-mail e uma confirmação de consentimento. A própria confirmação por e-mail estabelece verificação adicional. O site não guarda dados dos inscritos no GitHub. A lista de assinantes ficará sob a conta Buttondown criada para a Shop Fiel. Manter um contato de privacidade e política de tratamento de dados antes do lançamento.

## Arquivos nesta branch

- `blog/index.html` — seção de inscrição + âncora no menu
- `blog/blog.css` — estilos responsivos monocromáticos
