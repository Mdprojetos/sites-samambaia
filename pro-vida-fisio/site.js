/* Script compartilhado das prévias. Os dados de cada negócio ficam em window.SITE, no index.html. */
(() => {
  const S = window.SITE || {};
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // aberto agora? (horário de Brasília). HOURS = {diaDaSemana: [[inicio, fim], ...]} em minutos; 0 = domingo
  const HOURS = S.hours || {};
  const NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const fmt = m => Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');
  function status(){
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday), m = +p.hour * 60 + +p.minute, t = HOURS[day] || [];
    for (const [a, b] of t) if (m >= a && m < b) return {day, open:true, label:'Aberto agora', sub:'fecha às ' + fmt(b)};
    const later = t.find(([a]) => m < a);
    if (later) return {day, open:false, label:'Fechado agora', sub:'abre hoje às ' + fmt(later[0])};
    for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HOURS[d] && HOURS[d].length) return {day, open:false, label:'Fechado agora', sub:'abre ' + (i === 1 ? 'amanhã' : NAMES[d]) + ' às ' + fmt(HOURS[d][0][0])}; }
    return {day, open:false, label:'Horário', sub:'consulte'};
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
      card.querySelector('[data-status-full]').textContent = s.label + ' · ' + s.sub;
      card.querySelectorAll('[data-day]').forEach(li => li.classList.toggle('today', +li.dataset.day === s.day));
    }
  }
  paint(); setInterval(paint, 60000);

  // menu
  const nav = $('nav'), burger = $('burger');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));

  // mapa: só carrega o Google Maps quando a visitante pede
  const mapBtn = $('mapLoad');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    const box = $('map'), f = document.createElement('iframe');
    f.src = S.mapSrc; f.title = 'Mapa com a localização de ' + (S.name || 'o negócio');
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    box.classList.add('loaded'); box.replaceChildren(f);
  });

  // spotlight nos cards
  if (fine) document.querySelectorAll('.svc-card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // clube de aniversário (ver aniversarios/COMO-CONFIGURAR.md). Com BDAY_URL vazio, nada é enviado nem guardado.
  const form = $('bdayForm');
  if (form) {
    const BDAY_URL = S.BDAY_URL || '';
    const fNome = $('bNome'), fTel = $('bTel'), fNasc = $('bNasc'), fConsent = $('bConsent'), fMsg = $('bMsg'), fBtn = $('bBtn');
    const say = (t, bad) => { fMsg.textContent = t; fMsg.classList.toggle('bad', !!bad); };
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
    fConsent.addEventListener('change', () => $('bConsentWrap').classList.toggle('invalid', !fConsent.checked));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      say('');
      const bad = checks.filter(([el, ok]) => { el.setAttribute('aria-invalid', !ok()); return !ok(); });
      $('bConsentWrap').classList.toggle('invalid', !fConsent.checked);
      if (bad.length) { bad[0][0].focus(); return; }
      if (!fConsent.checked) { say('Marque a autorização para concluir o cadastro.', true); fConsent.focus(); return; }
      if (!BDAY_URL) { say(S.bdayOff || 'Nesta prévia o cadastro ainda não está ativo.'); return; }
      fBtn.disabled = true;
      try {
        const res = await fetch(BDAY_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({
          nome:fNome.value.trim(), telefone:fTel.value, nascimento:fNasc.value, consentimento:fConsent.checked, site:$('bSite').value
        })});
        const out = await res.json();
        if (!out.ok) throw new Error(out.erro || 'falha');
        const first = fNome.value.trim().split(/\s+/)[0];
        form.innerHTML = '<div class="bday-done" style="text-align:center;padding:24px 8px"><h3></h3><p>Cadastro feito! No seu aniversário você vai receber uma mensagem no WhatsApp.</p></div>';
        form.querySelector('h3').textContent = `Prontinho, ${first}!`;
      } catch (err) {
        say('Não foi possível enviar agora. Tente de novo em instantes.', true);
        fBtn.disabled = false;
      }
    });
  }

  if (reduce || !window.gsap) { document.documentElement.classList.add('no-gsap'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // título do hero palavra por palavra
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
  const aw = title.querySelector('.accent-word'); if (aw) aw.classList.add('w');
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('#heroTitle .w', {yPercent:110, opacity:0, rotate:3, filter:'blur(6px)', duration:1.1, stagger:.07})
    .from('[data-hero]', {y:30, opacity:0, duration:1, stagger:.12}, '-=.7')
    .from('.hero-frame', {clipPath:'inset(100% 0 0 0 round 999px 999px 24px 24px)', duration:1.4, ease:'power4.inOut'}, .2)
    .from('.float-card', {y:24, opacity:0, scale:.94, duration:.9, stagger:.15}, '-=.5');

  // anime.js: traço de destaque, estrelas e ícones dos serviços (os números ficam fixos e corretos no HTML)
  if (window.anime) {
    const path = $('accentPath'); if (path) anime({targets:path, strokeDashoffset:[anime.setDashoffset, 0], duration:1400, delay:900, easing:'easeInOutCubic'});
    const onceVisible = (el, fn) => ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter:fn});
    document.querySelectorAll('.stars').forEach(s => onceVisible(s, () => anime({targets:s.querySelectorAll('svg'), scale:[0, 1], rotate:['-30deg', '0deg'], delay:anime.stagger(90), duration:900, easing:'easeOutBack'})));
    const tr = $('track'); if (tr) onceVisible(tr, () => anime({targets:'.svc-card .ic-big', scale:[0, 1], rotate:['-25deg', '0deg'], delay:anime.stagger(100), duration:900, easing:'easeOutBack'}));
  }

  // galeria: duas fileiras infinitas em sentidos opostos
  const rows = [$('row1'), $('row2')].filter(Boolean);
  rows.forEach(r => [...r.children].forEach(f => { const c = f.cloneNode(true); c.setAttribute('aria-hidden', 'true'); r.append(c); }));
  const tweens = rows.map((r, i) => {
    const half = () => r.scrollWidth / 2;
    return i === 0
      ? gsap.fromTo(r, {x:0}, {x:() => -half(), duration:45, ease:'none', repeat:-1})
      : gsap.fromTo(r, {x:() => -half()}, {x:0, duration:45, ease:'none', repeat:-1});
  });
  if (rows.length) ScrollTrigger.create({trigger:'#galeria', start:'top bottom', end:'bottom top', onUpdate:self => {
    const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 4);
    tweens.forEach(t => gsap.to(t, {timeScale:boost, duration:.2, overwrite:true, onComplete:() => gsap.to(t, {timeScale:1, duration:1})}));
  }});

  // parallax leve
  gsap.to('.hero-frame .ph', {yPercent:-8, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});

  // blocos surgindo ao rolar
  gsap.utils.toArray('[data-up]').forEach(el => gsap.from(el, {y:40, opacity:0, duration:1, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%', once:true}}));

  // plano B: se as animações não rodarem (aba em segundo plano, leitor de tela), mostra tudo parado
  setTimeout(() => {
    if (gsap.ticker.frame > 10) return;
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(s => s.kill(true));
    gsap.set('[data-up],[data-hero],#heroTitle .w,.float-card,.hero-frame,.row', {clearProps:'all'});
    document.documentElement.classList.add('no-gsap');
  }, 3500);

  // botões magnéticos
  if (fine) document.querySelectorAll('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', {duration:.4, ease:'power3'}), yTo = gsap.quickTo(b, 'y', {duration:.4, ease:'power3'});
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
})();
