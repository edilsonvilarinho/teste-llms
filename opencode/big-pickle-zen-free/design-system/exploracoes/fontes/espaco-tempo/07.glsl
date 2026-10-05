// 07 · Rios de poeira — Linhas de poeira longas e retas caindo sem arrasto; um pulso forte as sacode.
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 0.0; // intensidade: sutil
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 2.0; // alcance: longo
const float INTENSIDADE = 0.0; // intensidade: sutil
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
