// Rodada 2 (03/10/2026): consumo suave, ataque >= 40 ms, sem ruído impulsivo nem realimentação
// divergente. Altura por material (poeira, rocha, gás, corpo grande) e ganho pela massa relativa.
// Síntese original portável para Oboe/C++: osciladores, biquads e eco com retorno <= 0,4.
const ALTURA = [587.33, 440, 293.66, 196];
const DURACAO = [1.1, 1.4, 1.9, 2.8];
function ganhoMassa() { return .35 + .65 * Math.sqrt(Math.min(1, Math.max(0, massa || 0))); }
function destino(espacial) {
  if (espacial && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner(); p.pan.value = .6 * Math.cos(angulo || 0); p.connect(saida); return p;
  }
  return saida;
}
function envelope(g, t, ataque, dur, pico) {
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(pico, t + ataque);
  g.gain.setTargetAtTime(0, t + ataque, Math.max(.05, (dur - ataque) / 4));
}
// Voz genérica: parciais [[mult, peso]], onda, filtro opcional, glide (razão final da altura).
function voz(t, f, o, alvo) {
  const g = ctx.createGain(), fim = t + o.dur + .1;
  envelope(g, t, o.ataque, o.dur, o.pico);
  let entrada = g;
  if (o.corte) {
    const lp = ctx.createBiquadFilter(); lp.type = o.passa || 'lowpass'; lp.frequency.value = o.corte; lp.Q.value = o.q || .7;
    if (o.varre) { lp.frequency.setValueAtTime(o.corte, t); lp.frequency.exponentialRampToValueAtTime(o.corte * o.varre, t + o.dur); }
    lp.connect(g); entrada = lp;
  }
  g.connect(alvo);
  (o.parciais || [[1, 1]]).forEach(([mult, peso]) => (o.desafina || [0]).forEach(c => {
    const osc = ctx.createOscillator(), pg = ctx.createGain();
    osc.type = o.onda || 'sine'; osc.detune.value = c;
    osc.frequency.setValueAtTime(f * mult, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(f * mult * o.glide, t + o.dur * (o.glideFrac || 1));
    if (o.vibrato) {
      const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vibrato; lg.gain.value = f * mult * .006;
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(fim);
    }
    pg.gain.value = peso / (o.desafina || [0]).length;
    osc.connect(pg); pg.connect(entrada); osc.start(t); osc.stop(fim);
  }));
  return o.dur;
}
function ecoCurto(alvo, tempo, retorno, mistura) {
  const d = ctx.createDelay(1), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain(), entrada = ctx.createGain();
  d.delayTime.value = tempo; fb.gain.value = Math.min(.4, retorno); lp.type = 'lowpass'; lp.frequency.value = 2200; wet.gain.value = mistura;
  entrada.connect(alvo); entrada.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(alvo);
  setTimeout(() => { entrada.disconnect(); }, 6000);
  return entrada;
}
function ruido(seg) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seg), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
// Jato: sopro ascendente filtrado, ataque de 0,6 s, sem estalo.
function jatoSopro(f0, f1, dur, pico, tonal) {
  const t = ctx.currentTime, g = ctx.createGain(), bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 2.5; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur * .8);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pico, t + .6); g.gain.setTargetAtTime(0, t + dur * .55, dur * .15);
  const s = ctx.createBufferSource(); s.buffer = ruido(dur + .2); s.connect(bp); bp.connect(g); g.connect(saida); s.start(t); s.stop(t + dur + .2);
  if (tonal) {
    const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1 / 2, t + dur * .8);
    og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(pico * tonal, t + .8); og.gain.setTargetAtTime(0, t + dur * .55, dur * .15);
    o.connect(og); og.connect(saida); o.start(t); o.stop(t + dur + .2);
  }
  return dur;
}
