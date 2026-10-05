// 09 · Grade torcida — Grade marcada e torcida pelo arrasto forte, com quadrupolo girando.
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
