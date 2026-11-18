# Azevedo Odontologia Especializada · prévia de site

> Prévia de site criada por Marcus Dantas como proposta. Não é o site oficial do negócio.

- **Nome:** Azevedo Odontologia Especializada
- **Categoria:** Clínica odontológica
- **Bairro:** Samambaia Norte
- **Endereço:** QS 408 CONJUNTO G, LOTE 4 - Samambaia Norte, Brasília - DF, 72318-597
- **Telefone:** (61) 98312-7952 (celular, WhatsApp a confirmar)
- **Nota no Google:** 4,9 · 42 avaliações
- **Horários:**
  - Segunda: 8h – 18h
  - Terça: 8h – 18h
  - Quarta: 8h – 18h
  - Quinta: 8h – 18h30
  - Sexta: 8h – 18h
  - Sábado: 8h – 12h
  - Domingo: Fechado
- **Fonte dos dados:** perfil público do negócio no Google Maps, lido em 18/11/2026. Nenhum dado foi inventado; só nota e total de avaliações são mostrados (sem textos ou nomes de clientes).
- **Prévia publicada:** https://previa-azevedo-odontologia-especial.vercel.app (projeto previa-azevedo-odontologia-especializada; a Vercel encurta nomes longos)

## Fotos a trocar
Todos os espaços de foto são ilustrações. Veja `img/LEIA-ME.txt` (hero.jpg, sobre.jpg, trabalho-1.jpg … trabalho-10.jpg). As fotos reais devem vir do próprio negócio.

## Dados que faltaram
- Fotos reais (trabalhos, espaço, equipe): pedir ao negócio.
- Lista de serviços e valores: não informada no perfil.
- CNPJ: não informado (comentário deixado na política de privacidade).
- Instagram: não incluído.
- Confirmar com o negócio que (61) 98312-7952 é WhatsApp (o perfil traz o número como telefone).
- Clube de aniversário: desconto/condição e validade a definir pelo negócio.

## Técnico
- Página estática: `index.html` + `style.css`, `site.js`, `icons.svg` (compartilhados entre as prévias) e `privacidade.html` (com `privacidade.css`, também compartilhado).
- `noindex, nofollow` na página e no cabeçalho `X-Robots-Tag` (`vercel.json`).
- Mapa do Google só carrega ao tocar em “Mostrar mapa” (`frame-src https://www.google.com` no CSP).
- Google Analytics desativado (`GA_ID = ''`).

Clube de aniversário: desativado na prévia (BDAY_URL vazio). Para ativar, o negócio segue aniversarios/COMO-CONFIGURAR.md (arquivos `Code.gs` = configuração e `Clube.gs` = lógica), define desconto e validade e envia a URL /exec.
