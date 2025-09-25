#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float u_tempo;
uniform vec3 u_color;

const float PI = 3.141592653;

void main() {

  	float ms = 60000.0 / u_tempo; //millis per beat
  	float phase = u_time / ms * PI * 2.0;
	float r = (sin(phase) + 1.0 / 2.0) * u_color.r;
	float g = (sin(phase) + 1.0 / 2.0) * u_color.g;
	float b = (sin(phase) + 1.0 / 2.0) * u_color.b;
	gl_FragColor = vec4(r, g, b,1.0);
}
