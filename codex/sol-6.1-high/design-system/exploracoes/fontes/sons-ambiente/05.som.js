//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.754), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, 60 / 72 * .75, .38, 2200, .3);
const motivo = [62, 69, 65, 72, 62, 67, 64, 71], baixo = [38, 38, 43, 41];
ciclo(m, 60 / 72, (t, i) => { nota(m, bus, hz(motivo[i % 8]), t, { onda: 'triangle', ataque: .045, sustenta: 0, libera: .9, ganho: .2, corte: 2600 });
  if (i % 8 === 0) nota(m, bus, hz(baixo[(i / 8 | 0) % 4] + 12), t, { onda: 'sawtooth', ataque: 1.5, sustenta: 3.5, libera: 2, ganho: .08, corte: 700, desafina: [-6, 6] }); });
return m;
