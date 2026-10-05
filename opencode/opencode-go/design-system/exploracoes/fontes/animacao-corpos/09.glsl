// 09 · Erupções e cometas — Coroas em erupção e cometas com cauda viva, rotação visível e deriva.
const float GIRO = 1.0; // rotação própria: visível
const float LUAS = 0.0; // luas: nenhuma
const float ESTELAR = 2.0; // atividade estelar: erupções na coroa
const float MOVIMENTO = 0.0; // movimento no espaço: deriva suave
const float EXTRA = 1.0; // vida extra: cauda viva de cometa
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
