//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * .8, out = ecoCurto(destino(false), .24, .28, .35);
voz(t, f, { onda: 'triangle', ataque: .04, dur: d, pico: 0.227 * ganhoMassa(), parciais: [[1, 1], [5.4, .12], [8.9, .05]] }, out);
return d + .6;
//== jato ==
return jatoSopro(500, 2400, 2.8, .22, .8);
//== ambiente ==
return { parar() {} };
