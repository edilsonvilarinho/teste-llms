//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * 1.2, out = destino(true);
voz(t, f, { ataque: .05, dur: d, pico: 0.286 * ganhoMassa(), glide: .5, glideFrac: .8, parciais: [[1, 1], [2, .3]] }, out);
return d;
//== jato ==
return jatoSopro(120, 700, 3.8, .4, .3);
//== ambiente ==
return { parar() {} };
