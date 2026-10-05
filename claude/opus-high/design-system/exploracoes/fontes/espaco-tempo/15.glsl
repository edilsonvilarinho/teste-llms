// 15 · Poeira em eco — Linhas de poeira de alcance médio com anéis de onda a cada absorção.
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
