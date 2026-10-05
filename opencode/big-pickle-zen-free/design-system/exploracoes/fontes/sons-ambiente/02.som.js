//== evento ==
return eventoReferencia();
//== jato ==
return 0; // Jato preservado no app; esta galeria isola a música.
//== ambiente ==
const m = criarMusica(1.242), bus = ctx.createGain(); bus.connect(m.out); eco(m, bus, .42, .42, 2500, .5);
const escala = [62, 65, 67, 69, 72, 74, 77, 79]; let s = 7;
ciclo(m, 2.5, (t, i) => { s = (s * 13 + 5) % 8; nota(m, bus, hz(escala[s]), t, { ataque: .04, sustenta: 0, libera: 4, ganho: .22, fm: [3.5, 1.2] });
  if (i % 4 === 0) nota(m, bus, hz(50), t, { onda: 'triangle', ataque: 1.5, sustenta: 4, libera: 4, ganho: .12 }); });
return m;
