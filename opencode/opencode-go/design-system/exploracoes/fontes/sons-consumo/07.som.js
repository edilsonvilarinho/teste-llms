//== evento ==
const t = ctx.currentTime, f = ALTURA[material] * 1.5, d = DURACAO[material] * 1.3, out = destino(false);
voz(t, f, { ataque: .04, dur: d, pico: 0.155 * ganhoMassa(), parciais: [[1, 1], [2.32, .45], [4.25, .2]] }, out);
return d;
//== jato ==
return jatoSopro(800, 3200, 2.8, .18, .6);
//== ambiente ==
return { parar() {} };
