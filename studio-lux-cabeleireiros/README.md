# Studio Lux Cabeleireiros · prévia de site

Prévia criada por Marcus Dantas como **proposta**, sem o conhecimento do negócio. Não é o site oficial (página com `noindex` e faixa de aviso).

- **Categoria:** Salão de beleza
- **Bairro:** Samambaia Norte
- **Endereço:** QR 208 Conjunto 18 Lote 26, Loja 01, Samambaia Norte, Brasília - DF, 72316-119
- **Telefone/WhatsApp:** (61) 98582-5061
- **Nota no Google:** 5,0 (34 avaliações)
- **Horários (perfil do Google Maps):**
  - Segunda: 10h – 19h
  - Terça: 10h – 19h
  - Quarta: 10h – 19h
  - Quinta: 10h – 19h
  - Sexta: 10h – 19h
  - Sábado: 10h – 19h
  - Domingo: Fechado
- **Fonte dos dados:** perfil público do Google Maps, lido em 30 de outubro de 2026. Nenhum texto de avaliação, nome de cliente ou foto foi copiado.
- **Prévia:** projeto `previa-studio-lux-cabeleireiros` na Vercel (endereço público no relatório do dia)

## Fotos
Fotos enviadas por Marcus Dantas em 14 de novembro de 2026 (formato WebP, já reduzidas para carregar rápido no celular):
- `img/hero.webp`: topo (penteado de noiva)
- `img/sobre.webp`: seção "Sobre" (profissional em frente ao letreiro)
- `img/espaco-1.webp` e `img/espaco-2.webp`: recortes do letreiro e do certificado na parede
- `img/trabalho-1.webp` a `img/trabalho-3.webp`: galeria (cachos, corte reto e penteado; as fileiras repetem as fotos)

Também veio um folheto de serviços (progressiva, mechas, botox capilar, hidratação, sobrancelhas, escova e corte). A foto da modelo do folheto parece de banco de imagens e não foi usada; a lista de serviços ainda não foi aplicada aos cards.

Antes de mostrar a prévia ao negócio, confirme que as fotos são do próprio salão e que ele e as clientes autorizam o uso.

Na publicação da Vercel, as imagens são carregadas desta pasta do GitHub pelo jsDelivr (cdn.jsdelivr.net) e o vercel.json publicado libera esse endereço em img-src. A cópia no GitHub usa os caminhos locais `img/...`.

## Dados que faltaram
- CNPJ (para a política de privacidade)
- Instagram e lista de serviços/valores (não constam no perfil do Maps)
- Confirmar se o número é WhatsApp (o perfil mostra só "Telefone"; os botões usam wa.me)
- Desconto/condição e validade do clube de aniversário (definir com o negócio)

## Clube de aniversário
Clube de aniversário: desativado na prévia (BDAY_URL vazio). Para ativar, o negócio segue aniversarios/COMO-CONFIGURAR.md, define desconto e validade e envia a URL /exec.

## Arquivos
- `index.html` (dados do negócio em `window.SITE`), `privacidade.html`, `vercel.json` (CSP + noindex)
- `style.css`, `site.js`, `icons.svg`: compartilhados entre as prévias
