# Revisão do UI kit Obsidiana — 30/09/2026

Direção 02 aprovada pelo usuário. Design system 1.0.0, sem implementação Android.

## Evidência obtida

- Builder executado com sucesso: 17 cores semânticas, 12 símbolos SVG e 28 pares de contraste. Todos os pares atingem o limiar configurado; menor resultado: 4,839:1.
- Sintaxe dos scripts incorporados no UI kit e no planejamento validada pelo parser JavaScript do Node.
- Navegação por 11 telas/estados: abertura, universo salvo, explorar, pausa, ajustes, carregamento, falha de leitura, falha de escrita, recuperação, ajuda e créditos.
- Slider de música por teclado: ajuste para 1% refletido nos controles da tela e do laboratório.
- Movimento reduzido e qualidade Econômica: seleção refletida entre exemplos.
- Ajuda retorna aos ajustes. Tentativa de salvamento demonstrativa desabilita o botão durante a operação e informa sucesso depois de concluir.
- Som começa desligado; ativação explícita muda o estado e desativação retorna ao silêncio. Não houve análise auditiva de qualidade ou medição de loudness.
- Exportação disponibiliza JSON com direção 2 e alternativa para cópia manual.
- Desktop 1440 × 1000 e viewport estreita 390 × 844: sem overflow horizontal do documento. Inspeção visual da identidade e da abertura.
- Exemplos de botão: alturas de referência 48/52; slider: 48. O artboard reduzido não representa tamanho físico de toque Android.
- Nenhuma mensagem de erro ou aviso encontrada no console durante a revisão.
- Planejamento mostra “02 · Obsidiana” selecionada e link para o design system.

## Limites

Não foram validados: renderização nativa, física, latência/mixagem final de áudio, saves reais, TalkBack, fonte ampliada no Android, temperatura, bateria ou desempenho em Adreno/Mali. Os budgets são hipóteses de prototipação, não capacidades comprovadas. Os pares de tokens não comprovam contraste sobre qualquer cena.

## Reprodução

### Portabilidade Android — A13

Componentes de painel/mensagem portados sem alterar tokens ou blocos gerados: superfície opaca, scrim 0,84, máximo 400 dp, insets + margem 24/16 dp e rolagem de recuperação. Build/APK de testes/lint aprovados localmente; seis casos Android apenas compilados nesta etapa. Capturas reais/execução remota e aceite registrados na issue #1 antes da conclusão. [Contrato e limites](../docs/android/paineis-mensagens.md). Esse registro não certifica cena GLES, TalkBack físico ou sensação em Adreno/Mali.

Na raiz do projeto: `python scripts/build_obsidiana.py`. Abrir `design-system/obsidiana.html` ou servir a pasta por HTTP local. O HTML incorpora CSS, ícones, dados e JavaScript; não exige CDN. `kit.js` contém a lógica editável, incorporada pelo builder.

### Variações para escolha de direção — A79 (01/10/2026)

Pedido do usuário: refatoração completa da cena, com uma skill que gere N exemplos por tema para escolher a direção. Decisão: **Obsidiana enriquecido**, ou seja, mesma paleta, tipografia e acessibilidade, com riqueza liberada.

- **Skill:** `.claude/skills/umbra-variacoes/`. Traz `SKILL.md`, referências (regras Obsidiana, contrato do shader, eixos por tema), casca/motor/estilo da galeria e os scripts `montar_galeria.py` e `validar_galeria.py`, só com biblioteca padrão.
- **Galeria `buraco-negro`:** `design-system/exploracoes/buraco-negro.html`, com 20 variações em 5 eixos: sombra, anel de fótons, lente, reação à absorção e brilho. Fontes em `design-system/exploracoes/fontes/buraco-negro/`. Índice em `exploracoes/index.html`. Escolhas registradas em `exploracoes/escolhas.json` (ainda vazio).
- **Validador executado:**
  - 20 variações, metadados completos e todos os pares diferindo em ≥ 2 eixos;
  - nenhuma cor literal fora das constantes geradas de `tokens.json`;
  - `uTempo` ausente da cena (movimento decorativo usa `TD`);
  - HTML atualizado, offline e com um único contexto WebGL;
  - **24 shaders compilados como GLSL ES 3.00** pelo glslangValidator do SDK.
- **Navegador (painel do app, Chromium):**
  - console sem erros e todas as vistas renderizando;
  - variação ampliada com absorção por toque;
  - variação 20 com 3000 pontos;
  - largura 375 px sem rolagem horizontal.
- `tests/test_variacoes.py` (4 testes) confere sincronia, paleta, movimento reduzido e distinção. A CI compila as galerias junto com os shaders do app.

**Limites:** o tempo de quadro do navegador não mede Android. Custos e perfis mínimos são estimativas. Escuta do áudio da galeria e TalkBack não foram avaliados. Nenhuma escolha altera tokens ou app até ser consolidada (etapa posterior).

### Galerias dos demais temas — A80 (01/10/2026)

Escolha registrada: buraco-negro **13 · Halo de poeira** (`exploracoes/escolhas.json`). O núcleo virou bloco compartilhado em `fontes/_base/nucleo-13.glsl`, incluído pelas novas galerias, cada uma com 20 variações:

| Galeria | Eixos que variam |
| --- | --- |
| consumo | trajetória, espaguetificação, rastro, contato com o horizonte, resposta do núcleo |
| espaco-tempo | grade, estrelas arrastadas, linhas de poeira, ondas gravitacionais, arrasto, alcance |
| jatos | gatilho real (cadência, a cada 4 absorções ou corpo grande), forma, duração, cor, extra |
| particulas | 1600 a 8000 pontos por perfil |
| planetas | iluminação, superfície, atmosfera, maré, corpo em destaque |
| disco-acrecao | — |
| sons | síntese Web Audio por material, drone, jato, espacialização |

O motor ganhou:
- queda de matéria antes da absorção (`uQueda`);
- gatilhos de jato por variação;
- botão "Ouvir sequência";
- drone padrão e por variação;
- teto rígido de −1 dBFS (waveshaper) depois do compressor.

**Verificação executada:**
- `validar_galeria.py --todos`: 8 galerias, 160 variações e **318 shaders GLSL ES 3.00 compilados**, 0 erros.
- `unittest`: aprovado.
- Painel do navegador: console sem erros e capturas de consumo, espaço-tempo, jatos, partículas, planetas e disco.
- **Som renderizado offline** (`OfflineAudioContext`), 20 receitas × 4 materiais, mais jato e drone:
  - absorções de −11,7 a −28,5 dBFS;
  - poeira leve até −29,3;
  - jatos de −15,4 a −20,6;
  - drones perto de −24 a −26.

**Falhas encontradas e corrigidas:**
- Karplus-Strong divergia até +4,8 dBFS, porque o `Q` de passa-baixas do Web Audio é em dB.
- Os timbres granular e sopro ficavam entre −34 e −45 dBFS.

**Limites:**
- Com o painel do navegador oculto, `requestAnimationFrame` pausa; a medição ao vivo não vale como evidência, por isso o som foi medido offline.
- Escuta humana, TalkBack e desempenho Android não foram avaliados.
- As escolhas destas galerias estão pendentes.

### Escolhas e planetas, rodada 2 — A81 (01/10/2026)

Escolhas do usuário registradas em `exploracoes/escolhas.json`:

| Tema | Escolha |
| --- | --- |
| consumo | 12 · Órbita nebulosa |
| disco | 01 · Filamentos keplerianos |
| espaço-tempo | 01 · Grade de Einstein |
| jatos | 11 · Feixe de partículas |
| partículas | 13 · Céu à deriva |
| sons | 05 · Poeira granular |
| planetas | Reprovado: "a ideia é ter uma ampla variedade" |

Decisões do usuário para a nova rodada:
- **Cores liberadas só para a matéria.** Os novos tokens `render.matterColors` são gelo, lava, oceano, terra, deserto, gás violeta, estrela azul, estrela vermelha e nebulosa. Ficam fora da UI, do núcleo, do disco e dos arcos. README atualizado; tokens nativos e UI kit regenerados.
- **Catálogo vivo por variação.** Cada uma das 20 variações é um estilo (iluminação, estilo de superfície, atmosfera, saturação) aplicado a um conjunto de 10 corpos de 16 tipos:
  - rochoso, lava, gelo, oceano e deserto;
  - gasoso com anéis, gigante de gelo, lua, cometa e asteroide;
  - anã vermelha, estrela azul, anã branca e gigante vermelha;
  - galáxia e nebulosa.

Verificação:
- `validar_galeria.py planetas`: 42 shaders GLSL ES 3.00 compilados, 0 erros.
- Builder, tokens nativos e unittest aprovados.
- Painel do navegador: console sem erros; capturas da 01 e da 04 com anéis, galáxia, cometa, estrelas e nebulosa.
- Aceite visual do usuário pendente.

Pedido do usuário depois da rodada 2: ver os corpos soltos no espaço, para avaliar a variedade, e só depois com o buraco negro, para ver a interação.

- O motor ganhou o interruptor "Buraco negro" (uniform `uNucleo`, em `tema.json` como `alternarNucleo`/`nucleoInicial`).
- A galeria de planetas abre sem núcleo: 10 corpos maiores numa grade que se adapta à proporção da vista (5 × 2, 3 × 4 ou 2 × 5), iluminados por uma estrela fora do quadro. Ligado, os corpos voltam a orbitar o núcleo 13.
- Validador: 318 shaders compilados, 0 erros.
- Capturas no painel: grade e vista ampliada com os 10 corpos visíveis, e o interruptor alternando.

### Animação dos corpos — A82 (01/10/2026)

Escolha de planetas: **04 · Silhuetas coloridas**. O usuário pediu animação melhor, então foi criada a galeria `animacao-corpos`, com 20 variações.

- **Fixo:** o estilo 04 e um catálogo de 12 corpos (oceano, gasoso com anéis, estrela azul, cometa, lava, gigante vermelha, gelo, galáxia, asteroide, gigante de gelo, nebulosa e deserto), soltos no espaço por padrão.
- **Varia:**
  - rotação própria: normal girada, com o relevo atravessando o disco;
  - luas orbitando, com oclusão atrás do planeta;
  - atividade estelar: pulsação, erupções na coroa ou proeminências;
  - movimento no espaço: deriva, paralaxe em camadas, órbita compartilhada ou balanço;
  - efeitos extras: nuvens em camada própria e tempestade oval, cauda de cometa com íons e poeira, anéis cintilantes.

Verificação:
- `validar_galeria.py --todos`: 9 galerias e 360 shaders compilados, 0 erros. Testes aprovados.
- Painel: a variação 16 mostra proeminências, luas, anéis, cometa e galáxia em movimento.
- Corrigido o corte duro da cauda do cometa.
- Aceite do usuário pendente.

### Protótipo jogável em HTML — A83 (01/10/2026)

Pedido do usuário: montar um protótipo do jogo com todas as escolhas antes de implementar no app.

**Arquivos:** fonte `design-system/prototipo/prototipo.fonte.html` + `prototipo.js`, gerados por `scripts/build_prototipo.py` em `umbra-prototipo.html`. O build injeta tokens, ícones e JS e tem `--check`.

**O que o protótipo junta:**
- núcleo 13;
- disco 01;
- consumo 12: órbita decaindo, nuvem, faíscas, desvio para o vermelho e anel local;
- espaço-tempo 01: grade ancorada no mundo, com anéis;
- jatos 11: a cada 4 absorções, com intervalo mínimo de 12 s;
- partículas 13: fundo com paralaxe;
- planetas 04 com 18 tipos de corpo por escala (Poeira → Galáxias);
- sons 05;
- animação **provisória** 01 · Mundos vivos, porque o usuário ainda não escolheu a animação.

**Como funciona:**
- Simulação a 60 Hz independente do quadro.
- O núcleo segue o dedo e freia em 600 ms; também responde a teclado.
- Crescimento logarítmico na tela: o núcleo fica com cerca de 15% da altura útil.
- Só corpos de até 0,5 R são comíveis; os maiores são esticados pela maré e desviados.
- Telas e textos dos tokens: abertura, exploração, pausa e ajustes.
- Movimento reduzido, qualidade Auto/Alta/Econômica e painel opcional do protótipo para saltar escalas.

**Verificação executada:**
- `node --check`; build `--check`; unittest (2 testes novos).
- Simulação acelerada pelo gancho `?teste`, 90 s de jogo guiado:
  - massa de 1 para 45,5 (até Planetas);
  - 256 absorções;
  - 9 jatos;
  - nenhum NaN.
- Capturas no painel: abertura, exploração, queda, escala de planetas e de sistemas, celular 375 px sem rolagem lateral. Console sem erros.

**Falhas corrigidas:**
- O aglomerado de poeira escurecia a grade.
- Corpos de até 0,75 R cobriam a sombra durante a captura. O limite caiu para 0,5 R, o corpo encolhe na espiral e fica oculto atrás da sombra.
- O painel do protótipo ficava com dados velhos depois de desligado.

**Limites:**
- O painel do navegador oculto pausa o `requestAnimationFrame`; a jogabilidade em tempo real não foi exercitada por pessoa.
- Escuta, sensação de controle e desempenho Android pendentes.

### Protótipo 2: partículas na GPU e bloom — A84 (02/10/2026)

**Motivo.** O usuário disse que os elementos do protótipo 1 "parecem PNG". O vídeo da referência (Black Hole Bloom, Unity), com 35,6 s e 464 × 832, mostra o anel do núcleo envolto em fumaça de partículas luminosas, nebulosas volumosas e bloom. A diferença está na técnica: a matéria é feita de partículas, e a cena é HDR com pós-processamento.

**Entrega.** `design-system/prototipo/umbra-particulas.html`, gerado pelo mesmo `scripts/build_prototipo.py`. Técnicas, todas portáveis 1:1 para GLES 3.0:
- partículas simuladas por transform feedback: 14 mil, 32 mil ou 64 mil;
- render em HDR RGBA16F, recuando para RGBA8 sem `EXT_color_buffer_float`;
- duas camadas, com lente gravitacional aplicada à camada de trás. Os arcos de Gargantua surgem da lente sobre o disco de partículas;
- bloom Kawase em 4 a 6 mipmaps;
- corpos com borda suave e emissão;
- aglomerados de matéria luminosa nas cores de `render.matterColors`;
- consumo com desintegração real em detritos que alimentam o disco;
- jato 11 como feixe de partículas.

Paleta Obsidiana por padrão. A paleta "Neon (referência)" serve só para comparar e está fora do Obsidiana.

**Verificação.**
- `node --check` e build `--check`.
- Painel do navegador com HDR de 16 bits ativo e 32 mil partículas: capturas do disco, dos arcos, do jato, dos aglomerados e da paleta neon. Console sem erros.
- Simulação guiada: 16 absorções, massa de 1 para 2,9.

**Ajustes feitos durante o teste:**
- disco e halos estourados;
- seixos cinza dominando a cena;
- aglomerados fracos demais.

**Limites.** O tempo de quadro com o painel oculto (20 a 40 ms) não representa o desempenho real. Desempenho e temperatura em Adreno/Mali e escuta continuam pendentes.

#### Crescimento visível no Protótipo 2 — A85 (02/10/2026)

O usuário perguntou se o efeito de crescimento era considerado. A massa e o raio já cresciam, mas a câmera compensava na mesma proporção, então o núcleo parecia sempre do mesmo tamanho.

Agora:
- Dentro de cada faixa (Poeira, Asteroides, Planetas, Sistemas, Galáxias e, depois, cada ×8 de massa), o núcleo vai de 12% a 24% da altura (`render.coreHeightRange`), em progressão logarítmica.
- Ao cruzar uma faixa, a câmera recua em 6 s (`motionMs.cameraScaleTransition`), com a curva de câmera (0,4; 0; 0,2; 1).
- Cada absorção faz o horizonte e o anel incharem 5% de forma breve; o efeito é só visual e não muda a simulação.
- O marco de escala é sem flash e sem fanfarra: uma onda 3,5× mais forte na grade, um anel de partículas se afastando, o disco acendendo e um grave granular.

Verificação pelo gancho `?teste`:
- raio na tela de 0,060 para 0,125 da altura ao longo da faixa;
- recuo até cerca de 0,07 ao entrar em Asteroides;
- capturas no fim da faixa, durante a transição e na faixa nova;
- console sem erros.

Sensação de ritmo e desempenho Android continuam pendentes.

### Plano v2 e issue #3 — A86 (02/10/2026)

O usuário pediu um plano detalhado para criar o app com base em tudo o que foi definido, uma issue com as decisões e atividades atômicas, e jogabilidade em retrato e paisagem. Animação dos corpos fixada em **01 · Mundos vivos**. O plano está em `docs/android/plano-v2.md`, com as decisões D1–D10 e as atividades A86–A118. A issue #3 foi publicada. Requisito novo, D7: retrato e paisagem; o tamanho do núcleo passa a valer sobre a menor dimensão (derivado, revisável no gate).

### Retorno do C61 — A121 (02/10/2026)

Otimizações de envio, cópias e carga dos alvos, sem alterar shaders, cores ou contagens. Builder Obsidiana executado sem deriva; 13/13 shaders válidos. JVM em execução nova (`--rerun`, sem cache de testes), incluindo a medição de alocação de dimensões internas em 1000 quadros; APK debug compilado. A solicitação de 60 Hz ao compositor não comprova FPS. Aparência e desempenho no C61 e no Adreno continuam pendentes; nenhum gate aprovado. Evidência: `docs/android/evidencias/A121.json`.

### Retorno do C61 — A122 (02/10/2026)

Fumaça em meia resolução, separada nas duas camadas da lente; nebulosa em meia resolução com as mesmas expressões de ruído, cores e movimento. Estrelas e grade em resolução interna cheia. A comparação automática com o Protótipo 2 passou com a diferença de separação/reamostragem documentada; fumaça usa contagem/taxa de referência 32k nos três perfis. Builder sem deriva. Revisão visual e desempenho no C61 permanecem pendentes; smoke em emulador ao fim da Frente 1. Evidência: `docs/android/evidencias/A122.json`.

### Retorno do C61 — A123 (02/10/2026)

Auto com rejeição persistente por sessão, p95 e alvo de 60 Hz; Alta com resolução dinâmica e limite de 2 MP; pool máximo persistente com faixa fixa de fumaça. Testes JVM de histerese, travamentos, conservação do universo, prefixo/ring e alocação executados; shaders comparados ao protótipo e validados (13/13). Smoke GLES executado no MEmu (1 teste, passou), com imagem lida e sem erro GL após trocas de perfil/resolução. Exploração real abriu e foi capturada; não comprova comparação visual integral, FPS físico, temperatura ou QA sensorial. APK ao fim desta frente com SHA e hash próprios. Evidência: `docs/android/evidencias/A123.json`.

### A124 — rodada sonora suave (02/10/2026)

10 consumos e 6 ambientes originais, 36 shaders compilados. Browser Chromium: vistas/foco/material/evento/jato/reduzido/qualidade, console sem erros, 375px sem overflow; capturas inspecionadas. Offline48k estéreo mediu consumo -29,89..-18,91dBFS e ambiente -28,21..-26,85dBFS. Escolha01/01 técnica provisória autorizada, escuta física pendente. Corrigido hidden dos interruptores de núcleo na casca compartilhada; cenas aprovadas preservadas.

### A125 — áudio nativo suave

Escolha provisória01 portada em dual-mono; ataques80ms, taper80ms, joelho tanh e transições15ms. Três testes nativos executados no MEmu/exit0; consumo -26,04..-19,34dBFS e maxDelta0,014201 numa rajada12vozes. Escuta/true peak/LUFS A118 pendentes.

### A126 — ambiente nativo

Maré grave01 ligada por padrão, bus música independente e crossfade4s por faixa. Música>0 com sinal e0% silenciosa em teste nativo executado; AudioOutputTest confirma slider/mute/defaults. Escuta física A118 pendente.

### A127 — escala real

Curva log por partes/inversa de D12 testada nas âncoras e4001 massas/fronteiras, classes, raio Schwarzschild e entradas inválidas. Sem alteração da identidade ou simulação. Indicadores físicos/visuais pendentes após A131.

### A128 — catálogo real

18 classes genéricas/21 nomeados, IDs estáveis e tipos externalizados. Fontes primárias/definições/estimativas em docs/android/astros-reais.md; dados assumidos não apresentados como medidos. JVM cobre unidades/inversa/horizontes/IDs/classes. QA visual e físico pendente.

## A129 — população relativa e migração

Implementação usa RealScale/KnownObjects com tipo/ID fixos, massa proporcional, 50 centros iniciais e reposição fora da câmera. Nove cenários JVM de deslocamento mediram média40,2–51,5; build e testes core/app executados com XML novos. Migração JSON/UMBRv1→v2 sem RNG/recriação, round-trip/checkpoint/backup e captura em curso exercitados; nenhum gate físico/visual aprovado. A130 porta aparência dos tipos; A131 mostra nomes/medidas.

## A130 — tipos astronômicos e seleção visível

GLSL portado da galeria planetas, tipo fixo A129 aplicado nos três consumidores, cores de matéria existentes e seleção visível antes do limite. Testes de geometria contra fonte e seleção/identidade executados; smoke GLES MEmu API31 executou18 sólidos mais pipeline/perfis/resolução (1 teste,0,72s,0 falhas/GL_NO_ERROR). Remanescentes16/17 são extensões com base existente, aceite sensorial pendente; nenhuma validação física/gate aprovada.

## A131 — HUD compacto e rótulos

Três linhas caption Obsidiana abaixo de UMBRA (massa · ⌀ horizonte, comparação ≈ com fio de 1 dp, tempo), fundo `background` a 91%, cores `textPrimary`/`textSecondary`/`borderDecorative`; rótulos de astros nomeados no mesmo estilo. Executado no MEmu API31: `ExplorationScreenTest` 5/5 (HUD sem região viva, reflow retrato/paisagem com fonte 1,3×, aviso nomeado Polite), `GlContextLossTest` e `RotationSessionTest`; capturas em `docs/android/evidencias/A131/`. Revisão visual no aparelho, TalkBack real e fonte ampliada do sistema continuam pendentes; nenhum gate aprovado.

## A132–A136 — segundo retorno do C61

Galerias rodada 2: `hud.html` (15, DOM sobre capturas reais), `sons-ambiente.html` (10) e `sons-consumo.html` (10); validador da skill sem erros, 22 shaders compilados por tema, console limpo e 375 px sem rolagem. Escolhas do usuário: HUD 02 · Régua cósmica, música 08 · Piano etéreo, consumo 07 · Cristal, jato sem som. Régua conferida no MEmu em retrato e paisagem (cores `background` 91 %, `textPrimary`, `textSecondary`, `textMuted`, `borderDecorative`, `borderControl`). Escuta e leitura no C61 pendentes; nenhum gate aprovado.
