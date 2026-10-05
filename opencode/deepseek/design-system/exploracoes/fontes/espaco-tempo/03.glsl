// 03 · Correntes de poeira — Grãos descem por espirais até o horizonte; um quadrupolo contínuo ondula o espaço.
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 1.0; // intensidade: média
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 2.0; // representação: linhas de poeira
const float ONDAS = 1.0; // ondas gravitacionais: quadrupolo contínuo
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 1.0; // alcance: médio
const float INTENSIDADE = 1.0; // intensidade: média
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
