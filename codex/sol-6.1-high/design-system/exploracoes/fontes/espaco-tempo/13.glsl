// 13 · Malha profunda — Grade de longo alcance afundando suavemente; pulso forte a cada absorção.
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 0.0; // intensidade: sutil
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 0.0; // intensidade: sutil
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
