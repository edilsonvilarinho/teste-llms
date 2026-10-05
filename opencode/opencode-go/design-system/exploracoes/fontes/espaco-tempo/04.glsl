// 04 · Lente pura — Nada explícito: só a lente e um pulso forte e lento que atravessa o céu a cada absorção.
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 2.0; // intensidade: marcada
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 3.0; // representação: só lente
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 2.0; // intensidade: marcada
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
