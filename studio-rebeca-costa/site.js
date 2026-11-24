// site.js · compartilhado entre as prévias. Monta a página com os dados de dados.js (window.SITE).
(() => {
  const S = window.SITE, D = document, $ = id => D.getElementById(id);
  const esc = s => String(s).replace(/[&<>'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','`':'&#96;'}[c]));
  const odonto = S.kind === 'odonto', isWa = !!S.wa;
  const fmt = m => Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');
  const DAYS = [[1,'Segunda'],[2,'Terça'],[3,'Quarta'],[4,'Quinta'],[5,'Sexta'],[6,'Sábado'],[0,'Domingo']];
  const q = encodeURIComponent(S.name + ' ' + S.addrFull);
  const hello = 'Olá, ' + S.short + '! Gostaria de agendar um horário.';
  const X = {
    channel: isWa ? 'WhatsApp' : 'telefone',
    contactUrl: isWa ? 'https://wa.me/' + S.wa + '?text=' + encodeURIComponent(hello) : 'tel:' + S.tel,
    benefit: odonto ? 'uma possível condição especial' : 'um possível desconto ou condição especial',
    catLow: odonto ? 'consultório odontológico' : S.cat.toLowerCase(),
    addrLong: S.addr + ', ' + S.bairro + ', Brasília – DF, CEP ' + S.cep,
    mapSrc: 'https://www.google.com/maps?q=' + q + '&output=embed',
    mapsLink: 'https://www.google.com/maps/search/?api=1&query=' + q,
    routeLink: 'https://www.google.com/maps/dir/?api=1&destination=' + q
  };
  const V = Object.assign({}, S, X);

  // cores e fontes do negócio
  const r = D.documentElement.style;
  Object.entries(S.pal).forEach(([k, v]) => r.setProperty('--' + k, v));
  r.setProperty('--serif', "'" + S.fonts.serif + "',Georgia,serif"); r.setProperty('--sans', "'" + S.fonts.sans + "',system-ui,sans-serif"); r.setProperty('--serif-w', S.fonts.w);
  const fl = D.createElement('link'); fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=' + S.fonts.q + '&display=swap'; D.head.append(fl);

  // política de privacidade: só preenche os campos
  if (D.body.classList.contains('legal-page')) {
    D.title = 'Política de Privacidade · ' + S.short + ' (prévia)';
    D.querySelectorAll('[data-k]').forEach(el => { el.textContent = V[el.dataset.k]; if (el.dataset.href) el.href = V[el.dataset.href]; });
    return;
  }

  D.title = S.short + ' · ' + S.bairro + ' (prévia)';
  const md = D.createElement('meta'); md.name = 'description'; md.content = 'Prévia de site para ' + S.name + ', ' + S.cat.toLowerCase() + ' em ' + S.bairro + ' – DF. Proposta, não é o site oficial.'; D.head.append(md);
  const ic = (id, cls) => '<svg class=' + (cls || 'ic') + '><use href=icons.svg#' + id + '></use></svg>';
  const stars = ic('i-star', 'st').repeat(5);
  const tgt = isWa ? ' target=_blank rel=noopener' : '';
  const cIcon = isWa ? 'i-wa' : 'i-phone';
  const cLabel = isWa ? 'Agendar pelo WhatsApp' : 'Ligar ' + S.phone;
  const cta = cls => '<a class=\'' + cls + '\' href=\'' + esc(X.contactUrl) + '\'' + tgt + '>' + ic(cIcon) + esc(cLabel) + '</a>';
  const title = esc(S.title).replace(/\{(.+?)\}/, '<span class=accent-word><i>$1</i><svg class=accent-line viewBox=\'0 0 200 30\' preserveAspectRatio=none aria-hidden=true><path id=accentPath d=\'M4 8 Q100 36 196 8\' fill=none stroke=currentColor stroke-width=4 stroke-linecap=round /></svg></span>');
  const hoursLi = DAYS.map(([d, n]) => '<li data-day=' + d + '><span>' + n + '</span><span>' + (S.hours[d] ? fmt(S.hours[d][0]) + ' – ' + fmt(S.hours[d][1]) : 'Fechado') + '</span></li>').join('');
  const hoursTxt = DAYS.map(([d, n]) => n.toLowerCase() + ', ' + (S.hours[d] ? 'das ' + fmt(S.hours[d][0]) + ' às ' + fmt(S.hours[d][1]) : 'fechado')).join('; ');
  const ph = (id, label, txt) => '<div class=ph role=img aria-label=\'' + label + '\'>' + ic(id, 'phi') + (txt ? '<span>' + txt + '</span>' : '') + '</div>';
  const plus = '<span class=plus>' + ic('i-plus') + '</span>';
  const bName = esc(S.name), sName = esc(S.short);

  $('app').innerHTML = `
<nav class=nav id=nav aria-label=Principal>
  <a href=#top class=brand><b>${sName}</b><small>${esc(S.sub)}</small></a>
  <ul><li><a href=#atendimento>Atendimento</a></li><li><a href=#sobre>Sobre</a></li><li><a href=#avaliacoes>Avaliações</a></li><li><a href=#aniversario>Aniversário</a></li><li><a href=#contato>Contato</a></li></ul>
  <a class='btn btn-primary' href='${esc(X.contactUrl)}'${tgt}>${isWa ? 'Agendar' : 'Ligar'}</a>
  <button class=burger id=burger aria-label='Abrir menu' aria-expanded=false><span></span><span></span></button>
</nav>
<header class=hero id=top><div class='wrap hero-grid'>
  <div>
    <h1 id=heroTitle>${title}</h1>
    <p class=lead data-hero>${esc(S.cat)} em ${esc(S.bairro)}, na ${esc(S.addr)}. ${isWa ? 'Agende pelo WhatsApp' : 'Agende pelo telefone'} e confira os horários de atendimento.</p>
    <div class=ctas data-hero>${cta('btn btn-primary magnetic')}<a class='btn btn-ghost magnetic' href=#contato>Como chegar</a></div>
    <div class=facts data-hero>
      <div><strong><span data-count=${S.rating.replace(',', '.')} data-dec=1>${S.rating}</span> <span class=stars aria-hidden=true>${stars}</span></strong><span data-count=${S.reviews}>${S.reviews}</span> avaliações no Google</div>
      <div id=heroStatus><strong><span class=dot></span><span data-status-label>Horário</span></strong><span data-status-sub>${esc(S.hoursTxt)}</span></div>
    </div>
  </div>
  <div class=hero-visual data-hero>
    <!-- FOTO: img/hero.jpg -->
    <div class=hero-frame>${ph(S.icon, 'Espaço reservado para a foto principal (img/hero.jpg)')}</div>
    <div class='float-card f2'><span class=ic-wrap>${ic('i-star')}</span><div><b>${S.rating} no Google</b>${S.reviews} avaliações</div></div>
    <div class=float-card><span class=ic-wrap>${ic('i-pin')}</span><div><b>${esc(S.bairro)}</b>${esc(S.addr.split(',')[0])}</div></div>
  </div>
</div></header>
<section class='section svc' id=atendimento><div class=wrap>
  <div class=head><h2 data-up>Como <i>agendar</i>.</h2><p data-up>${odonto ? 'Consultas' : 'Atendimento'} com hora marcada. Fale com ${sName} e combine o melhor horário.</p></div>
  <div class=track id=track>
    <div class=svc-card><span class=num>01</span>${ic(cIcon, 'ic-big')}<h3>${isWa ? 'Chame no WhatsApp' : 'Ligue para agendar'}</h3><p>${isWa ? 'Toque no botão e a mensagem já vai pronta para ' + sName + '.' : 'O telefone de ' + sName + ' é ' + esc(S.phone) + '.'}</p></div>
    <div class=svc-card><span class=num>02</span>${ic('i-cal', 'ic-big')}<h3>Combine o horário</h3><p>Atendimento: ${esc(S.hoursTxt)}.</p></div>
    <a class='svc-card cta-card' href=#contato><span class=num>03</span>${ic('i-pin', 'ic-big')}<h3>Venha até nós</h3><p>${esc(S.addr)}, ${esc(S.bairro)}.</p><span class=go>Ver endereço e mapa →</span></a>
  </div>
  <!-- SERVIÇOS: incluir a lista de serviços quando o negócio informar -->
  <ul class=tags data-up>${S.tags.map(t => '<li>' + esc(t) + '</li>').join('')}</ul>
</div></section>
<section class='section about' id=sobre><div class='wrap about-grid'>
  <!-- FOTO: img/sobre.jpg -->
  <figure class=portrait data-up>${ph('i-img', 'Espaço reservado para foto do espaço (img/sobre.jpg)', 'Foto do espaço')}</figure>
  <div class=about-text>
    <h2 data-up>${sName}, <i>${esc(S.bairro)}</i>.</h2>
    <p data-up>${bName} é ${odonto ? 'um consultório odontológico' : 'um ' + esc(S.cat.toLowerCase())} em ${esc(S.bairro)} – DF, com nota ${S.rating} no Google a partir de ${S.reviews} avaliações.</p>
    <ul class=chips data-up>${S.tags.map(t => '<li>' + ic(S.icon) + esc(t) + '</li>').join('')}<li>${ic('i-star')}Nota ${S.rating} no Google</li></ul>
    <!-- FOTOS: img/trabalho-1.jpg, img/trabalho-2.jpg, img/trabalho-3.jpg -->
    <div class=space data-up>${[1, 2, 3].map(n => ph('i-img', 'Espaço reservado para foto (img/trabalho-' + n + '.jpg)')).join('')}</div>
  </div>
</div></section>
<section class=section id=avaliacoes><div class=wrap><div class=rating-box data-up>
  <div class=rating><strong data-count=${S.rating.replace(',', '.')} data-dec=1>${S.rating}</strong><div><span class=stars aria-label='${S.rating} de 5 estrelas'>${stars}</span><span><span data-count=${S.reviews}>${S.reviews}</span> avaliações no Google</span></div></div>
  <div><h2>Bem avaliado <i>no Google</i>.</h2><p>Nota média de ${S.rating} em ${S.reviews} avaliações no perfil de ${bName} no Google Maps.</p></div>
</div></div></section>
<section class=section id=duvidas style=padding-top:0><div class='wrap faq-grid'>
  <h2 data-up>Dúvidas <i>frequentes</i>.</h2>
  <div data-up>
    <details open><summary>Como faço para agendar?${plus}</summary><div class=ans>Pelo ${X.channel} ${esc(S.phone)}. ${isWa ? 'É só tocar em qualquer botão de agendar e a mensagem já vai pronta.' : 'Toque no botão Ligar para chamar direto do celular.'}</div></details>
    <details><summary>Quais os dias e horários?${plus}</summary><div class=ans>${hoursTxt[0].toUpperCase() + hoursTxt.slice(1)}.</div></details>
    <details><summary>Onde fica?${plus}</summary><div class=ans>${esc(X.addrLong)}. O botão Como chegar abre a rota no Google Maps.</div></details>
  </div>
</div></section>
<section class=bday id=aniversario><div class=wrap><div class=bday-box>
  <div class=bday-text data-up>
    <span class=tag>${ic('i-gift')}Clube de aniversário</span>
    <h2>${odonto ? 'Uma <i>condição especial</i> no seu aniversário.' : 'Seu aniversário merece um <i>presente</i>.'}</h2>
    <p>Cadastre-se e, no seu aniversário, você recebe uma mensagem especial de ${bName} no WhatsApp, com ${X.benefit}, conforme as regras definidas pelo próprio ${odonto ? 'consultório' : 'negócio'}.</p>
    <ul class=perks><li>${ic('i-check')}Cadastro rápido, leva menos de 1 minuto</li><li>${ic('i-check')}Só uma mensagem por ano, no seu aniversário</li><li>${ic('i-check')}Você pode pedir a exclusão quando quiser</li></ul>
  </div>
  <div data-up><form class=bday-form id=bdayForm method=post action=#aniversario novalidate>
    <div class=field><label for=bNome>Nome</label><input id=bNome type=text autocomplete=name placeholder='Como você gostaria de ser chamado(a)' maxlength=80 required aria-describedby=bNomeErr><span class=err id=bNomeErr>Digite o seu nome.</span></div>
    <div class=two>
      <div class=field><label for=bTel>WhatsApp</label><input id=bTel type=tel inputmode=numeric autocomplete=tel-national placeholder='(61) 90000-0000' maxlength=15 required aria-describedby=bTelErr><span class=err id=bTelErr>Digite um telefone com DDD.</span></div>
      <div class=field><label for=bNasc>Data de nascimento</label><input id=bNasc type=text inputmode=numeric autocomplete=bday placeholder=dd/mm/aaaa maxlength=10 required aria-describedby=bNascErr><span class=err id=bNascErr>Digite uma data válida.</span></div>
    </div>
    <div class=hp aria-hidden=true><label for=bSite>Não preencha</label><input id=bSite name=site type=text tabindex=-1 autocomplete=off></div>
    <label class=consent id=bConsentWrap><input id=bConsent type=checkbox required><span>Autorizo ${bName} a guardar meus dados e me enviar uma mensagem no WhatsApp no meu aniversário. Posso pedir a exclusão a qualquer momento. Veja a <a href=privacidade.html target=_blank rel=noopener>Política de Privacidade</a>.</span></label>
    <p class=form-msg id=bMsg role=alert></p>
    <button class='btn btn-primary' type=submit id=bBtn>${ic('i-gift')}Quero participar</button>
  </form></div>
</div></div></section>
<section class=cta id=contato><div class=wrap>
  <div class=cta-box data-up><span class='cta-ring r1'></span><span class='cta-ring r2'></span>
    <h2>Agende seu <i>horário</i>.</h2><p>Fale com ${bName} pelo ${X.channel} ${esc(S.phone)}.</p><div class=ctas>${cta('btn btn-primary magnetic')}</div></div>
  <div class=info>
    <div data-up><h3>${ic('i-pin')}Endereço</h3><p><a class=u href='${esc(X.mapsLink)}' target=_blank rel=noopener>${esc(S.addr)}<br>${esc(S.bairro)} · ${S.cep}<br>Brasília – DF</a></p><a class=route href='${esc(X.routeLink)}' target=_blank rel=noopener>Como chegar →</a></div>
    <div data-up id=hoursCard><h3>${ic('i-clock')}Horários</h3><ul class=hours>${hoursLi}</ul><span class=pill><span class=dot></span><span data-status-full>—</span></span></div>
    <div data-up><h3>${ic('i-phone')}Contato</h3><p><a class=u href='${esc(isWa ? 'https://wa.me/' + S.wa : X.contactUrl)}'${tgt}>${esc(S.phone)}</a> · ${X.channel}</p></div>
  </div>
  <div class=map id=map data-up><button class='btn btn-ghost' type=button id=mapLoad>${ic('i-pin')}Mostrar mapa</button><p>O mapa é do Google e só carrega quando você toca.</p></div>
</div></section>
<footer><div class=wrap><span>© <span id=yr></span> ${bName} · ${esc(S.bairro)} – DF · <a class=legal href=privacidade.html>Política de Privacidade</a></span><span>Prévia de site · não oficial</span></div></footer>
<a class='fab${isWa ? '' : ' tel'}' href='${esc(X.contactUrl)}'${tgt} aria-label='${isWa ? 'Falar no WhatsApp' : 'Ligar'}'>${ic(cIcon, 'fab-ic')}</a>`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  $('yr').textContent = new Date().getFullYear();

  // aberto agora? (horário de Brasília)
  const HOURS = S.hours, NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  function status(){
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday), m = +p.hour * 60 + +p.minute, t = HOURS[day];
    if (t && m >= t[0] && m < t[1]) return {day, open:true, label:'Aberto agora', sub:'fecha às ' + fmt(t[1])};
    if (t && m < t[0]) return {day, open:false, label:'Fechado agora', sub:'abre hoje às ' + fmt(t[0])};
    for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HOURS[d]) return {day, open:false, label:'Fechado agora', sub:'abre ' + (i === 1 ? 'amanhã' : NAMES[d]) + ' às ' + fmt(HOURS[d][0])}; }
  }
  function paint(){
    const s = status(), hero = $('heroStatus'), card = $('hoursCard');
    hero.classList.toggle('is-open', s.open);
    hero.querySelector('[data-status-label]').textContent = s.label;
    hero.querySelector('[data-status-sub]').textContent = s.sub;
    card.classList.toggle('is-open', s.open);
    card.querySelector('[data-status-full]').textContent = s.label + ' · ' + s.sub;
    card.querySelectorAll('[data-day]').forEach(li => li.classList.toggle('today', +li.dataset.day === s.day));
  }
  paint(); setInterval(paint, 60000);

  // nav
  const nav = $('nav'), burger = $('burger');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
  if (fine) D.querySelectorAll('.svc-card').forEach(c => c.addEventListener('pointermove', e => {
    const b = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - b.left) + 'px'); c.style.setProperty('--my', (e.clientY - b.top) + 'px');
  }));

  // mapa: só carrega o Google Maps quando a visitante pede
  $('mapLoad').addEventListener('click', () => {
    const box = $('map'), f = D.createElement('iframe');
    f.src = X.mapSrc; f.title = 'Mapa com a localização de ' + S.name;
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    box.classList.add('loaded'); box.replaceChildren(f);
  });

  // Google Analytics (GA4): só com GA_ID preenchido e depois do aceite (LGPD). Na prévia fica vazio e nada é carregado.
  const GA_ID = window.GA_ID || '';
  if (GA_ID) {
    const ck = (() => { try { return localStorage.getItem('ck'); } catch { return null; } })();
    const load = () => { window.dataLayer = window.dataLayer || []; window.gtag = function(){ dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', GA_ID); const s = D.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; D.head.append(s); };
    if (ck === 'sim') load();
    else if (!ck) { const c = D.createElement('div'); c.className = 'cookie'; c.innerHTML = '<p>Usamos cookies do Google Analytics para contar visitas. Nada é ativado sem a sua permissão. <a href=privacidade.html#cookies>Saiba mais</a></p><div class=cookie-btns><button class=\'btn btn-ghost\' data-ck=nao>Recusar</button><button class=\'btn btn-primary\' data-ck=sim>Aceitar</button></div>'; D.body.append(c);
      c.querySelectorAll('[data-ck]').forEach(b => b.addEventListener('click', () => { try { localStorage.setItem('ck', b.dataset.ck); } catch {} c.remove(); if (b.dataset.ck === 'sim') load(); })); }
  }

  // clube de aniversário (ver aniversarios/COMO-CONFIGURAR.md). Com BDAY_URL vazio, nada é enviado nem guardado.
  const BDAY_URL = window.BDAY_URL || '';
  const form = $('bdayForm'), fNome = $('bNome'), fTel = $('bTel'), fNasc = $('bNasc'), fConsent = $('bConsent'), fMsg = $('bMsg'), fBtn = $('bBtn');
  fTel.addEventListener('input', () => {
    const d = fTel.value.replace(/[^0-9]/g, '').slice(0, 11);
    fTel.value = d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4) : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d;
  });
  fNasc.addEventListener('input', () => {
    const d = fNasc.value.replace(/[^0-9]/g, '').slice(0, 8);
    fNasc.value = [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/');
  });
  const validDate = v => {
    const m = v.match(/^([0-9]{2})[/]([0-9]{2})[/]([0-9]{4})$/); if (!m) return false;
    const dt = new Date(+m[3], m[2] - 1, +m[1]);
    return dt.getDate() === +m[1] && dt.getMonth() === m[2] - 1 && +m[3] >= 1900 && dt <= new Date();
  };
  const checks = [[fNome, () => fNome.value.trim().length >= 2], [fTel, () => /^[0-9]{10,11}$/.test(fTel.value.replace(/[^0-9]/g, ''))], [fNasc, () => validDate(fNasc.value)]];
  checks.forEach(([el, ok]) => el.addEventListener('blur', () => { if (el.value) el.setAttribute('aria-invalid', !ok()); }));
  checks.forEach(([el, ok]) => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true' && ok()) el.setAttribute('aria-invalid', 'false'); }));
  fConsent.addEventListener('change', () => $('bConsentWrap').classList.toggle('invalid', !fConsent.checked));
  form.addEventListener('submit', async e => {
    e.preventDefault(); fMsg.textContent = '';
    const bad = checks.filter(([el, ok]) => { el.setAttribute('aria-invalid', !ok()); return !ok(); });
    $('bConsentWrap').classList.toggle('invalid', !fConsent.checked);
    if (bad.length) { bad[0][0].focus(); return; }
    if (!fConsent.checked) { fMsg.textContent = 'Marque a autorização para concluir o cadastro.'; fConsent.focus(); return; }
    if (!BDAY_URL) { fMsg.textContent = 'Nesta prévia o cadastro ainda não está ativo. Fale com ' + S.name + ' pelo ' + X.channel + ' ' + S.phone + '.'; return; }
    fBtn.disabled = true;
    try {
      const res = await fetch(BDAY_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({nome:fNome.value.trim(), telefone:fTel.value, nascimento:fNasc.value, consentimento:fConsent.checked, site:$('bSite').value})});
      const out = await res.json();
      if (!out.ok) throw new Error(out.erro || 'falha');
      const h = D.createElement('h3'); h.textContent = 'Prontinho, ' + fNome.value.trim().split(' ')[0] + '!';
      const p = D.createElement('p'); p.textContent = 'Cadastro feito! No seu aniversário você vai receber uma mensagem de ' + S.name + ' no WhatsApp.';
      const done = D.createElement('div'); done.className = 'bday-done'; done.append(h, p); form.replaceChildren(done);
    } catch (err) {
      fMsg.textContent = 'Não foi possível enviar agora. Fale com ' + S.name + ' pelo ' + X.channel + ' ' + S.phone + '.'; fBtn.disabled = false;
    }
  });

  if (reduce || !window.gsap) { D.documentElement.classList.add('no-gsap'); return; }
  gsap.registerPlugin(ScrollTrigger);
  const tEl = $('heroTitle');
  [...tEl.childNodes].forEach(n => {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const frag = D.createDocumentFragment();
      n.textContent.split(/( +)/).forEach(t => { if (!t) return; if (!t.trim()) frag.append(t); else { const s = D.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); } });
      n.replaceWith(frag);
    }
  });
  tEl.querySelector('.accent-word').classList.add('w');
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('#heroTitle .w', {yPercent:110, opacity:0, rotate:3, filter:'blur(6px)', duration:1.1, stagger:.07})
    .from('[data-hero]', {y:30, opacity:0, duration:1, stagger:.12}, '-=.7')
    .from('.hero-frame', {clipPath:'inset(100% 0 0 0 round 999px 999px 24px 24px)', duration:1.4, ease:'power4.inOut'}, .2)
    .from('.float-card', {y:24, opacity:0, scale:.94, duration:.9, stagger:.15}, '-=.5');
  if (window.anime) {
    anime({targets:'#accentPath', strokeDashoffset:[anime.setDashoffset, 0], duration:1400, delay:900, easing:'easeInOutCubic'});
    const nf = (v, dec) => v.toFixed(dec).replace('.', ',');
    D.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, dec = +(el.dataset.dec || 0);
      el.textContent = nf(0, dec);
      const run = () => { const o = {v:0}; anime({targets:o, v:to, duration:1600, easing:'easeOutExpo', update:() => { el.textContent = nf(o.v, dec); }, complete:() => { el.textContent = nf(to, dec); }}); };
      if (el.closest('.hero')) setTimeout(run, 1200); else ScrollTrigger.create({trigger:el, start:'top 96%', once:true, onEnter:run});
    });
    D.querySelectorAll('.stars').forEach(s => ScrollTrigger.create({trigger:s, start:'top 90%', once:true, onEnter:() => anime({targets:s.querySelectorAll('svg'), scale:[0, 1], rotate:['-30deg', '0deg'], delay:anime.stagger(90), duration:900, easing:'easeOutBack'})}));
    ScrollTrigger.create({trigger:'#track', start:'top 80%', once:true, onEnter:() => anime({targets:'.svc-card .ic-big', scale:[0, 1], rotate:['-25deg', '0deg'], delay:anime.stagger(100), duration:900, easing:'easeOutBack'})});
  }
  gsap.utils.toArray('[data-up]').forEach(el => gsap.from(el, {y:40, opacity:0, duration:1, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%', once:true}}));
  // plano B: se as animações não rodarem (aba em segundo plano, leitor de tela), mostra tudo parado
  setTimeout(() => {
    if (gsap.ticker.frame > 10) return;
    gsap.globalTimeline.clear(); ScrollTrigger.getAll().forEach(s => s.kill(true));
    D.querySelectorAll('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toFixed(+(el.dataset.dec || 0)).replace('.', ','); });
    gsap.set('[data-up],[data-hero],#heroTitle .w,.float-card,.hero-frame,.svc-card .ic-big,.stars svg', {clearProps:'all'});
    D.documentElement.classList.add('no-gsap');
  }, 3500);
  if (fine) D.querySelectorAll('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', {duration:.4, ease:'power3'}), yTo = gsap.quickTo(b, 'y', {duration:.4, ease:'power3'});
    b.addEventListener('pointermove', e => { const k = b.getBoundingClientRect(); xTo((e.clientX - k.left - k.width / 2) * .25); yTo((e.clientY - k.top - k.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
})();
