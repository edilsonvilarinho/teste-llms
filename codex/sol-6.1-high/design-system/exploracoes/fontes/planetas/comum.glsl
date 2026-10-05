// Tema planetas, rodada 2 (01/10/2026): catálogo vivo. Cada variação é um ESTILO de renderização aplicado
// a um conjunto de 10 corpos de tipos diferentes orbitando o núcleo 13. Cores da matéria: M_* de
// render.matterColors (só matéria). Códigos:
//   iluminacao: 0 terminador pelo disco, 1 contraluz, 2 terminador + contraluz, 3 emissiva suave
//   estilo:     0 realista, 1 ilustrado (faixas chapadas + contorno), 2 gravura (meio-tom), 3 minimal (gradiente)
//   atmosfera:  0 nenhuma, 1 fina, 2 halo largo
//   saturacao:  0 contida, 1 média, 2 viva
//   conjunto:   0 sistema planetário, 1 gelo e fogo, 2 estelar, 3 misto com cometas
// Tipos de corpo:
//   0 rochoso, 1 lava, 2 gelo, 3 oceano, 4 deserto, 5 gasoso com anéis, 6 gigante de gelo, 7 lua,
//   8 cometa, 9 asteroide, 10 anã vermelha, 11 estrela azul, 12 anã branca, 13 gigante vermelha,
//   14 galáxia, 15 nebulosa

// Tipo, raio (em R) e órbita (em R) do k-ésimo corpo de cada conjunto.
vec3 corpoDoConjunto(int k, float conjunto) {
    if (conjunto < 0.5) {
        if (k == 0) return vec3(0.0, 0.16, 2.1);
        if (k == 1) return vec3(3.0, 0.22, 2.7);
        if (k == 2) return vec3(4.0, 0.2, 3.3);
        if (k == 3) return vec3(5.0, 0.34, 4.1);
        if (k == 4) return vec3(6.0, 0.28, 4.9);
        if (k == 5) return vec3(7.0, 0.09, 2.4);
        if (k == 6) return vec3(1.0, 0.15, 3.7);
        if (k == 7) return vec3(2.0, 0.14, 5.6);
        if (k == 8) return vec3(9.0, 0.1, 6.2);
        return vec3(8.0, 0.08, 5.2);
    }
    if (conjunto < 1.5) {
        if (k == 0) return vec3(1.0, 0.24, 2.2);
        if (k == 1) return vec3(2.0, 0.22, 2.9);
        if (k == 2) return vec3(13.0, 0.42, 4.6);
        if (k == 3) return vec3(6.0, 0.3, 3.7);
        if (k == 4) return vec3(8.0, 0.1, 5.5);
        if (k == 5) return vec3(1.0, 0.12, 3.2);
        if (k == 6) return vec3(2.0, 0.11, 4.2);
        if (k == 7) return vec3(11.0, 0.2, 6.1);
        if (k == 8) return vec3(9.0, 0.09, 2.6);
        return vec3(7.0, 0.08, 5.0);
    }
    if (conjunto < 2.5) {
        if (k == 0) return vec3(10.0, 0.18, 2.3);
        if (k == 1) return vec3(11.0, 0.22, 3.0);
        if (k == 2) return vec3(12.0, 0.08, 2.7);
        if (k == 3) return vec3(13.0, 0.45, 4.4);
        if (k == 4) return vec3(15.0, 0.9, 5.9);
        if (k == 5) return vec3(14.0, 0.8, 6.4);
        if (k == 6) return vec3(5.0, 0.26, 3.6);
        if (k == 7) return vec3(3.0, 0.15, 5.1);
        if (k == 8) return vec3(8.0, 0.09, 4.0);
        return vec3(9.0, 0.08, 3.3);
    }
    if (k == 0) return vec3(0.0, 0.15, 2.2);
    if (k == 1) return vec3(1.0, 0.18, 2.8);
    if (k == 2) return vec3(3.0, 0.2, 3.4);
    if (k == 3) return vec3(5.0, 0.3, 4.2);
    if (k == 4) return vec3(8.0, 0.11, 3.0);
    if (k == 5) return vec3(10.0, 0.18, 5.0);
    if (k == 6) return vec3(14.0, 0.75, 6.2);
    if (k == 7) return vec3(15.0, 0.8, 5.6);
    if (k == 8) return vec3(8.0, 0.09, 4.7);
    return vec3(4.0, 0.16, 3.9);
}

vec3 corBase(float tipo, vec2 n2, float detalhe) {
    if (tipo < 0.5) return mix(C_MEDIO * 0.55, C_QUENTE * 0.75, detalhe);
    if (tipo < 1.5) return mix(C_FUNDO * 4.0, M_LAVA, smoothstep(0.55, 0.75, detalhe));
    if (tipo < 2.5) return mix(M_GELO, C_BRANCO, detalhe * 0.6);
    if (tipo < 3.5) return mix(M_OCEANO, M_TERRA, smoothstep(0.52, 0.58, detalhe));
    if (tipo < 4.5) return mix(M_DESERTO * 0.8, M_DESERTO, 0.5 + 0.5 * sin(n2.y * 18.0 + detalhe * 4.0));
    if (tipo < 5.5) return mix(M_GAS, C_MEDIO, 0.5 + 0.5 * sin(n2.y * 12.0 + detalhe * 3.0));
    if (tipo < 6.5) return mix(M_GELO, M_OCEANO, 0.3 + 0.2 * sin(n2.y * 6.0 + detalhe));
    return mix(C_MEDIO * 0.5, C_MEDIO * 0.85, detalhe);
}

vec3 aplicarSaturacao(vec3 c, float saturacao) {
    float l = dot(c, vec3(0.333));
    vec3 neutro = mix(C_MEDIO, C_QUENTE, 0.35) * l * 1.2;
    return mix(neutro, c, saturacao < 0.5 ? 0.45 : saturacao < 1.5 ? 0.72 : 1.0);
}

float meioTom(float luz) {
#ifdef FRAGMENTO
    vec2 g = fract(gl_FragCoord.xy / 4.0) - 0.5;
    return step(length(g), sqrt(clamp(luz, 0.0, 1.0)) * 0.62);
#else
    return luz;
#endif
}

// Corpo sólido (tipos 0–9) em coordenadas locais d (unidades do raio do corpo).
vec4 corpoSolido(vec2 d, float tipo, vec2 dirLuz, float iluminacao, float estilo, float atmosfera, float saturacao, float semente) {
    float q = length(d);
    if (tipo > 8.5) q *= 1.0 + 0.25 * (ruido(vec2(atan(d.y, d.x) * 2.0, semente)) - 0.5);
    vec3 cor = vec3(0.0);
    float cobertura = 0.0;
    vec3 luzDir = normalize(vec3(dirLuz, 0.55));
    if (q < 1.0) {
        vec3 n = vec3(d, sqrt(max(1.0 - q * q, 0.0)));
        vec2 uv = n.xy * 2.2 + vec2(TD * 0.12, semente * 5.0);
        float detalhe = estilo > 2.5 ? 0.5 : fbm(uv * (tipo < 0.5 || tipo > 6.5 ? 2.6 : 1.6));
        if (estilo > 0.5 && estilo < 1.5) detalhe = floor(detalhe * 3.0 + 0.5) / 3.0;
        vec3 base = corBase(tipo, n.xy, detalhe);
        if (tipo < 0.5 || tipo > 6.5) base *= 1.0 - smoothstep(0.62, 0.7, ruido(uv * 4.0)) * 0.4;
        if (tipo > 2.5 && tipo < 3.5) base = mix(base, C_BRANCO, smoothstep(0.55, 0.8, fbm(uv * 2.0 + 9.0)) * 0.7);
        float lambert = max(dot(n, luzDir), 0.0);
        float rim = pow(1.0 - n.z, 3.0) * max(dot(normalize(d + 1e-5), dirLuz), 0.0);
        if (estilo > 0.5 && estilo < 1.5) lambert = smoothstep(0.05, 0.12, lambert) * 0.85 + 0.15 * lambert;
        float luz = iluminacao < 0.5 ? 0.07 + lambert
            : iluminacao < 1.5 ? 0.05 + 1.7 * rim
            : iluminacao < 2.5 ? 0.06 + 0.8 * lambert + 1.3 * rim
            : 0.55 + 0.45 * lambert;
        if (estilo > 1.5 && estilo < 2.5) luz = meioTom(luz) * 0.9 + 0.08;
        cor = aplicarSaturacao(base, saturacao) * luz;
        if (tipo > 0.5 && tipo < 1.5) cor += M_LAVA * smoothstep(0.6, 0.78, detalhe) * 0.9; // fendas incandescentes
        if (estilo > 0.5 && estilo < 1.5) cor = mix(cor, C_FUNDO, smoothstep(0.9, 0.98, q) * 0.8); // contorno
        cobertura = smoothstep(1.0, 0.95, q);
    }
    float atmo = atmosfera < 0.5 ? 0.0 : atmosfera < 1.5 ? 0.14 : 0.45;
    if (atmo > 0.0 && tipo < 6.5) {
        vec3 tom = tipo < 0.5 ? C_MEDIO : tipo < 1.5 ? M_LAVA : tipo < 2.5 ? M_GELO : tipo < 3.5 ? M_GELO
            : tipo < 4.5 ? M_DESERTO : tipo < 5.5 ? M_GAS : M_GELO;
        float halo = exp(-max(q - 1.0, 0.0) / atmo * 3.0) * smoothstep(0.82, 1.0, q);
        float lado = 0.3 + 0.7 * max(dot(normalize(d + 1e-5), dirLuz), 0.0);
        cor += aplicarSaturacao(tom, saturacao) * halo * lado * 0.55;
    }
    if (tipo > 4.5 && tipo < 5.5) {
        // Anéis inclinados: metade de trás sob o planeta, metade da frente por cima.
        vec2 a = rot(0.35) * d;
        float r = length(vec2(a.x, a.y * 3.4));
        float anel = smoothstep(1.35, 1.45, r) * (1.0 - smoothstep(2.15, 2.3, r)) * (0.6 + 0.4 * sin(r * 22.0));
        bool frente = a.y < 0.0;
        if (frente || q > 1.0) cor = mix(cor, aplicarSaturacao(mix(C_MEDIO, M_DESERTO, 0.5), saturacao) * 0.8, anel * 0.85);
        cobertura = max(cobertura, anel * 0.85);
    }
    return vec4(cor, cobertura);
}

vec4 corpoEstelar(vec2 d, float tipo, float saturacao) {
    float q = length(d);
    float a = atan(d.y, d.x);
    vec3 tom = tipo < 10.5 ? M_ESTRELA_VERMELHA : tipo < 11.5 ? M_ESTRELA_AZUL : tipo < 12.5 ? C_BRANCO : M_ESTRELA_VERMELHA;
    tom = aplicarSaturacao(tom, saturacao);
    float disco = smoothstep(1.0, 0.94, q);
    vec3 cor = mix(C_BRANCO, tom, smoothstep(0.0, 1.0, q * q)) * disco * (tipo > 12.5 ? 0.85 : 1.15);
    if (tipo > 12.5) cor *= 0.75 + 0.35 * fbm(d * 3.0 + TD * 0.08); // gigante vermelha granulada
    float coroa = exp(-max(q - 1.0, 0.0) * (tipo > 11.5 && tipo < 12.5 ? 1.2 : 2.4)) * (1.0 - disco);
    cor += tom * coroa * (0.5 + 0.3 * fbm(vec2(a * 3.0, TD * 0.3)));
    return vec4(cor, disco);
}

vec4 corpoDifuso(vec2 d, float tipo, float saturacao) {
    if (tipo < 14.5) {
        vec2 g = rot(0.5) * d;
        g.y /= 0.45;
        float q = length(g);
        float a = atan(g.y, g.x);
        float bracos = pow(0.5 + 0.5 * cos(2.0 * (a - log(max(q, 0.05)) * 2.4 - TD * 0.1)), 3.0);
        float brilho = exp(-q * 2.4) * (0.3 + 1.1 * bracos * (0.6 + 0.4 * fbm(g * 6.0))) + exp(-q * q * 40.0) * 0.8;
        return vec4(aplicarSaturacao(mix(M_ESTRELA_AZUL, C_QUENTE, smoothstep(0.0, 0.7, q)), saturacao) * brilho * 0.8, 0.0);
    }
    float nuvem = fbm(d * 1.6 + vec2(TD * 0.03, 0.0));
    float forma = exp(-dot(d, d) * 1.4) * smoothstep(0.35, 0.8, nuvem);
    vec3 tom = mix(M_NEBULOSA, M_GAS, fbm(d * 2.5 + 4.0));
    return vec4(aplicarSaturacao(tom, saturacao) * forma * 0.7, 0.0);
}

// Cauda sempre oposta à luz (vento da estrela ou radiação do disco).
vec4 cometa(vec2 p, vec2 c, float raio, float saturacao, vec2 fora) {
    vec2 d = p - c;
    float ao = dot(d, fora);
    float lado = dot(d, vec2(-fora.y, fora.x));
    float nucleo = exp(-dot(d, d) / (raio * raio * 0.5));
    float cauda = smoothstep(0.0, raio, ao) * exp(-ao / (raio * 9.0)) * exp(-pow(lado / (raio * (0.5 + ao / raio * 0.18)), 2.0));
    vec3 cor = aplicarSaturacao(mix(M_GELO, C_BRANCO, 0.4), saturacao) * (nucleo * 1.2 + cauda * 0.55);
    return vec4(cor, 0.0);
}

// Sem buraco negro (uNucleo = 0): os 10 corpos ficam soltos no espaço, maiores, numa grade frouxa de 5 × 2,
// derivando devagar e iluminados por uma estrela fora de quadro (alto à esquerda). Com buraco negro:
// orbitam o núcleo 13 e são iluminados pelo disco.
const vec2 LUZ_ESTRELA = vec2(-0.75, 0.66); // nao-cor

vec3 catalogo(vec2 p, float iluminacao, float estilo, float atmosfera, float saturacao, float conjunto) {
    bool livre = uNucleo < 0.5;
    vec3 c = livre ? fundo(p) : nucleoEscolhido(p);
    for (int k = 0; k < 10; k++) {
        vec3 info = corpoDoConjunto(k, conjunto);
        float tipo = info.x;
        float raio;
        vec2 centro;
        vec2 dirLuz;
        if (livre) {
            // Grade que se adapta à proporção da vista: 5 × 2 larga, 3 × 4 média, 2 × 5 estreita.
            float fk = float(k);
            float meiaLargura = 0.5 * uRes.x / uRes.y;
            float colunas = meiaLargura < 0.55 ? 2.0 : meiaLargura < 0.95 ? 3.0 : 5.0;
            float linhas = ceil(10.0 / colunas);
            vec2 celula = vec2(2.0 * meiaLargura * 0.94 / colunas, 0.94 / linhas);
            vec2 vaga = vec2(mod(fk, colunas) - (colunas - 1.0) * 0.5, (linhas - 1.0) * 0.5 - floor(fk / colunas)) * celula;
            vaga += (vec2(hash1(fk * 3.1), hash1(fk * 5.7)) - 0.5) * celula * 0.22;
            vaga += vec2(sin(TD * 0.05 + fk), cos(TD * 0.04 + fk * 1.7)) * 0.01;
            centro = vaga;
            float escala = min(min(celula.x, celula.y) / 0.3, 1.15);
            raio = clamp(info.y, 0.08, 0.34) * 0.24 * escala;
            if (tipo > 13.5) raio = 0.1 * escala;
            if (tipo > 9.5 && tipo < 13.5) raio *= 0.75;
            dirLuz = normalize(LUZ_ESTRELA);
        } else {
            raio = info.y * uR;
            float fase = float(k) * 2.399 + conjunto;
            float ang = fase + TD * 0.8 * pow(info.z, -1.5);
            vec2 l = vec2(cos(ang), sin(ang) * 0.34) * info.z * uR;
            centro = vec2(l.x, l.y + INCLINACAO * l.x);
            if (sin(ang) > 0.0 && length(centro) < uR * 1.1) continue;
            dirLuz = normalize(-centro);
        }
        float alcance = tipo > 13.5 ? raio * 1.8 : tipo > 7.5 && tipo < 8.5 ? raio * 14.0 : raio * 2.6;
        if (length(p - centro) > alcance) continue;
        vec4 corpoCor;
        if (tipo > 7.5 && tipo < 8.5) corpoCor = cometa(p, centro, raio, saturacao, -dirLuz);
        else if (tipo > 13.5) corpoCor = corpoDifuso((p - centro) / raio, tipo, saturacao);
        else if (tipo > 9.5) corpoCor = corpoEstelar((p - centro) / raio, tipo, saturacao);
        else corpoCor = corpoSolido((p - centro) / raio, tipo, dirLuz, iluminacao, estilo, atmosfera, saturacao, float(k));
        c = mix(c, vec3(0.0), corpoCor.a) + corpoCor.rgb;
    }
    return c;
}
