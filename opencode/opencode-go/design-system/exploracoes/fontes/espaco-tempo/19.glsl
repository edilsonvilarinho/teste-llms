// 19 · Poeira sutil — Poucos grãos descendo devagar, com quadrupolo discreto.
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
