# Inscrição Arquibancada Fiel — operação a custo zero

## Situação

Versão preparada na branch `feature/newsletter-arquibancada-fiel`, **não publicada no site oficial até cadastro funcionar e ser testado**. Substitui Buttondown e Kit.

## Arquitetura

1. Site estático no GitHub Pages (Shop Fiel), hospedagem atual sem contratação nova
2. Google Forms gratuito: coleta e-mail e aceite informado
3. Google Sheets vinculado ao Forms: cadastro privado, lista de exclusão/descadastro
4. Outlook já disponível no computador do responsável: preparo e envio manual de newsletter para contatos autorizados

Sem serviços pagos novos. Serviços gratuitos podem ter limites de armazenamento, política ou envio; esta solução é adequada para começar pequeno, não para disparos em massa.

## Como criar formulário no Google Forms

1. Ir a https://forms.google.com e criar um formulário em branco chamado **Arquibancada Fiel — Inscrição gratuita**.
2. Descrição: "Receba notícias, artigos e novidades da Shop Fiel por e-mail. Sem cobrança. Você poderá cancelar a inscrição a qualquer momento."
3. Em **Configurações > Respostas > Coletar endereços de e-mail**, escolher **Entrada do participante** (não a opção "Verificado", para não obrigar login com conta Google).
4. Incluir pergunta obrigatória tipo **caixas de seleção**: "Autorizo a Shop Fiel a enviar notícias, artigos e novidades por e-mail, com opção de descadastro a qualquer momento", opção "Sim, quero receber". Pergunta obrigatória.
5. Desligar a opção **Limitar a 1 resposta** (ela exigiria login no Google). Não limitar o formulário a pessoas de uma organização. Não pedir nome, CPF, senha ou WhatsApp.
6. Em **Respostas**, usar o botão para **vincular uma planilha** privada do Google Sheets à coleta, para organizar os inscritos.
7. **Publicar** o formulário para os respondentes e clicar em **Incorporar HTML (<>)**. Copiar o código completo `<iframe ...></iframe>`.
8. Na `blog/index.html` da branch de desenvolvimento, substituir o comentário `<!-- GOOGLE_FORMS_EMBED_SHOPFIEL -->` e parágrafo de preparação pelo **iframe oficial**. Não publicar a URL de edição nem a planilha de inscritos.
9. Fazer um teste completo: preencher como visitante sem login, conferir que chega ao Google Forms e à planilha, validar endereço coletado, privacidade e visual no celular. Não enviar newsletter até confirmar a autorização e verificar que o email é válido.
10. Publicar a branch na `main` somente quando o fluxo estiver validado.

## Envio das newsletters pelo Outlook

- Criar campanha manual no Outlook com assunto claro, identificação Shop Fiel, conteúdo objetivo e link real para o site.
- Usar apenas endereços com consentimento. **Bcc/CCO** preserva privacidade; jamais deixar toda a lista visível em Para/Cc.
- Preferir poucos destinatários e cadência baixa, sem automatização de disparo massivo. Verificar limites e políticas do provedor de e-mail ligado ao Outlook (Exchange Online não é recomendado pela Microsoft para marketing em massa).
- Incluir rodapé: "Você está recebendo este e-mail porque se inscreveu na Arquibancada Fiel. Para sair da lista, responda SAIR".
- Antes de cada envio, verificar e remover contatos que solicitaram cancelamento e aqueles que tiveram erros de entrega. Manter planilha privada e segura.
- O Google Forms **não comprova posse do e-mail** quando a coleta é por digitação; não afirmar que há double opt-in. Se houver crescimento ou abusos, implementar confirmação verificável.

## LGPD e segurança

- A base é consentimento específico e transparente para a finalidade descrita.
- Evitar coletar outras informações além do e-mail e da autorização.
- Restrição de acesso à planilha e opção de excluir dados mediante pedido.
- Para produção, disponibilizar política de privacidade e contato de cancelamento.
- Never publish mailbox passwords or tokens in GitHub (não publicar senhas, tokens ou dados dos inscritos no repositório).

## Arquivos

- `blog/index.html`: versão de desenvolvimento da área de cadastro, com espaço para o iframe do Google Forms.
- `blog/blog.css`: identidade preto/branco/cinza, responsivo.
