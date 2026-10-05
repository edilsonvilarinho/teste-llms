// 06 · Redemoinho estelar — Estrelas arrastadas em redemoinho e anéis de onda a cada absorção.
const float REPRESENTACAO = 1.0; // representação: estrelas arrastadas
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 1.0; // intensidade: média
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 1.0; // representação: estrelas arrastadas
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 1.0; // intensidade: média
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
