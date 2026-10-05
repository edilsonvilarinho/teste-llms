// 08 · Binária fantasma — Lente com quadrupolo contínuo, como se uma binária invisível girasse por perto.
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
