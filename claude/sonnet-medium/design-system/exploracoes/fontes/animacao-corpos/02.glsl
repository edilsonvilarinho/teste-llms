// 02 · Sistema em órbita — Todos os corpos giram juntos ao redor de um centro, com sistemas de luas e coroas em erupção.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 2.0; // luas: sistemas de luas
const float ESTELAR = 2.0; // atividade estelar: erupções na coroa
const float MOVIMENTO = 2.0; // movimento no espaço: órbita compartilhada
const float EXTRA = 3.0; // vida extra: tudo junto
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
