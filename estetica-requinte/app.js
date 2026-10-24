(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Prévia: sem clube de aniversário e sem Analytics até o negócio aprovar e enviar os dados
  const BDAY_URL = ''; // URL /exec do Google Apps Script do próprio negócio (vazio = desativado)
  const GA_ID = '';    // ID do GA4 do próprio negócio (vazio = nada é carregado)

  // aberto agora? (horário de Brasília), dados do perfil no Google Maps
  const HOURS = window.SITE.hours;
  const NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const fmt = m => Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');
  function status(){
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday), m = +p.hour * 60 + +p.minute, t = HOURS[day] || [];
    for (const r of t) if (m >= r[0] && m < r[1]) return {day, open:true, label:'Aberto agora', sub:'fecha às ' + fmt(r[1])};
    for (const r of t) if (m < r[0]) return {day, open:false, label:'Fechado agora', sub:'abre hoje às ' + fmt(r[0])};
    for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HOURS[d]) return {day, open:false, label:'Fechado agora', sub:'abre ' + (i === 1 ? 'amanhã' : NAMES[d]) + ' às ' + fmt(HOURS[d][0][0])}; }
  }
  function paint(){
    const s = status(), hero = document.getElementById('heroStatus'), card = document.getElementById('hoursCard');
    hero.classList.toggle('is-open', s.open);
    hero.querySelector('[data-status-label]').textContent = s.label;
    hero.querySelector('[data-status-sub]').textContent = s.sub;
    card.classList.toggle('is-open', s.open);
    card.querySelector('[data-status-full]').textContent = s.label + ' · ' + s.sub;
    card.querySelectorAll('[data-day]').forEach(li => li.classList.toggle('today', +li.dataset.day === s.day));
  }
  paint(); setInterval(paint, 60000);

  // mapa: só carrega o Google Maps quando a visitante pede
  const MAP_SRC = window.SITE.mapSrc;
  document.getElementById('mapLoad').addEventListener('click', () => {
    const box = document.getElementById('map'), f = document.createElement('iframe');
    f.src = MAP_SRC; f.title = window.SITE.mapTitle;
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    box.classList.add('loaded'); box.replaceChildren(f);
  });

  // nav
  const nav = document.getElementById('nav'), burger = document.getElementById('burger');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));

  if (fine) document.querySelectorAll('.svc-card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  if (reduce || !window.gsap) { document.documentElement.classList.add('no-gsap'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const title = document.getElementById('heroTitle');
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
  title.querySelector('.accent-word').classList.add('w');
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('#heroTitle .w', {yPercent:110, opacity:0, rotate:3, filter:'blur(6px)', duration:1.1, stagger:.07})
    .from('[data-hero]', {y:30, opacity:0, duration:1, stagger:.12}, '-=.7')
    .from('.hero-frame', {clipPath:'inset(100% 0 0 0 round 999px 999px 24px 24px)', duration:1.4, ease:'power4.inOut'}, .2)
    .from('.float-card', {y:24, opacity:0, scale:.94, duration:.9, stagger:.15}, '-=.5');

  if (window.anime) {
    anime({targets:'#accentPath', strokeDashoffset:[anime.setDashoffset, 0], duration:1400, delay:900, easing:'easeInOutCubic'});
    const onceVisible = (el, fn) => ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter:fn});
    const fmtNum = (v, dec) => v.toFixed(dec).replace('.', ',');
    document.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, dec = +(el.dataset.dec || 0);
      el.textContent = fmtNum(0, dec);
      const run = () => {
        const o = {v:0};
        anime({targets:o, v:to, duration:1600, easing:'easeOutExpo', update:() => { el.textContent = fmtNum(o.v, dec); }, complete:() => { el.textContent = fmtNum(to, dec); }});
      };
      if (el.closest('.hero')) setTimeout(run, 1200);
      else ScrollTrigger.create({trigger:el, start:'top 96%', once:true, onEnter:run});
    });
    document.querySelectorAll('.stars').forEach(s => onceVisible(s, () => anime({targets:s.querySelectorAll('svg'), scale:[0, 1], rotate:['-30deg', '0deg'], delay:anime.stagger(90), duration:900, easing:'easeOutBack'})));
    ScrollTrigger.create({trigger:'#track', start:'top 80%', once:true, onEnter:() =>
      anime({targets:'.svc-card .ic-big', scale:[0, 1], rotate:['-25deg', '0deg'], delay:anime.stagger(100), duration:900, easing:'easeOutBack'})});
  }

  // galeria: fileiras infinitas em sentidos opostos (cópias só visuais)
  const rows = [document.getElementById('row1'), document.getElementById('row2')];
  rows.forEach(r => [...r.children].forEach(f => { const c = f.cloneNode(true); c.setAttribute('aria-hidden', 'true'); r.append(c); }));
  const tweens = rows.map((r, i) => {
    const half = () => r.scrollWidth / 2;
    return i === 0
      ? gsap.fromTo(r, {x:0}, {x:() => -half(), duration:40, ease:'none', repeat:-1})
      : gsap.fromTo(r, {x:() => -half()}, {x:0, duration:40, ease:'none', repeat:-1});
  });
  ScrollTrigger.create({trigger:'#galeria', start:'top bottom', end:'bottom top', onUpdate:self => {
    const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 4);
    tweens.forEach(t => gsap.to(t, {timeScale:boost, duration:.2, overwrite:true, onComplete:() => gsap.to(t, {timeScale:1, duration:1})}));
  }});

  gsap.utils.toArray('[data-up]').forEach(el => gsap.from(el, {y:40, opacity:0, duration:1, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%', once:true}}));

  // plano B: se as animações não rodarem (aba pausada, leitor de tela), mostra tudo parado
  setTimeout(() => {
    if (gsap.ticker.frame > 10) return;
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(s => s.kill(true));
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toFixed(+(el.dataset.dec || 0)).replace('.', ','); });
    gsap.set('[data-up],[data-hero],#heroTitle .w,.float-card,.hero-frame,.row', {clearProps:'all'});
    document.documentElement.classList.add('no-gsap');
  }, 3500);

  if (fine) document.querySelectorAll('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', {duration:.4, ease:'power3'}), yTo = gsap.quickTo(b, 'y', {duration:.4, ease:'power3'});
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
})();
