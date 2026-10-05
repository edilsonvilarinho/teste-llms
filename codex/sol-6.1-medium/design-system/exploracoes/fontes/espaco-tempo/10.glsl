// 10 · Riscos curtos — Estrelas se esticam só perto do núcleo; pulso forte nas absorções.
const float REPRESENTACAO = 1.0; // representação: estrelas arrastadas
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
vec3 cena(vec2 p) {
    return espacoTempo(p, REPRESENTACAO, ONDAS, ARRASTO, ALCANCE, INTENSIDADE);
}
//== pontos ==
const float REPRESENTACAO = 1.0; // representação: estrelas arrastadas
const float ONDAS = 2.0; // ondas gravitacionais: pulso único forte
const float ARRASTO = 1.0; // arrasto de referenciais: leve
const float ALCANCE = 0.0; // alcance: curto
const float INTENSIDADE = 0.0; // intensidade: sutil
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosEspaco(i, n, REPRESENTACAO, ARRASTO, ALCANCE, INTENSIDADE, pos, tamanho, cor, alfa);
}
