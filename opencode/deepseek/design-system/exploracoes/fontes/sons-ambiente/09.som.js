//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.923), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .22, .25, 1500, .25);
[62, 64, 69, 74].forEach((n, k) => camada(m, bus, hz(n), 'triangle', .045, .015 + k * .011, 1600));
ciclo(m, 9, (t) => { const s = ctx.createBufferSource(); s.buffer = ruidoRosa(9.5); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = .8;
  bp.frequency.setValueAtTime(400, t); bp.frequency.linearRampToValueAtTime(1300, t + 4.5); bp.frequency.linearRampToValueAtTime(400, t + 9);
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + 4.5); g.gain.linearRampToValueAtTime(0, t + 9.2);
  s.connect(bp); bp.connect(g); g.connect(bus); s.start(t); s.stop(t + 9.5); });
return m;
