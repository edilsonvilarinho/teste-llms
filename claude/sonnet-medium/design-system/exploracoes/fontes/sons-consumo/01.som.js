//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material], out = destino(false);
const src = ctx.createGain();
[[730, 6, 1], [1090, 8, .6]].forEach(([fc, q, w]) => { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fc; bp.Q.value = q; const g = ctx.createGain(); g.gain.value = w * 3; src.connect(bp); bp.connect(g); g.connect(out); });
voz(t, f / 2, { onda: 'sawtooth', ataque: .06, dur: d, pico: 0.538 * ganhoMassa(), desafina: [-8, 8] }, src);
return d;
//== jato ==
return jatoSopro(300, 1400, 3.2, .3, .5);
//== ambiente ==
return { parar() {} };
