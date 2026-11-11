# Luana Silva Estética e Depilação · prévia de site

Prévia de site criada por Marcus Dantas como proposta, sem o conhecimento do negócio. **Não é o site oficial.** A página tem `noindex, nofollow` e uma faixa avisando que é uma prévia.

- **Nome no Google Maps:** Luana Silva Estética e Depilação
- **Categoria (Maps):** Depilação · usada aqui como clínica de estética (estética e depilação)
- **Bairro:** Samambaia Norte
- **Endereço:** QN 209, Conjunto 01, Lote 22, Sala 201 – Samambaia Norte, Brasília – DF, 72341-414
- **Telefone (Google Maps):** (61) 98144-7307 · usado no site só como "Ligar"
- **WhatsApp (folheto do studio):** (61) 99595-5215 · todos os botões de agendar abrem este número
- **Instagram (folheto do studio):** @studioluanasilvaestetica
- **Serviços (folheto do studio):** massagem, depilação, limpeza de pele, dermaplaning e spa dos pés
- **Horários:** Segunda: 9h – 19h; Terça: 9h – 19h; Quarta: 9h – 19h; Quinta: 9h – 19h; Sexta: 9h – 19h; Sábado: 9h – 17h; Domingo: Fechado
- **Nota:** 5,0 · 25 avaliações no Google
- **Site no perfil:** Instagram (sem domínio próprio)
- **Fonte dos dados:** perfil público do Google Maps, consultado em 11 de novembro de 2026, e o folheto de serviços do studio (WhatsApp, Instagram e serviços). Nenhum texto de avaliação, nome de cliente ou foto foi copiado.

## Fotos e folheto

Imagens enviadas por Marcus Dantas em 11 de novembro de 2026 (formato WebP, já reduzidas para carregar rápido no celular):

- `img/hero.webp`: foto principal do topo, recortada do folheto "Quem sou eu?" (só a foto da Luana, sem o texto)
- `img/studio.webp`: sala de atendimento, na seção "Conheça o studio"
- `img/folheto-servicos.webp`: folheto de serviços inteiro, na seção "Conheça o studio"

O WhatsApp, o Instagram e a lista de serviços vieram do folheto de serviços do próprio studio. A galeria que desliza foi trocada por uma seção fixa com essas duas imagens, porque os folhetos têm muito texto.

Antes de mostrar a prévia ao negócio, confirme que as imagens podem ser usadas. Para pôr fotos de trabalhos, crie `img/trabalho-1.webp` etc. (retrato 3:4) e acrescente-as na seção "Conheça o studio".

Na publicação da Vercel, as imagens são carregadas desta pasta do GitHub pelo jsDelivr (cdn.jsdelivr.net). A cópia no GitHub usa os caminhos locais `img/...`.

## Dados que faltaram

- Valores dos serviços (informados pelo WhatsApp)
- Fotos de trabalhos, CNPJ
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
