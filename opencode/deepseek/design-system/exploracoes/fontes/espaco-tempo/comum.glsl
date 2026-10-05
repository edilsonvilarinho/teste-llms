// Tema espaço-tempo: núcleo 13 fixo; varia como a curvatura e as ondas gravitacionais aparecem.
// Códigos:
//   representacao: 0 grade deformada, 1 estrelas arrastadas, 2 linhas de poeira (pontos), 3 só lente
//   ondas:         0 anéis na absorção, 1 quadrupolo contínuo, 2 pulso único forte, 3 nenhuma
//   arrasto:       0 nenhum, 1 leve, 2 forte
//   alcance:       0 curto, 1 médio, 2 longo
//   intensidade:   0 sutil, 1 média, 2 marcada

float alcanceR(float alcance) { return alcance < 0.5 ? 2.5 : alcance < 1.5 ? 5.0 : 10.0; }
float forcaK(float intensidade) { return intensidade < 0.5 ? 0.35 : intensidade < 1.5 ? 0.7 : 1.15; }
float giroArrasto(float arrasto) { return arrasto < 0.5 ? 0.0 : arrasto < 1.5 ? 0.5 : 1.3; }

// Frente de onda que sai do núcleo `atraso` s depois da absorção (decorativa).
float ondaAtrasada(float r, float atraso, float velocidade, float largura, float duracao) {
    float s = uPulso.x - atraso;
    if (s < 0.0 || s > duracao) return 0.0;
    return gauss(r - (uR + s * velocidade), largura) * (1.0 - s / duracao) * uMov * (0.4 + 0.6 * uPulso.y);
}

// Amplitude radial das ondas gravitacionais no ponto.
float amplitudeOnda(vec2 p, float ondas, float alcance) {
    float r = length(p);
    if (ondas < 0.5) {
        return ondaAtrasada(r, 0.0, 0.26, 0.025, 3.6) + 0.6 * ondaAtrasada(r, 0.35, 0.26, 0.02, 3.6)
            + 0.35 * ondaAtrasada(r, 0.7, 0.26, 0.018, 3.6);
    }
    if (ondas < 1.5) {
        float a = atan(p.y, p.x);
        return 0.55 * cos(2.0 * a - TD * 1.4 + r / uR * 2.6) * exp(-r / (alcanceR(alcance) * uR * 1.4))
            * smoothstep(1.2, 2.2, r / uR) * uMov;
    }
    if (ondas < 2.5) return 2.2 * ondaAtrasada(r, 0.0, 0.14, 0.07, 5.5);
    return 0.0;
}

// Coordenada do espaço "plano" vista no ponto p (poço puxa para dentro, arrasto torce, ondas deslocam).
vec2 deformar(vec2 p, float ondas, float arrasto, float alcance, float intensidade) {
    float r = length(p);
    vec2 dir = p / max(r, 1e-4);
    float alc = alcanceR(alcance) * uR;
    float k = forcaK(intensidade);
    vec2 q = p + dir * k * uR * uR * 1.6 / (r + uR * 0.6) * exp(-r / alc);
    q = rot(giroArrasto(arrasto) * exp(-r / alc) * uR / (r + 0.3 * uR)) * q;
    q += dir * amplitudeOnda(p, ondas, alcance) * uR * (0.15 + 0.2 * k);
    return q;
}

float linhasGrade(vec2 q, float celula) {
#ifdef FRAGMENTO
    vec2 g = q / celula;
    vec2 d = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), vec2(1e-4));
    return 1.0 - min(min(d.x, d.y), 1.0);
#else
    return 0.0;
#endif
}

// Fundo com a representação escolhida, antes do núcleo.
vec3 fundoCurvo(vec2 p, float representacao, float ondas, float arrasto, float alcance, float intensidade) {
    vec2 q = deformar(p, ondas, arrasto, alcance, intensidade);
    vec2 b = lentePontual(p, uR * 1.55) + (q - p);
    float rn = length(p) / uR;
    float k = forcaK(intensidade);
    vec3 c;
    if (representacao > 0.5 && representacao < 1.5) {
        // Estrelas arrastadas: média ao longo da direção do fluxo (radial + arrasto).
        vec2 fluxo = normalize(q - p + vec2(-p.y, p.x) * giroArrasto(arrasto) * 0.3 + 1e-5) * uR * 0.11 * (0.5 + k);
        c = vec3(0.0);
        for (int i = 0; i < 8; i++) c += fundo(b + fluxo * float(i)) * (1.0 - float(i) * 0.08);
        c /= 2.6;
    } else {
        c = fundo(b);
    }
    if (representacao < 0.5) {
        float l = linhasGrade(q, uR * 0.55);
        float alcanceVis = exp(-length(p) / (alcanceR(alcance) * uR * 2.2));
        float poco = smoothstep(1.05, 2.4, rn);
        c += mix(C_MEDIO, C_QUENTE, exp(-rn * 0.35)) * l * (0.06 + 0.16 * k) * (0.35 + 0.65 * alcanceVis) * poco;
    }
    float frente = amplitudeOnda(p, ondas, alcance);
    c += C_MEDIO * max(frente, 0.0) * 0.035 * (0.5 + k);
    return c;
}

vec3 espacoTempo(vec2 p, float representacao, float ondas, float arrasto, float alcance, float intensidade) {
    float rn = length(p) / uR;
    vec3 c = nucleoSobre(fundoCurvo(p, representacao, ondas, arrasto, alcance, intensidade), p, 1.0);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    return c + corDisco(calor) * d;
}

// Linhas de poeira: grãos descem por espirais logarítmicas até o núcleo, torcidas pelo arrasto.
void linhasPoeira(int j, float arrasto, float alcance, float intensidade, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    float fj = float(j);
    float linha = mod(fj, 64.0);
    float a0 = linha / 64.0 * TAU + hash1(linha) * 0.08;
    float u = fract(hash1(fj * 1.37) + TD * (0.025 + 0.02 * forcaK(intensidade)));
    float r0 = alcanceR(alcance) * 0.9 + 2.0;
    float r = mix(r0, 1.15, u * u) * uR;
    float a = a0 + (0.35 + giroArrasto(arrasto)) * log(r0 * uR / r);
    pos = vec2(cos(a), sin(a)) * r;
    tamanho = 1.0 + 0.8 * hash1(fj * 2.9);
    cor = mix(C_MEDIO, C_QUENTE, u);
    alfa = sin(u * PI) * (0.12 + 0.18 * forcaK(intensidade));
}

void pontosEspaco(int i, int n, float representacao, float arrasto, float alcance, float intensidade, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    int halo = representacao > 1.5 && representacao < 2.5 ? n / 3 : n;
    if (i < halo) poeiraHalo(i, pos, tamanho, cor, alfa);
    else linhasPoeira(i - halo, arrasto, alcance, intensidade, pos, tamanho, cor, alfa);
}
