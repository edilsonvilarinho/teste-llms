// Rodada 2 (03/10/2026): música audível em alto-falante de celular. Conteúdo principal entre
// 200 Hz e 2 kHz; graves só como reforço. Síntese original: osciladores, filtros e eco com
// retorno <= 0,45 (porta para Oboe/C++ sem convolução nem amostras). Nível normalizado pela
// medição offline (RMS após passa-altas de 250 Hz), registrada em tema.json.
function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
function criarMusica(nivel) {
  const t = ctx.currentTime, out = ctx.createGain();
  out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(nivel, t + 1.5);
  out.connect(saida);
  const m = { out, timers: [], nos: [], parar() {
    const a = ctx.currentTime;
    out.gain.cancelScheduledValues(a); out.gain.setTargetAtTime(0, a, .15);
    m.timers.forEach(clearInterval);
    m.nos.forEach(n => { try { n.stop(a + 1.2); } catch (e) {} });
  } };
  return m;
}
// Eco mono com passa-baixas no retorno; mistura volta para o mesmo destino.
function eco(m, entrada, tempo, retorno, corte, mistura) {
  const d = ctx.createDelay(2), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain();
  d.delayTime.value = tempo; fb.gain.value = Math.min(.45, retorno);
  lp.type = 'lowpass'; lp.frequency.value = corte; wet.gain.value = mistura;
  entrada.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(m.out);
}
// Uma nota com envelope (ataque em rampa, sustentação, liberação exponencial).
// o: { onda, ataque, sustenta, libera, ganho, corte, q, desafina:[cents], parciais:[[mult, peso]], fm:[razao, indice] }
function nota(m, destino, f, t0, o) {
  const g = ctx.createGain(), fim = t0 + o.ataque + (o.sustenta || 0) + o.libera;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(o.ganho, t0 + o.ataque);
  g.gain.setValueAtTime(o.ganho, t0 + o.ataque + (o.sustenta || 0));
  g.gain.setTargetAtTime(0, t0 + o.ataque + (o.sustenta || 0), o.libera / 4);
  let alvo = g;
  if (o.corte) {
    const lp = ctx.createBiquadFilter(); lp.type = o.passa || 'lowpass';
    lp.frequency.value = o.corte; lp.Q.value = o.q || 0; lp.connect(g); alvo = lp;
  }
  g.connect(destino);
  const fontes = [];
  (o.parciais || [[1, 1]]).forEach(([mult, peso]) => (o.desafina || [0]).forEach(c => {
    const osc = ctx.createOscillator(), pg = ctx.createGain();
    osc.type = o.onda || 'sine'; osc.frequency.value = f * mult; osc.detune.value = c;
    pg.gain.value = peso / (o.desafina || [0]).length;
    if (o.fm) {
      const mod = ctx.createOscillator(), idx = ctx.createGain();
      mod.frequency.value = f * mult * o.fm[0];
      idx.gain.setValueAtTime(f * o.fm[1], t0); idx.gain.setTargetAtTime(f * o.fm[1] * .15, t0, o.libera / 3);
      mod.connect(idx); idx.connect(osc.frequency); mod.start(t0); mod.stop(fim + .1); fontes.push(mod);
    }
    osc.connect(pg); pg.connect(alvo); osc.start(t0); osc.stop(fim + .1); fontes.push(osc);
  }));
  fontes[fontes.length - 1].onended = () => g.disconnect();
}
// Repete fn(t0, passo) a cada `periodo` s, agendando 0,1 s à frente; o primeiro passo é imediato.
function ciclo(m, periodo, fn) {
  let passo = 0;
  const tick = () => fn(ctx.currentTime + .1, passo++);
  tick(); m.timers.push(setInterval(tick, periodo * 1000));
}
// Oscilador contínuo (camada sustentada) com respiração lenta de ganho.
function camada(m, destino, f, onda, ganho, respira, corte) {
  const osc = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), prof = ctx.createGain();
  osc.type = onda; osc.frequency.value = f; g.gain.value = ganho * .8;
  lfo.frequency.value = respira; prof.gain.value = ganho * .2;
  lfo.connect(prof); prof.connect(g.gain);
  let alvo = g;
  if (corte) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = corte; lp.connect(g); alvo = lp; }
  osc.connect(alvo); g.connect(destino); osc.start(); lfo.start(); m.nos.push(osc, lfo);
  return { osc, g };
}
// Ruído rosa (Paul Kellet econômico) para ondas suaves, sem ataque impulsivo.
function ruidoRosa(seg) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seg), ctx.sampleRate), d = b.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913;
    d[i] = (b0 + b1 + b2 + w * .1848) * .11;
  }
  return b;
}
// Consumo de referência fixo nesta galeria (isola a música): seno com ataque de 80 ms.
function eventoReferencia() {
  const t = ctx.currentTime, f = [587.33, 440, 293.66, 220][material], dur = [1.2, 1.4, 2, 2.8][material];
  const g = ctx.createGain(), o = ctx.createOscillator(), pico = .16 * (.35 + .65 * Math.sqrt(Math.min(1, massa)));
  o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pico, t + .08);
  g.gain.setTargetAtTime(0, t + .1, dur / 4); o.connect(g); g.connect(saida); o.start(t); o.stop(t + dur + .2);
  return dur;
}
