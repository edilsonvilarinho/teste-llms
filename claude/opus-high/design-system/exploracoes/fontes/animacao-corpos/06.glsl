// 06 · Luas em dança — Sistemas de luas orbitando cada planeta e estrelas pulsando, com balanço.
const float GIRO = 1.0; // rotação própria: visível
const float LUAS = 2.0; // luas: sistemas de luas
const float ESTELAR = 1.0; // atividade estelar: pulsação
const float MOVIMENTO = 3.0; // movimento no espaço: balanço
const float EXTRA = 2.0; // vida extra: anéis cintilantes
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
