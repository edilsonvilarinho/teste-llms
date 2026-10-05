// 11 · Proeminências em paralaxe — Estrelas com proeminências passando em camadas; nuvens e tempestades.
const float GIRO = 1.0; // rotação própria: visível
const float LUAS = 0.0; // luas: nenhuma
const float ESTELAR = 3.0; // atividade estelar: proeminências
const float MOVIMENTO = 1.0; // movimento no espaço: paralaxe em camadas
const float EXTRA = 0.0; // vida extra: nuvens e tempestades
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
