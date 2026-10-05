const $ = id => document.getElementById(id);
const TOKENS = JSON.parse($('ds-token-data').textContent);
const CONTRAST = JSON.parse($('ds-contrast-data').textContent);
const prefs = {music:50,effects:55,vibration:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,quality:'Auto'};
let screen='home', settingsOrigin='home', infoOrigin='settings', animationEnabled=true, sceneTime=12, lastFrame=0, heroVisible=true, sceneVisible=false, hint=true;
let audioContext, ambientGain, effectsGain, audioOn=false, effectVoices=0, lastNote=-Infinity, noteIndex=0;
let toastTimer, retryTimer;
const engine=new SpaceRenderer();
$('webgl-notice').hidden=engine.ready;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const glyph=name=>`<svg class="icon" aria-hidden="true"><use href="#obs-${name}"/></svg>`;
const button=(label,action,kind='')=>`<button class="native-button ${kind}" data-action="${action}">${label}</button>`;
const iconButton=(label,action,name)=>`<button class="icon-target" data-action="${action}" aria-label="${label}"><span class="icon-visual">${glyph(name)}</span></button>`;
const range=(label,key)=>`<label class="native-range"><span>${label}</span><output>${prefs[key]}%</output><input type="range" min="0" max="100" value="${prefs[key]}" data-pref="${key}" aria-label="${label}"/></label>`;
const toggle=(label,key,note)=>`<label class="native-switch"><span class="switch-label">${label}<small>${note}</small></span><input type="checkbox" data-pref="${key}" ${prefs[key]?'checked':''}/><span class="switch-visual" aria-hidden="true"></span></label>`;
const panel=(title,body,actions,strap='',extra='')=>`<div class="screen-scrim"><section class="screen-panel">${strap?`<div class="panel-strap">${strap}</div>`:''}<h3 class="type-title">${title}</h3><p class="type-body">${body}</p>${extra}${actions}</section></div>`;
const SCREENS={
 home:['Abertura','Núcleo à esquerda; menu à direita. Nenhum número de progresso.','Começar','Silhueta e área livre para observação.'],
 returning:['Universo salvo','Variante da abertura para um universo existente.','Continuar','Nunca reiniciar sem intenção explícita.'],
 game:['Explorar','Ferramentas discretas nas bordas; um dedo explora.','Pausar','Núcleo, disco e arcos legíveis.'],
 pause:['Pausa','Cena congelada. Retomar exige uma ação.','Continuar','Universo e preferências.'],
 settings:['Ajustes','Painel opaco, controles rotulados e rolagem quando necessário.','Voltar','Preferências e ponto de origem.'],
 loading:['Carregamento','Indicar operação, sem contagem regressiva ou pressão.','Aguardar / cancelar','Não mostrar um universo vazio como save válido.'],
 loaderror:['Falha ao carregar','Explicar a operação que falhou e oferecer tentativa segura.','Tentar novamente','Arquivos existentes; não substituir por um universo novo.'],
 saveerror:['Falha ao salvar','Mensagem persistente; sessão em memória permanece aberta.','Tentar salvar novamente','Universo atual e última cópia válida.'],
 recovery:['Backup restaurado','Avisar somente após recuperar uma cópia válida.','Continuar','Cópia restaurada e clareza sobre a recuperação.'],
 help:['Ajuda','Instruções curtas, sem tutoriais obrigatórios.','Voltar','O ponto de origem e a sessão.'],
 credits:['Créditos','Autoria e licenças verificáveis; referência visual identificada.','Voltar','Separação entre inspiração e material original.']
};
function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,4500)}
function screenMarkup(){
 if(['home','returning'].includes(screen))return `<div class="home-scrim"></div><div class="home-menu"><div class="type-overline">NO SEU TEMPO</div><h3 class="type-display">${esc(TOKENS.copy.brand)}</h3><p class="type-body">${screen==='returning'?'Seu universo está aqui, como você deixou.':TOKENS.copy.opening}</p>${button(screen==='returning'?'Continuar':'Começar','game','primary')}${button('Ajustes','settings','text')}</div>`;
 if(screen==='game')return `<span class="game-brand">${esc(TOKENS.copy.brand)}</span><div class="game-tools">${iconButton(audioOn?'Silenciar áudio demonstrativo':'Ouvir áudio demonstrativo','sound',audioOn?'volume':'muted')}${iconButton('Pausar exploração','pause','pause')}</div>${hint?`<p class="game-instruction">${TOKENS.copy.instruction}</p>`:''}`;
 if(screen==='pause')return panel(TOKENS.copy.pauseTitle,TOKENS.copy.pauseBody,button('Continuar','game','primary')+button('Ajustes','settings')+button('Voltar à abertura','home','text'),'O UNIVERSO PODE ESPERAR');
 if(screen==='settings')return `<div class="screen-scrim"><section class="screen-panel settings-panel"><h3 class="type-title">Seu ritmo.</h3><p class="type-body">Ajuste o conforto da experiência.</p>${range('Música','music')}${range('Efeitos','effects')}${toggle('Vibração','vibration','Desligada por padrão.')}${toggle('Movimento reduzido','reduced','Menos movimento decorativo.')}<fieldset style="border:0;padding:0;margin:12px 0"><legend class="setting-heading">Qualidade gráfica</legend><div class="quality-group">${['Auto','Alta','Econômica'].map(q=>`<label><input type="radio" name="screen-quality" value="${q}" data-pref="quality" ${prefs.quality===q?'checked':''}/><span>${q}</span></label>`).join('')}</div></fieldset><div class="footer-row">${button('Ajuda','help','text')}${button('Créditos','credits','text')}</div>${button('Voltar','settings-back','primary')}</section></div>`;
 if(screen==='loading')return panel('Seu universo está voltando.','Preparando a cena. Este estado é demonstrativo.',button('Cancelar','home','text'),'CARREGAMENTO', '<div class="spinner" role="img" aria-label="Carregando"></div>');
 if(screen==='loaderror')return panel('Não conseguimos abrir.','O arquivo não pôde ser lido. Você pode tentar novamente; não vamos substituir seu universo.',button('Tentar novamente','retry-load','primary')+button('Voltar','home','text'),'FALHA AO CARREGAR');
 if(screen==='saveerror')return panel('Vamos preservar.',TOKENS.copy.saveError,button('Tentar salvar novamente','retry-save','primary')+button('Continuar a observar','game','text'),'FALHA DE SALVAMENTO');
 if(screen==='recovery')return panel('Uma cópia preservada.',TOKENS.copy.recovery,button('Continuar','game','primary'),'RECUPERAÇÃO · EXEMPLO');
 if(screen==='help')return panel('Apenas explore.','Deslize um dedo para mover o buraco negro. Solte para observar. Matéria próxima entra em órbita e pode ser absorvida. O crescimento abre a câmera lentamente. Não há derrota, metas ou tempo limite.',button('Voltar','info-back','primary'));
 return panel('Feito para permanecer.','Umbra é o nome escolhido para o jogo. Arte procedural e ícones originais neste estudo. Gargantua, de Interstellar, é referência visual. Este pacote não inclui cenas, trilha ou assets do filme. Créditos finais do jogo serão preenchidos com autoria e licenças verificadas.',button('Voltar','info-back','primary'),'CRÉDITOS DO ESTUDO');
}
function portraitMarkup(){const opening=['home','returning'].includes(screen);if(opening)return `<div class="p-scrim"></div><div class="p-menu"><div class="type-overline">NO SEU TEMPO</div><h3 class="type-display">${esc(TOKENS.copy.brand)}</h3><p class="type-body">${screen==='returning'?'Seu universo está aqui, como você deixou.':'Deslize. Observe. Permaneça.'}</p><span class="native-button primary">${screen==='returning'?'Continuar':'Começar'}</span><span class="native-button text">Ajustes</span></div>`;return `<div class="p-brand">${esc(TOKENS.copy.brand).toUpperCase()}</div><div class="p-tools"><span></span><span></span></div>${screen==='game'&&hint?'<p class="p-hint">Deslize para explorar. Solte para observar.</p>':''}`}
function drawPortrait(){const opening=['home','returning'].includes(screen),c=TOKENS.layout.openingPortrait.holeCenterNormalized;engine.render($('portrait-canvas'),{...THEME,hole:THEME.hole*375/812},{time:sceneTime,game:true,x:0,y:opening?.5-c[1]:0})}
function draw(){engine.render($('scene-canvas'),THEME,{time:sceneTime,game:!['home','returning'].includes(screen)});engine.render($('hero-canvas'),THEME,{time:sceneTime,hero:true});$('portrait-ui').innerHTML=portraitMarkup();drawPortrait()}
function showScreen(next){if(!SCREENS[next])return;if(next==='settings'&&screen!=='settings')settingsOrigin=screen;if(['help','credits'].includes(next))infoOrigin=screen;if(next==='game'&&['home','returning'].includes(screen))hint=true;else if(next!=='game')hint=false;screen=next;renderScreen();draw();syncAudio();}
function renderScreen(){
 $('screen-ui').innerHTML=screenMarkup();const data=SCREENS[screen];['screen-name','screen-contract','screen-action','screen-preserve'].forEach((id,i)=>$(id).textContent=data[i]);
 document.querySelectorAll('[data-screen]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.screen===screen));b.tabIndex=b.dataset.screen===screen?0:-1});
 if(!document.querySelector('[data-screen][aria-selected="true"]'))document.querySelector('[data-screen]').tabIndex=0;
 $('extra-screen').value=['home','game','pause','settings'].includes(screen)?'':screen;
}
function syncPreferences(){
 ['component-music','audio-music','audio-effects'].forEach(id=>{const k=id.includes('effects')?'effects':'music';$(id).value=prefs[k];$(id+'-value').textContent=prefs[k]+'%'});
 ['reduced-motion','component-reduced'].forEach(id=>$(id).checked=prefs.reduced);$('component-vibration').checked=prefs.vibration;
 document.querySelectorAll('[name="quality-component"]').forEach(r=>r.checked=r.value===prefs.quality);
 $('quality-description').textContent={Auto:'Auto adapta efeitos ao desempenho. A simulação mantém as mesmas regras.',Alta:'Alta preserva mais partículas e resolução auxiliar. O budget ainda será medido.',Econômica:'Econômica reduz efeitos auxiliares e preserva núcleo, disco e arcos.'}[prefs.quality];
 document.body.classList.toggle('reduced-motion',prefs.reduced);animationEnabled=$('animate-scene').checked&&!prefs.reduced;draw();syncAudio();
}
document.querySelectorAll('[data-screen]').forEach(b=>{b.addEventListener('click',()=>showScreen(b.dataset.screen));b.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-screen]')];let index=tabs.indexOf(b);if(e.key==='ArrowRight')index=(index+1)%tabs.length;else if(e.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();showScreen(tabs[index].dataset.screen);tabs[index].focus()})});
$('extra-screen').addEventListener('change',e=>{if(e.target.value)showScreen(e.target.value)});
$('screen-ui').addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
 if(action==='sound'){await toggleAudio();renderScreen();return}
 if(action==='settings-back'){showScreen(settingsOrigin);return}if(action==='info-back'){showScreen(infoOrigin);return}
 if(action==='retry-load'||action==='retry-save'){b.disabled=true;b.setAttribute('aria-busy','true');b.textContent='Tentando…';clearTimeout(retryTimer);retryTimer=setTimeout(()=>{if((action==='retry-load'&&screen==='loaderror')||(action==='retry-save'&&screen==='saveerror')){showScreen(action==='retry-load'?'returning':'pause');toast('Tentativa concluída na demonstração. Nenhum arquivo Android foi alterado.')}},650);return}
 showScreen(action);
});
$('screen-ui').addEventListener('input',e=>{const k=e.target.dataset.pref;if(!k)return;prefs[k]=e.target.type==='checkbox'?e.target.checked:k==='quality'?e.target.value:Number(e.target.value);if(e.target.type==='range')e.target.parentElement.querySelector('output').textContent=prefs[k]+'%';syncPreferences()});
$('app-frame').addEventListener('pointerdown',e=>{if(screen==='game'&&!e.target.closest('button')){hint=false;renderScreen();toast('Gesto ilustrativo: a física será implementada no protótipo nativo.')}});
$('reset-demo').addEventListener('click',()=>{clearTimeout(retryTimer);Object.assign(prefs,{music:50,effects:55,vibration:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,quality:'Auto'});audioOn=false;hint=true;settingsOrigin='home';$('animate-scene').checked=true;showScreen('home');syncPreferences();toast('Demonstração restaurada.')});
['component-music','audio-music','audio-effects'].forEach(id=>$(id).addEventListener('input',e=>{prefs[id.includes('effects')?'effects':'music']=Number(e.target.value);syncPreferences();if(screen==='settings')renderScreen()}));
['reduced-motion','component-reduced'].forEach(id=>$(id).addEventListener('change',e=>{prefs.reduced=e.target.checked;syncPreferences();if(screen==='settings')renderScreen()}));
$('component-vibration').addEventListener('change',e=>{prefs.vibration=e.target.checked;if(screen==='settings')renderScreen();toast('Estado demonstrado. O HTML não aciona o motor de vibração.')});
document.querySelectorAll('[name="quality-component"]').forEach(r=>r.addEventListener('change',()=>{prefs.quality=r.value;syncPreferences();if(screen==='settings')renderScreen()}));
$('animate-scene').addEventListener('change',syncPreferences);
document.querySelectorAll('[data-component-demo]').forEach(b=>b.addEventListener('click',()=>toast('Componente: '+b.dataset.componentDemo+'. A ação é ilustrativa.')));
let messageSuccess=false;
$('message-retry').addEventListener('click',()=>{const b=$('message-retry');if(messageSuccess){messageSuccess=false;b.textContent='Tentar salvar novamente';$('message-copy').textContent=TOKENS.copy.saveError;$('message-status').textContent='Falha reapresentada para revisão.';return}b.disabled=true;b.setAttribute('aria-busy','true');b.textContent='Tentando…';setTimeout(()=>{messageSuccess=true;b.disabled=false;b.removeAttribute('aria-busy');b.textContent='Repetir exemplo de falha';$('message-copy').textContent='Tentativa concluída neste exemplo.';$('message-status').textContent='Sucesso demonstrativo. Nenhum save Android foi gravado.'},650)});
$('color-grid').innerHTML=Object.entries(TOKENS.colors).map(([key,c])=>`<article class="color-card"><div class="color-block" style="background:${c.value}"></div><div class="color-description"><b>${esc(key)}</b><code>${c.value}</code><p>${esc(c.role)}</p></div></article>`).join('');
const groups=[...new Set(CONTRAST.map(c=>c.foreground))];
$('contrast-table').innerHTML=groups.map(k=>{const rows=CONTRAST.filter(c=>c.foreground===k);return `<tr><td>${k}</td><td>4 fundos de UI</td><td>${Math.min(...rows.map(r=>r.ratio)).toFixed(2)}:1</td><td>${rows[0].minimum}:1</td><td class="success">${rows.every(r=>r.pass)?'Passou':'Revisar'}</td></tr>`}).join('');
$('contrast-summary').textContent=`${CONTRAST.length} pares verificados por luminância sRGB. Todos atingem o limiar definido. Não inclui texto diretamente sobre a cena.`;
$('type-specimens').innerHTML=Object.entries(TOKENS.typography.styles).map(([k,v])=>`<div class="type-row"><div class="type-meta"><b>${k}</b><span>${v.sizeSp} / ${v.lineHeightSp} sp<br>${v.weight} · ${v.trackingSp} sp</span></div><div><p class="type-${k}">${k==='display'?esc(TOKENS.copy.brand):k==='overline'?'NO SEU TEMPO':k==='title'?'Uma pausa.':'Deslize. Observe. Permaneça.'}</p><p class="tiny">${esc(v.usage)}</p></div></div>`).join('');
$('spacing-specimens').innerHTML=Object.entries(TOKENS.spacingDp).map(([k,v])=>`<div class="space-item"><div class="space-block" style="width:${v}px;height:${v}px;background:var(--obs-accent)"></div><b>${v} dp</b><span>${k}</span></div>`).join('');
const iconNames={pause:'Pausar',play:'Continuar',back:'Voltar',close:'Fechar',volume:'Áudio ativo',muted:'Áudio silenciado',settings:'Ajustes',help:'Ajuda',check:'Concluído',retry:'Tentar novamente',arrow:'Avançar',file:'Arquivo'};
$('icon-gallery').innerHTML=Object.entries(iconNames).map(([k,v])=>`<div class="icon-tile">${glyph(k)}<span>${v}</span><code>obs-${k}</code></div>`).join('');
$('motion-timeline').innerHTML=[['Pressão','press'],['Entrada de painel','panelEnter'],['Saída de painel','panelExit'],['Troca de tela','screenCrossfade'],['Pausa de áudio','audioPauseFade']].map(([label,k])=>`<div class="motion-row"><span>${label}</span><div class="motion-track"><div class="motion-bar" style="width:${TOKENS.motionMs[k]/350*100}%"></div></div><span>${TOKENS.motionMs[k]} ms</span></div>`).join('');
$('render-budget').innerHTML=Object.entries(TOKENS.render.particles.budgets).map(([k,v])=>`<tr><td>${{high:'Alta',balanced:'Equilíbrio · Auto inicia',economy:'Econômica'}[k]}</td><td>${v.count.toLocaleString('pt-BR')}</td><td>${v.renderScale}</td><td>${v.bloomMips}</td><td>${v.solidBodies}</td></tr>`).join('');
$('run-motion').addEventListener('click',()=>{$('motion-demo').classList.toggle('active');$('motion-status').textContent=prefs.reduced?'Mudança essencial · movimento reduzido':'600 ms · sem overshoot'});
new ResizeObserver(entries=>{for(const e of entries){if(e.target.id==='app-frame')e.target.style.setProperty('--frame-scale',e.contentRect.width/960);else e.target.style.setProperty('--demo-travel',Math.max(0,e.contentRect.width-68)+'px')}}).observe($('app-frame'));
const motionResize=new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--demo-travel',Math.max(0,e.contentRect.width-68)+'px')});motionResize.observe($('motion-demo'));
function syncAudio(){
 const paused=!['home','returning','game'].includes(screen)||document.hidden;
 if(audioContext&&ambientGain){const t=audioContext.currentTime;ambientGain.gain.cancelScheduledValues(t);ambientGain.gain.setTargetAtTime(audioOn&&!paused?prefs.music/100*.055:0,t,.09);effectsGain.gain.setTargetAtTime(prefs.effects/100*.18,t,.05)}
 $('audio-toggle').setAttribute('aria-pressed',String(audioOn));$('audio-toggle').textContent=audioOn?'Silenciar ambiente':'Ouvir ambiente';$('audio-visual').classList.toggle('active',audioOn&&!paused);
 $('audio-status').textContent=audioOn?(paused?'Ambiente suspenso durante pausa, ajustes ou tela de apoio.':'Ambiente demonstrativo ativo. Sem mixagem final.'):'Silencioso. Ative o ambiente ou uma nota para experimentar.';
}
async function ensureAudio(){
 const AudioAPI=window.AudioContext||window.webkitAudioContext;if(!AudioAPI){toast('Este navegador não oferece Web Audio. A especificação permanece disponível.');return false}
 try{if(!audioContext){audioContext=new AudioAPI();ambientGain=audioContext.createGain();ambientGain.gain.value=0;ambientGain.connect(audioContext.destination);effectsGain=audioContext.createGain();effectsGain.gain.value=prefs.effects/100*.18;effectsGain.connect(audioContext.destination);TOKENS.audio.demoDroneHz.forEach((hz,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=hz;g.gain.value=[.55,.3,.15][i];o.connect(g);g.connect(ambientGain);o.start()})}await audioContext.resume();return true}catch(e){toast('Áudio indisponível: '+e.message);return false}
}
async function toggleAudio(){if(!audioOn&&!await ensureAudio())return;audioOn=!audioOn;syncAudio()}
$('audio-toggle').addEventListener('click',async()=>{await toggleAudio();if(screen==='game')renderScreen()});
$('audio-note').addEventListener('click',async()=>{if(!await ensureAudio())return;const t=audioContext.currentTime;if(t-lastNote<TOKENS.audio.groupEventsMs/1000||effectVoices>=TOKENS.audio.effectVoicesMax)return;lastNote=t;effectVoices++;const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=TOKENS.audio.demoNotesHz[noteIndex++%TOKENS.audio.demoNotesHz.length];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+2.6);o.connect(g);g.connect(effectsGain);o.start(t);o.stop(t+2.7);o.onended=()=>{effectVoices--;o.disconnect();g.disconnect()};if(!audioOn)$('audio-status').textContent='Nota demonstrativa de absorção · ataque macio, cauda longa.'});
$('audio-visual').innerHTML=Array.from({length:45},(_,i)=>`<span style="--height:${14+Math.round(Math.abs(Math.sin(i*.44))*48)}px"></span>`).join('');
document.addEventListener('visibilitychange',()=>{if(document.hidden){audioOn=false;syncAudio();if(audioContext)audioContext.suspend();if(screen==='game')showScreen('pause')}lastFrame=0});
window.addEventListener('blur',()=>{audioOn=false;syncAudio();if(audioContext)audioContext.suspend();if(screen==='game')showScreen('pause')});
const tokenText=JSON.stringify(TOKENS,null,2);$('token-code').textContent=tokenText;$('tokens-copy').value=tokenText;
$('download-tokens').addEventListener('click',()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([tokenText],{type:'application/json'}));a.href=url;a.download='umbra-obsidiana-tokens.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('tokens-fallback').hidden=false;toast('Tokens preparados. Uma cópia manual também está disponível no handoff.')});
$('print-kit').addEventListener('click',()=>window.print());
$('mobile-nav').addEventListener('change',e=>$(e.target.value).scrollIntoView({behavior:prefs.reduced?'instant':'smooth'}));
const sectionObserver=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting);if(!visible.length)return;const id=visible[0].target.id;document.querySelectorAll('.rail nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));$('mobile-nav').value=id},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main>.section').forEach(s=>sectionObserver.observe(s));
const sceneObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.target.id==='hero-canvas')heroVisible=e.isIntersecting;else sceneVisible=e.isIntersecting}});sceneObserver.observe($('hero-canvas'));sceneObserver.observe($('app-frame'));
function loop(timestamp){requestAnimationFrame(loop);if(document.hidden||!animationEnabled){lastFrame=timestamp;return}if(timestamp-lastFrame<40)return;const delta=lastFrame?Math.min(.1,(timestamp-lastFrame)/1000):0;lastFrame=timestamp;if(['home','returning','game'].includes(screen)){sceneTime+=delta;if(sceneVisible)engine.render($('scene-canvas'),THEME,{time:sceneTime,game:screen==='game'});if(sceneVisible)drawPortrait();if(heroVisible)engine.render($('hero-canvas'),THEME,{time:sceneTime,hero:true})}}
renderScreen();syncPreferences();requestAnimationFrame(loop);
