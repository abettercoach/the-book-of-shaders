#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float u_tempo;
uniform vec3 u_color;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vTexCoord;

const float PI = 3.141592653;

void main() {

	vec2 st = vTexCoord.xy;
	vec2 mt = u_mouse / u_resolution;

  	float ms = 60000.0 / u_tempo; //millis per beat
  	float phase = u_time / ms * PI * 2.0 * 0.4;
	float r = (sin(phase) + 1.0 / 2.0) * u_color.r;
	float g = (sin(phase * 0.7) + 1.0 / 2.0) * u_color.g;
	float b = (sin(phase * 0.3) + 1.0 / 2.0) * u_color.b;
	gl_FragColor = vec4((st.x * 0.5) * r, mt.y / 2. + (st.x * 0.7) * g / 2., st.x * b, 1.0);
}
