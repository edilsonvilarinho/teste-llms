//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material], out = destino(true);
voz(t, f, { onda: 'sawtooth', ataque: .12, dur: d, pico: 0.583 * ganhoMassa(), corte: f * 3, parciais: [[1, 1], [1.5, .7]], desafina: [-6, 6] }, out);
return d;
//== jato ==
return jatoSopro(150, 900, 3.6, .38, .4);
//== ambiente ==
return { parar() {} };
