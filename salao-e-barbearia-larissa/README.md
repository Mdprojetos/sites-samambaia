# Salão e Barbearia Larissa · prévia de site

> Prévia de site criada por Marcus Dantas como proposta. Não é o site oficial do negócio.

- **Nome:** Salão e Barbearia Larissa
- **Categoria:** Salão de beleza e barbearia
- **Bairro:** Samambaia Norte
- **Endereço:** QR 204 Principal entre a 204, conjunto 05 35 - Samambaia, Brasília - DF, 72316-085
- **Telefone:** (61) 3357-0053 (fixo)
- **Nota no Google:** 5,0 · 40 avaliações
- **Horários:**
  - Segunda: 8h – 19h
  - Terça: 8h – 19h
  - Quarta: 8h – 19h
  - Quinta: 8h – 19h
  - Sexta: 8h – 19h
  - Sábado: 8h – 19h
  - Domingo: Fechado
- **Fonte dos dados:** perfil público do negócio no Google Maps, lido em 18/11/2026. Nenhum dado foi inventado; só nota e total de avaliações são mostrados (sem textos ou nomes de clientes).
- **Prévia publicada:** https://previa-salao-e-barbearia-larissa.vercel.app

## Fotos a trocar
Todos os espaços de foto são ilustrações. Veja `img/LEIA-ME.txt` (hero.jpg, sobre.jpg, trabalho-1.jpg … trabalho-10.jpg). As fotos reais devem vir do próprio negócio.

## Dados que faltaram
- Fotos reais (trabalhos, espaço, equipe): pedir ao negócio.
- Lista de serviços e valores: não informada no perfil.
- CNPJ: não informado (comentário deixado na política de privacidade).
- Instagram: não incluído.
- WhatsApp: o perfil traz só telefone fixo (61) 3357-0053; os botões fazem ligação (tel:). Trocar por WhatsApp quando o negócio informar.
- Clube de aniversário: desconto/condição e validade a definir pelo negócio.

## Técnico
- Página estática: `index.html` + `style.css`, `site.js`, `icons.svg` (compartilhados entre as prévias) e `privacidade.html` (com `privacidade.css`, também compartilhado).
- `noindex, nofollow` na página e no cabeçalho `X-Robots-Tag` (`vercel.json`).
- Mapa do Google só carrega ao tocar em “Mostrar mapa” (`frame-src https://www.google.com` no CSP).
- Google Analytics desativado (`GA_ID = ''`).

Clube de aniversário: desativado na prévia (BDAY_URL vazio). Para ativar, o negócio segue aniversarios/COMO-CONFIGURAR.md (arquivos `Code.gs` = configuração e `Clube.gs` = lógica), define desconto e validade e envia a URL /exec.
