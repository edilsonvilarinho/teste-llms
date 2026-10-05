// 12 · Balanço completo — Tudo junto com balanço suave e estrelas pulsando, giro lento.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 0.0; // luas: nenhuma
const float ESTELAR = 1.0; // atividade estelar: pulsação
const float MOVIMENTO = 3.0; // movimento no espaço: balanço
const float EXTRA = 3.0; // vida extra: tudo junto
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
