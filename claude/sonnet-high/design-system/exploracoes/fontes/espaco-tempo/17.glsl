// 17 · Grade de ecos — Grade curta e marcada, anéis em eco a cada absorção, sem arrasto.
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
