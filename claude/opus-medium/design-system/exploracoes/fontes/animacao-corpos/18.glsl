// 18 · Anéis em paralaxe — Anéis cintilantes passando em camadas com estrelas pulsando e giro rápido.
const float GIRO = 2.0; // rotação própria: rápida
const float LUAS = 0.0; // luas: nenhuma
const float ESTELAR = 1.0; // atividade estelar: pulsação
const float MOVIMENTO = 1.0; // movimento no espaço: paralaxe em camadas
const float EXTRA = 2.0; // vida extra: anéis cintilantes
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
