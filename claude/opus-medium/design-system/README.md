# Umbra / Obsidiana — design system 1.0.0

Direção **02 · Obsidiana**, escolhida pelo usuário em 30/09/2026. Este pacote especifica a apresentação do futuro jogo Android; não implementa o aplicativo, a física ou a persistência de universo.

## Arquivos e fonte de verdade

- `obsidiana.html`: UI kit autossuficiente, com telas, estados, componentes, animação e áudio demonstrativo. Pode abrir diretamente em navegador; nenhum asset depende de internet.
- `tokens.json`: valores canônicos de cor, dimensão, tipografia, movimento, cena e som. Formato próprio, com unidades declaradas; não promete compatibilidade com uma especificação externa de tokens.
- `icons.svg`: 12 símbolos vetoriais originais, incorporados também no HTML. Grade de 24 × 24, traço de 1,5 unidades; usar em 20 dp dentro de alvo de 48 dp.
- `../scripts/build_obsidiana.py`: incorpora os tokens e o sprite no HTML e reaproveita o renderer demonstrativo do planejamento. Executar após alterar tokens, ícones ou renderer.

## Identidade e composição

**Contraste e precisão:** espaço quase negro, luz marfim/âmbar, disco estreito, arcos de Gargantua, poucos rastros. Interface sans-serif, ações retangulares sem arredondamento e controles de pausa/áudio circulares. O âmbar pertence à matéria, não aos botões.

O jogo é **jogável em retrato e em paisagem** (`layout.orientation`), girando a qualquer momento sem perder sessão, áudio ou contexto (decisão de 02/10/2026). O tamanho do núcleo vale sobre a **menor dimensão** da área útil (`layout.coreSizeBasis`); em paisagem, isso equivale à altura. Girar reajusta a escala em 600 ms, sem salto nem zoom instantâneo.

Abertura em paisagem: núcleo à esquerda e menu alinhado à direita. Abertura em retrato (`layout.openingPortrait`): núcleo no terço superior e menu embaixo, ocupando a largura útil com margem de 16 dp. Exploração, nas duas orientações: núcleo acompanhado no centro, pausa e áudio no canto superior final; marca discreta no canto inicial; instrução embaixo. Não há pontuação, tarefa ou derrota. Por decisão de 02/10/2026 (D11), a exploração mostra um HUD informativo, sempre visível e compacto, abaixo da marca: massa em M☉, diâmetro do horizonte, maior astro conhecido superado com o próximo marco em fio fino e tempo de jogo, em texto Obsidiana pequeno (marfim, nunca âmbar). Astros nomeados recebem nome discreto ao aparecer e aviso breve ao serem consumidos, sem flash nem fanfarra. O menu não pode cobrir o buraco negro na abertura.

Matéria pode usar `render.matterColors` (gelo, lava, oceano, terra, deserto, gás violeta, estrelas azul e vermelha, nebulosa rosada), dessaturadas, para dar ampla variedade a planetas, estrelas e nebulosas (decisão de 01/10/2026). Essas cores nunca vão para UI, núcleo, disco ou arcos.

Painéis são **opacos**, com scrim escuro. Sem vidro, gradação colorida de botão, efeito neon na UI ou sombras de cards volumosas. O contorno decorativo `#353B44` não deve ser a única pista de que algo pode ser tocado; usar `borderControl` ou `accent` em controles.

## Tipografia, tamanho e acesso

Android usa sans-serif do sistema (`FontFamily.Default`), com tamanhos em **sp** e dimensões em **dp**. O HTML usa Arial/Helvetica para representar a linguagem; não garante métricas iguais em diferentes fabricantes. Nenhuma fonte externa é necessária.

Marca em 48/56 sp, peso 400, tracking de 4 sp; reduzir para 36 sp em altura compacta. Títulos em 28/36 sp; corpo em 16/24 sp; rótulos em 14/20 sp. Caixa alta fica restrita à marca e às etiquetas curtas. Instruções não usam somente caption de 12 sp.

Botão principal: contorno marfim de 1 dp, altura de 52 dp, raio zero. Secundários e textuais: altura de 48 dp. Ícone circular de 44 dp fica dentro de alvo de 48 dp. Focus: contorno de 2 dp e afastamento de 4 dp. Pressionado: fundo `surfacePressed` por 120 ms. Desabilitado: cor específica e razão legível próxima; não representar somente por uma alteração de cor.

Aplicar insets reais de sistema, corte de câmera e barras de navegação. Margem base de 24 dp; 16 dp em paisagem compacta. Painel de até 400 dp, com rolagem se não couber. Fonte ampliada deve provocar reflow; não fixar a escala de fonte nem truncar botão de recuperação. Menus têm semântica TalkBack, descriptions de ícones, labels e valores dos sliders. O jogo por gesto não é apresentado como plenamente acessível a leitor de tela; isso requer desenho e validação próprios.

## Contratos de tela e estado

| Contexto | Ação principal | Comportamento |
|---|---|---|
| Abertura nova | Começar | Uma frase de instrução; sem aula bloqueante. |
| Universo salvo | Continuar | Retorna ao estado salvo; sem recompensa por ausência. |
| Exploração | Pausar | Ícone sempre alcançável. Primeiro gesto dispensa a instrução. |
| Pausa | Continuar | Congelar simulação; fade de áudio de 250 ms. |
| Ajustes | Voltar | Música/efeitos separados, vibração, movimento reduzido, qualidade, ajuda e créditos. Voltar retorna à origem. |
| Carregamento | — | Preparando seu universo; sem porcentagem fictícia. |
| Falha de carregamento | Tentar novamente | Motivo legível e ação de retorno, sem tela preta silenciosa. |
| Falha de save | Tentar salvar novamente | Mensagem persistente e sessão em memória preservada. Nunca declarar sucesso sem conclusão. |
| Backup restaurado | Continuar | Explicar que a cópia anterior válida foi usada. |
| Ajuda | Voltar | Frase curta de controle; não reinicia universo. |
| Créditos | Voltar | Autoria, licença e origem dos assets finais; sem inventar contribuidores. |

Botões em operação exibem rótulo explícito (`Salvando…`) e indicador discreto; não piscam. A mensagem de erro permanece até resolução ou saída deliberada. A gravação concluída usa confirmação discreta e nunca fanfarra. O UI kit simula esses estados e identifica que não está gravando um save nativo.

## Movimento, renderização e som

- Interface: easing `(0.2, 0, 0, 1)`, entrada de painel 220 ms, saída 180 ms, crossfade 350 ms. Sem escala elástica ou overshoot.
- Câmera: easing `(0.4, 0, 0.2, 1)`, mudança de escala em 6 s; parar após soltar em aproximadamente 600 ms. Não sacudir a câmera.
- Movimento reduzido: sem paralaxe, granulação, lente animada ou ondulação decorativa; crossfade de tela de 120 ms. Trajetórias essenciais permanecem; câmera continua suave, sem salto.
- A cena roda somente em primeiro plano e fora de pausa/ajustes. A troca de qualidade visual não pode alterar massa, velocidade ou gravidade.
- Núcleo ocupa inicialmente 12%–24% da altura útil durante jogo. Preservar núcleo, disco e arcos em todos os perfis; reduzir fundo, brilho e partículas primeiro.
- Tetos iniciais de partículas (8.000/4.000/1.600) são orçamento para teste, não capacidade demonstrada. Nenhuma medição do HTML comprova GPU, bateria ou 60 FPS no Android.
- **Render v2 (02/10/2026, Protótipo 2):** matéria em partículas na GPU, cena HDR com bloom e lente só na camada de trás.
  - `render.particles.budgets`: 14.000 / 32.000 / 64.000 partículas (Econômica / Equilíbrio / Alta), escala de render 0,6 / 0,75 / 1,0, 4 / 5 / 6 mips de bloom e 18 / 26 / 34 corpos sólidos. Status "a medir" em Adreno e Mali; os números podem cair no gate físico.
  - `render.bloom`: limiar 1,0 em RGBA16F ou 0,7 em RGBA8, joelho 0,5, intensidade 0,6, exposição 1,1, gama 0,9, vinheta 0,35.
  - `render.lens`: anel de Einstein em 1,55 R; sombra macia de 0,88 a 1,06 R; halo em 1,06 R e fio em 1,02 R.
  - `render.growthBand`: o diâmetro do núcleo vai de 12% a 24% da **menor dimensão** dentro de cada faixa (limites de massa 4 / 32 / 256 / 2048, depois cada ×8); cada absorção incha 5%; suavização τ de 800 ms.
  - `render.jets`: um jato a cada 4 absorções, intervalo mínimo de 12 s, duração de 8 s, só visual.
- Áudio: timbres limpos, graves suaves e intervalos longos. Agrupar eventos em 120 ms e limitar inicialmente a 12 vozes de efeitos. Crescimento enriquece timbre, sem escalada de volume/tensão.
- Música 50%, efeitos 55%, vibração desligada por padrão. O app Android inicia com som (`audio.mutedDefault`, decisão de 01/10/2026), sujeito a foco de áudio; o UI kit HTML continua iniciando silencioso. Android deve respeitar foco de áudio e desligamento de fone; Bluetooth não tem garantia de baixa latência.
- Meta inicial de mixagem: −20 LUFS integrado e pico verdadeiro até −1 dBTP, a medir na produção final. Usar síntese original e CC0 verificado com inventário de assets.

## Handoff para implementação nativa

| Token | Consumidor futuro | Unidade |
|---|---|---|
| `colors` | Cores semânticas da UI; uniforms para matéria/cena | sRGB; converter para espaço linear quando o passe exigir |
| `typography.styles` | `TextStyle` / `Typography` Compose | sp |
| `spacingDp`, `shapesDp`, `components` | Layout, hit targets, bordas e formas | dp |
| `motionMs`, `motion` | Animações de UI e câmera | ms / curva Bézier |
| `render` | Configuração do renderer GLES 3.0 | normalizado; números com status de calibração |
| `audio` | Configuração de mixagem e eventos Oboe | Hz, ganho normalizado, ms e vozes |

Não copiar CSS como código Compose ou GLSL. Os tokens representam intenção; a integração precisa validar fonte ampliada, insets, lifecycle, rebuild do contexto GPU e callback de áudio. Nenhuma classe Kotlin, dependência ou versão de ferramenta foi instalada neste pacote.

## Validação e critérios de passagem

O builder verifica cores de texto e controles sobre os fundos de UI contra os mínimos de 4,5:1 / 3:1. Contornos decorativos e controles desabilitados não são tratados como pares de controle ativo. As medições numéricas dos tokens não substituem medir a composição sobre cena: a UI usa scrim/painel opaco para tornar o fundo previsível.

No navegador: testar telas, estados, sliders, switches, seleção de qualidade, modo reduzido, exportação dos tokens, teclado, áudio opt-in e layouts desktop/estreito. O UI kit possui artboard em escala: o usuário deve usar os controles do laboratório em tela estreita; o tamanho reduzido do artboard não equivale a hit target nativo.

No Android, ainda pendente: menus com TalkBack; fonte ampliada; Adreno/Mali; 20 min após aquecimento; meta de 60 FPS e p95 até 20 ms; mixagem em fones/alto-falante/Bluetooth; falha/recuperação de save; perda de foco e recriação de superfície. Só então validar os budgets de renderização e os parâmetros de sensação do jogo.

## Referências técnicas

- [Android — acessibilidade e alvos de toque](https://developer.android.com/guide/topics/ui/accessibility/apps)
- [Android — OpenGL ES](https://developer.android.com/develop/ui/views/graphics/opengl/about-opengl)
- [Android — Oboe](https://developer.android.com/games/sdk/oboe)
- [DNEG — lente e silhueta de Gargantua](https://www.dneg.com/news/gravitational-lensing-by-spinning-black-holes)
- [WCAG — contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG — contraste de componentes](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

O nome **Umbra** foi escolhido pelo usuário em 30/09/2026. O design system define a linguagem da direção escolhida; regras de física, pesos e curva de crescimento continuam sujeitos ao protótipo definido no planejamento.
