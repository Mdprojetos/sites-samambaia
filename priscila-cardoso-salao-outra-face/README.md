# Priscila Cardoso – Salão Outra Face — prévia de site

> Prévia criada por Marcus Dantas como proposta, sem o conhecimento do negócio. Não é o site oficial. Página com `noindex`.

- **Categoria:** Salão de beleza
- **Bairro:** Samambaia Sul
- **Endereço:** QS 112 – Samambaia, Brasília – DF, 72302-540
- **Telefone/WhatsApp:** (61) 98612-9021 — número de celular do perfil (presume-se WhatsApp)
- **Instagram:** @salaooutraface (visto na placa da fachada; adicionado ao site em 18/11/2026)
- **Nota no Google:** 4,8 (35 avaliações)

## Horários (perfil do Google)

- Segunda: 9h às 18h
- Terça: 9h às 18h
- Quarta: 9h às 18h
- Quinta: 9h às 18h
- Sexta: 9h às 18h
- Sábado: 9h às 20h
- Domingo: fechado

## Fonte dos dados

Perfil público do negócio no Google Maps, consultado em 16/11/2026. Nenhum texto de avaliação, nome de cliente ou foto foi copiado.

## Fotos (pasta `img/`)

Fotos enviadas por Marcus Dantas em 18 de novembro de 2026 (formato WebP, já reduzidas para carregar rápido no celular):

- `img/hero.webp`: topo (cabelo loiro em ondas, diante do painel com o logotipo)
- `img/sobre.webp`: seção "Sobre" (profissional finalizando os cachos de uma cliente; a foto original estava espelhada e foi desvirada para o letreiro ficar legível)
- `img/trabalho-1.webp` a `img/trabalho-3.webp`: galeria (cachos, mechas e ondas)
- `img/trabalho-4.webp`: galeria (fachada do salão)

A foto da seção "Sobre" mostra o rosto de uma cliente, que posou para a foto. Confirme com o salão que ela autoriza o uso. Na fachada aparece um carro estacionado, sem placa visível.

A placa da fachada mostra o Instagram @salaooutraface (já colocado no site) e um endereço diferente do perfil do Google (QR 333, Conjunto C, lote 7, Avenida 300/302?). Confirme o endereço atual com o salão antes de publicar.

Na publicação da Vercel, as imagens são carregadas desta pasta do GitHub pelo jsDelivr (cdn.jsdelivr.net), liberado no `vercel.json`. A cópia no GitHub usa os caminhos locais `img/...`.

## O que faltou

- CNPJ (comentário reservado em privacidade.html)
- Lista de serviços e preços (não informada no perfil; não foi inventada)
- Desconto/condição especial e validade do Clube de aniversário (definir com o negócio)

## Clube de aniversário

Clube de aniversário: desativado na prévia (BDAY_URL vazio). Para ativar, o negócio segue aniversarios/COMO-CONFIGURAR.md, define desconto e validade e envia a URL /exec.

## Arquivos

- `index.html`: página (dados do negócio em `window.SITE`)
- `style.css`, `site.js`, `icons.svg`: arquivos compartilhados entre as prévias
- `privacidade.html`: política de privacidade (LGPD)
- `vercel.json`: cabeçalhos de segurança (CSP com `frame-src https://www.google.com`, `X-Robots-Tag: noindex`)
