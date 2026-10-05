// Helpers do tema sons (prefixados a cada corpo de função pela skill). Síntese original Web Audio,
// sem samples. Parâmetros dos tokens: notas demoNotesHz, graves demoDroneHz, pico de voz 0,25 e ganho
// perceptual 0,35 + 0,65·√massa (A78). O motor aplica efeitos 55%, música 50% e limitador −1 dBFS.
const NOTAS = [293.6648, 329.6276, 369.9944, 440, 493.8833];
const GRAVES = [73.4162, 110, 146.8324];
const PICO = 0.25;

function ganhoPerceptual(m) { return 0.35 + 0.65 * Math.sqrt(Math.min(1, Math.max(0, m))); }

function destino(espacial, ang) {
  const g = ctx.createGain();
  if (espacial && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-0.75, Math.min(0.75, Math.cos(ang || 0) * 0.75));
    g.connect(p); p.connect(saida);
  } else {
    g.connect(saida);
  }
  return g;
}

function envelope(g, t, ataque, dur, pico) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(pico, t + ataque);
  g.gain.setTargetAtTime(0.0001, t + ataque + dur * 0.15, Math.max(0.05, dur * 0.22));
}

function oscilador(tipo, f, t, dur, alvo) {
  const o = ctx.createOscillator();
  o.type = tipo; o.frequency.value = f; o.connect(alvo);
  o.start(t); o.stop(t + dur + 0.2);
  return o;
}

function fonteRuido(dur) {
  const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(); s.buffer = b;
  return s;
}

function filtro(tipo, f, q) {
  const x = ctx.createBiquadFilter();
  x.type = tipo; x.frequency.value = f; x.Q.value = q || 0.7;
  return x;
}

// Frequência e duração por material conforme o eixo "diferença entre materiais".
function perfilMaterial(modo, material) {
  const durBase = [1.2, 1.4, 2.2, 3.4][material];
  if (modo === 'altura') return { f: [293.6648, 220, 146.8324, 73.4162][material], dur: durBase };
  if (modo === 'duração') return { f: [220, 196, 174.6, 146.8324][material], dur: [0.7, 1.4, 2.6, 4.2][material] };
  return { f: [293.6648, 146.8324, 110, 73.4162][material], dur: durBase };
}

// Uma absorção. timbre: sino | sopro | corda | coral | granular. Retorna a duração.
function tocarAbsorcao(timbre, modo, espacial) {
  const t = ctx.currentTime + 0.01;
  const perfil = perfilMaterial(modo, material);
  let { f, dur } = perfil;
  const pico = PICO * ganhoPerceptual(massa);
  const out = destino(espacial, angulo);
  // No modo "timbre", o material troca a síntese: poeira sino, rocha granular, gás sopro, grande coral.
  const efetivo = modo === 'timbre' ? ['sino', 'granular', 'sopro', 'coral'][material] : timbre;
  const g = ctx.createGain(); g.connect(out);
  if (efetivo === 'sino') {
    envelope(g, t, 0.01, dur, pico);
    const mod = ctx.createOscillator(), indice = ctx.createGain();
    mod.frequency.value = f * 2.76;
    indice.gain.setValueAtTime(f * 1.4, t); indice.gain.setTargetAtTime(f * 0.1, t, dur * 0.25);
    mod.connect(indice);
    const c = oscilador('sine', f, t, dur, g);
    indice.connect(c.frequency);
    mod.start(t); mod.stop(t + dur + 0.2);
  } else if (efetivo === 'sopro') {
    envelope(g, t, 0.25, dur, pico * 4.0); // ruído em banda estreita perde ~10 dB
    const n = fonteRuido(dur + 0.3), bp = filtro('bandpass', f * 2, 5);
    bp.frequency.setValueAtTime(f * 3, t); bp.frequency.exponentialRampToValueAtTime(f * 1.2, t + dur);
    n.connect(bp); bp.connect(g); n.start(t); n.stop(t + dur + 0.3);
  } else if (efetivo === 'corda') {
    // Karplus-Strong: rajada de ruído realimentada por atraso (f ≤ 340 Hz pelo quantum de 128 amostras).
    f = Math.min(f, 330);
    const atraso = ctx.createDelay(1); atraso.delayTime.value = 1 / f;
    const realim = ctx.createGain(); realim.gain.value = 0.975;
    // Q de passa-baixas no Web Audio é em dB: negativo evita ressonância (ganho do laço < 1).
    const lp = filtro('lowpass', 2400, -6);
    const rajada = fonteRuido(0.03), eg = ctx.createGain();
    eg.gain.value = pico * 0.9;
    rajada.connect(eg); eg.connect(atraso); atraso.connect(lp); lp.connect(realim); realim.connect(atraso);
    lp.connect(g); g.gain.value = 1;
    g.gain.setValueAtTime(1, t + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    rajada.start(t); rajada.stop(t + 0.03);
    setTimeout(() => { realim.disconnect(); }, (dur + 0.4) * 1000);
  } else if (efetivo === 'coral') {
    envelope(g, t, Math.min(0.5, dur * 0.25), dur, pico * 0.6);
    [1, 1.005, 1.5, 2.002].forEach((m, i) => oscilador(i % 2 ? 'triangle' : 'sine', f * m, t, dur, g));
  } else {
    // Granular: graos curtos de ruído filtrado espalhados no tempo.
    g.gain.value = 1;
    const graos = 10 + Math.round(massa * 10);
    for (let i = 0; i < graos; i++) {
      const tg = t + Math.random() * dur * 0.6, eg = ctx.createGain();
      envelope(eg, tg, 0.005, 0.12, pico * (1 - i / graos) * 5.0); // compensa banda estreita
      const n = fonteRuido(0.2), bp = filtro('bandpass', f * (1.5 + Math.random()), 8);
      n.connect(bp); bp.connect(eg); eg.connect(g); n.start(tg); n.stop(tg + 0.2);
    }
  }
  return dur + 0.3;
}

// Jato. tipo: sopro | acorde | sub | coro. Retorna a duração.
function tocarJato(tipo) {
  const t = ctx.currentTime + 0.01, dur = 3.2;
  const g = ctx.createGain(); g.connect(saida);
  if (tipo === 'sopro') {
    envelope(g, t, 0.6, dur, 1.0);
    const n = fonteRuido(dur + 0.5), bp = filtro('bandpass', 200, 3);
    bp.frequency.setValueAtTime(180, t); bp.frequency.exponentialRampToValueAtTime(1800, t + dur);
    n.connect(bp); bp.connect(g); n.start(t); n.stop(t + dur + 0.5);
  } else if (tipo === 'acorde') {
    g.gain.value = 1;
    [NOTAS[0] / 2, NOTAS[2] / 2, NOTAS[3] / 2].forEach((f, i) => {
      const eg = ctx.createGain(); eg.connect(g);
      envelope(eg, t + i * 0.25, 0.6, dur - i * 0.25, 0.09);
      const o = oscilador('sine', f, t + i * 0.25, dur, eg);
      o.frequency.exponentialRampToValueAtTime(f * 2, t + dur);
    });
  } else if (tipo === 'sub') {
    envelope(g, t, 0.5, dur, 0.28);
    const o = oscilador('sine', 55, t, dur, g);
    o.frequency.exponentialRampToValueAtTime(GRAVES[0], t + dur);
    const n = fonteRuido(dur + 0.4), lp = filtro('lowpass', 140, 0.7), ng = ctx.createGain();
    ng.gain.value = 0.5; n.connect(lp); lp.connect(ng); ng.connect(g); n.start(t); n.stop(t + dur + 0.4);
  } else {
    envelope(g, t, 0.8, dur, 0.07);
    [1, 1.004, 1.5, 2, 2.003].forEach(m => oscilador('triangle', NOTAS[3] * m, t, dur, g));
  }
  return dur + 0.5;
}

// Drone do núcleo (bus de música). tipo: grave | acorde | pad | pulso | nenhum. Retorna { parar() }.
function iniciarDrone(tipo) {
  const t = ctx.currentTime, nos = [];
  const g = ctx.createGain(); g.connect(saida);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(tipo === 'nenhum' ? 0 : 0.11, t + 0.6);
  const freqs = tipo === 'acorde' ? [73.4162, 110, 146.8324, 220] : GRAVES;
  if (tipo === 'pad') {
    const lp = filtro('lowpass', 380, 1.2), lfo = ctx.createOscillator(), prof = ctx.createGain();
    lfo.frequency.value = 0.05; prof.gain.value = 180; lfo.connect(prof); prof.connect(lp.frequency);
    lp.connect(g); lfo.start(); nos.push(lfo);
    [73.4162, 73.9, 110, 110.6].forEach(f => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = f; og.gain.value = 0.25;
      o.connect(og); og.connect(lp); o.start(); nos.push(o);
    });
  } else if (tipo !== 'nenhum') {
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.frequency.value = f; og.gain.value = tipo === 'acorde' ? 0.24 : 0.33;
      const lfo = ctx.createOscillator(), prof = ctx.createGain();
      lfo.frequency.value = tipo === 'pulso' ? 0.22 : 0.021 + i * 0.016;
      prof.gain.value = tipo === 'pulso' ? 0.12 : 0.07;
      lfo.connect(prof); prof.connect(og.gain); o.connect(og); og.connect(g);
      o.start(); lfo.start(); nos.push(o, lfo);
    });
  }
  return { parar() { const a = ctx.currentTime; g.gain.setTargetAtTime(0, a, 0.08); nos.forEach(n => n.stop(a + 0.6)); } };
}
