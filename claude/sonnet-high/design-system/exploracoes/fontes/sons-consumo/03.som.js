//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * 1.4, out = destino(false);
const g = ctx.createGain(); envelope(g, t, .04, d, 0.189 * ganhoMassa()); g.connect(out);
const c = ctx.createOscillator(), mo = ctx.createOscillator(), ix = ctx.createGain(); c.frequency.value = f; mo.frequency.value = f * 2.76;
ix.gain.setValueAtTime(f * 1.1, t); ix.gain.setTargetAtTime(f * .1, t, d / 5); mo.connect(ix); ix.connect(c.frequency); c.connect(g);
c.start(t); mo.start(t); c.stop(t + d + .1); mo.stop(t + d + .1);
return d;
//== jato ==
return jatoSopro(400, 1600, 3, .2, .9);
//== ambiente ==
return { parar() {} };
