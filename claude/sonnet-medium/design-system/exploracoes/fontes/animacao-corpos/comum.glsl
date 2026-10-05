// Tema animação dos corpos: estilo escolhido em planetas (04 · Silhuetas coloridas: contraluz, realista,
// halo largo, cores vivas) fixo, num catálogo de 12 corpos de tipos diferentes. Varia só a animação.
// Códigos:
//   giro:      0 lenta, 1 visível, 2 rápida (rotação própria das superfícies)
//   luas:      0 nenhuma, 1 uma por planeta, 2 sistemas de luas
//   estelar:   0 calma, 1 pulsação, 2 erupções na coroa, 3 proeminências
//   movimento: 0 deriva suave, 1 paralaxe em camadas, 2 órbita compartilhada, 3 balanço
//   extra:     0 nuvens e tempestades, 1 cauda viva de cometa, 2 anéis cintilantes, 3 tudo junto
// Tipos: 1 lava, 2 gelo, 3 oceano, 4 deserto, 5 gasoso com anéis, 6 gigante de gelo, 8 cometa,
// 9 asteroide, 11 estrela azul, 13 gigante vermelha, 14 galáxia, 15 nebulosa, 10 anã vermelha

const vec2 LUZ = vec2(-0.75, 0.66); // nao-cor

float tipoDoCatalogo(int k) {
    if (k == 0) return 3.0;
    if (k == 1) return 5.0;
    if (k == 2) return 11.0;
    if (k == 3) return 8.0;
    if (k == 4) return 1.0;
    if (k == 5) return 13.0;
    if (k == 6) return 2.0;
    if (k == 7) return 14.0;
    if (k == 8) return 9.0;
    if (k == 9) return 6.0;
    if (k == 10) return 15.0;
    return 4.0;
}

float tamanhoDoTipo(float t) {
    if (t > 12.5 && t < 13.5) return 0.3;
    if (t > 4.5 && t < 6.5) return 0.3;
    if (t > 13.5) return 0.42;
    if (t > 8.5 && t < 9.5) return 0.11;
    if (t > 7.5 && t < 8.5) return 0.1;
    if (t > 10.5 && t < 11.5) return 0.17;
    return 0.2;
}

bool extraAtivo(float extra, float qual) { return extra > 2.5 || abs(extra - qual) < 0.5; }

float velocidadeGiro(float giro) { return giro < 0.5 ? 0.12 : giro < 1.5 ? 0.4 : 0.9; }

// Normal girada em torno do eixo vertical: o relevo atravessa o disco e volta pelo outro lado.
vec3 girar(vec3 n, float angulo) {
    float c = cos(angulo);
    float s = sin(angulo);
    return vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z);
}

vec2 coordSuperficie(vec3 m) { return m.xy * 1.7 + vec2(m.z * 1.3, m.z * 0.4); }

vec3 saturar(vec3 c) { return c; } // estilo 04: cores vivas (sem mistura com o neutro)

// Corpo sólido no estilo 04 (contraluz + halo largo), com rotação, nuvens, tempestades e anéis animados.
vec4 corpoAnimado(vec2 d, float tipo, vec2 dirLuz, float giro, float extra, float semente) {
    float q = length(d);
    float giroAng = TD * velocidadeGiro(giro) * (tipo > 4.5 && tipo < 6.5 ? 1.5 : 1.0) + semente;
    if (tipo > 8.5 && tipo < 9.5) {
        q *= 1.0 + 0.28 * (ruido(vec2(atan(d.y, d.x) * 2.0 + giroAng * 1.5, semente)) - 0.5); // asteroide tombando
    }
    vec3 cor = vec3(0.0);
    float cobertura = 0.0;
    vec3 luz3 = normalize(vec3(dirLuz, 0.55));
    if (q < 1.0) {
        vec3 n = vec3(d, sqrt(max(1.0 - q * q, 0.0)));
        vec3 m = girar(n, giroAng);
        vec2 uv = coordSuperficie(m) + semente * 3.0;
        float detalhe = fbm(uv * 1.6);
        vec3 base;
        if (tipo < 1.5) base = mix(C_FUNDO * 4.0, M_LAVA, smoothstep(0.55, 0.75, detalhe));
        else if (tipo < 2.5) base = mix(M_GELO, C_BRANCO, detalhe * 0.6);
        else if (tipo < 3.5) base = mix(M_OCEANO, M_TERRA, smoothstep(0.52, 0.58, detalhe));
        else if (tipo < 4.5) base = mix(M_DESERTO * 0.8, M_DESERTO, 0.5 + 0.5 * sin(m.y * 18.0 + detalhe * 4.0));
        else if (tipo < 5.5) {
            float fluxo = extraAtivo(extra, 0.0) ? fbm(vec2(m.y * 6.0, m.x * 2.0 - TD * 0.3)) : detalhe;
            base = mix(M_GAS, C_MEDIO, 0.5 + 0.5 * sin(m.y * 12.0 + fluxo * 3.0));
        } else if (tipo < 6.5) base = mix(M_GELO, M_OCEANO, 0.3 + 0.2 * sin(m.y * 6.0 + detalhe));
        else base = mix(C_MEDIO * 0.5, C_MEDIO * 0.85, detalhe);
        if (extraAtivo(extra, 0.0)) {
            // Nuvens em camada própria, girando mais rápido que a superfície; tempestade oval nos gasosos.
            if (tipo > 1.5 && tipo < 4.5) {
                vec3 mn = girar(n, giroAng * 1.6 + TD * 0.05);
                float nuvem = smoothstep(0.5, 0.78, fbm(coordSuperficie(mn) * 2.2 + 9.0));
                base = mix(base, C_BRANCO, nuvem * 0.75);
            }
            if (tipo > 4.5 && tipo < 5.5) {
                vec3 ms = girar(n, giroAng + 0.8);
                float oval = exp(-pow((ms.x - 0.2) / 0.22, 2.0) - pow((ms.y + 0.25) / 0.09, 2.0)) * step(0.0, ms.z);
                base = mix(base, M_LAVA, oval * 0.7);
            }
        }
        float lambert = max(dot(n, luz3), 0.0);
        float rim = pow(1.0 - n.z, 3.0) * max(dot(normalize(d + 1e-5), dirLuz), 0.0);
        cor = saturar(base) * (0.05 + 1.7 * rim + 0.08 * lambert);
        if (tipo < 1.5) cor += M_LAVA * smoothstep(0.6, 0.78, detalhe) * (0.7 + 0.35 * sin(TD * 0.9 + detalhe * 9.0));
        cobertura = smoothstep(1.0, 0.95, q);
    }
    if (tipo < 6.5) {
        vec3 tom = tipo < 1.5 ? M_LAVA : tipo < 3.5 ? M_GELO : tipo < 4.5 ? M_DESERTO : tipo < 5.5 ? M_GAS : M_GELO;
        float halo = exp(-max(q - 1.0, 0.0) / 0.45 * 3.0) * smoothstep(0.82, 1.0, q);
        cor += tom * halo * (0.3 + 0.7 * max(dot(normalize(d + 1e-5), dirLuz), 0.0)) * 0.55;
    }
    if (tipo > 4.5 && tipo < 5.5) {
        vec2 a = rot(0.35) * d;
        float r = length(vec2(a.x, a.y * 3.4));
        float ang = atan(a.y * 3.4, a.x);
        float faixas = 0.6 + 0.4 * sin(r * 22.0);
        if (extraAtivo(extra, 2.0)) {
            faixas = 0.55 + 0.35 * sin(r * 22.0 - TD * 0.6) + 0.25 * step(0.93, hash(floor(vec2(r * 30.0, ang * 30.0 - TD * 2.0 / r))));
        }
        float anel = smoothstep(1.35, 1.45, r) * (1.0 - smoothstep(2.15, 2.3, r)) * faixas;
        if (a.y < 0.0 || q > 1.0) cor = mix(cor, mix(C_MEDIO, M_DESERTO, 0.5) * 0.85, anel * 0.85);
        cobertura = max(cobertura, anel * 0.85);
    }
    return vec4(cor, cobertura);
}

// Luas orbitando o planeta (em unidades do raio do planeta).
vec4 luasDe(vec2 d, float luas, float giro, float semente, vec2 dirLuz) {
    if (luas < 0.5) return vec4(0.0);
    int total = luas < 1.5 ? 1 : 3;
    vec4 soma = vec4(0.0);
    for (int i = 0; i < 3; i++) {
        if (i >= total) break;
        float fi = float(i);
        float raioOrbita = 1.75 + 0.65 * fi;
        float ang = semente * 2.0 + fi * 2.1 + TD * (0.7 + 0.5 * velocidadeGiro(giro)) / (1.0 + fi);
        vec2 c = vec2(cos(ang), sin(ang) * 0.32) * raioOrbita;
        float r = 0.17 - 0.03 * fi;
        vec2 dd = (d - c) / r;
        float qq = length(dd);
        if (qq > 1.6) continue;
        bool atras = sin(ang) > 0.0 && length(c) < 1.0;
        if (atras) continue;
        vec3 n = vec3(dd, sqrt(max(1.0 - qq * qq, 0.0)));
        float rim = pow(1.0 - n.z, 3.0) * max(dot(normalize(dd + 1e-5), dirLuz), 0.0);
        float cob = smoothstep(1.0, 0.92, qq);
        soma.rgb += C_MEDIO * (0.06 + 1.5 * rim) * cob;
        soma.a = max(soma.a, cob);
    }
    return soma;
}

vec4 estrelaAnimada(vec2 d, float tipo, float estelar) {
    float pulsa = estelar > 0.5 && estelar < 1.5 ? 1.0 + 0.045 * sin(TD * 1.3) : 1.0;
    vec2 e = d / pulsa;
    float q = length(e);
    float a = atan(e.y, e.x);
    vec3 tom = tipo < 10.5 ? M_ESTRELA_VERMELHA : tipo < 11.5 ? M_ESTRELA_AZUL : M_ESTRELA_VERMELHA;
    float disco = smoothstep(1.0, 0.94, q);
    float granulos = 0.8 + 0.3 * fbm(e * 4.0 + vec2(TD * 0.15, -TD * 0.1));
    vec3 cor = mix(C_BRANCO, tom, smoothstep(0.0, 1.0, q * q)) * disco * granulos * (tipo > 12.5 ? 0.9 : 1.15);
    float atividade = estelar > 1.5 && estelar < 2.5 ? 1.0 : 0.0;
    float coroaVel = 0.3 + 1.2 * atividade;
    float raios = 0.55 + 0.45 * fbm(vec2(a * 3.0, TD * coroaVel));
    float alcance = 2.4 - 1.2 * atividade * pow(fbm(vec2(a * 6.0, TD * 0.5)), 2.0) * 2.0;
    cor += tom * exp(-max(q - 1.0, 0.0) * max(alcance, 0.8)) * (1.0 - disco) * raios * (0.55 + 0.35 * atividade);
    if (estelar > 2.5) {
        // Proeminências: três arcos que sobem e assentam na borda.
        for (int i = 0; i < 3; i++) {
            float fi = float(i);
            float base = fi * 2.1 + 0.6 + 0.3 * sin(TD * 0.1 + fi);
            vec2 pe = vec2(cos(base), sin(base)) * 1.0;
            float altura = 0.25 + 0.12 * sin(TD * 0.6 + fi * 1.7);
            vec2 centro = pe * (1.0 + altura * 0.5);
            float arco = gauss(length(e - centro) - altura * 0.6, 0.035) * step(1.0, q);
            cor += mix(tom, M_LAVA, 0.4) * arco * 0.9;
        }
    }
    return vec4(cor, disco);
}

vec4 difusoAnimado(vec2 d, float tipo, float giro) {
    if (tipo < 14.5) {
        vec2 g = rot(0.5) * d;
        g.y /= 0.45;
        float q = length(g);
        float a = atan(g.y, g.x);
        float bracos = pow(0.5 + 0.5 * cos(2.0 * (a - log(max(q, 0.05)) * 2.4 - TD * (0.1 + 0.25 * velocidadeGiro(giro)))), 3.0);
        float brilho = exp(-q * 2.4) * (0.3 + 1.1 * bracos * (0.6 + 0.4 * fbm(g * 6.0))) + exp(-q * q * 40.0) * 0.8;
        return vec4(mix(M_ESTRELA_AZUL, C_QUENTE, smoothstep(0.0, 0.7, q)) * brilho * 0.8, 0.0);
    }
    vec2 w = d + 0.35 * vec2(fbm(d * 1.4 + TD * 0.05), fbm(d * 1.4 + 7.0 - TD * 0.04));
    float nuvem = fbm(w * 1.6);
    float forma = exp(-dot(d, d) * 1.4) * smoothstep(0.35, 0.8, nuvem);
    vec3 tom = mix(M_NEBULOSA, M_GAS, fbm(w * 2.5 + 4.0));
    return vec4(tom * forma * 0.75, 0.0);
}

vec4 cometaAnimado(vec2 p, vec2 c, float raio, vec2 fora, float extra) {
    vec2 d = p - c;
    float ao = dot(d, fora);
    float lado = dot(d, vec2(-fora.y, fora.x));
    bool viva = extraAtivo(extra, 1.0);
    float coma = exp(-dot(d, d) / (raio * raio * 0.5)) * (viva ? 1.0 + 0.15 * sin(TD * 2.0) : 1.0);
    float u = max(ao, 0.0) / raio;
    float ion = smoothstep(0.0, 1.0, u) * exp(-u / 6.0) * exp(-pow(lado / (raio * (0.3 + u * 0.06)), 2.0));
    float curva = lado - u * u * raio * 0.012;
    float poeira = smoothstep(0.0, 1.0, u) * exp(-u / 4.5) * exp(-pow(curva / (raio * (0.6 + u * 0.16)), 2.0));
    if (viva) {
        float fios = 0.55 + 0.6 * fbm(vec2(lado / raio * 3.0, u * 0.35 - TD * 1.4));
        ion *= fios * (1.0 + 0.3 * sin(u * 0.5 - TD * 3.0));
        poeira *= 0.7 + 0.5 * fbm(vec2(curva / raio * 2.0, u * 0.25 - TD * 0.8));
    }
    vec3 cor = mix(M_GELO, C_BRANCO, 0.4) * coma * 1.2 + M_ESTRELA_AZUL * ion * 0.6 + mix(C_QUENTE, C_MEDIO, 0.4) * poeira * 0.45;
    return vec4(cor, 0.0);
}


vec2 posicaoLivre(int k, float movimento, vec2 celula, vec2 vaga, float meiaLargura) {
    float fk = float(k);
    if (movimento < 0.5) return vaga + vec2(sin(TD * 0.05 + fk), cos(TD * 0.04 + fk * 1.7)) * 0.012;
    if (movimento < 1.5) {
        float profundidade = 0.4 + 0.6 * hash1(fk * 4.3);
        float x = mod(vaga.x + TD * 0.02 * profundidade + meiaLargura, 2.0 * meiaLargura) - meiaLargura;
        return vec2(x, vaga.y + sin(TD * 0.1 + fk) * 0.008);
    }
    if (movimento < 2.5) {
        float r = length(vaga * vec2(1.0, 1.6));
        float a = atan(vaga.y * 1.6, vaga.x) + TD * 0.05 / (0.3 + r);
        return vec2(cos(a), sin(a) / 1.6) * r;
    }
    return vaga + vec2(sin(TD * 0.35 + fk * 1.3) * 0.015, sin(TD * 0.5 + fk * 2.1) * 0.02);
}

vec3 corposAnimados(vec2 p, float giro, float luas, float estelar, float movimento, float extra) {
    bool livre = uNucleo < 0.5;
    vec3 c = livre ? fundo(p) : nucleoEscolhido(p);
    float meiaLargura = 0.5 * uRes.x / uRes.y;
    float colunas = meiaLargura < 0.55 ? 2.0 : meiaLargura < 0.95 ? 3.0 : 4.0;
    float linhas = ceil(12.0 / colunas);
    vec2 celula = vec2(2.0 * meiaLargura * 0.94 / colunas, 0.94 / linhas);
    float escala = min(min(celula.x, celula.y) / 0.3, 1.15);
    for (int k = 0; k < 12; k++) {
        float fk = float(k);
        float tipo = tipoDoCatalogo(k);
        vec2 centro;
        float raio;
        vec2 dirLuz;
        if (livre) {
            vec2 vaga = vec2(mod(fk, colunas) - (colunas - 1.0) * 0.5, (linhas - 1.0) * 0.5 - floor(fk / colunas)) * celula;
            vaga += (vec2(hash1(fk * 3.1), hash1(fk * 5.7)) - 0.5) * celula * 0.2;
            centro = posicaoLivre(k, movimento, celula, vaga, meiaLargura);
            raio = tamanhoDoTipo(tipo) * 0.24 * escala;
            dirLuz = normalize(LUZ);
        } else {
            float orbita = 2.1 + fk * 0.38;
            float ang = fk * 2.399 + TD * 0.8 * pow(orbita, -1.5);
            vec2 l = vec2(cos(ang), sin(ang) * 0.34) * orbita * uR;
            centro = vec2(l.x, l.y + INCLINACAO * l.x);
            if (sin(ang) > 0.0 && length(centro) < uR * 1.1) continue;
            raio = tamanhoDoTipo(tipo) * uR * (tipo > 13.5 ? 1.6 : 0.8);
            dirLuz = normalize(-centro);
        }
        float alcance = tipo > 7.5 && tipo < 8.5 ? raio * 26.0 : tipo > 13.5 ? raio * 1.8 : raio * 3.2;
        if (length(p - centro) > alcance) continue;
        vec4 r;
        if (tipo > 7.5 && tipo < 8.5) r = cometaAnimado(p, centro, raio, -dirLuz, extra);
        else if (tipo > 13.5) r = difusoAnimado((p - centro) / raio, tipo, giro);
        else if (tipo > 9.5) r = estrelaAnimada((p - centro) / raio, tipo, estelar);
        else {
            r = corpoAnimado((p - centro) / raio, tipo, dirLuz, giro, extra, fk);
            if (tipo < 6.5) {
                vec4 l = luasDe((p - centro) / raio, luas, giro, fk, dirLuz);
                r.rgb = mix(r.rgb, vec3(0.0), l.a) + l.rgb;
                r.a = max(r.a, l.a);
            }
        }
        c = mix(c, vec3(0.0), r.a) + r.rgb;
    }
    return c;
}
