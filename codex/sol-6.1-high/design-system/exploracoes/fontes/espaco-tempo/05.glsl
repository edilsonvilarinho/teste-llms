// 05 · Grade sutil — Grade quase invisível, de curto alcance, que só denuncia a curvatura perto do núcleo.
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 0.0; // representação: grade deformada
const float ONDAS = 3.0; // ondas gravitacionais: nenhuma
const float ARRASTO = 0.0; // arrasto de referenciais: nenhum
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
