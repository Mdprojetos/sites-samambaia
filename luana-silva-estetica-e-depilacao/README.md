# Luana Silva Estética e Depilação · prévia de site

Prévia de site criada por Marcus Dantas como proposta, sem o conhecimento do negócio. **Não é o site oficial.** A página tem `noindex, nofollow` e uma faixa avisando que é uma prévia.

- **Nome no Google Maps:** Luana Silva Estética e Depilação
- **Categoria (Maps):** Depilação · usada aqui como clínica de estética (estética e depilação)
- **Bairro:** Samambaia Norte
- **Endereço:** QN 209, Conjunto 01, Lote 22, Sala 201 – Samambaia Norte, Brasília – DF, 72341-414
- **Telefone:** (61) 98144-7307 (número de celular; os botões abrem o WhatsApp — confirmar com o negócio se o número usa WhatsApp)
- **Horários:** Segunda: 9h – 19h; Terça: 9h – 19h; Quarta: 9h – 19h; Quinta: 9h – 19h; Sexta: 9h – 19h; Sábado: 9h – 17h; Domingo: Fechado
- **Nota:** 5,0 · 25 avaliações no Google
- **Site no perfil:** Instagram (sem domínio próprio)
- **Fonte dos dados:** perfil público do Google Maps, consultado em 11 de novembro de 2026. Nenhum texto de avaliação, nome de cliente ou foto foi copiado.

## Fotos a trocar

Todos os espaços de foto são ilustrativos. As fotos reais devem vir do próprio negócio: veja `img/LEIA-ME.txt` (img/hero.jpg, img/trabalho-1.jpg … img/trabalho-10.jpg).

## Dados que faltaram

- Lista de serviços e valores (o site só cita o que aparece no nome/categoria do perfil e manda o resto para o WhatsApp)
- Fotos reais, Instagram, CNPJ
- Horário de domingo: o perfil mostrava "Fechado" na semana de feriado (15/11); confirmar o horário normal

## Clube de aniversário

Clube de aniversário: desativado na prévia (BDAY_URL vazio). Para ativar, o negócio segue aniversarios/COMO-CONFIGURAR.md, define desconto e validade e envia a URL /exec.

Com `bdayUrl` vazio (no `<script id="cfg">` do index.html), o formulário valida os campos mas não faz nenhum pedido de rede e mostra a mensagem de prévia.

## Arquivos

- `index.html`: página (dados do negócio em `<script type="application/json" id="cfg">`)
- `style.css`, `site.js`, `icons.svg`: arquivos compartilhados entre as prévias
- `privacidade.html`: política de privacidade (LGPD)
- `vercel.json`: cabeçalhos de segurança (CSP com `frame-src https://www.google.com`, `X-Robots-Tag: noindex`)
- `aniversarios/`: Code.gs e COMO-CONFIGURAR.md do clube de aniversário (Google Apps Script)
