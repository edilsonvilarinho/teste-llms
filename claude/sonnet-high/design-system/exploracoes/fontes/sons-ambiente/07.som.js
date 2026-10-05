//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.563), bus = ctx.createGain(); bus.connect(m.out);
const parc = [[1, 1], [2, .6], [3, .45], [4, .3], [5, .2], [6, .12]];
camada(m, bus, hz(45), 'sine', .05, .02);
const acordes = [[57, 64], [57, 65], [55, 62], [57, 64, 69]];
ciclo(m, 20, (t, i) => acordes[i % 4].forEach(n => nota(m, bus, hz(n), t, { ataque: 5, sustenta: 11, libera: 5, ganho: .06, parciais: parc })));
return m;
