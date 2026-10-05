// Tema consumo: núcleo 13 fixo; varia como a matéria cai, se deforma, deixa rastro, toca o horizonte e
// como o núcleo responde. Ciclo do Capture.kt: ATTRACTED → CAPTURED → DISINTEGRATING → ABSORBED,
// aqui comprimido em uDuracaoQueda s (trajetória essencial: usa o relógio real, não TD).
// Códigos dos parâmetros:
//   trajetoria: 0 espiral, 1 mergulho, 2 órbita decaindo
//   espaguete:  0 estiramento, 1 fios, 2 nuvem, 3 fragmentos
//   rastro:     0 filamento, 1 cauda de poeira, 2 faíscas (pontos), 3 nenhum
//   contato:    0 apagar, 1 desvio para o vermelho, 2 brilho no contato
//   resposta:   0 arcos acendem, 1 onda gravitacional, 2 anel local, 3 halo se recolhe

// Posição (xy) e ângulo orbital (z) no progresso t ∈ [0, 1]; t = 1 encosta no horizonte.
vec3 posQueda(float t, float a0, float trajetoria) {
    float r0 = 4.2;
    float r;
    float a;
    if (trajetoria < 0.5) {
        r = mix(r0, 1.0, pow(t, 1.25));
        a = a0 + 1.3 * TAU * t * t;
    } else if (trajetoria < 1.5) {
        r = mix(r0, 1.0, pow(t, 2.4));
        a = a0 + 0.5 * t;
    } else {
        a = a0 + 3.0 * TAU * t;
        r = mix(r0, 1.0, t) * (1.0 + 0.22 * (1.0 - t) * cos(a - a0));
    }
    vec2 l = vec2(cos(a), sin(a) * 0.32) * r * uR;
    return vec3(l.x, l.y + INCLINACAO * l.x, a);
}

// Desvio para o vermelho: perto do horizonte o tempo parece desacelerar (a queda congela e escurece).
float tempoContato(float t, float contato) {
    if (contato < 0.5 || contato > 1.5 || t < 0.82) return t;
    return 0.82 + 0.18 * (1.0 - exp(-(t - 0.82) * 14.0));
}

float raioMaterial(float material, float massa) {
    float base = material < 0.5 ? 0.08 : material < 1.5 ? 0.1 : material < 2.5 ? 0.2 : 0.3;
    return uR * base * (0.75 + 0.5 * massa);
}

vec3 corMaterial(float material, float t) {
    vec3 c = material < 0.5 ? C_MEDIO
        : material < 1.5 ? mix(C_QUENTE, C_MEDIO, 0.3) * 0.8
        : material < 2.5 ? mix(C_ESTRELA, C_MEDIO, 0.5)
        : mix(C_QUENTE, C_BRANCO, 0.2);
    // Aquecimento por maré ao se aproximar.
    return mix(c, C_BRANCO, smoothstep(0.55, 0.95, t) * 0.55);
}

// Corpo elíptico esticado ao longo de `eixo` (direção do núcleo). duro: borda definida e lado iluminado.
float corpoForma(vec2 d, vec2 eixo, float raio, float estira, bool duro, vec2 luz) {
    float par = dot(d, eixo);
    float per = dot(d, vec2(-eixo.y, eixo.x));
    float q = length(vec2(par / (raio * (1.0 + estira)), per / (raio / (1.0 + 0.35 * estira))));
    if (!duro) return exp(-q * q * 1.6);
    float iluminado = 0.35 + 0.65 * clamp(dot(normalize(d + 1e-6), luz), 0.0, 1.0);
    return (smoothstep(1.0, 0.82, q) * iluminado + 0.25 * exp(-q * q));
}

bool escondido(vec3 q) {
    return sin(q.z) > 0.0 && length(q.xy) < uR * 1.02;
}

// Matéria em queda: corpo deformado + rastro + contato. Zero quando não há queda em curso.
vec3 materia(vec2 p, float trajetoria, float espaguete, float rastro, float contato) {
    float t0 = progressoQueda();
    if (t0 < 0.0) return vec3(0.0);
    float t = tempoContato(t0, contato);
    float material = uQueda.w;
    float raio = raioMaterial(material, uQueda.y);
    vec3 q = posQueda(t, uQueda.z, trajetoria);
    if (escondido(q)) return vec3(0.0);
    vec2 eixo = normalize(-q.xy + 1e-6);
    float s = smoothstep(0.35, 1.0, t);
    bool duro = material > 0.5 && material < 1.5 || material > 2.5;
    float b = 0.0;
    if (espaguete < 0.5) {
        b = corpoForma(p - q.xy, eixo, raio, 7.0 * s, duro, eixo);
    } else if (espaguete < 1.5) {
        for (int k = 0; k < 5; k++) {
            float fk = float(k) - 2.0;
            vec3 qk = posQueda(max(t - abs(fk) * 0.012 * s, 0.0), uQueda.z, trajetoria);
            vec2 off = vec2(-eixo.y, eixo.x) * fk * raio * 0.45 * (1.0 + 2.0 * s);
            b += corpoForma(p - qk.xy - off, eixo, raio * (1.0 - 0.6 * s), 10.0 * s, false, eixo) * (1.0 - 0.15 * abs(fk));
        }
        b *= 0.55;
    } else if (espaguete < 2.5) {
        float r2 = raio * (1.0 + 2.5 * s);
        b = corpoForma(p - q.xy, eixo, r2, 2.0 * s, false, eixo) / (1.0 + 2.0 * s);
        b *= 0.7 + 0.5 * fbm((p - q.xy) / uR * 6.0 + uQueda.x);
    } else {
        for (int k = 0; k < 6; k++) {
            float fk = float(k);
            vec3 qk = posQueda(max(t - fk * 0.03 * s, 0.0), uQueda.z + (hash1(fk + 3.0) - 0.5) * 0.25 * s, trajetoria);
            float rk = raio * (k == 0 ? 0.7 : 0.35 + 0.2 * hash1(fk));
            b += corpoForma(p - qk.xy, eixo, rk, 1.5 * s, duro, eixo);
        }
    }
    float rastroB = 0.0;
    if (rastro < 0.5) {
        for (int k = 1; k <= 14; k++) {
            float tk = t - float(k) * 0.012;
            if (tk < 0.0) break;
            vec3 qk = posQueda(tk, uQueda.z, trajetoria);
            if (escondido(qk)) continue;
            rastroB += gauss(length(p - qk.xy), raio * 0.22) * (1.0 - float(k) / 15.0);
        }
        rastroB *= 0.5;
    } else if (rastro < 1.5) {
        for (int k = 1; k <= 16; k++) {
            float tk = t - float(k) * 0.02;
            if (tk < 0.0) break;
            vec3 qk = posQueda(tk, uQueda.z, trajetoria);
            if (escondido(qk)) continue;
            float w = raio * (0.4 + float(k) * 0.09);
            rastroB += gauss(length(p - qk.xy), w) * (1.0 - float(k) / 17.0) * (0.6 + 0.6 * ruido((p - qk.xy) / uR * 9.0 + float(k)));
        }
        rastroB *= 0.22;
    }
    vec3 cor = corMaterial(material, t);
    float brilho = 1.0;
    if (contato < 0.5) {
        brilho = 1.0 - smoothstep(0.82, 1.0, t0);
    } else if (contato < 1.5) {
        float v = smoothstep(0.7, 1.0, t0);
        cor = mix(cor, C_QUENTE * 0.55, v);
        brilho = exp(-max(t0 - 0.78, 0.0) * 9.0);
    }
    vec3 c = cor * (b * 0.9 + rastroB) * brilho;
    if (contato > 1.5) {
        c += corAnel(0.6) * gauss(length(p - q.xy), raio * 2.6) * smoothstep(0.86, 1.0, t0) * 0.45;
    }
    return c;
}

// Núcleo 13 com a resposta à absorção escolhida.
vec3 nucleoComResposta(vec2 p, float resposta, float trajetoria) {
    float r = length(p);
    float rn = r / uR;
    vec2 b = lentePontual(p, uR * 1.55);
    if (resposta > 0.5 && resposta < 1.5) b += (p / max(r, 1e-4)) * onda(r, 0.3, 0.03, 3.0) * 0.04;
    vec3 c = nucleoSobre(fundo(b), p, resposta < 0.5 ? 1.15 : 0.9);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    if (resposta > 1.5 && resposta < 2.5) {
        vec2 impacto = posQueda(1.0, uPulso.z, trajetoria).xy;
        float local = exp(-pow(length(p - impacto) / (uR * 0.9), 2.0));
        c += corAnel(0.9) * gauss(rn - 1.03, 0.025) * (0.3 + 1.2 * local) * pulso(2.4) * 1.3;
    }
    if (resposta > 2.5) {
        float recolhe = pulso(2.6);
        c *= 1.0 - 0.4 * recolhe * smoothstep(1.15, 1.7, rn) * (1.0 - smoothstep(3.5, 5.5, rn));
        c += corAnel(0.85) * gauss(rn - 1.02, 0.012) * recolhe * 1.1;
    }
    return c;
}

// Faíscas que se soltam do corpo durante a queda e um estouro suave no impacto.
void faiscas(int j, int total, float trajetoria, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    float fj = float(j);
    vec2 dir = vec2(cos(hash1(fj * 2.3) * TAU), sin(hash1(fj * 2.3) * TAU));
    float t = progressoQueda();
    tamanho = 1.0 + 1.5 * hash1(fj * 4.4);
    cor = mix(C_QUENTE, C_BRANCO, hash1(fj * 5.1) * 0.6);
    if (t >= 0.0) {
        float nasce = 0.25 + 0.7 * hash1(fj * 1.9);
        float idade = (t - nasce) * uDuracaoQueda;
        vec3 q = posQueda(nasce, uQueda.z, trajetoria);
        pos = q.xy + dir * idade * uR * 0.35 - q.xy * idade * 0.25;
        alfa = (idade > 0.0 && idade < 1.2) ? (1.0 - idade / 1.2) * 0.55 : 0.0;
        if (escondido(vec3(pos, q.z))) alfa = 0.0;
    } else {
        float s = uPulso.x;
        vec2 impacto = posQueda(1.0, uPulso.z, trajetoria).xy;
        pos = impacto + dir * s * uR * (0.25 + 0.5 * hash1(fj * 7.3));
        alfa = s < 1.4 ? (1.0 - s / 1.4) * 0.5 * uMov * (0.4 + 0.6 * uPulso.y) : 0.0;
    }
}

// Pontos: 60% poeira do halo (núcleo 13) + 40% faíscas quando o rastro é de faíscas.
void pontosConsumo(int i, int n, float trajetoria, float rastro, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    int halo = rastro > 1.5 && rastro < 2.5 ? n * 6 / 10 : n;
    if (i < halo) poeiraHalo(i, pos, tamanho, cor, alfa);
    else faiscas(i - halo, n - halo, trajetoria, pos, tamanho, cor, alfa);
}
