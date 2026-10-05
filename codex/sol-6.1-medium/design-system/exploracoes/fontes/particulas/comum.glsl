// Tema partículas: núcleo 13 fixo (inclui a poeira do halo); varia a vida de partículas ao redor.
// Códigos:
//   ambiente:      0 nenhuma, 1 esparsa, 2 densa (poeira de fundo)
//   comportamento: 0 órbita, 1 deriva, 2 atração em espiral
//   camada:        0 fundo com paralaxe, 1 plano do disco, 2 halo esférico
//   tamanho:       0 finas, 1 variadas, 2 grandes e suaves
//   reacao:        0 faíscas na absorção, 1 onda que empurra, 2 acendem, 3 nenhuma

vec3 cenaParticulas(vec2 p) {
    // Leve névoa quente no plano do disco para as partículas pousarem sobre algo.
    float plano = exp(-abs(p.y - INCLINACAO * p.x) / uR * 3.0) * exp(-abs(p.x) / uR * 0.35);
    return nucleoEscolhido(p) + C_QUENTE * plano * 0.04;
}

float tamanhoBase(float tamanho, float h) {
    if (tamanho < 0.5) return 0.9 + 0.7 * h;
    if (tamanho < 1.5) return 0.9 + 3.2 * h * h;
    return 3.0 + 5.0 * h;
}

float alfaTamanho(float tamanho) { return tamanho > 1.5 ? 0.12 : 1.0; }

// Empurrão radial da frente de onda da última absorção (decorativo).
vec2 empurrao(vec2 pos) {
    float r = length(pos);
    float s = uPulso.x;
    if (s > 3.0) return vec2(0.0);
    float frente = uR + s * 0.3;
    float forca = exp(-pow((r - frente) / 0.05, 2.0)) * (1.0 - s / 3.0) * uMov * (0.4 + 0.6 * uPulso.y);
    return pos / max(r, 1e-4) * forca * uR * 0.5;
}

// Partícula da camada principal.
void camadaPrincipal(float fj, float comportamento, float camada, out vec2 pos, out float profundidade) {
    float h1 = hash1(fj * 1.13);
    float h2 = hash1(fj * 2.71);
    float h3 = hash1(fj * 3.37);
    profundidade = 1.0;
    if (camada < 0.5) {
        // Fundo com paralaxe: três profundidades derivando devagar, a câmera "respira" lateralmente.
        profundidade = 0.3 + 0.7 * h3;
        vec2 base = vec2(h1, h2) * 2.0 - 1.0;
        vec2 deriva = comportamento > 0.5 && comportamento < 1.5 ? vec2(TD * 0.01, TD * 0.004) : vec2(0.0);
        vec2 paralaxe = vec2(sin(TD * 0.07), cos(TD * 0.05)) * 0.02 * profundidade;
        pos = mod(base * vec2(1.0, 0.6) + deriva * profundidade + paralaxe + 1.0, 2.0) - 1.0;
        pos.y *= 0.6;
        if (comportamento > 1.5) {
            float u = fract(h3 + TD * 0.02);
            pos = mix(pos, pos * 0.15, u * u);
        }
        return;
    }
    float r;
    float a;
    if (comportamento < 0.5) {
        r = mix(1.4, 6.0, pow(h1, 1.4)) * uR;
        a = h2 * TAU + TD * 0.9 * pow(r / uR, -1.5);
    } else if (comportamento < 1.5) {
        r = mix(1.6, 6.5, h1) * uR * (1.0 + 0.08 * sin(TD * 0.2 + h3 * TAU));
        a = h2 * TAU + TD * 0.05;
    } else {
        float u = fract(h1 + TD * (0.03 + 0.03 * h3));
        r = mix(6.0, 1.05, u * u) * uR;
        a = h2 * TAU + 2.5 * log(6.0 / (r / uR));
    }
    if (camada < 1.5) {
        vec2 l = vec2(cos(a), sin(a) / 6.4 * (1.0 + 2.0 * h3)) * r;
        pos = vec2(l.x, l.y + INCLINACAO * l.x);
        profundidade = sin(a) > 0.0 ? -1.0 : 1.0;
    } else {
        float incl = (h3 - 0.5) * PI;
        float no = hash1(fj * 5.9) * TAU;
        vec3 q = vec3(cos(a), sin(a) * cos(incl), sin(a) * sin(incl)) * r;
        q.xy = rot(no) * q.xy;
        pos = q.xy;
        profundidade = q.z > 0.0 ? -1.0 : 1.0;
    }
}

void pontosParticulas(int i, int n, float ambiente, float comportamento, float camada, float tamanho, float reacao,
                      out vec2 pos, out float tam, out vec3 cor, out float alfa) {
    int halo = n / 5;
    int fundoN = ambiente < 0.5 ? 0 : ambiente < 1.5 ? n / 10 : n * 3 / 10;
    float fj = float(i);
    float h = hash1(fj * 7.31);
    if (i < halo) { poeiraHalo(i, pos, tam, cor, alfa); return; }
    if (i < halo + fundoN) {
        pos = (vec2(hash1(fj * 1.9), hash1(fj * 2.3)) * 2.0 - 1.0) * vec2(1.0, 0.55);
        pos += vec2(sin(TD * 0.05 + h * 6.0), cos(TD * 0.04 + h * 5.0)) * 0.01;
        tam = 0.8 + 0.8 * h;
        cor = mix(C_ESTRELA, C_MEDIO, h);
        alfa = 0.05 + 0.1 * h;
        return;
    }
    float profundidade;
    camadaPrincipal(fj, comportamento, camada, pos, profundidade);
    if (reacao > 0.5 && reacao < 1.5) pos += empurrao(pos);
    tam = tamanhoBase(tamanho, h);
    float r = length(pos) / uR;
    cor = mix(C_QUENTE, C_MEDIO, clamp(r / 6.0 + h * 0.3, 0.0, 1.0));
    float cintila = 0.75 + 0.25 * sin(TD * (0.4 + h) + h * TAU);
    alfa = (0.16 + 0.28 * h) * cintila * alfaTamanho(tamanho);
    if (profundidade < 0.0 && r < 1.05) alfa = 0.0;
    if (reacao > 1.5 && reacao < 2.5) alfa *= 1.0 + 1.8 * pulso(2.2) * exp(-(r - 1.0) * 0.5);
    if (reacao < 0.5 && i % 7 == 0) {
        // Faíscas: um em cada sete grãos vira faísca saindo do ponto de absorção.
        float s = uPulso.x;
        vec2 impacto = vec2(cos(uPulso.z), sin(uPulso.z) * 0.3) * uR * 1.05;
        vec2 dir = vec2(cos(h * TAU), sin(h * TAU));
        if (s < 1.6) {
            pos = impacto + dir * s * uR * (0.3 + 0.6 * hash1(fj * 4.1));
            cor = mix(C_QUENTE, C_BRANCO, 0.5);
            alfa = (1.0 - s / 1.6) * 0.55 * (0.4 + 0.6 * uPulso.y) * uMov;
            tam = 1.2 + h;
        }
    }
}
