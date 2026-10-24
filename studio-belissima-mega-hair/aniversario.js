// Clube de aniversário: cadastro enviado para a planilha do Google do próprio negócio.
// A URL /exec do Google Apps Script fica em data-url no <form id="bdForm">.
// Enquanto estiver vazia (prévia), o formulário NÃO envia nem guarda nenhum dado.
(() => {
  const form = document.getElementById('bdForm');
  if (!form) return;
  const BDAY_URL = form.dataset.url || '';
  const NOME = form.dataset.nome || 'o negócio';
  const ZAP = form.dataset.zap || '';
  const $ = id => document.getElementById(id);
  const fNome = $('bdNome'), fTel = $('bdTel'), fNasc = $('bdNasc'), fConsent = $('bdConsent'), fMsg = $('bdMsg'), fBtn = $('bdBtn'), wrap = $('bdConsentWrap');
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
  const zapTxt = ZAP ? ` pelo WhatsApp ${ZAP}` : ' pelo WhatsApp';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    fMsg.textContent = '';
    const bad = checks.filter(([el, ok]) => { el.setAttribute('aria-invalid', !ok()); return !ok(); });
    wrap.classList.toggle('invalid', !fConsent.checked);
    if (bad.length) { bad[0][0].focus(); return; }
    if (!fConsent.checked) { fMsg.textContent = 'Marque a autorização para concluir o cadastro.'; fConsent.focus(); return; }
    if (!BDAY_URL) { fMsg.textContent = `O clube ainda não está ativo nesta prévia, e nenhum dado foi enviado. Para falar com ${NOME}, chame${zapTxt}.`; return; }
    fBtn.disabled = true; fBtn.lastChild.textContent = 'Enviando…';
    try {
      const res = await fetch(BDAY_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({
        nome:fNome.value.trim(), telefone:fTel.value, nascimento:fNasc.value, consentimento:fConsent.checked, site:$('bdSite').value
      })});
      const out = await res.json();
      if (!out.ok) throw new Error(out.erro || 'falha');
      if (window.gtag) gtag('event', 'sign_up', {method:'clube_aniversario'});
      const first = fNome.value.trim().split(/\s+/)[0];
      form.innerHTML = '<div class="bd-done"><h3></h3><p></p></div>';
      form.querySelector('h3').textContent = `Prontinho, ${first}!`;
      form.querySelector('p').textContent = `Cadastro feito! No seu aniversário você vai receber uma mensagem de ${NOME} no WhatsApp.`;
    } catch (err) {
      fMsg.textContent = `Não foi possível enviar agora. Tente de novo em instantes ou chame${zapTxt}.`;
      fBtn.disabled = false; fBtn.lastChild.textContent = 'Quero participar';
    }
  });
})();
