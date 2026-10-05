// 12 · Lente com ecos — Só lente, com três anéis de onda em eco após cada absorção.
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 1.0; // intensidade: média
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 0.0; // ondas gravitacionais: anéis na absorção
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 1.0; // intensidade: média
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
