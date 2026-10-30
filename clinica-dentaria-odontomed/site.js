/* Script compartilhado das prévias. Os dados de cada negócio ficam em window.SITE, no index.html. */
(() => {
  const S = window.SITE || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const $ = id => document.getElementById(id);
  const yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
  const contato = (S.wa ? 'pelo WhatsApp ' : 'pelo telefone ') + (S.phoneFmt || '');

  // aberto agora? (horário de Brasília). HOURS = {diaDaSemana: [[inicio, fim], ...]} em minutos
  const HOURS = S.hours || {};
  const UNSURE = S.unsure || [];
  const NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const fmt = m => Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');
  function status(){
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday), m = +p.hour * 60 + +p.minute, t = HOURS[day] || [];
    if (UNSURE.includes(day)) return {day, open:false, label:'Horário a confirmar', sub:'confirme ' + contato};
    for (const [a, b] of t) if (m >= a && m < b) return {day, open:true, label:'Aberto agora', sub:'fecha às ' + fmt(b)};
    const later = t.find(([a]) => m < a);
    if (later) return {day, open:false, label:'Fechado agora', sub:'abre hoje às ' + fmt(later[0])};
    for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HOURS[d] && HOURS[d].length) return {day, open:false, label:'Fechado agora', sub:'abre ' + (i === 1 ? 'amanhã' : NAMES[d]) + ' às ' + fmt(HOURS[d][0][0])}; }
    return {day, open:false, label:'Fechado agora', sub:''};
  }
  function paint(){
    const s = status(), hero = $('heroStatus'), card = $('hoursCard');
    if (hero) {
      hero.classList.toggle('is-open', s.open);
      hero.querySelector('[data-status-label]').textContent = s.label;
      hero.querySelector('[data-status-sub]').textContent = s.sub;
    }
    if (card) {
      card.classList.toggle('is-open', s.open);
      card.querySelector('[data-status-full]').textContent = s.label + (s.sub ? ' · ' + s.sub : '');
      card.querySelectorAll('[data-day]').forEach(li => li.classList.toggle('today', +li.dataset.day === s.day));
    }
  }
  paint(); setInterval(paint, 60000);

  // nav
  const nav = $('nav'), burger = $('burger');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));

  // spotlight nos cards
  if (fine) document.querySelectorAll('.svc-card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // mapa: só carrega o Google Maps quando a visitante pede
  const mapBtn = $('mapLoad');
  if (mapBtn && S.mapSrc) mapBtn.addEventListener('click', () => {
    const box = $('map'), f = document.createElement('iframe');
    f.src = S.mapSrc; f.title = 'Mapa com a localização de ' + S.nome;
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    box.classList.add('loaded'); box.replaceChildren(f);
  });

  // Google Analytics: só se houver GA_ID e a visitante aceitar (nesta prévia, GA_ID está vazio)
  const GA_ID = S.GA_ID || '';
  const cookieBox = $('cookie');
  if (GA_ID && cookieBox) {
    const getCk = () => { try { return localStorage.getItem('ck'); } catch { return null; } };
    const loadGA = () => {
      if (window.gtag) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', GA_ID);
      const s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.append(s);
    };
    if (getCk() === 'sim') loadGA(); else if (!getCk()) cookieBox.hidden = false;
    cookieBox.querySelectorAll('[data-ck]').forEach(b => b.addEventListener('click', () => {
      try { localStorage.setItem('ck', b.dataset.ck); } catch {}
      cookieBox.hidden = true; if (b.dataset.ck === 'sim') loadGA();
    }));
  }

  // clube de aniversário (BDAY_URL vazio = cadastro desativado, nada é enviado nem guardado)
  const form = $('bdayForm');
  if (form) {
    const BDAY_URL = S.BDAY_URL || '';
    const fNome = $('bNome'), fTel = $('bTel'), fNasc = $('bNasc');
    const fConsent = $('bConsent'), fMsg = $('bMsg'), fBtn = $('bBtn'), wrap = $('bConsentWrap');
    const say = (t, err) => { fMsg.textContent = t; fMsg.classList.toggle('err', !!err); };
    fTel.addEventListener('input', () => {
      const d = fTel.value.replace(/\D/g, '').slice(0, 11);
      fTel.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });
    fNasc.addEventListener('input', () => {
      const d = fNasc.value.replace(/\D/g, '').slice(0, 8);
      fNasc.value = [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/');
    });
    const validDate = v => {
      const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if (!m) return false;
      const dt = new Date(+m[3], m[2] - 1, +m[1]);
      return dt.getDate() === +m[1] && dt.getMonth() === m[2] - 1 && +m[3] >= 1900 && dt <= new Date();
    };
    const checks = [
      [fNome, () => fNome.value.trim().length >= 2],
      [fTel, () => /^\d{10,11}$/.test(fTel.value.replace(/\D/g, ''))],
      [fNasc, () => validDate(fNasc.value)]
    ];
    checks.forEach(([el, ok]) => el.addEventListener('blur', () => { if (el.value) el.setAttribute('aria-invalid', !ok()); }));
    checks.forEach(([el, ok]) => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true' && ok()) el.setAttribute('aria-invalid', 'false'); }));
    fConsent.addEventListener('change', () => wrap.classList.toggle('invalid', !fConsent.checked));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      say('');
      const bad = checks.filter(([el, ok]) => { el.setAttribute('aria-invalid', !ok()); return !ok(); });
      wrap.classList.toggle('invalid', !fConsent.checked);
      if (bad.length) { bad[0][0].focus(); return; }
      if (!fConsent.checked) { say('Marque a autorização para concluir o cadastro.', true); fConsent.focus(); return; }
      if (!BDAY_URL) { say('Nesta prévia o cadastro ainda não está ativo. Fale com ' + S.nome + ' ' + contato + '.'); return; }
      fBtn.disabled = true;
      try {
        const res = await fetch(BDAY_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({
          nome:fNome.value.trim(), telefone:fTel.value, nascimento:fNasc.value, consentimento:fConsent.checked, site:$('bSite').value
        })});
        const out = await res.json();
        if (!out.ok) throw new Error(out.erro || 'falha');
        const first = fNome.value.trim().split(/\s+/)[0];
        form.innerHTML = '<div class="bday-done"><h3></h3><p></p></div>';
        form.querySelector('h3').textContent = `Prontinho, ${first}!`;
        form.querySelector('p').textContent = 'Cadastro feito! No seu aniversário você vai receber uma mensagem de ' + S.nome + ' no WhatsApp.';
      } catch (err) {
        say('Não foi possível enviar agora. Tente de novo em instantes ou fale com ' + S.nome + ' ' + contato + '.', true);
        fBtn.disabled = false;
      }
    });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) { document.documentElement.classList.add('no-gsap'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // entrada do hero palavra por palavra
  const title = $('heroTitle');
  [...title.childNodes].forEach(n => {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) frag.append(t);
        else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); }
      });
      n.replaceWith(frag);
    }
  });
  const mw = title.querySelector('.mark-word'); if (mw) mw.classList.add('w');
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('#heroTitle .w', {yPercent:110, opacity:0, rotate:3, filter:'blur(6px)', duration:1.1, stagger:.07})
    .from('[data-hero]', {y:30, opacity:0, duration:1, stagger:.12}, '-=.7')
    .from('.hero-frame', {clipPath:'inset(100% 0 0 0 round 24px)', duration:1.4, ease:'power4.inOut'}, .2)
    .from('.float-card', {y:24, opacity:0, scale:.94, duration:.9, stagger:.15}, '-=.5');

  // anime.js: traço, contadores, estrelas e ícones
  if (window.anime) {
    const path = $('markPath');
    if (path) anime({targets:path, strokeDashoffset:[anime.setDashoffset, 0], duration:1400, delay:900, easing:'easeInOutCubic'});
    const onceVisible = (el, fn) => ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter:fn});
    const fmtNum = (v, dec) => v.toFixed(dec).replace('.', ',');
    document.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, dec = +(el.dataset.dec || 0);
      el.textContent = fmtNum(0, dec);
      const run = () => { const o = {v:0}; anime({targets:o, v:to, duration:1600, easing:'easeOutExpo', update:() => { el.textContent = fmtNum(o.v, dec); }, complete:() => { el.textContent = fmtNum(to, dec); }}); };
      if (el.closest('.hero')) setTimeout(run, 1200);
      else ScrollTrigger.create({trigger:el, start:'top 96%', once:true, onEnter:run});
    });
    document.querySelectorAll('.stars').forEach(s => onceVisible(s, () => anime({targets:s.querySelectorAll('svg'), scale:[0, 1], rotate:['-30deg', '0deg'], delay:anime.stagger(90), duration:900, easing:'easeOutBack'})));
    const track = $('track');
    if (track) ScrollTrigger.create({trigger:track, start:'top 80%', once:true, onEnter:() =>
      anime({targets:'.svc-card .ic-big', scale:[0, 1], rotate:['-25deg', '0deg'], delay:anime.stagger(100), duration:900, easing:'easeOutBack'})});
  }

  // galeria: duas fileiras infinitas em sentidos opostos, aceleram com a rolagem
  const rows = [$('row1'), $('row2')].filter(Boolean);
  rows.forEach(r => [...r.children].forEach(f => { const c = f.cloneNode(true); c.setAttribute('aria-hidden', 'true'); r.append(c); }));
  const tweens = rows.map((r, i) => {
    const half = () => r.scrollWidth / 2;
    return i === 0
      ? gsap.fromTo(r, {x:0}, {x:() => -half(), duration:40, ease:'none', repeat:-1})
      : gsap.fromTo(r, {x:() => -half()}, {x:0, duration:40, ease:'none', repeat:-1});
  });
  if (rows.length) ScrollTrigger.create({trigger:rows[0].parentElement, start:'top bottom', end:'bottom top', onUpdate:self => {
    const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 4);
    tweens.forEach(t => gsap.to(t, {timeScale:boost, duration:.2, overwrite:true, onComplete:() => gsap.to(t, {timeScale:1, duration:1})}));
  }});

  // parallax das imagens
  gsap.to('#heroImg', {yPercent:-12, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
  if ($('portraitImg')) gsap.fromTo('#portraitImg', {yPercent:-8}, {yPercent:6, ease:'none', scrollTrigger:{trigger:'.about', start:'top bottom', end:'bottom top', scrub:true}});

  // serviços: trilho horizontal fixado (desktop)
  const mm = gsap.matchMedia();
  mm.add('(min-width:961px)', () => {
    const sec = $('servicos'), track = $('track');
    if (!sec || !track || track.children.length < 4) return;
    sec.classList.add('horizontal');
    const dist = () => { const left = track.parentElement.getBoundingClientRect().left; return Math.max(0, left + track.scrollWidth - innerWidth + Math.max(20, (innerWidth - 1200) / 2)); };
    const tw = gsap.to(track, {x:() => -dist(), ease:'none', scrollTrigger:{trigger:sec, start:'top top', end:() => '+=' + dist(), pin:true, scrub:.6, invalidateOnRefresh:true}});
    return () => { sec.classList.remove('horizontal'); tw.scrollTrigger && tw.scrollTrigger.kill(); gsap.set(track, {clearProps:'x'}); };
  });

  // revelar blocos
  gsap.utils.toArray('[data-up]').forEach(el => gsap.from(el, {y:40, opacity:0, duration:1, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%', once:true}}));

  // plano B: se as animações não rodarem (aba em segundo plano, leitor de tela), mostra tudo parado
  setTimeout(() => {
    if (gsap.ticker.frame > 10) return;
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(s => s.kill(true));
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toFixed(+(el.dataset.dec || 0)).replace('.', ','); });
    gsap.set('[data-up],[data-hero],#heroTitle .w,.float-card,.hero-frame,#heroImg,#portraitImg', {clearProps:'all'});
    document.documentElement.classList.add('no-gsap');
  }, 3500);

  // botões magnéticos
  if (fine) document.querySelectorAll('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', {duration:.4, ease:'power3'}), yTo = gsap.quickTo(b, 'y', {duration:.4, ease:'power3'});
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
})();
