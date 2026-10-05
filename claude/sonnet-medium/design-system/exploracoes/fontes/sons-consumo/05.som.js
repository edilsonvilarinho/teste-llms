//== evento ==
const t = ctx.currentTime, f = ALTURA[material], d = DURACAO[material] * 1.1, out = destino(false);
voz(t, f, { onda: 'sawtooth', ataque: .16, dur: d, pico: 0.364 * ganhoMassa(), corte: 2200, vibrato: 5.2, desafina: [-10, 0, 10] }, out);
return d;
//== jato ==
return jatoSopro(250, 1000, 3.4, .22, 1);
//== ambiente ==
return { parar() {} };
