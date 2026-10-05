# 🕳️ UMBRA — Plano Completo de Desenvolvimento

> **Modelo que gerou este plano:** Claude Opus 4.6 (Thinking) — Antigravity IDE  
> **Data de geração:** 2026-10-05  
> **Objetivo:** Construir o jogo UMBRA como aplicação web usando **Node.js** (backend) + **Vue.js** (frontend), aplicando fielmente o design system **Obsidiana 1.0.0**.

---

## 📋 Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Resumo do Design System Obsidiana](#2-resumo-do-design-system-obsidiana)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Atividades Atômicas e Commits](#5-atividades-atômicas-e-commits)
6. [Referências dos Tokens](#6-referências-dos-tokens)

---

## 1. Visão Geral do Projeto

**UMBRA** é um jogo contemplativo de buraco negro. O jogador controla um buraco negro que se move pelo espaço, atraindo e absorvendo matéria cósmica (poeira, asteroides, planetas, estrelas, galáxias). Não há derrota, metas rígidas ou tempo limite — o objetivo é explorar e crescer.

### Regras fundamentais do jogo

- O buraco negro segue o dedo/mouse e freia suavemente ao soltar (600 ms)
- Matéria próxima entra em órbita e pode ser absorvida
- O crescimento é logarítmico: o núcleo ocupa de 12% a 24% da altura útil
- Faixas de escala: Poeira → Asteroides → Planetas → Sistemas → Galáxias (cada ×8 de massa depois)
- A cada 4 absorções um jato visual é disparado (intervalo mínimo 12 s)
- HUD compacto: massa, diâmetro do horizonte, comparação com astro real, tempo de jogo
- Sem pontuação, sem derrota, sem recompensa por ausência
- Jogável em retrato e paisagem, com transição suave de 600 ms

### Telas/Estados

| Tela | Ação Principal | Descrição |
|------|---------------|-----------|
| Abertura (nova) | Começar | Frase de instrução; sem tutorial bloqueante |
| Abertura (salva) | Continuar | Retorna ao estado salvo |
| Exploração | Pausar | Ícone sempre alcançável; primeiro gesto dispensa instrução |
| Pausa | Continuar | Congela simulação; fade de áudio 250 ms |
| Ajustes | Voltar | Música/efeitos/vibração/mov. reduzido/qualidade |
| Carregamento | — | "Preparando seu universo"; sem porcentagem fictícia |
| Falha de carregamento | Tentar novamente | Motivo legível e ação de retorno |
| Falha de save | Tentar salvar novamente | Mensagem persistente, sessão preservada |
| Backup restaurado | Continuar | Explicar recuperação |
| Ajuda | Voltar | Frase curta de controle |
| Créditos | Voltar | Autoria e licença |

---

## 2. Resumo do Design System Obsidiana

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#030508` | Espaço profundo / fundo do app |
| `surface` | `#090D13` | Painéis opacos (pausa, ajustes) |
| `surfaceRaised` | `#111823` | Seletores e áreas elevadas |
| `surfacePressed` | `#202631` | Fundo temporário de controles pressionados |
| `textPrimary` | `#FAF8F2` | Títulos, corpo e ações principais |
| `textSecondary` | `#BBC2CC` | Descrições e informações de apoio |
| `textMuted` | `#949CA9` | Legenda legível |
| `accent` | `#E9E4D9` | Contorno da ação principal, foco, seleção |
| `borderDecorative` | `#353B44` | Divisores e contornos decorativos |
| `borderControl` | `#8A929F` | Contornos de controles interativos |
| `success` | `#A9C7B5` | Confirmação |
| `error` | `#E8B0A9` | Mensagem de falha |
| `disabledText` | `#626B79` | Controle indisponível |
| `diskWarm` | `#EEB676` | Matéria e brilho âmbar (NÃO para UI) |
| `diskMid` | `#DDD8CC` | Filamentos marfim |
| `diskHot` | `#FAF8F2` | Regiões luminosas do disco |
| `core` | `#000000` | Núcleo do buraco negro |

### Cores de Matéria (só para objetos celestes, NUNCA para UI)

| Token | Hex | Tipo |
|-------|-----|------|
| `ice` | `#A9C8D8` | Gelo |
| `lava` | `#D2714E` | Lava |
| `ocean` | `#4F8E8A` | Oceano |
| `land` | `#8C9A6A` | Terra |
| `desert` | `#CDA77C` | Deserto |
| `gasViolet` | `#9C8CC0` | Gás violeta |
| `starBlue` | `#B4CBF2` | Estrela azul |
| `starRed` | `#E0896B` | Estrela vermelha |
| `nebulaRose` | `#C090A8` | Nebulosa rosada |

### Tipografia

| Estilo | Tamanho | Altura | Peso | Tracking | Uso |
|--------|---------|--------|------|----------|-----|
| display | 48px | 56px | 400 | 4px | Marca UMBRA |
| title | 28px | 36px | 400 | 0.4px | Título de pausa/ajustes |
| section | 20px | 28px | 500 | 0px | Grupos de configuração |
| body | 16px | 24px | 400 | 0px | Descrição e instruções |
| label | 14px | 20px | 500 | 0.2px | Botões e rótulos |
| caption | 12px | 18px | 400 | 0.2px | Texto auxiliar |
| overline | 12px | 18px | 500 | 1.5px | Assinatura curta |

### Espaçamento (dp/px)

`xs: 4` · `sm: 8` · `md: 12` · `lg: 16` · `xl: 24` · `xxl: 32` · `xxxl: 48` · `hero: 64`

### Formas

- **Raio de ação/painel/seletor:** 0px (retangular)
- **Ícone visual:** raio 22px, tamanho 44px dentro de alvo de 48px
- **Foco:** contorno 2px, offset 4px
- **Borda:** 1px

### Animações

| Propriedade | Duração | Curva |
|-------------|---------|-------|
| Pressão | 120 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Entrada de painel | 220 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Saída de painel | 180 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Crossfade de tela | 350 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Câmera (escala) | 6000 ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Freio ao soltar | 600 ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

### Proibições de Movimento

- ❌ Sacudir câmera
- ❌ Flash branco
- ❌ Estrobo
- ❌ Fanfarra de crescimento
- ❌ Zoom instantâneo

### Componentes

| Componente | Altura | Borda | Raio | Detalhes |
|------------|--------|-------|------|----------|
| Botão primário | 52px | accent | 0 | Min-width 160px, padding-h 24px |
| Botão secundário | 48px | borderControl | 0 | Padding-h 20px |
| Botão textual | 48px | nenhuma | 0 | Transparente |
| Ícone circular | 44px (alvo 48px) | borderControl | 22px | Glyph 20px |
| Slider | 48px (alvo) | — | — | Track 2px, thumb 16px |
| Switch | 48px (alvo) | — | — | 40×24px, retangular |

### Ícones SVG (12 símbolos, grade 24×24, traço 1.5)

`pause` · `play` · `back` · `close` · `volume` · `muted` · `settings` · `help` · `check` · `retry` · `arrow` · `file`

### Textos Canônicos (Copy)

| Chave | Texto |
|-------|-------|
| brand | UMBRA |
| opening | Deslize. Observe. Permaneça. |
| instruction | Deslize para explorar. Solte para observar. |
| pauseTitle | Uma pausa. |
| pauseBody | Continue quando quiser. |
| settingsTitle | Seu ritmo. |
| saveError | Não foi possível salvar agora. Seu universo continua aberto. |
| recovery | O último arquivo não pôde ser lido. Recuperamos a cópia anterior válida. |

**Palavras proibidas no copy:** "Corra", "Complete", "Bata o recorde", "Não perca sua sequência", "Resgate a recompensa".

---

## 3. Stack Tecnológica

| Camada | Tecnologia | Versão mínima |
|--------|-----------|---------------|
| Frontend | Vue.js 3 (Composition API) | 3.4+ |
| Build tool | Vite | 5+ |
| Renderização | Canvas 2D + WebGL 2 (via `<canvas>`) | — |
| Áudio | Web Audio API | — |
| Backend | Node.js + Express | Node 20+ |
| Banco de dados | SQLite (via `better-sqlite3`) | — |
| API | REST JSON | — |
| Testes | Vitest (front) + supertest (back) | — |
| Linguagem | JavaScript/TypeScript | — |

---

## 4. Estrutura de Pastas

```
umbra-game/
├── package.json                  # Raiz do monorepo (workspaces)
├── design-system/                # Pasta existente (referência, NÃO editar)
│
├── server/                       # Backend Node.js
│   ├── package.json
│   ├── src/
│   │   ├── index.js              # Entrada do servidor Express
│   │   ├── routes/
│   │   │   ├── universe.js       # CRUD de universos (save/load)
│   │   │   ├── settings.js       # Preferências do jogador
│   │   │   └── leaderboard.js    # Marcos de crescimento
│   │   ├── db/
│   │   │   ├── schema.sql        # Esquema SQLite
│   │   │   └── connection.js     # Pool de conexão
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Tratamento centralizado de erros
│   │   │   └── validate.js       # Validação de payloads
│   │   └── utils/
│   │       └── physics.js        # Constantes e cálculos de escala
│   └── tests/
│       └── universe.test.js
│
├── client/                       # Frontend Vue.js
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── icons.svg             # Sprite de ícones copiado do design-system
│   ├── src/
│   │   ├── main.js               # Entrada Vue
│   │   ├── App.vue               # Componente raiz
│   │   ├── assets/
│   │   │   ├── tokens.css        # Variáveis CSS do design-system
│   │   │   └── tokens.json       # Tokens JSON importados
│   │   ├── styles/
│   │   │   ├── reset.css         # CSS reset
│   │   │   ├── typography.css    # Classes tipográficas
│   │   │   ├── components.css    # Estilos de componentes
│   │   │   ├── animations.css    # Transições e keyframes
│   │   │   └── responsive.css    # Breakpoints portrait/landscape
│   │   ├── composables/
│   │   │   ├── useGameLoop.js    # requestAnimationFrame + delta time
│   │   │   ├── usePhysics.js     # Gravitação, órbita, absorção
│   │   │   ├── useRenderer.js    # Canvas WebGL/2D
│   │   │   ├── useAudio.js       # Web Audio API
│   │   │   ├── useOrientation.js # Portrait/landscape detector
│   │   │   ├── useInput.js       # Touch/mouse/keyboard
│   │   │   ├── useSave.js        # Comunicação com backend
│   │   │   └── usePreferences.js # Estado de configurações
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── ObsButton.vue
│   │   │   │   ├── ObsIconButton.vue
│   │   │   │   ├── ObsSlider.vue
│   │   │   │   ├── ObsSwitch.vue
│   │   │   │   ├── ObsQualitySelector.vue
│   │   │   │   ├── ObsPanel.vue
│   │   │   │   ├── ObsMessage.vue
│   │   │   │   ├── ObsIcon.vue
│   │   │   │   └── ObsToast.vue
│   │   │   ├── screens/
│   │   │   │   ├── OpeningScreen.vue
│   │   │   │   ├── GameScreen.vue
│   │   │   │   ├── PauseScreen.vue
│   │   │   │   ├── SettingsScreen.vue
│   │   │   │   ├── LoadingScreen.vue
│   │   │   │   ├── ErrorScreen.vue
│   │   │   │   ├── RecoveryScreen.vue
│   │   │   │   ├── HelpScreen.vue
│   │   │   │   └── CreditsScreen.vue
│   │   │   └── game/
│   │   │       ├── GameCanvas.vue
│   │   │       ├── GameHud.vue
│   │   │       └── GameControls.vue
│   │   └── stores/
│   │       ├── gameStore.js      # Estado do jogo (Pinia)
│   │       └── uiStore.js        # Estado da UI
│   └── tests/
│       └── components/
│           └── ObsButton.test.js
```

---

## 5. Atividades Atômicas e Commits

> **Instruções para o modelo executor:** Execute cada atividade na ordem. Cada atividade resulta em exatamente **um commit**. O código de cada commit deve compilar e não quebrar nenhum teste anterior. Use a mensagem de commit indicada. Não pule atividades. Quando houver código, implemente o código **completo**, não use placeholders como `// TODO`.

---

### FASE 1 — Scaffolding e Infraestrutura

---

#### ✅ Atividade 01: Inicializar monorepo e workspace root

**Objetivo:** Criar a raiz do projeto com workspace configuration.

**Passos:**
1. Na pasta `umbra-game/` (criar na raiz do workspace, ao lado de `design-system/`), criar `package.json`:
```json
{
  "name": "umbra-game",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client"
  }
}
```
2. Instalar `concurrently` como devDependency na raiz.
3. Criar `.gitignore` com `node_modules/`, `dist/`, `*.db`, `.env`.
4. Executar `git init` e fazer o commit inicial.

**Commit:** `feat: inicializar monorepo com workspaces client e server`

---

#### ✅ Atividade 02: Criar projeto Vue.js com Vite

**Objetivo:** Scaffolding do frontend Vue 3.

**Passos:**
1. Executar `npx -y create-vite@latest client/ --template vue` dentro de `umbra-game/`.
2. Dentro de `client/`, instalar dependências: `npm install pinia vue-router@4`.
3. Instalar devDependencies: `npm install -D vitest @vue/test-utils jsdom`.
4. Configurar `vite.config.js` com proxy para o backend:
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  test: {
    environment: 'jsdom'
  }
})
```
5. Limpar os arquivos padrão gerados pelo Vite (remover `HelloWorld.vue`, estilo padrão, etc.).

**Commit:** `feat: scaffolding do frontend Vue 3 com Vite, Pinia e Vue Router`

---

#### ✅ Atividade 03: Criar projeto backend Node.js + Express

**Objetivo:** Scaffolding do backend.

**Passos:**
1. Criar `server/package.json`:
```json
{
  "name": "umbra-server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "test": "node --test tests/"
  }
}
```
2. Instalar: `express`, `cors`, `better-sqlite3`, `helmet`.
3. Criar `server/src/index.js` com servidor Express básico:
   - CORS habilitado
   - JSON body parser
   - Helmet para segurança
   - Health check em `GET /api/health`
   - Escutar na porta `3000` (ou `process.env.PORT`)
4. Verificar que `npm run dev:server` inicia sem erros.

**Commit:** `feat: scaffolding do backend Node.js com Express, CORS e Helmet`

---

#### ✅ Atividade 04: Configurar banco de dados SQLite

**Objetivo:** Criar esquema do banco e módulo de conexão.

**Passos:**
1. Criar `server/src/db/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS universes (
  id TEXT PRIMARY KEY,
  player_name TEXT DEFAULT 'Explorador',
  mass REAL DEFAULT 1.0,
  position_x REAL DEFAULT 0.0,
  position_y REAL DEFAULT 0.0,
  scale_band INTEGER DEFAULT 0,
  absorptions INTEGER DEFAULT 0,
  jets_fired INTEGER DEFAULT 0,
  play_time_seconds REAL DEFAULT 0.0,
  bodies_data TEXT DEFAULT '[]',
  preferences TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  universe_id TEXT NOT NULL,
  band_name TEXT NOT NULL,
  mass_at_milestone REAL NOT NULL,
  reached_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (universe_id) REFERENCES universes(id)
);
```
2. Criar `server/src/db/connection.js`:
   - Importar `better-sqlite3`
   - Criar/abrir `umbra.db` na pasta `server/data/`
   - Executar `schema.sql` no init com `pragma journal_mode = WAL`
   - Exportar instância do db

**Commit:** `feat: configurar SQLite com esquema de universos e milestones`

---

### FASE 2 — Design System no Frontend

---

#### ✅ Atividade 05: Importar tokens CSS do design system

**Objetivo:** Trazer as variáveis CSS do Obsidiana para o projeto Vue.

**Passos:**
1. Copiar `design-system/tokens.css` para `client/src/assets/tokens.css`.
2. Copiar `design-system/tokens.json` para `client/src/assets/tokens.json`.
3. Copiar `design-system/icons.svg` para `client/public/icons.svg`.
4. Criar `client/src/styles/reset.css` com reset mínimo:
   - `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
   - `html, body { height: 100%; overflow: hidden; }`
   - `body { background: var(--obs-background); color: var(--obs-text-primary); font-family: var(--obs-font); }`
   - `-webkit-font-smoothing: antialiased;`
5. Importar `tokens.css` e `reset.css` no `main.js`.

**Commit:** `feat: importar tokens CSS, JSON e ícones do design system Obsidiana`

---

#### ✅ Atividade 06: Criar classes tipográficas CSS

**Objetivo:** Implementar todas as classes de tipografia do design system.

**Passos:**
1. Criar `client/src/styles/typography.css` com as classes exatamente conforme o design system:
```css
.type-display {
  font-family: var(--obs-font);
  font-size: 48px;
  line-height: 56px;
  font-weight: 400;
  letter-spacing: 4px;
}
.type-display--compact {
  font-size: 36px;
  line-height: 44px;
}
.type-title {
  font-family: var(--obs-font);
  font-size: 28px;
  line-height: 36px;
  font-weight: 400;
  letter-spacing: 0.4px;
}
.type-section {
  font-family: var(--obs-font);
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  letter-spacing: 0px;
}
.type-body {
  font-family: var(--obs-font);
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: 0px;
}
.type-label {
  font-family: var(--obs-font);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.type-caption {
  font-family: var(--obs-font);
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  letter-spacing: 0.2px;
}
.type-overline {
  font-family: var(--obs-font);
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
```
2. Importar `typography.css` no `main.js`.

**Commit:** `feat: criar classes tipográficas Obsidiana completas`

---

#### ✅ Atividade 07: Criar CSS de animações e transições

**Objetivo:** Implementar todas as animações do design system.

**Passos:**
1. Criar `client/src/styles/animations.css`:
```css
:root {
  --obs-ease: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --obs-ease-camera: cubic-bezier(0.4, 0.0, 0.2, 1.0);
}

/* Transições de painel */
.panel-enter-active {
  transition: opacity 220ms var(--obs-ease), transform 220ms var(--obs-ease);
}
.panel-leave-active {
  transition: opacity 180ms var(--obs-ease), transform 180ms var(--obs-ease);
}
.panel-enter-from { opacity: 0; transform: translateY(12px); }
.panel-leave-to { opacity: 0; transform: translateY(-8px); }

/* Crossfade de tela */
.screen-enter-active {
  transition: opacity 350ms var(--obs-ease);
}
.screen-leave-active {
  transition: opacity 350ms var(--obs-ease);
}
.screen-enter-from, .screen-leave-to { opacity: 0; }

/* Estado pressionado */
.press-feedback {
  transition: background-color 120ms var(--obs-ease);
}
.press-feedback:active {
  background-color: var(--obs-surface-pressed);
}

/* Spinner de carregamento */
@keyframes obs-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--obs-border-decorative);
  border-top-color: var(--obs-accent);
  border-radius: 50%;
  animation: obs-spin 1s linear infinite;
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active {
    transition-duration: 0ms;
  }
  .screen-enter-active,
  .screen-leave-active {
    transition-duration: 120ms;
  }
}
.reduced-motion .panel-enter-active,
.reduced-motion .panel-leave-active {
  transition-duration: 0ms;
}
.reduced-motion .screen-enter-active,
.reduced-motion .screen-leave-active {
  transition-duration: 120ms;
}
```
2. Importar no `main.js`.

**Commit:** `feat: criar animações e transições conforme tokens de movimento Obsidiana`

---

#### ✅ Atividade 08: Criar CSS responsivo (portrait/landscape)

**Objetivo:** Implementar layout adaptativo conforme as regras do design system.

**Passos:**
1. Criar `client/src/styles/responsive.css`:
   - **Landscape (default):** Núcleo à esquerda (posição 30%, 50%), menu alinhado à direita, margem 24px, painel max-width 400px.
   - **Portrait (`@media (orientation: portrait)`):** Núcleo no terço superior (50%, 30%), menu embaixo ocupando largura útil com margem 16px.
   - **Compact (`@media (max-height: 500px)`):** display compacto (36px em vez de 48px para marca).
   - Margem base 24px; 16px em landscape compacta (`@media (max-height: 400px)`).
   - Painel max-width 400px com scroll on overflow.
   - O menu **nunca** cobre o buraco negro na abertura.
2. Importar no `main.js`.

**Commit:** `feat: criar layout responsivo portrait/landscape conforme tokens de layout`

---

### FASE 3 — Componentes UI Vue.js

---

#### ✅ Atividade 09: Componente ObsIcon

**Objetivo:** Wrapper para ícones SVG do sprite.

**Passos:**
1. Criar `client/src/components/ui/ObsIcon.vue`:
   - Props: `name` (string, required), `size` (number, default 20), `label` (string, default '')
   - Template: `<svg>` com `<use>` apontando para `href="/icons.svg#obs-{name}"`
   - Se `label` vazio, `aria-hidden="true"`; se preenchido, `role="img"` + `aria-label`
   - Estilo: `width` e `height` conforme prop `size`, `stroke: currentColor`, `fill: none`, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`

**Commit:** `feat: criar componente ObsIcon com sprite SVG do design system`

---

#### ✅ Atividade 10: Componente ObsButton

**Objetivo:** Botão conforme especificação de componentes.

**Passos:**
1. Criar `client/src/components/ui/ObsButton.vue`:
   - Props: `variant` ('primary' | 'secondary' | 'text'), `disabled`, `loading`, `loadingText` (default 'Aguarde…'), `fullWidth`
   - Emits: `click`
   - Template: `<button>` com slot para conteúdo
   - Estilos conforme design system:
     - **Primary:** height 52px, min-width 160px, padding-h 24px, border 1px `accent`, color `accent`, bg transparent, radius 0
     - **Secondary:** height 48px, padding-h 20px, border 1px `borderControl`, color `textSecondary`, bg transparent, radius 0
     - **Text:** height 48px, color `textSecondary`, bg transparent, sem borda, radius 0
   - Estado `pressed` (`:active`): bg `surfacePressed` por 120ms com easing `var(--obs-ease)`
   - Estado `focus-visible`: contorno 2px com offset 4px, cor `accent`
   - Estado `disabled`: cor `disabledText`, cursor `not-allowed`
   - Estado `loading`: texto muda para `loadingText`, `aria-busy="true"`, botão desabilitado
   - Classe `press-feedback` para efeito de pressão
   - Font: `type-label`

**Commit:** `feat: criar componente ObsButton com variantes primary/secondary/text`

---

#### ✅ Atividade 11: Componente ObsIconButton

**Objetivo:** Botão circular para ícones (pausa, áudio).

**Passos:**
1. Criar `client/src/components/ui/ObsIconButton.vue`:
   - Props: `icon` (string), `label` (string, required para acessibilidade)
   - Emits: `click`
   - Alvo de toque: 48px, visual: 44px, glyph: 20px
   - Borda 1px `borderControl`, raio 22px
   - Focus-visible: contorno 2px offset 4px, cor `accent`
   - Pressed: bg `surfacePressed` por 120ms
   - Usar `<ObsIcon>` internamente com size 20
   - `aria-label` obrigatório (via prop `label`)

**Commit:** `feat: criar componente ObsIconButton circular com acessibilidade`

---

#### ✅ Atividade 12: Componente ObsSlider

**Objetivo:** Slider para música e efeitos.

**Passos:**
1. Criar `client/src/components/ui/ObsSlider.vue`:
   - Props: `modelValue` (number), `label` (string), `min` (0), `max` (100), `step` (1)
   - Emits: `update:modelValue`
   - Template: `<label>` com:
     - `<span class="type-label">` para o rótulo
     - `<output>` com valor + "%" (sempre visível, `valueAlwaysVisible: true`)
     - `<input type="range">`
   - Alvo de 48px de altura, track de 2px (bg `borderDecorative`, preenchido `accent`), thumb de 16px circular bg `accent`
   - Customizar `input[type=range]`:
     - `::-webkit-slider-runnable-track`: height 2px, bg `borderDecorative`
     - `::-webkit-slider-thumb`: 16px circular, bg `accent`
     - `::-moz-range-track` e `::-moz-range-thumb` equivalentes
   - `aria-label` no input, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

**Commit:** `feat: criar componente ObsSlider com output de valor visível`

---

#### ✅ Atividade 13: Componente ObsSwitch

**Objetivo:** Toggle para vibração e movimento reduzido.

**Passos:**
1. Criar `client/src/components/ui/ObsSwitch.vue`:
   - Props: `modelValue` (boolean), `label` (string), `note` (string, descrição auxiliar)
   - Emits: `update:modelValue`
   - Template: `<label>` com:
     - `<span class="type-body">` para label
     - `<small class="type-caption">` para note
     - `<input type="checkbox" role="switch">` visualmente escondido
     - `<span class="switch-visual">` com indicador deslizante
   - Visual: 40×24px, **retangular** (sem arredondamento, raio 0), indicador desliza com transição suave (120ms)
   - On: fundo `accent`, indicador à direita
   - Off: borda 1px `borderControl`, fundo transparente, indicador à esquerda
   - Label sempre visível
   - Alvo mínimo de toque: 48px (padding ao redor do visual)
   - `aria-checked` dinâmico

**Commit:** `feat: criar componente ObsSwitch retangular com label e nota`

---

#### ✅ Atividade 14: Componente ObsQualitySelector

**Objetivo:** Seletor de qualidade gráfica (Auto/Alta/Econômica).

**Passos:**
1. Criar `client/src/components/ui/ObsQualitySelector.vue`:
   - Props: `modelValue` ('Auto' | 'Alta' | 'Econômica')
   - Emits: `update:modelValue`
   - Template: `<fieldset>` com `<legend class="type-section">` "Qualidade gráfica"
   - 3 `<label>` com `<input type="radio">` cada:
     - Auto, Alta, Econômica
   - Alvo de 48px por opção
   - Selecionado: borda 1px `accent` + bg `surfaceRaised`
   - Não selecionado: borda 1px `borderDecorative` + bg `transparent`
   - Raio: 0px (retangular)
   - Texto: `type-label`, cor `textPrimary` (selecionado) ou `textSecondary`
   - Descrição abaixo do grupo (em `<p class="type-caption">`):
     - Auto: "Auto adapta efeitos ao desempenho. A simulação mantém as mesmas regras."
     - Alta: "Alta preserva mais partículas e resolução auxiliar."
     - Econômica: "Econômica reduz efeitos auxiliares e preserva núcleo, disco e arcos."

**Commit:** `feat: criar componente ObsQualitySelector com 3 perfis`

---

#### ✅ Atividade 15: Componente ObsPanel

**Objetivo:** Painel opaco reutilizável para menus.

**Passos:**
1. Criar `client/src/components/ui/ObsPanel.vue`:
   - Props: `title` (string), `body` (string), `strap` (string, overline opcional, ex: "O UNIVERSO PODE ESPERAR")
   - Slots: `actions` (para botões), `extra` (para spinner ou conteúdo adicional)
   - Template:
     - `div.screen-scrim`: bg `#030508` com alpha 0.84 (scrimColor + scrimAlpha dos tokens)
     - `section.screen-panel`: bg `surface`, max-width 400px, padding 24px (16px em compact), overflow-y auto
     - Se `strap`: `div.type-overline` com o texto
     - `h3.type-title` com o título
     - `p.type-body` com o corpo
     - `<slot name="extra" />`
     - `<slot name="actions" />`
   - Usar `<Transition name="panel">` envolvendo o scrim+panel
   - `role="dialog"` e `aria-modal="true"` na section
   - Focar o primeiro botão ao abrir

**Commit:** `feat: criar componente ObsPanel com scrim e animação de entrada/saída`

---

#### ✅ Atividade 16: Componente ObsMessage

**Objetivo:** Mensagem de erro/sucesso persistente.

**Passos:**
1. Criar `client/src/components/ui/ObsMessage.vue`:
   - Props: `type` ('error' | 'success' | 'info'), `message` (string), `support` (string), `actionLabel` (string)
   - Emits: `action`
   - Template:
     - `div` com bg `surface`, padding 24px
     - `p.type-body` com `message`, cor: `textPrimary`
     - `p.type-caption` com `support`, cor: `textSecondary`
     - Ícone de status: `check` (success), `retry` (error), colorido com `success`/`error`
     - `<ObsButton>` com `actionLabel` (ação obrigatória, `mustIncludeAction: true`)
   - Erro: cor lateral `error`, **sem auto-dismiss** (`noAutoDismissOnError: true`)
   - Sucesso: cor lateral `success`

**Commit:** `feat: criar componente ObsMessage com tipos error/success/info`

---

#### ✅ Atividade 17: Componente ObsToast

**Objetivo:** Notificação temporária discreta.

**Passos:**
1. Criar `client/src/components/ui/ObsToast.vue`:
   - Props: `message` (string), `visible` (boolean), `duration` (number, default 4500)
   - Emits: `dismiss`
   - Aparece na parte inferior da tela, centralizado horizontalmente
   - bg `surfaceRaised`, texto `textSecondary`, padding `lg` (16px), classe `type-caption`
   - Auto-dismiss: `setTimeout` com `duration`, emitir `dismiss`
   - Animação: `<Transition name="panel">` — fade + translate-y de 12px, duração 220ms
   - `role="status"` e `aria-live="polite"`

**Commit:** `feat: criar componente ObsToast com auto-dismiss`

---

### FASE 4 — Stores e Estado

---

#### ✅ Atividade 18: Criar gameStore com Pinia

**Objetivo:** Estado central do jogo.

**Passos:**
1. Registrar Pinia no `main.js`:
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```
2. Criar `client/src/stores/gameStore.js`:
```js
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    mass: 1.0,
    positionX: 0,
    positionY: 0,
    velocityX: 0,
    velocityY: 0,
    scaleBand: 0,
    absorptions: 0,
    jetsFired: 0,
    playTimeSeconds: 0,
    bodies: [],
    coreScreenSize: 0.12,
    bandMassBounds: [4, 32, 256, 2048],
    beyondLastBandFactor: 8,
    bandNames: ['Poeira', 'Asteroides', 'Planetas', 'Sistemas', 'Galáxias'],
    lastJetTime: -Infinity,
    absorptionsSinceJet: 0,
    horizonDiameter: 0,
    knownBodyComparison: '',
    universeId: null,
    hasSave: false,
    isDirty: false,
  }),
  getters: {
    currentBandName(state) {
      const idx = state.scaleBand
      if (idx < state.bandNames.length) return state.bandNames[idx]
      const extra = idx - state.bandNames.length + 1
      return `Galáxias ×${Math.pow(state.beyondLastBandFactor, extra)}`
    },
    schwarzschildRadius(state) {
      return state.mass * 2.95
    },
    coreHeightFraction(state) {
      const lo = 0.12
      const hi = 0.24
      let bandStart, bandEnd
      if (state.scaleBand === 0) {
        bandStart = 0
        bandEnd = state.bandMassBounds[0]
      } else if (state.scaleBand < state.bandMassBounds.length) {
        bandStart = state.bandMassBounds[state.scaleBand - 1]
        bandEnd = state.bandMassBounds[state.scaleBand]
      } else {
        const prev = state.bandMassBounds[state.bandMassBounds.length - 1]
        const extra = state.scaleBand - state.bandMassBounds.length
        bandStart = prev * Math.pow(state.beyondLastBandFactor, extra)
        bandEnd = bandStart * state.beyondLastBandFactor
      }
      const t = Math.log(state.mass / Math.max(bandStart, 0.001)) / Math.log(bandEnd / Math.max(bandStart, 0.001))
      return lo + Math.max(0, Math.min(1, t)) * (hi - lo)
    },
  },
  actions: {
    absorb(bodyMass) {
      this.mass += bodyMass
      this.absorptions += 1
      this.absorptionsSinceJet += 1
      this.isDirty = true
      // Verificar mudança de banda
      let newBand = 0
      for (let i = 0; i < this.bandMassBounds.length; i++) {
        if (this.mass >= this.bandMassBounds[i]) newBand = i + 1
      }
      if (newBand >= this.bandMassBounds.length) {
        const lastBound = this.bandMassBounds[this.bandMassBounds.length - 1]
        let extra = 0
        let threshold = lastBound * this.beyondLastBandFactor
        while (this.mass >= threshold) {
          extra++
          threshold *= this.beyondLastBandFactor
        }
        newBand = this.bandMassBounds.length + extra
      }
      this.scaleBand = newBand
      // Verificar jato
      const now = performance.now()
      if (this.absorptionsSinceJet >= 4 && now - this.lastJetTime >= 12000) {
        this.jetsFired += 1
        this.lastJetTime = now
        this.absorptionsSinceJet = 0
        return { jet: true }
      }
      return { jet: false }
    },
    updatePosition(x, y) {
      this.positionX = x
      this.positionY = y
    },
    tick(deltaSeconds) {
      this.playTimeSeconds += deltaSeconds
    },
    reset() {
      this.$reset()
    },
  }
})
```

**Commit:** `feat: criar gameStore com estado do buraco negro, bandas e absorção`

---

#### ✅ Atividade 19: Criar uiStore com Pinia

**Objetivo:** Estado da interface e preferências.

**Passos:**
1. Criar `client/src/stores/uiStore.js`:
```js
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    currentScreen: 'home',
    previousScreen: null,
    settingsOrigin: 'home',
    infoOrigin: 'home',
    showInstruction: true,
    musicVolume: 50,
    effectsVolume: 55,
    vibrationEnabled: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    qualityProfile: 'Auto',
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    isCompact: window.innerHeight < 500,
    smallestDimension: Math.min(window.innerWidth, window.innerHeight),
    audioEnabled: false,
    toastMessage: '',
    toastVisible: false,
  }),
  getters: {
    isPortrait: (state) => state.orientation === 'portrait',
    isLandscape: (state) => state.orientation === 'landscape',
    isOpening: (state) => ['home', 'returning'].includes(state.currentScreen),
    isPlaying: (state) => state.currentScreen === 'game',
  },
  actions: {
    navigateTo(screen) {
      if (screen === 'settings' && this.currentScreen !== 'settings') {
        this.settingsOrigin = this.currentScreen
      }
      if (['help', 'credits'].includes(screen)) {
        this.infoOrigin = this.currentScreen
      }
      if (screen === 'game' && ['home', 'returning'].includes(this.currentScreen)) {
        this.showInstruction = true
      } else if (screen !== 'game') {
        this.showInstruction = false
      }
      this.previousScreen = this.currentScreen
      this.currentScreen = screen
    },
    goBack() {
      if (['help', 'credits'].includes(this.currentScreen)) {
        this.currentScreen = this.infoOrigin || 'settings'
      } else if (this.currentScreen === 'settings') {
        this.currentScreen = this.settingsOrigin
      } else if (this.previousScreen) {
        this.currentScreen = this.previousScreen
      }
    },
    showToast(message) {
      this.toastMessage = message
      this.toastVisible = true
      setTimeout(() => {
        this.toastVisible = false
      }, 4500)
    },
    dismissInstruction() {
      this.showInstruction = false
    },
    detectOrientation() {
      this.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      this.isCompact = window.innerHeight < 500
      this.smallestDimension = Math.min(window.innerWidth, window.innerHeight)
    },
  }
})
```

**Commit:** `feat: criar uiStore com telas, preferências e orientação`

---

### FASE 5 — Telas e Navegação

---

#### ✅ Atividade 20: Configurar App.vue e roteamento por estado

**Objetivo:** Montar o shell da aplicação com transições entre telas.

**Passos:**
1. Editar `client/src/App.vue`:
   - Importar `useUiStore`
   - Importar todos os componentes de tela
   - Usar `<Transition name="screen">` para crossfade entre telas (350ms)
   - Renderizar a tela correta baseado em `uiStore.currentScreen` usando `<component :is="screenComponents[uiStore.currentScreen]" />`
   - Montar `<ObsToast :message="uiStore.toastMessage" :visible="uiStore.toastVisible" />` global
   - No `onMounted`: adicionar listener de `resize` e `orientationchange` → `uiStore.detectOrientation()`
   - No `onMounted`: watcher de `uiStore.reducedMotion` → toggle classe `reduced-motion` no `document.body`
   - No `onUnmounted`: remover listeners
2. Mapeamento de telas:
```js
const screenComponents = {
  home: OpeningScreen,
  returning: OpeningScreen,
  game: GameScreen,
  pause: PauseScreen,
  settings: SettingsScreen,
  loading: LoadingScreen,
  loaderror: ErrorScreen,
  saveerror: ErrorScreen,
  recovery: RecoveryScreen,
  help: HelpScreen,
  credits: CreditsScreen,
}
```

**Commit:** `feat: configurar App.vue com crossfade de telas e detecção de orientação`

---

#### ✅ Atividade 21: Tela de Abertura (OpeningScreen)

**Objetivo:** Implementar a tela de abertura em landscape e portrait.

**Passos:**
1. Criar `client/src/components/screens/OpeningScreen.vue`:
   - Importar `useUiStore` e `useGameStore`
   - Computar `isReturning = uiStore.currentScreen === 'returning'`
   - **Layout Landscape** (quando `uiStore.isLandscape`):
     - Div wrapper com posição relativa, tela cheia
     - Div `home-scrim` (bg gradient escuro)
     - Div `home-menu` alinhado à direita, max-width 320px:
       - `<div class="type-overline">NO SEU TEMPO</div>`
       - `<h1 class="type-display">UMBRA</h1>`
       - `<p class="type-body">` texto conforme estado (opening ou returning)
       - `<ObsButton variant="primary">` Começar/Continuar
       - `<ObsButton variant="text">` Ajustes
   - **Layout Portrait** (quando `uiStore.isPortrait`):
     - Núcleo visual no terço superior (posição 50%, 30%)
     - Menu embaixo, centralizado, margem 16px, largura total
   - Ao clicar "Começar": `uiStore.navigateTo('loading')` → criar universo → `uiStore.navigateTo('game')`
   - Ao clicar "Continuar": `uiStore.navigateTo('loading')` → carregar universo → `uiStore.navigateTo('game')`
   - Ao clicar "Ajustes": `uiStore.navigateTo('settings')`
   - O menu **nunca** cobre o buraco negro

**Commit:** `feat: criar tela de abertura com layout landscape/portrait`

---

#### ✅ Atividade 22: Tela de Exploração (GameScreen)

**Objetivo:** Tela principal do jogo.

**Passos:**
1. Criar `client/src/components/screens/GameScreen.vue`:
   - Template:
     - `<GameCanvas />` em tela cheia (z-index 0)
     - Overlay de UI (z-index 1, pointer-events none exceto nos botões):
       - Top-start: `<span class="type-overline game-brand">UMBRA</span>` em cor `textMuted`
       - Abaixo da marca: `<GameHud />`
       - Top-end: `<GameControls />`
       - Bottom: instrução `<p class="type-body game-instruction">` com texto "Deslize para explorar. Solte para observar." — visível apenas quando `uiStore.showInstruction`
   - Ao primeiro pointer/touch no canvas: `uiStore.dismissInstruction()`
   - Escutar `visibilitychange`: se hidden → `uiStore.navigateTo('pause')`
   - Escutar `blur`: mesma ação

**Commit:** `feat: criar tela de exploração com HUD, controles e instrução`

---

#### ✅ Atividade 23: Tela de Pausa (PauseScreen)

**Objetivo:** Painel de pausa sobre scrim.

**Passos:**
1. Criar `client/src/components/screens/PauseScreen.vue`:
   - Template: `<ObsPanel>` com:
     - `strap="O UNIVERSO PODE ESPERAR"`
     - `title="Uma pausa."`
     - `body="Continue quando quiser."`
     - Slot `actions`:
       - `<ObsButton variant="primary" @click="uiStore.navigateTo('game')">Continuar</ObsButton>`
       - `<ObsButton variant="secondary" @click="uiStore.navigateTo('settings')">Ajustes</ObsButton>`
       - `<ObsButton variant="text" @click="uiStore.navigateTo('home')">Voltar à abertura</ObsButton>`

**Commit:** `feat: criar tela de pausa com painel Obsidiana`

---

#### ✅ Atividade 24: Tela de Ajustes (SettingsScreen)

**Objetivo:** Painel de configurações completo.

**Passos:**
1. Criar `client/src/components/screens/SettingsScreen.vue`:
   - Template: `<ObsPanel>` com:
     - `title="Seu ritmo."`
     - `body="Ajuste o conforto da experiência."`
     - Slot `extra`:
       - `<ObsSlider v-model="uiStore.musicVolume" label="Música" />`
       - `<ObsSlider v-model="uiStore.effectsVolume" label="Efeitos" />`
       - `<ObsSwitch v-model="uiStore.vibrationEnabled" label="Vibração" note="Desligada por padrão." />`
       - `<ObsSwitch v-model="uiStore.reducedMotion" label="Movimento reduzido" note="Menos movimento decorativo." />`
       - `<ObsQualitySelector v-model="uiStore.qualityProfile" />`
       - Footer: `<ObsButton variant="text" @click="uiStore.navigateTo('help')">Ajuda</ObsButton>` e `<ObsButton variant="text" @click="uiStore.navigateTo('credits')">Créditos</ObsButton>`
     - Slot `actions`:
       - `<ObsButton variant="primary" @click="uiStore.goBack()">Voltar</ObsButton>`
   - O painel rola se não couber (overflow-y auto)

**Commit:** `feat: criar tela de ajustes com todos os controles do design system`

---

#### ✅ Atividade 25: Tela de Carregamento (LoadingScreen)

**Objetivo:** Tela de carregamento sem porcentagem fictícia.

**Passos:**
1. Criar `client/src/components/screens/LoadingScreen.vue`:
   - `<ObsPanel>`:
     - `strap="CARREGAMENTO"`
     - `title="Seu universo está voltando."`
     - `body="Preparando a cena."`
     - Slot `extra`: `<div class="spinner" role="img" aria-label="Carregando"></div>`
     - Slot `actions`: `<ObsButton variant="text" @click="uiStore.navigateTo('home')">Cancelar</ObsButton>`
   - Sem barra de progresso, sem porcentagem

**Commit:** `feat: criar tela de carregamento com spinner discreto`

---

#### ✅ Atividade 26: Telas de Erro (ErrorScreen)

**Objetivo:** Falha de carregamento e falha de save.

**Passos:**
1. Criar `client/src/components/screens/ErrorScreen.vue`:
   - Computar tipo baseado em `uiStore.currentScreen` ('loaderror' ou 'saveerror')
   - **Falha de carregamento** (`loaderror`):
     - Strap: "FALHA AO CARREGAR"
     - Title: "Não conseguimos abrir."
     - Body: "O arquivo não pôde ser lido. Você pode tentar novamente; não vamos substituir seu universo."
     - Actions: `<ObsButton variant="primary" :loading="retrying" loading-text="Tentando…" @click="retry">Tentar novamente</ObsButton>` + `<ObsButton variant="text" @click="uiStore.navigateTo('home')">Voltar</ObsButton>`
   - **Falha de save** (`saveerror`):
     - Strap: "FALHA DE SALVAMENTO"
     - Title: "Vamos preservar."
     - Body: "Não foi possível salvar agora. Seu universo continua aberto."
     - Actions: `<ObsButton variant="primary" :loading="retrying" loading-text="Tentando…" @click="retry">Tentar salvar novamente</ObsButton>` + `<ObsButton variant="text" @click="uiStore.navigateTo('game')">Continuar a observar</ObsButton>`
   - `retry()`: setar `retrying = true`, chamar save/load, tratar resultado, setar `retrying = false`
   - Botão em operação: label "Tentando…", `aria-busy="true"`, desabilitado

**Commit:** `feat: criar telas de erro para falha de carga e salvamento`

---

#### ✅ Atividade 27: Tela de Recuperação (RecoveryScreen)

**Objetivo:** Aviso de backup restaurado.

**Passos:**
1. Criar `client/src/components/screens/RecoveryScreen.vue`:
   - `<ObsPanel>`:
     - `strap="RECUPERAÇÃO"`
     - `title="Uma cópia preservada."`
     - `body="O último arquivo não pôde ser lido. Recuperamos a cópia anterior válida."`
     - Slot `actions`: `<ObsButton variant="primary" @click="uiStore.navigateTo('game')">Continuar</ObsButton>`

**Commit:** `feat: criar tela de recuperação de backup`

---

#### ✅ Atividade 28: Telas de Ajuda e Créditos

**Objetivo:** Painéis informativos.

**Passos:**
1. Criar `client/src/components/screens/HelpScreen.vue`:
   - `<ObsPanel>`:
     - `title="Apenas explore."`
     - `body="Deslize um dedo para mover o buraco negro. Solte para observar. Matéria próxima entra em órbita e pode ser absorvida. O crescimento abre a câmera lentamente. Não há derrota, metas ou tempo limite."`
     - Slot `actions`: `<ObsButton variant="primary" @click="uiStore.goBack()">Voltar</ObsButton>`
2. Criar `client/src/components/screens/CreditsScreen.vue`:
   - `<ObsPanel>`:
     - `strap="CRÉDITOS"`
     - `title="Feito para permanecer."`
     - `body="Umbra é o nome escolhido para o jogo. Arte procedural e ícones originais. Gargantua, de Interstellar, é referência visual. Este jogo não inclui cenas, trilha ou assets do filme."`
     - Slot `actions`: `<ObsButton variant="primary" @click="uiStore.goBack()">Voltar</ObsButton>`

**Commit:** `feat: criar telas de ajuda e créditos`

---

### FASE 6 — Composables e Motor do Jogo

---

#### ✅ Atividade 29: Composable useOrientation

**Objetivo:** Detectar e reagir a mudanças de orientação.

**Passos:**
1. Criar `client/src/composables/useOrientation.js`:
   - Retornar refs reativas: `{ orientation, isPortrait, isLandscape, isCompact, smallestDimension }`
   - No `onMounted`: escutar `resize` e `screen.orientation?.addEventListener('change', ...)`
   - Calcular:
     - `orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'`
     - `isCompact = window.innerHeight < 500`
     - `smallestDimension = Math.min(window.innerWidth, window.innerHeight)`
   - Transição suave: ao trocar, aguardar 600ms (`rotationRescaleMs`) antes de ajustar escala
   - Atualizar `uiStore.orientation`, `uiStore.isCompact`, `uiStore.smallestDimension`
   - No `onUnmounted`: remover listeners

**Commit:** `feat: criar composable useOrientation com detecção portrait/landscape`

---

#### ✅ Atividade 30: Composable useInput

**Objetivo:** Capturar input de touch, mouse e teclado.

**Passos:**
1. Criar `client/src/composables/useInput.js`:
   - Aceitar `canvasRef` (ref ao elemento canvas)
   - Estado reativo: `{ targetX, targetY, isPointerDown, lastGestureTime }`
   - No `onMounted`:
     - Escutar `pointerdown`, `pointermove`, `pointerup` no canvas
     - Escutar `keydown` global: setas ↑↓←→ para mover, Escape para pausar, Space para continuar
   - Converter coordenadas de tela para coordenadas do mundo:
     - `worldX = (clientX - canvas.width/2) / scale`
     - `worldY = (clientY - canvas.height/2) / scale`
   - Ao primeiro gesto: `uiStore.dismissInstruction()`
   - Freio de 600ms ao soltar: interpolar velocidade para 0 usando curva `(0.4, 0, 0.2, 1)` — implementar como decaimento exponencial `v *= Math.pow(0.01, deltaTime / 0.6)`
   - Retornar as refs reativas
   - No `onUnmounted`: remover listeners

**Commit:** `feat: criar composable useInput com touch/mouse/keyboard`

---

#### ✅ Atividade 31: Composable useGameLoop

**Objetivo:** Loop de jogo fixo a 60 Hz.

**Passos:**
1. Criar `client/src/composables/useGameLoop.js`:
   - Aceitar `onTick(deltaSeconds)` callback
   - Estado reativo: `{ isRunning, fps }`
   - `start()`: iniciar `requestAnimationFrame` loop
   - `stop()`: cancelar loop
   - Loop interno:
     - Calcular delta time clampado a 100ms máx
     - Fixed timestep de 1/60 s: acumular delta, executar `onTick(1/60)` enquanto acumulado >= 1/60
     - Calcular FPS com média móvel de 60 frames
   - Parar automaticamente quando:
     - `document.hidden === true`
     - `uiStore.currentScreen !== 'game'`
   - Escutar `visibilitychange`:
     - Se hidden: pausar jogo, silenciar áudio, `uiStore.navigateTo('pause')`
   - Escutar `blur`: mesma ação
   - Retornar `{ start, stop, isRunning, fps }`

**Commit:** `feat: criar composable useGameLoop com timestep fixo a 60 Hz`

---

#### ✅ Atividade 32: Composable usePhysics

**Objetivo:** Simulação gravitacional simplificada.

**Passos:**
1. Criar `client/src/composables/usePhysics.js`:
   - Aceitar `gameStore` e `inputState`
   - Constantes:
     - `G = 50` (constante gravitacional do jogo)
     - `MAX_BODIES = 50`
     - `SPAWN_DISTANCE = 1.5` (vezes a viewport)
     - `HORIZON_ABSORB = 0.5` (fração do raio do horizonte para absorver)
     - `SWELL_AMOUNT = 0.05` (5% de inchamento por absorção)
     - `SWELL_TAU = 800` (ms de suavização)
     - `JET_INTERVAL = 4` (absorções entre jatos)
     - `JET_MIN_DELAY = 12000` (ms mínimo entre jatos)
     - `JET_DURATION = 8000` (ms de duração visual)
   - Tipos de corpo (18 tipos por escala, mapeados para `matterColors`):
     - Poeira: `dust` (gelo), `pebble` (deserto)
     - Asteroides: `rock` (terra), `ice_rock` (gelo), `metal` (deserto)
     - Planetas: `ocean` (oceano), `lava` (lava), `ice` (gelo), `desert` (deserto), `gas` (gasViolet)
     - Estrelas: `star_blue` (starBlue), `star_red` (starRed)
     - Sistemas: `nebula` (nebulaRose), `galaxy_small` (gasViolet)
     - Galáxias: `galaxy` (starBlue)
   - `tick(dt)`:
     1. Mover buraco negro em direção ao target do input; freio suave se pointer up
     2. Para cada corpo:
        a. Calcular distância ao buraco negro
        b. Aplicar força gravitacional: `F = G * mass_bh * mass_body / r²`
        c. Atualizar velocidade e posição
        d. Se distância < horizonte × 0.5: absorver (`gameStore.absorb(body.mass)`)
        e. Se distância > despawn distance: remover
     3. Repor corpos para manter ~50 ativos, spawnar fora da câmera
     4. Atualizar `gameStore.tick(dt)`
   - `spawnBody()`: criar corpo com tipo adequado à faixa atual, posição aleatória fora da câmera
   - Retornar `{ tick, bodies, activeJet }`

**Commit:** `feat: criar composable usePhysics com gravitação, órbita e absorção`

---

#### ✅ Atividade 33: Composable useRenderer

**Objetivo:** Renderização da cena do jogo em Canvas 2D.

**Passos:**
1. Criar `client/src/composables/useRenderer.js`:
   - Aceitar `canvasRef`, `gameStore`, `physics`
   - Usar `canvas.getContext('2d')`
   - `render(time)`:
     1. Limpar canvas com `#030508` (background)
     2. Ajustar canvas size ao container × `devicePixelRatio`
     3. Calcular câmera: centro no buraco negro, zoom baseado em `coreHeightFraction`
     4. **Estrelas** (camada 0): ~200 pontos brancos fixos com opacidade baixa, paralaxe sutil (desativar com reducedMotion)
     5. **Grade de Einstein** (camada 1): linhas `#353B44` (borderDecorative), curvadas perto do BH usando distorção simples (deslocar vértices em direção ao BH proporcionalmente a 1/r)
     6. **Corpos celestes** (camada 2): círculos preenchidos com cor de `matterColors`, tamanho proporcional à massa, borda suave com `globalAlpha` ou `shadowBlur`
     7. **Disco de acreção** (camada 3): arco elíptico ao redor do núcleo, gradiente `diskWarm` → `diskMid` → `diskHot`, inclinação -0.12 rad
     8. **Arcos gravitacionais** (camada 4): acima e abaixo do núcleo, cor `diskMid` com opacidade, strength 0.72
     9. **Núcleo** (camada 5): círculo `#000000`, tamanho baseado em `coreHeightFraction` × `smallestDimension`
     10. **Jatos** (camada 6, quando ativo): feixe de partículas perpendicular ao disco, cor `diskHot` → `diskWarm`, eixo `[0.1191, 0.9929]`, duração 8s
   - Qualidade:
     - Alta: mais estrelas, grade mais densa, bloom simulado (shadow blur)
     - Econômica: menos estrelas, sem grade detalhada, sem bloom
   - Movimento reduzido: sem paralaxe em estrelas, sem granulação
   - Retornar `{ render, resize }`

**Commit:** `feat: criar composable useRenderer com renderização 2D da cena do jogo`

---

#### ✅ Atividade 34: Composable useAudio

**Objetivo:** Áudio via Web Audio API.

**Passos:**
1. Criar `client/src/composables/useAudio.js`:
   - Estado: `{ isActive, context }`
   - **Iniciar silencioso**: não criar AudioContext até gesto do usuário
   - `init()`: criar `AudioContext`, nós de ganho, osciladores de drone, compressor e waveshaper (limiter -1 dBFS)
   - **Drone/ambiente**: 3 osciladores senoidais (73.4, 110, 146.8 Hz), ganhos [0.55, 0.3, 0.15], conectados a `ambientGain`
   - `ambientGain.value = uiStore.musicVolume / 100 * 0.055`
   - **Efeitos**: nó `effectsGain`, `effectsGain.value = uiStore.effectsVolume / 100 * 0.18`
   - `playNote(freqIndex)`:
     - Verificar agrupamento: `now - lastNote < 120ms` → ignorar
     - Verificar vozes: `activeVoices >= 12` → ignorar
     - Criar oscilador senoidal na frequência de `demoNotesHz[freqIndex % 5]`
     - Envelope: attack 80ms, decay longo (2.6s exponencial), auto-stop
     - Conectar a `effectsGain`
   - **Fade de pausa**: `ambientGain.linearRampToValueAtTime(0, now + 0.25)` (250ms)
   - **Fade de retomada**: `ambientGain.linearRampToValueAtTime(target, now + 0.6)` (600ms)
   - `toggle()`: alternar mudo
   - `suspend()`: `context.suspend()` — ao perder foco/visibility
   - `resume()`: `context.resume()` — ao retomar
   - Escutar `uiStore.musicVolume`, `uiStore.effectsVolume` → ajustar gains
   - Retornar `{ init, toggle, playNote, suspend, resume, isActive }`

**Commit:** `feat: criar composable useAudio com Web Audio API, drone e efeitos`

---

#### ✅ Atividade 35: Composable usePreferences

**Objetivo:** Sincronizar preferências entre UI, localStorage e composables.

**Passos:**
1. Criar `client/src/composables/usePreferences.js`:
   - `STORAGE_KEY = 'umbra-preferences'`
   - `load()`: ler do `localStorage`, popular `uiStore` com valores salvos (ou defaults)
   - `save()`: serializar preferências do `uiStore` para `localStorage`
   - Watchear (com `watch` do Vue) mudanças nas preferências do `uiStore`:
     - `musicVolume`, `effectsVolume`, `vibrationEnabled`, `reducedMotion`, `qualityProfile`
     - Ao mudar: chamar `save()` e notificar composables relevantes
   - `reducedMotion`:
     - Toggle classe `reduced-motion` no `document.body`
     - Notificar renderer para ajustar qualidade
   - Detectar `prefers-reduced-motion` do sistema como default
   - Retornar `{ load, save }`

**Commit:** `feat: criar composable usePreferences com persistência em localStorage`

---

### FASE 7 — Componentes do Jogo

---

#### ✅ Atividade 36: Componente GameCanvas

**Objetivo:** Canvas do jogo com responsividade.

**Passos:**
1. Criar `client/src/components/game/GameCanvas.vue`:
   - Template: `<canvas ref="canvasRef" class="game-canvas"></canvas>`
   - Style: `position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none;`
   - No `onMounted`:
     - Inicializar `useInput(canvasRef)`
     - Inicializar `useRenderer(canvasRef, gameStore, physics)`
     - Inicializar `usePhysics(gameStore, inputState)`
     - Inicializar `useGameLoop(onTick)`
     - `onTick(dt)`: `physics.tick(dt)`, `renderer.render(sceneTime)`, `sceneTime += dt`
     - `useResizeObserver` ou `ResizeObserver` para ajustar canvas.width/height
   - Prevenir scroll/zoom: `@touchmove.prevent`, `@wheel.prevent`
   - Emitir `@gesture` para o pai (para dismiss instrução)

**Commit:** `feat: criar componente GameCanvas com responsividade e prevenção de scroll`

---

#### ✅ Atividade 37: Componente GameHud

**Objetivo:** HUD compacto informativo.

**Passos:**
1. Criar `client/src/components/game/GameHud.vue`:
   - Importar `useGameStore`
   - Posicionado abaixo da marca UMBRA (top-start, margin-top 4px)
   - Template:
     - `div.game-hud` com bg `rgba(3, 5, 8, 0.91)` (background a 91% opacidade), padding 8px
     - Linha 1 `<span class="type-caption" style="color: var(--obs-text-primary)">`: `{{ mass.toFixed(1) }} M☉ · ⌀ {{ horizonDiameter }}`
     - Linha 2 `<span class="type-caption" style="color: var(--obs-text-secondary)">`: `≈ {{ knownBodyComparison }}`
       - Fio fino entre comparação atual e próximo marco: `border-bottom: 1px solid var(--obs-border-decorative)`
     - Linha 3 `<span class="type-caption" style="color: var(--obs-text-secondary)">`: `{{ formattedPlayTime }}`
   - Computed `formattedPlayTime`: `HH:MM:SS` a partir de `gameStore.playTimeSeconds`
   - **NUNCA usar cor âmbar (diskWarm) no HUD**
   - Acessibilidade: `aria-live="polite"` para atualizações

**Commit:** `feat: criar componente GameHud com massa, horizonte, comparação e tempo`

---

#### ✅ Atividade 38: Componente GameControls

**Objetivo:** Controles flutuantes do jogo.

**Passos:**
1. Criar `client/src/components/game/GameControls.vue`:
   - Importar `useUiStore`, `useAudio` (ou injetar via provide/inject)
   - Posição: canto superior direito, `position: absolute; top: var(--obs-space-xl); right: var(--obs-space-xl);`
   - Portrait: ajustar para `right: var(--obs-space-lg)`
   - Template:
     - `div.game-controls` com `display: flex; gap: var(--obs-space-sm); align-items: center;`
     - `<ObsIconButton :icon="audioEnabled ? 'volume' : 'muted'" :label="audioEnabled ? 'Silenciar áudio' : 'Ouvir áudio'" @click="toggleAudio" />`
     - `<ObsIconButton icon="pause" label="Pausar exploração" @click="uiStore.navigateTo('pause')" />`
   - `toggleAudio()`: chamar `audio.toggle()`, atualizar `uiStore.audioEnabled`

**Commit:** `feat: criar componente GameControls com botões de áudio e pausa`

---

### FASE 8 — Backend API

---

#### ✅ Atividade 39: Rotas de Universo (CRUD)

**Objetivo:** API REST para salvar/carregar universos.

**Passos:**
1. Criar `server/src/routes/universe.js`:
   - Importar `Router` do express e `db` de `../db/connection.js`
   - `POST /api/universes`:
     - Gerar id com `crypto.randomUUID()`
     - Inserir na tabela universes com defaults
     - Retornar `{ id }` com status 201
   - `GET /api/universes`:
     - Selecionar todos, retornar array ordenado por `updated_at` desc
   - `GET /api/universes/:id`:
     - Selecionar por id
     - Se não encontrado: retornar 404 com `{ error: 'Universo não encontrado' }`
     - Parsear `bodies_data` e `preferences` de JSON
     - Retornar objeto completo
   - `PUT /api/universes/:id`:
     - Validar: `mass` é número > 0, `position_x` e `position_y` são números
     - Atualizar campos: mass, position_x, position_y, scale_band, absorptions, jets_fired, play_time_seconds, bodies_data (JSON.stringify), preferences (JSON.stringify)
     - Atualizar `updated_at = datetime('now')`
     - Se não encontrado: 404
     - Retornar `{ success: true }`
   - `DELETE /api/universes/:id`:
     - Deletar da tabela
     - Deletar milestones associados
     - Se não encontrado: 404
     - Retornar `{ success: true }`
2. Registrar no `index.js` com `app.use('/api', universeRouter)`

**Commit:** `feat: criar rotas REST de CRUD de universos`

---

#### ✅ Atividade 40: Rotas de Milestones

**Objetivo:** Registrar marcos de crescimento.

**Passos:**
1. Criar `server/src/routes/leaderboard.js`:
   - `POST /api/universes/:id/milestones`:
     - Validar: `band_name` é string, `mass_at_milestone` é número > 0
     - Verificar que o universo existe (404 se não)
     - Verificar duplicata: se já existe milestone com mesmo `band_name` para este universo → 409 Conflict
     - Inserir na tabela milestones
     - Retornar `{ id }` com status 201
   - `GET /api/universes/:id/milestones`:
     - Verificar que o universo existe (404 se não)
     - Selecionar todos milestones do universo, ordenados por `reached_at`
     - Retornar array
2. Registrar no `index.js`

**Commit:** `feat: criar rotas de milestones para marcos de crescimento`

---

#### ✅ Atividade 41: Rotas de Preferências

**Objetivo:** Salvar/carregar preferências no servidor.

**Passos:**
1. Criar `server/src/routes/settings.js`:
   - `GET /api/universes/:id/settings`:
     - Verificar que o universo existe (404 se não)
     - Retornar `JSON.parse(universe.preferences)` ou `{}` se vazio
   - `PUT /api/universes/:id/settings`:
     - Verificar que o universo existe (404 se não)
     - Validar campos: musicVolume (0–100), effectsVolume (0–100), vibrationEnabled (boolean), reducedMotion (boolean), qualityProfile ('Auto'|'Alta'|'Econômica')
     - Atualizar coluna `preferences` com `JSON.stringify(body)`
     - Retornar `{ success: true }`
2. Registrar no `index.js`

**Commit:** `feat: criar rotas de preferências do jogador`

---

#### ✅ Atividade 42: Middleware de erros e validação

**Objetivo:** Tratamento centralizado de erros.

**Passos:**
1. Criar `server/src/middleware/errorHandler.js`:
```js
export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.message}`)
  const status = err.status || 500
  const message = status === 500 ? 'Erro interno do servidor' : err.message
  res.status(status).json({ error: message })
}
```
2. Criar `server/src/middleware/validate.js`:
```js
export function validateBody(requiredFields) {
  return (req, res, next) => {
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `Campo obrigatório ausente: ${field}` })
      }
    }
    next()
  }
}

export function validateNumeric(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] !== undefined && typeof req.body[field] !== 'number') {
        return res.status(400).json({ error: `Campo deve ser numérico: ${field}` })
      }
    }
    next()
  }
}
```
3. No `index.js`:
   - `app.use(express.json({ limit: '1mb' }))`
   - `app.use(errorHandler)` como último middleware
4. Aplicar `validateNumeric` e `validateBody` nas rotas relevantes

**Commit:** `feat: criar middleware de erro centralizado e validação de payloads`

---

### FASE 9 — Integração Frontend ↔ Backend

---

#### ✅ Atividade 43: Composable useSave

**Objetivo:** Comunicação do frontend com a API de save/load.

**Passos:**
1. Criar `client/src/composables/useSave.js`:
   - Estado: `{ isSaving, isLoading, lastSaveTime }`
   - `create()`:
     - `POST /api/universes`
     - Guardar `universeId` no `localStorage` e `gameStore.universeId`
     - Retornar id
   - `save()`:
     - `isSaving = true`
     - `PUT /api/universes/${gameStore.universeId}` com estado serializado do `gameStore`
     - Se sucesso: `gameStore.isDirty = false`, `lastSaveTime = Date.now()`
     - Se falha: `uiStore.navigateTo('saveerror')`
     - `isSaving = false`
   - `load(id)`:
     - `isLoading = true`
     - `GET /api/universes/${id}`
     - Popular `gameStore` com dados retornados
     - Se 404: `uiStore.navigateTo('loaderror')`
     - Se falha: `uiStore.navigateTo('loaderror')`
     - `isLoading = false`
   - `autoSave()`: `setInterval(save, 60000)` — salvar a cada 60s se `gameStore.isDirty`
   - `checkExistingSave()`: ler `universeId` do `localStorage`, retornar boolean
   - **Nunca declarar sucesso** sem confirmação HTTP 200 do servidor
   - Retornar `{ create, save, load, autoSave, checkExistingSave, isSaving, isLoading }`

**Commit:** `feat: criar composable useSave com auto-save e tratamento de erros`

---

#### ✅ Atividade 44: Integrar save na tela de abertura

**Objetivo:** Detectar e carregar universo salvo.

**Passos:**
1. Em `OpeningScreen.vue`:
   - No `onMounted`:
     - Chamar `useSave.checkExistingSave()`
     - Se retorna true: `uiStore.navigateTo('returning')` (se ainda estiver em 'home')
   - Ao clicar "Começar":
     - `uiStore.navigateTo('loading')`
     - `await useSave.create()`
     - `gameStore.reset()`
     - `uiStore.navigateTo('game')`
   - Ao clicar "Continuar":
     - `uiStore.navigateTo('loading')`
     - `const id = localStorage.getItem('umbra-universe-id')`
     - `await useSave.load(id)`
     - Se sucesso: `uiStore.navigateTo('game')`
     - Se falha: tratado pelo `useSave` (navega para loaderror)
   - Iniciar auto-save quando entrar no game

**Commit:** `feat: integrar detecção de save e carregamento na tela de abertura`

---

### FASE 10 — Polimento e Testes

---

#### ✅ Atividade 45: Adicionar acessibilidade completa

**Objetivo:** Garantir WCAG mínimo em todos os componentes.

**Passos:**
1. Revisar e garantir em TODOS os componentes:
   - `ObsIconButton`: `aria-label` presente (já feito via prop required)
   - `ObsSlider`: `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` no `<input>`
   - `ObsSwitch`: `role="switch"`, `aria-checked` dinâmico
   - `ObsPanel`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apontando para o título
   - `ObsToast`: `role="status"`, `aria-live="polite"`
   - `ObsQualitySelector`: `<fieldset>` + `<legend>`, cada radio com label
   - `ObsMessage`: `role="alert"` para erro, `role="status"` para sucesso
   - Spinner: `role="img"`, `aria-label="Carregando"`
2. Focus visível global:
```css
*:focus-visible {
  outline: var(--obs-focus-width) solid var(--obs-accent);
  outline-offset: var(--obs-focus-offset);
}
```
3. Navegação por teclado:
   - Tab entre todos os controles interativos
   - Enter/Space para ativar botões
   - Escape para fechar painéis
   - Setas para sliders e quality selector
4. Verificar que todos os pares de cores atingem contraste mínimo (4.5:1 texto normal, 3:1 controles/texto grande) — confirmado pelo `contraste-verificado.json` que todos passam.

**Commit:** `feat: adicionar atributos ARIA, foco visível e navegação por teclado`

---

#### ✅ Atividade 46: Testes unitários dos componentes UI

**Objetivo:** Testar componentes base com Vitest.

**Passos:**
1. Criar `client/tests/components/ObsButton.test.js`:
   - `it('renderiza com variante primary')`: montar, verificar classe e min-width
   - `it('emite click quando clicado')`: montar, trigger click, assert emitted
   - `it('não emite click quando disabled')`: montar com `disabled: true`, trigger click, assert not emitted
   - `it('mostra loading text quando loading')`: montar com `loading: true`, verificar texto
2. Criar `client/tests/components/ObsSlider.test.js`:
   - `it('emite update:modelValue ao mudar')`: montar, mudar input, assert emitted value
   - `it('mostra valor com %')`: montar com value 50, verificar output "50%"
3. Criar `client/tests/components/ObsSwitch.test.js`:
   - `it('toggle alterna estado')`: montar, trigger change, assert emitted
   - `it('exibe label e nota')`: verificar textos renderizados
4. Criar `client/tests/components/ObsQualitySelector.test.js`:
   - `it('emite perfil selecionado')`: montar, selecionar radio, assert emitted
5. Executar: `npx vitest run --reporter=verbose` — todos devem passar.

**Commit:** `test: adicionar testes unitários para componentes UI Obsidiana`

---

#### ✅ Atividade 47: Testes do backend

**Objetivo:** Testar as rotas da API.

**Passos:**
1. Instalar `supertest` como devDependency no server.
2. Criar `server/tests/universe.test.js` usando `node:test` e `node:assert`:
```js
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
// importar app e supertest
```
   - `it('POST /api/universes cria universo')`: status 201, body tem `id`
   - `it('GET /api/universes/:id retorna universo')`: status 200, verificar campos
   - `it('PUT /api/universes/:id atualiza estado')`: enviar mass=5, status 200
   - `it('GET após PUT retorna dados atualizados')`: mass === 5
   - `it('DELETE /api/universes/:id remove')`: status 200
   - `it('GET após DELETE retorna 404')`: status 404
   - `it('PUT com mass negativa retorna 400')`: status 400
   - `it('POST milestone registra marco')`: status 201
   - `it('POST milestone duplicada retorna 409')`: status 409
   - `it('GET milestones retorna lista')`: verificar array
3. Usar banco temporário para testes (criar em `/tmp/test-umbra.db` ou `:memory:`).
4. Executar: `npm test --workspace=server` — todos devem passar.

**Commit:** `test: adicionar testes de integração para API de universos`

---

#### ✅ Atividade 48: Teste de integração E2E básico

**Objetivo:** Verificar fluxo completo de telas.

**Passos:**
1. Criar `client/tests/e2e/flow.test.js`:
   - Configurar: criar Pinia de teste, montar App.vue
   - `it('inicia na tela home')`: assert `uiStore.currentScreen === 'home'`
   - `it('navega para loading ao começar')`: simular click em "Começar", assert screen === 'loading'
   - `it('navega para game após loading')`: emitir navegação, assert screen === 'game'
   - `it('pausa ao clicar pause')`: simular click no botão pause, assert screen === 'pause'
   - `it('continua do pause')`: simular click "Continuar", assert screen === 'game'
   - `it('abre ajustes do pause')`: simular click "Ajustes", assert screen === 'settings'
   - `it('volta do ajustes para pause')`: simular click "Voltar", assert screen === 'pause'
   - `it('abre ajuda dos ajustes')`: navegar settings → help, assert screen === 'help'
   - `it('volta da ajuda para settings')`: simular click "Voltar", assert screen === 'settings'
2. Executar: `npx vitest run tests/e2e/` — todos devem passar.

**Commit:** `test: adicionar teste E2E do fluxo principal de telas`

---

#### ✅ Atividade 49: Otimização de performance

**Objetivo:** Garantir fluidez da renderização.

**Passos:**
1. No `useRenderer.js`:
   - Implementar pool de objetos para corpos celestes (array pré-alocado, reutilizar ao invés de criar/destruir)
   - Limitar rendering conforme perfil:
     - Alta: 8000 partículas max, 200 estrelas, grade detalhada
     - Equilíbrio/Auto: 4000 partículas, 100 estrelas, grade simples
     - Econômica: 1600 partículas, 50 estrelas, sem grade
   - Não redesenhar estrelas a cada frame: renderizar em OffscreenCanvas estático, compor sobre o canvas principal
   - Usar `canvas.width` e `canvas.height` inteiros (sem subpixel)
2. No `usePhysics.js`:
   - Implementar spatial hash grid para detecção de proximidade O(n) ao invés de O(n²)
   - Não calcular gravidade para corpos a mais de 3× a viewport de distância
   - Skip physics update se delta for 0
3. No `useGameLoop.js`:
   - Medir FPS: média dos últimos 60 frames
   - Log FPS no console em modo dev (`import.meta.env.DEV`)
   - Se FPS < 30 por 5s seguidos e perfil é Auto: reduzir qualidade automaticamente

**Commit:** `perf: otimizar renderização com pool de objetos e spatial hash`

---

#### ✅ Atividade 50: README do projeto e scripts finais

**Objetivo:** Documentação para rodar o projeto.

**Passos:**
1. Criar `umbra-game/README.md`:
```markdown
# 🕳️ UMBRA

Jogo contemplativo de buraco negro. Explore o espaço, atraia matéria e cresça sem limites.

## Stack

- **Frontend:** Vue.js 3 + Vite + Pinia + Canvas 2D + Web Audio API
- **Backend:** Node.js + Express + SQLite

## Pré-requisitos

- Node.js 20+

## Instalação

```bash
cd umbra-game
npm install
```

## Desenvolvimento

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000

## Testes

```bash
npm test --workspace=client
npm test --workspace=server
```

## Controles

- **Mouse/Touch:** Arraste para mover o buraco negro
- **Soltar:** O buraco negro freia suavemente (600ms)
- **Escape:** Pausar
- **Teclado:** Setas para mover

## Design System

Baseado no **Obsidiana 1.0.0** — paleta quase negra com marfim/âmbar, tipografia sem serif, formas retangulares.

Referência: `design-system/README.md`
```
2. Verificar que `npm run dev` na raiz inicia ambos os projetos sem erro.
3. Verificar que `npm test` em ambos os workspaces passa.

**Commit:** `docs: criar README com instruções de instalação, execução e referências`

---

## 6. Referências dos Tokens

Todos os valores de design devem vir dos arquivos canônicos:

| Arquivo | Caminho | Uso |
|---------|---------|-----|
| `tokens.css` | `design-system/tokens.css` | Variáveis CSS para o frontend |
| `tokens.json` | `design-system/tokens.json` | Valores canônicos completos |
| `icons.svg` | `design-system/icons.svg` | 12 ícones SVG (24×24, traço 1.5) |
| `contraste-verificado.json` | `design-system/contraste-verificado.json` | 28 pares de contraste verificados |
| `README.md` | `design-system/README.md` | Documentação completa do design system |
| `validacao.md` | `design-system/validacao.md` | Histórico de validação e decisões |
| `escolhas.json` | `design-system/exploracoes/escolhas.json` | Escolhas de design aprovadas |

---

> **⚠️ Regras para o modelo executor:**
>
> 1. Siga as atividades na ordem exata (01 → 50).
> 2. Cada atividade = 1 commit atômico com a mensagem indicada.
> 3. Nunca use cores fora da paleta Obsidiana na UI.
> 4. Cores de `matterColors` são EXCLUSIVAS para corpos celestes.
> 5. Todos os raios de ação/painel/seletor são **0px** (retangular).
> 6. Ícones circulares com raio **22px** são a exceção.
> 7. Texto da marca sempre em **CAIXA ALTA** e tracking de **4px**.
> 8. **Proibido:** flash branco, estrobo, fanfarra, zoom instantâneo, shake de câmera.
> 9. O jogo inicia **silencioso** no browser; áudio requer ativação explícita.
> 10. Movimento reduzido deve funcionar: remover paralaxe, granulação e decoração; manter trajetórias essenciais.
> 11. Scrim de painel: `#030508` com alpha `0.84`.
> 12. Painel max-width `400px`, padding `24px` (16px em compact), scroll se overflow.
> 13. Botão em operação: rótulo explícito ("Salvando…"), indicador discreto, `aria-busy="true"`.
> 14. Mensagem de erro permanece até resolução ou saída deliberada.
> 15. Nunca declarar sucesso de save sem conclusão confirmada pelo servidor.

---

*Plano gerado por **Claude Opus 4.6 (Thinking)** via Antigravity IDE em 05/10/2026.*
