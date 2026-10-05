// 11 · Espiral de grãos — Poeira em espirais fortemente torcidas, sem ondas.
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
