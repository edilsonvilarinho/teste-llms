// 07 · Céu em movimento — Paralaxe em camadas com tudo junto: nuvens, cauda viva e anéis cintilantes.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 1.0; // luas: uma por planeta
const float ESTELAR = 2.0; // atividade estelar: erupções na coroa
const float MOVIMENTO = 1.0; // movimento no espaço: paralaxe em camadas
const float EXTRA = 3.0; // vida extra: tudo junto
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
