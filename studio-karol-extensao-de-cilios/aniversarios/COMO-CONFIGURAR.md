# Clube de aniversário: como configurar

Os cadastros feitos no site vão para uma planilha do Google. Todo dia, às 8h, o Google confere quem faz aniversário e manda um e-mail com um botão que abre o WhatsApp da cliente com a mensagem de parabéns já escrita (com a oferta, se o negócio definir uma).

Tudo é gratuito. Faça isso **uma vez**, logado na conta Google que vai receber os avisos (a de Studio Karol - Extensão de Cílios).

## 1. Criar a planilha

1. Acesse <https://sheets.new> e dê o nome **Studio Karol - Extensão de Cílios · Aniversários**.
2. No menu, clique em **Extensões → Apps Script**.
3. Apague o que estiver escrito no editor, cole todo o conteúdo do arquivo `Code.gs` e clique em **Salvar** (ícone de disquete).

## 2. Definir o desconto e a validade

**Quem escolhe o desconto (ou a condição especial) e a validade é Studio Karol - Extensão de Cílios.** O site não promete nenhum valor. No topo do código, preencha:

```js
const DESCONTO = '';   // definir com o negócio, ex.: '10% de desconto' ou 'uma condição especial'
const VALIDADE = '';   // definir com o negócio, ex.: 'durante todo o mês do seu aniversário'
const EMAIL_AVISO = '';   // deixe vazio para receber no e-mail desta conta
const HORA_AVISO = 8;
```

Enquanto `DESCONTO` ficar vazio, a mensagem de parabéns vai sem oferta. Salve de novo.

## 3. Ativar o aviso diário

1. Na barra de cima, escolha a função **configurar** e clique em **Executar**.
2. O Google vai pedir permissão. Clique em **Revisar permissões**, escolha a conta e depois em **Avançado → Acessar projeto (não seguro)** → **Permitir**. O aviso aparece porque o script foi feito por você e não passou por revisão do Google. É normal.
3. Volte à planilha: deve ter aparecido a aba **Cadastros**.
4. (Opcional) Escolha a função **testarAviso** e clique em **Executar** para receber um e-mail de exemplo.

## 4. Publicar para o site conseguir enviar os cadastros

1. Clique em **Implantar → Nova implantação**.
2. Na engrenagem, escolha **App da Web**.
3. Preencha:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
5. Envie essa URL para quem cuida do site. Ela vai no `index.html`, na linha:

```js
SITE.BDAY_URL = ''; // colar aqui a URL /exec
```

## Dia a dia

- Os cadastros aparecem na aba **Cadastros**. Se alguém se cadastrar de novo com um WhatsApp que já está na planilha, o cadastro original é mantido (isso impede que outra pessoa altere os dados de uma cliente). Para corrigir um nome ou data, edite direto na planilha.
- Para tirar alguém (pedido de exclusão), apague a linha da pessoa.
- A coluna **Último aviso (ano)** marca quem já foi avisado no ano, para não repetir.
- Quem nasceu em 29/02 é avisado no dia 28/02 nos anos que não são bissextos.

## Cuidados com os dados das clientes

- **Não compartilhe a planilha.** Quem tem acesso de edição à planilha também vê e altera o script. Se precisar mostrar para alguém, compartilhe só como leitor e por pouco tempo.
- **Ative a verificação em duas etapas** na conta Google que guarda a planilha (<https://myaccount.google.com/signinoptions/two-step-verification>). A planilha é tão segura quanto a senha dessa conta.
- **A URL `/exec` não é segredo.** Ela fica no código do site, e qualquer pessoa pode vê-la. Isso não é um problema: por ela só é possível *enviar* um cadastro, nunca ler a planilha.
- **Ao trocar de conta**, depois que o site estiver usando a URL nova, vá na conta antiga em **Implantar → Gerenciar implantações → Arquivar**. Assim a URL antiga para de aceitar cadastros. Depois apague a planilha antiga (e a lixeira do Drive).
- **Pedido de exclusão (LGPD):** apague a linha da pessoa e responda confirmando.

## Se mudar o código depois

Depois de editar o `Code.gs`, vá em **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. Assim a URL continua a mesma.
