// 04 · Coroas ativas — Estrelas com proeminências subindo da borda; planetas girando devagar e balançando.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 1.0; // luas: uma por planeta
const float ESTELAR = 3.0; // atividade estelar: proeminências
const float MOVIMENTO = 3.0; // movimento no espaço: balanço
const float EXTRA = 2.0; // vida extra: anéis cintilantes
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
