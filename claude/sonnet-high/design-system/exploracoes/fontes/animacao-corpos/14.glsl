// 14 · Sistemas em paralaxe — Sistemas de luas atravessando o quadro em camadas, anéis cintilantes.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 2.0; // luas: sistemas de luas
const float ESTELAR = 0.0; // atividade estelar: calma
const float MOVIMENTO = 1.0; // movimento no espaço: paralaxe em camadas
const float EXTRA = 2.0; // vida extra: anéis cintilantes
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
