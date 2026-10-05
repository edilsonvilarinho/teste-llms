//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.599), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .37, .35, 2400, .38);
const frases = [[65, 69, 72, 74], [67, 72, 74, 77], [69, 72, 74, 79], [65, 67, 69, 72]];
ciclo(m, 9, (t, i) => { frases[i % 4].forEach((n, k) => nota(m, bus, hz(n), t + k * 1.1 + (k === 3 ? .4 : 0), { onda: 'triangle', ataque: .05, sustenta: 0, libera: 3.5, ganho: .2, corte: 2400, parciais: [[1, 1], [2, .25]] }));
  nota(m, bus, hz([41, 43, 45, 41][i % 4] + 12), t, { onda: 'triangle', ataque: .06, sustenta: 0, libera: 5, ganho: .14, corte: 1200 }); });
return m;
