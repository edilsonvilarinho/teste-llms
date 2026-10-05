//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(2.780), bus = ctx.createGain(); eco(m, bus, .35, .35, 2000, .4);
[[730, 6], [1090, 8], [2440, 10]].forEach(([f, q], k) => { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
  const g = ctx.createGain(); g.gain.value = [1, .7, .35][k] * 3; bus.connect(bp); bp.connect(g); g.connect(m.out); });
const acordes = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64]];
ciclo(m, 8, (t, i) => acordes[i % 4].forEach(n => nota(m, bus, hz(n), t, { onda: 'sawtooth', ataque: 2, sustenta: 4.5, libera: 2.5, ganho: .09, desafina: [-9, 0, 9] })));
return m;
