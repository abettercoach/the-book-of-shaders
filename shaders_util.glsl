#ifndef RECETAS
#define RECETAS

float sdf_circulo(vec2 p, vec2 o) {
  return distance(p, o);
}
float circulo(vec2 p, vec2 o, float r) {
  return smoothstep(r - 0.001, r + 0.001, (distance(p, o));
}

#endif
