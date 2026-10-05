//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material], out = destino(false);
voz(t, f, { onda: 'triangle', ataque: .3, dur: d, pico: 0.202 * ganhoMassa(), corte: 2600, parciais: [[1, 1], [2, .4], [3, .15]] }, out);
return d;
//== jato ==
return jatoSopro(200, 1200, 4, .3, .7);
//== ambiente ==
return { parar() {} };
