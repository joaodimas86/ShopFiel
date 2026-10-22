# Newsletter Shop Fiel — Arquibancada Fiel

## Status: implementação preparada, aguardando formulário real do Kit

Este trabalho foi desenvolvido na branch `feature/newsletter-arquibancada-fiel` e **não está publicado em `main`**. O código de inscrição do Kit pertence à conta que a Shop Fiel irá criar, por isso não deve ser inventado.

## Kit — plano gratuito (verificado em 22/10/2026)

O plano gratuito atual inclui até **10.000 inscritos**, formulários e páginas ilimitados e envios de newsletter ilimitados. Ultrapassar esse total implica escolher um plano pago para continuar enviando.

Fontes oficiais:
- https://help.kit.com/en/articles/16627071-the-kit-free-plan
- https://help.kit.com/en/articles/4009572-form-embedding-basics
- https://help.kit.com/en/articles/2502655-the-confirmation-email

## Ativação da conta e do formulário

1. Criar a conta Shop Fiel em https://kit.com/ e selecionar **Free**, sem aderir inadvertidamente a um trial pago.
2. Acessar `Grow > Landing Pages & Forms`; criar um **Form** do tipo **Inline** chamado “Arquibancada Fiel”. Não criar Landing Page: ela não pode ser incorporada como formulário no site.
3. Na edição, usar visual monocromático (preto, branco, cinza); texto sugerido: “Entre para a lista da Fiel” e botão “Quero receber”.
4. Em `Settings > Confirmation Email`, habilitar **Send confirmation email** e deixar **Auto-confirm new subscribers** desativado (dupla confirmação).
5. Publicar o formulário no Kit com **Save & Publish**. Em `Embed > JavaScript`, copiar o código completo do **formulário**, não uma chave privada/API.
6. Em `blog/index.html`, substituir o bloco de preparação marcado `KIT_FORM_EMBED_SHOPFIEL` (inclusive o aviso de preparação) pelo código oficial de embed fornecido pela conta Shop Fiel.
7. Revisar identificação do remetente, opção de descadastro e política de privacidade; manter explicação clara do que será enviado e somente coletar dados necessários.
8. Abrir a página em ambiente de teste, enviar cadastro com endereço de teste controlado, conferir recebimento do email de confirmação, clicar no link, validar status “Confirmed” no Kit e testar descadastro. Validar mobile e desktop.
9. **Somente após o teste real**, aplicar as mudanças da branch em `main` e conferir o deploy do GitHub Pages.

## Segurança e privacidade

- **Jamais** publicar chave de API secreta no repositório público.
- Usar apenas o script público de incorporação gerado na conta Shop Fiel.
- Consentimento informado explícito na interface, e dupla confirmação ativa no Kit.
- Dados dos leitores pertencem à lista Kit controlada pela Shop Fiel, não ficam salvos no GitHub.
- O código da branch é apenas a estrutura visual e não representa um cadastro funcional enquanto não existir formulário publicado e testado.

## Arquivos nesta branch

- `blog/index.html` — seção, âncora no menu e espaço para incorporação do Kit
- `blog/blog.css` — visual responsivo e monocromático
- `integrations/newsletter/README.md` — instruções de ativação e testes
