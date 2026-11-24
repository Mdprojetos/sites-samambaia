# Clube de aniversário de Renata Mendes Bronzeamento Natural E Artificial: como configurar

Os cadastros feitos no site vão para uma planilha do Google. Todo dia, às 8h, o Google confere quem faz aniversário e manda um e-mail com um botão que abre o WhatsApp da pessoa com a mensagem de parabéns já escrita. Tudo é gratuito. Faça **uma vez**, logado na conta Google do negócio.

**Quem escolhe o desconto e a validade é o próprio Renata Mendes.** A prévia deixa os dois em branco.

## 1. Criar a planilha
1. Acesse <https://sheets.new> e dê o nome **Renata Mendes · Aniversários**.
2. Clique em **Extensões → Apps Script**.
3. Apague o que estiver no editor e cole todo o `Code.gs`.
4. Clique no **+** ao lado de *Arquivos* → **Script**, dê o nome `config`, cole o `config.gs` e preencha `DESCONTO` e `VALIDADE`. Salve.

## 2. Ativar o aviso diário
1. Escolha a função **configurar** e clique em **Executar**.
2. Autorize: **Revisar permissões → conta → Avançado → Acessar projeto (não seguro) → Permitir**. O aviso aparece porque o script não passou por revisão do Google; é normal.
3. Confira a aba **Cadastros** na planilha. (Opcional: rode **testarAviso** para receber um e-mail de exemplo.)

## 3. Publicar para o site enviar os cadastros
1. **Implantar → Nova implantação → App da Web**. Executar como: **Eu**. Quem pode acessar: **Qualquer pessoa**.
2. Copie a **URL do app da Web** (termina em `/exec`) e envie para quem cuida do site. Ela vai no `dados.js`, na linha `window.BDAY_URL = '';`.
3. Para dúvidas sobre a instalação: Renata Mendes Bronzeamento Natural E Artificial, (61) 99682-5764.

## Dia a dia e cuidados (LGPD)
- Os cadastros aparecem na aba **Cadastros**. Um WhatsApp já cadastrado não é sobrescrito. Para corrigir, edite direto na planilha.
- Pedido de exclusão: apague a linha da pessoa e confirme para ela.
- Não compartilhe a planilha e ative a verificação em duas etapas na conta Google.
- A URL `/exec` não é segredo: por ela só é possível *enviar* um cadastro, nunca ler a planilha.
- Depois de mudar o código: **Implantar → Gerenciar implantações → lápis → Nova versão → Implantar** (a URL continua a mesma).
