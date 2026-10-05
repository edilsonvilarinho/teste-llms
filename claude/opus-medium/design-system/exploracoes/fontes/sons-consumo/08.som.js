//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * .7, out = ecoCurto(destino(true), .18, .35, .5);
voz(t, f, { ataque: .045, dur: d, pico: 0.303 * ganhoMassa(), glide: 1.26, glideFrac: .25, parciais: [[1, 1], [2, .2]] }, out);
return d + .8;
//== jato ==
return jatoSopro(300, 1800, 3, .28, .5);
//== ambiente ==
return { parar() {} };
