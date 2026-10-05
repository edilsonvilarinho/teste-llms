//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.361), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .5, .4, 3000, .45);
const escala = [67, 69, 71, 73, 74, 76, 78, 79, 83, 86]; let s = 3;
camada(m, bus, hz(55), 'sine', .05, .03); camada(m, bus, hz(62), 'sine', .04, .05);
ciclo(m, 1.6, (t) => { s = (s * 7 + 3) % 10; nota(m, bus, hz(escala[s]), t, { ataque: 1.2, sustenta: .5, libera: 3, ganho: .07, parciais: [[1, 1], [2.01, .3]] }); });
return m;
