'use strict';
// Galeria HUD (03/10/2026): 15 propostas do HUD da exploração (D11). Dados dos marcos vêm de
// core/sim/KnownObjects.kt; os três últimos (Virgem, Laniakea, universo) são propostas ainda sem
// fonte registrada em docs/android/astros-reais.md. Horizonte: raio de Schwarzschild 2,953 km × M/M☉.
const R_SOL = 695700, AL = 9.4607304725808e12, UA = 149597870.7, KPC = 3.085677581491367e16;
const SCHW = 2.953;
const MARCOS = [
  { id: 'ceres', nome: 'Ceres', m: 4.719e-10, r: 469.7 },
  { id: 'lua', nome: 'Lua', art: 'a', m: 3.694e-8, r: 1737.4 },
  { id: 'terra', nome: 'Terra', art: 'a', m: 3.003e-6, r: 6371 },
  { id: 'jupiter', nome: 'Júpiter', m: 9.546e-4, r: 69911 },
  { id: 'proxima', nome: 'Proxima Centauri', m: .123, r: .145 * R_SOL },
  { id: 'sol', nome: 'Sol', art: 'o', m: 1, r: R_SOL },
  { id: 'sirius-b', nome: 'Sirius B', m: 1.018, r: .008098 * R_SOL },
  { id: 'pulsar', nome: 'Pulsar do Caranguejo', art: 'o', m: 1.4, r: 10 },
  { id: 'sirius-a', nome: 'Sirius A', m: 2.063, r: 1.7144 * R_SOL },
  { id: 'vega', nome: 'Vega', m: 2.15, r: 2.726 * R_SOL },
  { id: 'betelgeuse', nome: 'Betelgeuse', m: 18, r: 764 * R_SOL },
  { id: 'rigel', nome: 'Rigel', m: 21, r: 78.9 * R_SOL },
  { id: 'cygnus', nome: 'Cygnus X-1', m: 21.2, r: SCHW * 21.2 },
  { id: 'uy', nome: 'UY Scuti', m: 30, r: 1708 * R_SOL },
  { id: 'r136', nome: 'R136a1', m: 200, r: 35 * R_SOL },
  { id: 'sgr', nome: 'Sagitário A*', m: 4e6, r: SCHW * 4e6 },
  { id: 'm87', nome: 'M87*', m: 6.5e9, r: SCHW * 6.5e9 },
  { id: 'ton', nome: 'TON 618', m: 6.6e10, r: SCHW * 6.6e10 },
  { id: 'lmc', nome: 'Grande Nuvem de Magalhães', art: 'a', m: 1.38e11, r: 5000 * AL },
  { id: 'andromeda', nome: 'Andrômeda', m: 8e11, r: 240 * KPC },
  { id: 'via', nome: 'Via Láctea', art: 'a', m: 1.5e12, r: 50000 * AL },
  { id: 'virgem', nome: 'Aglomerado de Virgem', art: 'o', m: 1.2e15, proposta: true },
  { id: 'laniakea', nome: 'Laniakea', m: 1e17, proposta: true },
  { id: 'universo', nome: 'Universo observável', art: 'o', m: 7.5e22, r: 4.4e23, proposta: true },
];
// Eras para o mapa segmentado (variação 12), em log10 M☉.
const ERAS = [['Pequenos corpos', -13, -8], ['Planetas', -8, -2], ['Estrelas', -2, 3], ['Gigantes', 3, 9], ['Galáxias', 9, 13], ['Cosmos', 13, 23]];
const LOG_MIN = -13, LOG_MAX = 23;

// ---------- formatação pt-BR ----------
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => (n < 0 ? '⁻' : '') + String(Math.abs(n)).split('').map(d => SUP[+d]).join('');
const nf = (v, d = 1) => v.toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
function cient(v) {
  const e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e);
  return (Math.abs(m - 1) < .05 ? '' : nf(m, 1) + ' × ') + '10' + sup(e);
}
const ESCALAS = [[1e21, 'sextilhão', 'sextilhões'], [1e18, 'quintilhão', 'quintilhões'], [1e15, 'quatrilhão', 'quatrilhões'],
  [1e12, 'trilhão', 'trilhões'], [1e9, 'bilhão', 'bilhões'], [1e6, 'milhão', 'milhões'], [1e3, 'mil', 'mil']];
// Número por extenso curto: "3,2 mil", "1,5 trilhão", "45"; nunca uma sequência de 15 dígitos.
function palavras(v) {
  if (v >= 1e24) return cient(v);
  for (const [b, s, p] of ESCALAS) if (v >= b) { const x = v / b, t = nf(x, x < 10 ? 1 : 0); return t + ' ' + (t === '1' ? s : p); }
  if (v >= 10) return nf(v, 0);
  if (v >= 1) return nf(v, 1);
  if (v >= .01) return nf(v, 2);
  return cient(v);
}
const de = t => /(ão|ões)$/.test(t) ? t + ' de' : t;
const massaSol = M => palavras(M) + ' M☉';
// Unidade amigável: maior referência que o núcleo já alcançou.
const UNIDADES = [[1.5e12, 'Via Láctea', 'Vias Lácteas'], [1, 'Sol', 'Sóis'], [9.546e-4, 'Júpiter', 'Júpiteres'],
  [3.003e-6, 'Terra', 'Terras'], [3.694e-8, 'Lua', 'Luas'], [4.719e-10, 'Ceres', 'Ceres']];
function amigavel(M) {
  for (const [b, s, p] of UNIDADES) if (M >= b) { const x = M / b; return de(palavras(x)) + ' ' + (x < 1.95 ? s : p); }
  const t = M * 1.98847e27; // toneladas
  return de(palavras(t)) + ' toneladas';
}
const doA = x => (x.art ? 'd' + x.art + ' ' : 'de ') + x.nome;
function distancia(km) {
  const metros = km * 1000;
  if (metros < .01) return cient(metros) + ' m';
  if (metros < 1) return nf(metros * 100, 1) + ' cm';
  if (km < 1) return nf(metros, 0) + ' m';
  if (km < 1e6) return de(palavras(km)) + ' km';
  if (km < 30 * UA) return de(palavras(km)) + ' km';
  if (km < .05 * AL) return nf(km / UA, 0) + ' UA';
  const a = km / AL; return de(palavras(a)) + ' ' + (a < 1.95 ? 'ano-luz' : 'anos-luz');
}
function tempo(seg) { const m = Math.floor(seg / 60), h = Math.floor(m / 60); return h ? `${h} h ${m % 60} min` : `${m} min`; }

// ---------- estado derivado ----------
function comparar(valor, campo) {
  const lista = MARCOS.filter(x => x[campo] != null).sort((a, b) => a[campo] - b[campo]);
  let prev = null, next = null;
  for (const x of lista) { if (x[campo] <= valor) prev = x; else { next = x; break; } }
  const lo = prev ? prev[campo] : valor / 10, hi = next ? next[campo] : valor;
  const frac = next ? Math.min(1, Math.max(0, Math.log(valor / lo) / Math.log(hi / lo))) : 1;
  return { prev, next, frac, lista };
}
function estado(logM, seg, passou) {
  const M = Math.pow(10, logM), r = SCHW * M;
  return { M, r, d: 2 * r, logM, seg, passou, massa: comparar(M, 'm'), raio: comparar(r, 'r') };
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fio = (f, cls = '') => `<div class="fio ${cls}"><i style="width:${(f * 100).toFixed(1)}%"></i></div>`;
const vezes = x => x >= 100 ? palavras(x) + '×' : nf(x, x < 10 ? 1 : 0) + '×';
const posLog = (v, a, b) => Math.min(1, Math.max(0, (Math.log10(v) - a) / (b - a)));

// ---------- 15 variações ----------
const VARIACOES = [
  { id: '01', nome: 'Linha única', descricao: 'Uma linha no topo: massa por extenso e o último gigante superado. Tempo discreto ao lado da marca.',
    eixos: { posição: 'topo', massa: 'por extenso M☉', critério: 'massa', visual: 'nenhum', densidade: '1 linha' },
    render: s => `<div class="h topo"><span class="forte">${esc(massaSol(s.M))}</span>${s.massa.prev ? ` <span class="sec">· maior que ${esc(s.massa.prev.nome)}</span>` : ''}</div>
      <div class="h marca-tempo">${tempo(s.seg)}</div>` },
  { id: '02', nome: 'Régua cósmica', descricao: 'Régua log de asteroide ao universo na base, com gigantes marcados e o núcleo como ponto que avança.',
    eixos: { posição: 'base', massa: 'por extenso M☉', critério: 'massa', visual: 'régua completa', densidade: '2 linhas' },
    render: s => { const chave = ['lua', 'sol', 'sgr', 'via', 'universo'];
      const ticks = MARCOS.filter(x => chave.includes(x.id)).map(x => `<b style="left:${(posLog(x.m, LOG_MIN, LOG_MAX) * 100).toFixed(1)}%"><em>${esc(x.nome.split(' ')[0])}</em></b>`).join('');
      return `<div class="h base regua-cosmica"><div class="linha"><span class="forte">${esc(massaSol(s.M))}</span><span class="sec">${tempo(s.seg)}</span></div>
        <div class="regua">${ticks}<u style="left:${(posLog(s.M, LOG_MIN, LOG_MAX) * 100).toFixed(1)}%"></u></div></div>`; } },
  { id: '03', nome: 'Silhuetas comparadas', descricao: 'Círculos em proporção real entre o horizonte e o próximo astro maior; nome e razão ao lado.',
    eixos: { posição: 'topo', massa: 'unidade amigável', critério: 'tamanho', visual: 'círculos', densidade: '3 linhas' },
    render: s => { const n = s.raio.next, p = s.raio.prev, R = 22;
      const rb = n ? Math.max(1.5, R * s.r / n.r) : R;
      return `<div class="h topo cartao silhuetas"><svg width="64" height="48" viewBox="0 0 64 48"><circle cx="40" cy="24" r="${R}" class="alvo"/><circle cx="${40 - R + rb}" cy="24" r="${rb.toFixed(2)}" class="nucleo"/></svg>
        <div><div class="forte">${esc(amigavel(s.M))}</div><div class="sec">${n ? (s.r / n.r >= .01 ? `horizonte = ${esc(nf(s.r / n.r * 100, 0))}% ${esc(doA(n))}` : `${esc(n.nome)} ainda é ${esc(vezes(n.r / s.r))} maior`) : 'maior que tudo no catálogo'}</div>
        <div class="ter">${p ? 'já maior que ' + esc(p.nome) : '&nbsp;'} · ${tempo(s.seg)}</div></div></div>`; } },
  { id: '04', nome: 'Escada de marcos', descricao: 'Lista vertical à direita com dois gigantes já superados, o núcleo e os próximos dois.',
    eixos: { posição: 'lateral direita', massa: 'unidade amigável', critério: 'massa', visual: 'lista de marcos', densidade: '6 linhas' },
    render: s => { const l = s.massa.lista, i = s.massa.next ? l.indexOf(s.massa.next) : l.length;
      const itens = [l[i - 2], l[i - 1]].filter(Boolean).map(x => `<li class="passado">${esc(x.nome)}</li>`).join('') +
        `<li class="voce">● ${esc(amigavel(s.M))}</li>` + [l[i], l[i + 1]].filter(Boolean).map(x => `<li>${esc(x.nome)}</li>`).join('');
      return `<div class="h direita escada"><ul>${itens}</ul><div class="ter">${tempo(s.seg)}</div></div>`; } },
  { id: '05', nome: 'Barra entre marcos', descricao: 'Massa amigável e uma barra do último gigante superado ao próximo, com os nomes nas pontas.',
    eixos: { posição: 'topo', massa: 'unidade amigável', critério: 'massa', visual: 'barra entre marcos', densidade: '2 linhas' },
    render: s => `<div class="h topo cartao largo"><div class="linha"><span class="forte">${esc(amigavel(s.M))}</span><span class="ter">${tempo(s.seg)}</span></div>
      <div class="pontas"><span>${esc(s.massa.prev ? s.massa.prev.nome : 'início')}</span>${fio(s.massa.frac)}<span>${esc(s.massa.next ? s.massa.next.nome : '—')}</span></div></div>` },
  { id: '06', nome: 'Anel de progresso', descricao: 'Anel compacto abaixo dos controles: preenche até o próximo gigante; massa curta no centro.',
    eixos: { posição: 'canto direito', massa: 'científica curta', critério: 'massa', visual: 'anel', densidade: 'compacto' },
    render: s => { const C = 2 * Math.PI * 22, f = s.massa.frac;
      return `<div class="h direita anel"><svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="22" class="trilho"/><circle cx="28" cy="28" r="22" class="prog" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 28 28)"/>
        <text x="28" y="31" text-anchor="middle">${esc(cient(s.M).replace(/^1 × /, ''))}</text></svg><div class="ter centro">M☉</div>
        <div class="sec centro">${s.massa.next ? '→ ' + esc(s.massa.next.nome) : 'topo'}</div><div class="ter centro">${tempo(s.seg)}</div></div>`; } },
  { id: '07', nome: 'Unidade amigável', descricao: 'Massa grande e legível em Terras, Sóis ou Vias Lácteas; abaixo, o tamanho do horizonte em comparação.',
    eixos: { posição: 'topo', massa: 'unidade amigável grande', critério: 'massa + tamanho', visual: 'nenhum', densidade: '2 linhas' },
    render: s => { const p = s.raio.prev;
      return `<div class="h topo"><div class="grande">${esc(amigavel(s.M))}</div><div class="sec">${p ? 'horizonte maior que ' + esc(p.nome) : 'horizonte menor que qualquer astro do catálogo'} · ${tempo(s.seg)}</div></div>`; } },
  { id: '08', nome: 'Científico limpo', descricao: 'Potência de dez em destaque e uma régua de décadas; para quem gosta de ordem de grandeza.',
    eixos: { posição: 'topo', massa: 'potência de dez', critério: 'massa', visual: 'régua de décadas', densidade: '2 linhas' },
    render: s => { const e = Math.floor(s.logM), ticks = Array.from({ length: 12 }, (_, k) => `<b style="left:${(k / 11 * 100).toFixed(1)}%" class="${k * 3 + LOG_MIN <= e ? 'on' : ''}"></b>`).join('');
      return `<div class="h topo cartao largo"><div class="linha"><span class="grande">10${sup(e)} <small>M☉</small></span><span class="sec">${s.massa.next ? 'próximo: ' + esc(s.massa.next.nome) : ''}</span></div>
        <div class="decadas">${ticks}<u style="left:${(posLog(s.M, LOG_MIN, LOG_MAX) * 100).toFixed(1)}%"></u></div><div class="ter">${tempo(s.seg)}</div></div>`; } },
  { id: '09', nome: 'Quantos cabem', descricao: 'Tamanho do horizonte contado em astros conhecidos: "cabem 12 Terras no diâmetro".',
    eixos: { posição: 'topo', massa: 'por extenso M☉', critério: 'tamanho', visual: 'contagem', densidade: '2 linhas' },
    render: s => { const p = s.raio.prev, q = p ? s.r / p.r : 0;
      return `<div class="h topo"><div class="forte">${p ? (q >= 2 ? `cabem ${esc(q >= 100 ? palavras(q) : nf(Math.floor(q), 0))} × ${esc(p.nome)} no diâmetro` : `do tamanho ${esc(doA(p))}`) : 'menor que qualquer astro do catálogo'}</div>
        <div class="sec">${esc(massaSol(s.M))} · ${tempo(s.seg)}</div></div>`; } },
  { id: '10', nome: 'Chip que se abre', descricao: 'Um chip mínimo; ao superar um gigante, abre por 3 s com o nome e fecha sozinho. Sem flash.',
    eixos: { posição: 'topo', massa: 'unidade amigável', critério: 'massa', visual: 'aviso ao superar', densidade: '1→3 linhas' },
    render: s => `<div class="h topo chip ${s.passou ? 'aberto' : ''}"><span class="forte">${esc(amigavel(s.M))}</span>
      ${s.passou ? `<div class="sec">superou ${esc(s.passou)}</div><div class="ter">próximo: ${esc(s.massa.next ? s.massa.next.nome : '—')} · ${tempo(s.seg)}</div>` : ''}</div>` },
  { id: '11', nome: 'Faixa inferior', descricao: 'Faixa larga na base: massa à esquerda, barra entre gigantes ao centro e tempo à direita.',
    eixos: { posição: 'base', massa: 'por extenso M☉', critério: 'massa', visual: 'barra entre marcos', densidade: '1 linha larga' },
    render: s => `<div class="h base faixa"><span class="forte">${esc(massaSol(s.M))}</span>
      <span class="meio"><em>${esc(s.massa.prev ? s.massa.prev.nome : '')}</em>${fio(s.massa.frac)}<em>${esc(s.massa.next ? s.massa.next.nome : '')}</em></span><span class="ter">${tempo(s.seg)}</span></div>` },
  { id: '12', nome: 'Mapa de eras', descricao: 'Barra segmentada em seis eras (pequenos corpos → cosmos); a era atual acende e mostra o progresso.',
    eixos: { posição: 'topo', massa: 'unidade amigável', critério: 'massa', visual: 'eras segmentadas', densidade: '2 linhas' },
    render: s => { const segs = ERAS.map(([n, a, b]) => { const on = s.logM >= a && s.logM < b, f = on ? (s.logM - a) / (b - a) : (s.logM >= b ? 1 : 0);
        return `<div class="era ${on ? 'on' : ''}"><i style="width:${(f * 100).toFixed(0)}%"></i></div>`; }).join('');
      const atual = ERAS.find(([, a, b]) => s.logM >= a && s.logM < b) || ERAS[ERAS.length - 1];
      return `<div class="h topo cartao largo"><div class="linha"><span class="forte">${esc(amigavel(s.M))}</span><span class="sec">${esc(atual[0])}</span></div><div class="eras">${segs}</div><div class="ter">${tempo(s.seg)}</div></div>`; } },
  { id: '13', nome: 'Régua lateral', descricao: 'Régua vertical fina na borda esquerda com gigantes por tamanho; o núcleo sobe como um ponto.',
    eixos: { posição: 'lateral esquerda', massa: 'por extenso M☉', critério: 'tamanho', visual: 'régua vertical', densidade: 'mínimo' },
    render: s => { const ids = ['terra', 'jupiter', 'sol', 'uy', 'ton', 'via', 'universo'], a = -3, b = 24;
      const ticks = MARCOS.filter(x => ids.includes(x.id)).map(x => `<b style="bottom:${(posLog(x.r, a, b) * 100).toFixed(1)}%" class="${x.r <= s.r ? 'on' : ''}"><em>${esc(x.nome.split(' ')[0])}</em></b>`).join('');
      return `<div class="h esquerda vertical"><div class="trilho">${ticks}<u style="bottom:${(posLog(s.r, a, b) * 100).toFixed(1)}%"></u></div>
        <div class="rodape"><div class="forte">${esc(massaSol(s.M))}</div><div class="ter">${tempo(s.seg)}</div></div></div>`; } },
  { id: '14', nome: 'Horizonte em km', descricao: 'Foco no tamanho: diâmetro do horizonte por extenso e o astro de tamanho parecido.',
    eixos: { posição: 'topo', massa: 'diâmetro (sem massa)', critério: 'tamanho', visual: 'barra entre marcos', densidade: '2 linhas' },
    render: s => `<div class="h topo cartao largo"><div class="linha"><span class="forte">⌀ ${esc(distancia(s.d))}</span><span class="ter">${tempo(s.seg)}</span></div>
      <div class="pontas"><span>${esc(s.raio.prev ? s.raio.prev.nome : 'início')}</span>${fio(s.raio.frac)}<span>${esc(s.raio.next ? s.raio.next.nome : '—')}</span></div></div>` },
  { id: '15', nome: 'Mínimo com falta', descricao: 'Canto inferior: massa amigável grande e quanto falta para o próximo gigante ("falta 2,1×").',
    eixos: { posição: 'base esquerda', massa: 'unidade amigável grande', critério: 'massa', visual: 'falta para o próximo', densidade: '2 linhas' },
    render: s => { const n = s.massa.next;
      return `<div class="h base-esq"><div class="grande">${esc(amigavel(s.M))}</div><div class="sec">${n ? `próximo: ${esc(n.nome)} · falta ${esc(vezes(n.m / s.M))}` : 'nada maior no catálogo'}</div>${fio(s.massa.frac, 'curto')}<div class="ter">${tempo(s.seg)}</div></div>`; } },
];

// ---------- galeria ----------
(function () {
  const $ = q => document.querySelector(q);
  const grade = $('#grade'), cRange = $('#ctl-massa'), cPlay = $('#ctl-play'), cOri = $('#ctl-orientacao'), cExport = $('#ctl-exportar');
  const CHAVE = 'umbra-hud-escolha';
  let escolha = { principal: null, favoritas: [] };
  try { escolha = Object.assign(escolha, JSON.parse(localStorage.getItem(CHAVE) || '{}')); } catch (e) {}
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(escolha)); } catch (e) {} atualizarResumo(); };
  const telas = VARIACOES.map(v => {
    const art = document.createElement('article'); art.className = 'card';
    art.innerHTML = `<div class="tela retrato"><div class="camada"></div></div>
      <div class="info"><h2><span>${v.id}</span> ${esc(v.nome)}</h2><p>${esc(v.descricao)}</p>
      <dl>${Object.entries(v.eixos).map(([k, x]) => `<dt>${esc(k)}</dt><dd>${esc(x)}</dd>`).join('')}</dl>
      <div class="acoes"><button type="button" data-fav aria-pressed="false">Favoritar</button><button type="button" data-princ aria-pressed="false">Principal</button></div></div>`;
    grade.appendChild(art);
    const fav = art.querySelector('[data-fav]'), princ = art.querySelector('[data-princ]');
    fav.addEventListener('click', () => { const i = escolha.favoritas.indexOf(v.id); if (i >= 0) escolha.favoritas.splice(i, 1); else escolha.favoritas.push(v.id); salvar(); });
    princ.addEventListener('click', () => { escolha.principal = escolha.principal === v.id ? null : v.id; if (escolha.principal && !escolha.favoritas.includes(v.id)) escolha.favoritas.push(v.id); salvar(); });
    return { v, art, tela: art.querySelector('.tela'), camada: art.querySelector('.camada'), fav, princ };
  });
  function atualizarResumo() {
    telas.forEach(t => { const f = escolha.favoritas.includes(t.v.id), p = escolha.principal === t.v.id;
      t.fav.setAttribute('aria-pressed', f); t.fav.textContent = f ? 'Favorita ✓' : 'Favoritar';
      t.princ.setAttribute('aria-pressed', p); t.princ.textContent = p ? 'Principal ✓' : 'Principal'; t.art.classList.toggle('escolhida', p); });
    $('#resumo').textContent = `Principal: ${escolha.principal || '—'} · Favoritas: ${escolha.favoritas.slice().sort().join(', ') || '—'}`;
  }
  atualizarResumo();
  cExport.addEventListener('click', () => {
    const json = JSON.stringify({ tema: 'hud', principal: escolha.principal, favoritas: escolha.favoritas.slice().sort(), data: new Date().toISOString().slice(0, 10) }, null, 2);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = 'escolha-hud.json'; a.click();
  });
  cOri.addEventListener('change', () => { document.body.classList.toggle('modo-paisagem', cOri.value === 'paisagem'); telas.forEach(t => { t.tela.classList.toggle('retrato', cOri.value === 'retrato'); t.tela.classList.toggle('paisagem', cOri.value === 'paisagem'); }); });
  // Varredura: 120 s de asteroide ao universo; o tempo de jogo exibido é simulado (1 s = 30 s de jogo).
  let rodando = true, logM = LOG_MIN, ultimo = performance.now(), segJogo = 0, passou = null, passouAte = 0;
  cPlay.addEventListener('click', () => { rodando = !rodando; cPlay.textContent = rodando ? 'Pausar varredura' : 'Retomar varredura'; cPlay.setAttribute('aria-pressed', !rodando); });
  cRange.addEventListener('input', () => { logM = +cRange.value; segJogo = (logM - LOG_MIN) / (LOG_MAX - LOG_MIN) * 3600; desenhar(true); });
  function desenhar(forcar) {
    const s = estado(logM, segJogo, performance.now() < passouAte ? passou : null);
    $('#leitura').textContent = `${massaSol(s.M)} · ⌀ ${distancia(s.d)}`;
    telas.forEach(t => { const h = t.v.render(s); if (forcar || t.camada._h !== h) { t.camada.innerHTML = h; t.camada._h = h; } });
  }
  let prevNext = null;
  function quadro(agora) {
    const dt = Math.min(.1, (agora - ultimo) / 1000); ultimo = agora;
    if (rodando) {
      logM += dt * (LOG_MAX - LOG_MIN) / 120; segJogo += dt * 30;
      if (logM > LOG_MAX) { logM = LOG_MIN; segJogo = 0; }
      cRange.value = logM.toFixed(2);
    }
    const n = comparar(Math.pow(10, logM), 'm').prev;
    if (n && prevNext && n.id !== prevNext.id && n.m > prevNext.m) { passou = n.nome; passouAte = agora + 3000; }
    prevNext = n;
    desenhar(false);
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
})();
