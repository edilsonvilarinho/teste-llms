//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(2.564), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .28, .3, 1800, .35);
const acordes = [[50, 57, 64, 69], [48, 55, 62, 67], [53, 60, 67, 72], [46, 53, 60, 65]];
ciclo(m, 10, (t, i) => acordes[i % 4].forEach(n => nota(m, bus, hz(n), t, { onda: 'sawtooth', ataque: 2.5, sustenta: 6, libera: 3, ganho: .08, corte: 1400, desafina: [-7, 7] })));
return m;
