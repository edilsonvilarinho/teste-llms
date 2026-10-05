//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(4.064), bus = ctx.createGain(); bus.connect(m.out);
const acordes = [[38, 50, 57, 64, 65], [34, 46, 53, 62, 65], [41, 53, 57, 64, 67], [36, 48, 55, 62, 64]];
ciclo(m, 12, (t, i) => acordes[i % 4].forEach((n, k) => nota(m, bus, hz(n), t, { onda: 'sawtooth', ataque: 3.5, sustenta: 6.5, libera: 3.5, ganho: k ? .06 : .05, corte: 1700, desafina: [-12, 0, 12] })));
return m;
