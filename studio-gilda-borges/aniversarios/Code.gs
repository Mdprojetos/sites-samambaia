/**
 * @OnlyCurrentDoc  — o script só consegue mexer nesta planilha, em nenhum outro arquivo do Drive
 */

/**
 * Gilda Borges · Clube de aniversário
 *
 * - Recebe os cadastros do site e guarda na aba "Cadastros" desta planilha.
 * - Todo dia de manhã confere os aniversariantes e manda um e-mail para Gilda Borges
 *   com um botão que abre o WhatsApp da cliente com a mensagem de parabéns pronta.
 *
 * Passo a passo de instalação: aniversarios/COMO-CONFIGURAR.md
 */

// ===== AJUSTE AQUI =====
const DESCONTO = '';   // definir com o negócio (ex.: '10%'); vazio = mensagem sem porcentagem
const VALIDADE = '';   // definir com o negócio (ex.: 'durante todo o mês do seu aniversário')
const EMAIL_AVISO = '';                                   // vazio = e-mail da conta Google que fez a instalação
const HORA_AVISO = 8;                                     // hora do aviso diário (horário de Brasília)
// ========================

const ABA = 'Cadastros';
const FUSO = 'America/Sao_Paulo';
const LIMITE_POR_MINUTO = 20;   // freio contra robôs enviando cadastros em massa
const LIMITE_TOTAL = 20000;     // teto de linhas da planilha
const CABECALHO =['Cadastrado em', 'Nome', 'WhatsApp', 'Nascimento', 'Dia', 'Mês', 'Último aviso (ano)'];

/** Rode UMA vez depois de colar o código: cria a aba e o aviso diário. */
function configurar() {
  obterAba_();
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'verificarAniversarios')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('verificarAniversarios')
    .timeBased().everyDays(1).atHour(HORA_AVISO).inTimezone(FUSO).create();
}

/**
 * Recebe o cadastro enviado pelo formulário do site.
 * Só grava; nunca devolve dados da planilha. A resposta é sempre igual para
 * cadastro novo ou repetido, para ninguém descobrir quem já está cadastrado.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || e.postData.contents.length > 2000) return json_({ ok: false, erro: 'dados' });
    const d = JSON.parse(e.postData.contents);
    if (d.site) return json_({ ok: true }); // robô de spam preencheu o campo escondido
    if (d.consentimento !== true) return json_({ ok: false, erro: 'dados' });

    const nome = String(d.nome || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const tel = String(d.telefone || '').replace(/\D/g, '');
    const m = String(d.nascimento || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (nome.length < 2 || !/^\d{10,11}$/.test(tel) || !m || !dataValida_(+m[1], +m[2], +m[3])) {
      return json_({ ok: false, erro: 'dados' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      // freio: no máximo LIMITE_POR_MINUTO cadastros por minuto no total
      // (dentro da trava para envios simultâneos não escaparem da contagem)
      const cache = CacheService.getScriptCache();
      const chave = 'n' + Math.floor(Date.now() / 60000);
      const n = +(cache.get(chave) || 0);
      if (n >= LIMITE_POR_MINUTO) return json_({ ok: false, erro: 'limite' });
      cache.put(chave, String(n + 1), 120);

      const aba = obterAba_();
      const total = aba.getLastRow() - 1;
      if (total >= LIMITE_TOTAL) return json_({ ok: false, erro: 'limite' });
      // WhatsApp já cadastrado: mantém o cadastro original. Assim ninguém consegue
      // trocar o nome ou a data de outra cliente só sabendo o telefone dela.
      const tels = total > 0 ? aba.getRange(2, 3, total, 1).getValues().map(r => String(r[0]).replace(/\D/g, '')) : [];
      if (tels.indexOf(tel) < 0) aba.appendRow([new Date(), texto_(nome), formatarTel_(tel), m[0], +m[1], +m[2], '']);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, erro: 'servidor' });
  }
}

/** Abrir a URL do app no navegador mostra se a instalação deu certo. */
function doGet() {
  return ContentService.createTextOutput('Clube de aniversário de Gilda Borges funcionando.');
}

/** Roda todo dia (gatilho criado em configurar). */
function verificarAniversarios() {
  const hoje = new Date();
  const dia = +Utilities.formatDate(hoje, FUSO, 'd');
  const mes = +Utilities.formatDate(hoje, FUSO, 'M');
  const ano = +Utilities.formatDate(hoje, FUSO, 'yyyy');
  const bissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0);

  const aba = obterAba_();
  const total = aba.getLastRow() - 1;
  if (total < 1) return;

  const aniversariantes = [];
  aba.getRange(2, 1, total, 7).getValues().forEach((r, i) => {
    let d = +r[4];
    const mm = +r[5];
    if (d === 29 && mm === 2 && !bissexto) d = 28; // quem nasceu em 29/02 recebe no dia 28
    if (d === dia && mm === mes && String(r[6]) !== String(ano)) {
      aniversariantes.push({ nome: String(r[1]).replace(/^'/, ''), tel: String(r[2]), nasc: String(r[3]), linha: i + 2 });
    }
  });
  if (!aniversariantes.length) return;

  enviarEmail_(aniversariantes, ano);
  aniversariantes.forEach(p => aba.getRange(p.linha, 7).setValue(String(ano)));
}

/** Manda um e-mail de exemplo para conferir como o aviso chega. */
function testarAviso() {
  const hoje = Utilities.formatDate(new Date(), FUSO, 'dd/MM');
  enviarEmail_([{ nome: 'Cliente Exemplo', tel: '(61) 98334-4933', nasc: hoje + '/1995' }], +Utilities.formatDate(new Date(), FUSO, 'yyyy'));
}

function enviarEmail_(lista, ano) {
  const cards = lista.map(p => {
    const primeiro = p.nome.split(' ')[0];
    const idade = ano - +p.nasc.slice(-4);
    const link = 'https://wa.me/55' + p.tel.replace(/\D/g, '') + '?text=' + encodeURIComponent(mensagem_(primeiro));
    return `
      <div style="border:1px solid #e3e6dc;border-radius:16px;padding:20px;margin:0 0 14px">
        <div style="font-size:18px;font-weight:700;color:#1f2418">${esc_(p.nome)}</div>
        <div style="color:#5f6654;margin:4px 0 14px">${esc_(p.tel)} · faz ${idade} anos hoje</div>
        <a href="${link}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px">Enviar parabéns no WhatsApp</a>
      </div>`;
  }).join('');

  const qtd = lista.length;
  MailApp.sendEmail({
    to: EMAIL_AVISO || Session.getEffectiveUser().getEmail(),
    subject: `🎂 ${qtd === 1 ? 'Aniversariante' : qtd + ' aniversariantes'} hoje em Gilda Borges`,
    htmlBody: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#4f5d2f;font-weight:400">${qtd === 1 ? 'Hoje tem aniversariante!' : 'Hoje tem ' + qtd + ' aniversariantes!'}</h2>
        <p style="color:#5f6654">Toque no botão para abrir o WhatsApp com a mensagem de parabéns ${DESCONTO ? 'e o benefício de ' + esc_(DESCONTO) + ' ' : ''}já escrita.</p>
        ${cards}
      </div>`
  });
}

function mensagem_(primeiroNome) {
  const presente = DESCONTO
    ? `Para comemorar, você ganhou ${DESCONTO} de desconto${VALIDADE ? ', válido ' + VALIDADE : ''}. `
    : `Para comemorar, preparamos um presente especial para você. `;
  return `Feliz aniversário, ${primeiroNome}! 🎉\n\n` +
    `Aqui é Gilda Borges. Desejamos um novo ano cheio de saúde, alegria e muitos motivos para sorrir.\n\n` +
    presente +
    `É só chamar aqui para agendar! 💛`;
}

function obterAba_() {
  const planilha = SpreadsheetApp.getActive();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight('bold');
    aba.setFrozenRows(1);
    aba.getRange('C:D').setNumberFormat('@');
    aba.getRange('G:G').setNumberFormat('@');
    aba.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  }
  return aba;
}

function dataValida_(d, m, a) {
  const dt = new Date(a, m - 1, d);
  return dt.getDate() === d && dt.getMonth() === m - 1 && a >= 1900 && dt <= new Date();
}

function formatarTel_(t) {
  return t.length === 11
    ? `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`
    : `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
}

// impede que um nome começando com = + - @ vire fórmula na planilha
function texto_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
