//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.459), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .5, .33, 2000, .32);
const motivos = [[62, 66, 69, 72], [64, 67, 71, 74], [60, 64, 67, 72], [62, 69, 72, 74]];
ciclo(m, 6, (t, i) => { motivos[i % 4].forEach((n, k) => nota(m, bus, hz(n), t + k * .5, { ataque: .04, sustenta: 0, libera: 1.4, ganho: .22, parciais: [[1, 1], [3.9, .18], [9.2, .05]] }));
  nota(m, bus, hz(50), t, { onda: 'triangle', ataque: .8, sustenta: 3, libera: 2, ganho: .12, corte: 900 }); });
return m;
