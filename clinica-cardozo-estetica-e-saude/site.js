// script compartilhado das prévias. Os dados de cada negócio ficam em window.SITE, no index.html.
(() => {
  const S = window.SITE || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const $ = id => document.getElementById(id);
  $('yr').textContent = new Date().getFullYear();

  // aberto agora? (horário de Brasília). HOURS = {diaDaSemana:[[inicio, fim], ...]} em minutos
  const HOURS = S.HOURS || {};
  const NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const fmt = m => Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');
  function status(){
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday), m = +p.hour * 60 + +p.minute, t = HOURS[day] || [];
    const cur = t.find(r => m >= r[0] && m < r[1]);
    if (cur) return {day, open:true, label:'Aberto agora', sub:'fecha às ' + fmt(cur[1])};
    const later = t.find(r => m < r[0]);
    if (later) return {day, open:false, label:'Fechado agora', sub:'abre hoje às ' + fmt(later[0])};
    for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HOURS[d] && HOURS[d].length) return {day, open:false, label:'Fechado agora', sub:'abre ' + (i === 1 ? 'amanhã' : NAMES[d]) + ' às ' + fmt(HOURS[d][0][0])}; }
    return {day, open:false, label:'Horário', sub:'consulte pelo telefone'};
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

  // mapa: só carrega o Google Maps quando a visitante pede
  $('mapLoad').addEventListener('click', () => {
    const box = $('map'), f = document.createElement('iframe');
    f.src = S.mapSrc; f.title = 'Mapa com a localização de ' + S.name;
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    box.classList.add('loaded'); box.replaceChildren(f);
  });

  // Google Analytics: só carrega depois que a visitante aceita os cookies (LGPD). Sem GA_ID, nada acontece.
  const GA_ID = S.gaId || '';
  const cookieBox = $('cookie');
  const getCk = () => { try { return localStorage.getItem('ck'); } catch { return null; } };
  function loadGA(){
    if (!GA_ID || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID);
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.append(s);
  }
  if (cookieBox) {
    if (GA_ID) { if (getCk() === 'sim') loadGA(); else if (!getCk()) cookieBox.hidden = false; }
    cookieBox.querySelectorAll('[data-ck]').forEach(b => b.addEventListener('click', () => {
      try { localStorage.setItem('ck', b.dataset.ck); } catch {}
      cookieBox.hidden = true;
      if (b.dataset.ck === 'sim') loadGA();
    }));
  }
  const track = (name, params) => window.gtag && gtag('event', name, params);
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    if (a.href.includes('wa.me')) track('generate_lead', {method:'whatsapp', link_text:(a.querySelector('h3') || a).textContent.trim().slice(0, 60)});
    else if (a.href.startsWith('tel:')) track('generate_lead', {method:'telefone'});
    else if (a.href.includes('google.com/maps')) track('ver_rota');
  });

  // spotlight nos cards
  if (fine) document.querySelectorAll('.svc-card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // clube de aniversário (só existe em alguns sites)
  const form = $('bdayForm');
  if (form) {
    const BDAY_URL = S.bdayUrl || '';
    const fNome = $('bNome'), fTel = $('bTel'), fNasc = $('bNasc'), fConsent = $('bConsent'), fMsg = $('bMsg'), fBtn = $('bBtn');
    const btnText = fBtn.lastChild.textContent;
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
      fMsg.textContent = '';
      const bad = checks.filter(([el, ok]) => { el.setAttribute('aria-invalid', !ok()); return !ok(); });
      $('bConsentWrap').classList.toggle('invalid', !fConsent.checked);
      if (bad.length) { bad[0][0].focus(); return; }
      if (!fConsent.checked) { fMsg.textContent = 'Marque a autorização para concluir o cadastro.'; fConsent.focus(); return; }
      // prévia: sem BDAY_URL o formulário não envia nem guarda nada
      if (!BDAY_URL) { fMsg.textContent = `Nesta prévia o cadastro ainda não está ativo. Fale com ${S.name} pelo WhatsApp ${S.phone}.`; return; }
      fBtn.disabled = true; fBtn.lastChild.textContent = 'Enviando…';
      try {
        const res = await fetch(BDAY_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({
          nome:fNome.value.trim(), telefone:fTel.value, nascimento:fNasc.value, consentimento:fConsent.checked, site:$('bSite').value
        })});
        const out = await res.json();
        if (!out.ok) throw new Error(out.erro || 'falha');
        track('sign_up', {method:'clube_aniversario'});
        const first = fNome.value.trim().split(/\s+/)[0];
        form.innerHTML = '<div style="text-align:center;padding:24px 8px"><h3 style="font-size:2rem;margin-bottom:10px"></h3><p style="color:var(--muted)"></p></div>';
        form.querySelector('h3').textContent = `Prontinho, ${first}!`;
        form.querySelector('p').textContent = `Cadastro feito! No seu aniversário você vai receber uma mensagem de ${S.name} no WhatsApp.`;
      } catch (err) {
        fMsg.textContent = `Não foi possível enviar agora. Tente de novo em instantes ou fale com ${S.name} pelo WhatsApp ${S.phone}.`;
        fBtn.disabled = false; fBtn.lastChild.textContent = btnText;
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
  const aw = title.querySelector('.accent-word'); if (aw) aw.classList.add('w');
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('#heroTitle .w', {yPercent:110, opacity:0, rotate:3, filter:'blur(6px)', duration:1.1, stagger:.07})
    .from('[data-hero]', {y:30, opacity:0, duration:1, stagger:.12}, '-=.7')
    .from('.hero-visual .frame', {clipPath:'inset(100% 0 0 0)', duration:1.4, ease:'power4.inOut'}, .2)
    .from('.float-card', {y:24, opacity:0, scale:.94, duration:.9, stagger:.15}, '-=.5');

  if (window.anime) {
    anime({targets:'#accentPath', strokeDashoffset:[anime.setDashoffset, 0], duration:1400, delay:900, easing:'easeInOutCubic'});
    const fmtNum = (v, dec) => v.toFixed(dec).replace('.', ',');
    document.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, dec = +(el.dataset.dec || 0);
      const run = () => { const o = {v:0}; anime({targets:o, v:to, duration:1600, easing:'easeOutExpo', update:() => { el.textContent = fmtNum(o.v, dec); }, complete:() => { el.textContent = fmtNum(to, dec); }}); };
      if (el.closest('.hero')) setTimeout(run, 1200);
      else ScrollTrigger.create({trigger:el, start:'top 96%', once:true, onEnter:run});
    });
    document.querySelectorAll('.stars').forEach(s => ScrollTrigger.create({trigger:s, start:'top 90%', once:true, onEnter:() => anime({targets:s.querySelectorAll('svg'), scale:[0, 1], rotate:['-30deg', '0deg'], delay:anime.stagger(90), duration:900, easing:'easeOutBack'})}));
    ScrollTrigger.create({trigger:'#track', start:'top 80%', once:true, onEnter:() =>
      anime({targets:'.svc-card .ic-big', scale:[0, 1], rotate:['-25deg', '0deg'], delay:anime.stagger(100), duration:900, easing:'easeOutBack'})});
  }

  gsap.utils.toArray('[data-up]').forEach(el => gsap.from(el, {y:40, opacity:0, duration:1, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%', once:true}}));

  // plano B: se as animações não rodarem (aba em segundo plano, leitor de tela), mostra tudo parado
  setTimeout(() => {
    if (gsap.ticker.frame > 10) return;
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(s => s.kill(true));
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toFixed(+(el.dataset.dec || 0)).replace('.', ','); });
    gsap.set('[data-up],[data-hero],#heroTitle .w,.float-card,.hero-visual .frame', {clearProps:'all'});
    document.documentElement.classList.add('no-gsap');
  }, 3500);

  if (fine) document.querySelectorAll('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', {duration:.4, ease:'power3'}), yTo = gsap.quickTo(b, 'y', {duration:.4, ease:'power3'});
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
})();
