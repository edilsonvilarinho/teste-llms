// 15 · Estrelas inquietas — Erupções na coroa com balanço e nuvens; rotação visível com uma lua.
const float GIRO = 1.0; // rotação própria: visível
const float LUAS = 1.0; // luas: uma por planeta
const float ESTELAR = 2.0; // atividade estelar: erupções na coroa
const float MOVIMENTO = 3.0; // movimento no espaço: balanço
const float EXTRA = 0.0; // vida extra: nuvens e tempestades
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
