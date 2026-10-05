// Tema disco de acreção: núcleo 13 sem o disco (sombra, arcos, anel e halo fixos); o disco varia.
// Códigos:
//   espessura:   0 fino, 1 médio, 2 espesso com bordas difusas
//   turbulencia: 0 filamentos, 1 células, 2 braços em espiral, 3 bandas suaves
//   rotacao:     0 lenta, 1 rápida, 2 diferencial forte
//   doppler:     0 leve, 1 forte, 2 com desvio de calor
//   reacao:      0 onda que circula, 1 mancha quente orbitando, 2 disco incha, 3 nenhuma

float achatamento(float espessura) { return espessura < 0.5 ? 6.4 : espessura < 1.5 ? 4.2 : 2.7; }

float giroDisco(float dr, float rotacao) {
    if (rotacao < 0.5) return TD * 0.45 * pow(max(dr, 1.0), -1.5);
    if (rotacao < 1.5) return TD * 1.5 * pow(max(dr, 1.0), -1.5);
    return TD * 1.1 * pow(max(dr, 1.0), -2.2);
}

float texturaDisco(float dr, float da, float giro, float turbulencia) {
    if (turbulencia < 0.5) {
        float f = fbmAngular(dr, da, giro, vec2(7.0, 1.7));
        float fino = fbmAngular(dr, da, giro * 1.15, vec2(22.0, 3.2));
        return 0.25 + 0.95 * f * f + 0.4 * (fino - 0.5);
    }
    if (turbulencia < 1.5) {
        float cel = fbmAngular(dr, da, giro, vec2(3.5, 3.0));
        return 0.2 + 1.3 * smoothstep(0.35, 0.75, cel);
    }
    if (turbulencia < 2.5) {
        float bracos = 0.5 + 0.5 * cos(3.0 * (da - giro) + log(max(dr, 1.0)) * 7.0);
        float f = fbmAngular(dr, da, giro, vec2(5.0, 1.4));
        return 0.25 + 1.1 * pow(bracos, 2.0) * (0.6 + 0.6 * f);
    }
    return 0.7 + 0.18 * sin(dr * 16.0 + 0.6 * sin(da * 2.0 - giro));
}

float discoVariavel(vec2 p, float espessura, float turbulencia, float rotacao, float doppler, float reacao, out float calor) {
    float incha = reacao > 1.5 && reacao < 2.5 ? pulso(2.6) * 0.5 * uMov : 0.0;
    float ach = achatamento(espessura) / (1.0 + incha);
    vec2 d = vec2(p.x, (p.y - INCLINACAO * p.x) * ach);
    float dr = length(d) / uR;
    float da = atan(d.y, d.x);
    float borda = espessura > 1.5 ? 0.6 : 0.25;
    float mascara = smoothstep(1.2, 1.2 + borda, dr) * (1.0 - smoothstep(2.4, 4.4 + borda, dr));
    if (espessura > 1.5) mascara *= 0.75 + 0.5 * fbm(vec2(p.x / uR * 2.0, p.y / uR * 6.0 - TD * 0.1));
    float giro = giroDisco(dr, rotacao);
    float textura = max(texturaDisco(dr, da, giro, turbulencia), 0.0);
    float aproxima = clamp(p.x / (uR * 2.6), -1.0, 1.0);
    float ganho = doppler < 0.5 ? 0.25 : 0.6;
    float dop = 1.0 + ganho * aproxima;
    dop = max(dop * dop, 0.08);
    calor = clamp(1.8 / dr - 0.45 + (doppler > 1.5 ? 0.55 : 0.2) * aproxima, 0.0, 1.0);
    float b = (textura * (0.2 + 0.85 / max(dr - 0.95, 0.32)) * 0.7 + gauss(dr - 1.42, 0.16) * 0.55) * dop;
    if (reacao < 0.5) {
        // Onda de brilho que percorre o anel a partir do ponto de queda.
        float s = uPulso.x;
        float frente = uPulso.z + s * 1.8 * uMov;
        float dist = abs(mod(da - frente + PI, TAU) - PI);
        b *= 1.0 + 1.4 * exp(-dist * dist * 6.0) * pulso(3.0) * exp(-(dr - 1.5) * 0.6);
    } else if (reacao < 1.5) {
        float s = uPulso.x;
        float ang = uPulso.z + s * 1.1 * uMov;
        float dist = abs(mod(da - ang + PI, TAU) - PI);
        b += exp(-dist * dist * 30.0 - pow(dr - 1.7, 2.0) * 8.0) * pulso(4.0) * 1.6;
    }
    return mascara * b;
}

vec3 cenaDisco(vec2 p, float espessura, float turbulencia, float rotacao, float doppler, float reacao) {
    float rn = length(p) / uR;
    vec3 c = nucleoSobre(fundoNucleo(p), p, 1.0);
    float calor;
    float d = discoVariavel(p, espessura, turbulencia, rotacao, doppler, reacao, calor);
    if (rn < 1.0 && (p.y - INCLINACAO * p.x) > -0.08 * uR * (1.0 + espessura)) d = 0.0;
    vec3 cor = corDisco(calor);
    if (doppler > 1.5) cor = mix(cor, C_QUENTE * 0.6, clamp(-p.x / (uR * 3.0), 0.0, 1.0) * 0.6);
    return c + cor * d;
}
