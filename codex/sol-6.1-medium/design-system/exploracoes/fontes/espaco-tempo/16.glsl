// 16 · Lente torcida — Só lente, com arrasto forte e longo alcance, sem ondas.
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 1.0; // intensidade: média
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 2.0; // arrasto de referenciais: forte
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 1.0; // intensidade: média
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
