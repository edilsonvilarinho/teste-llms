//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * .8, out = destino(true);
const s = ctx.createBufferSource(); s.buffer = ruido(d + .2); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 9;
bp.frequency.setValueAtTime(f * 2, t); bp.frequency.exponentialRampToValueAtTime(f * .7, t + d);
const g = ctx.createGain(); envelope(g, t, .09, d, 3.319 * ganhoMassa()); s.connect(bp); bp.connect(g); g.connect(out); s.start(t); s.stop(t + d + .2);
return d;
//== jato ==
return jatoSopro(200, 2200, 3.6, .35, 0);
//== ambiente ==
return { parar() {} };
