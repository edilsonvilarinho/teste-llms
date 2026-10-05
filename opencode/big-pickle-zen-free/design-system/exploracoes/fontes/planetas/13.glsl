// 13 · Gravura estelar — Meio-tom aplicado a estrelas e planetas, luz emissiva, contido. Conjunto: anã vermelha, estrela azul, anã branca, gigante vermelha, nebulosa, galáxia, gasoso com anéis, oceano, cometas e asteroides.
const float ILUMINACAO = 3.0; // iluminação: emissiva suave
const float ESTILO = 2.0; // estilo: gravura
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 0.0; // saturação: contida
const float CONJUNTO = 2.0; // conjunto: estelar
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
