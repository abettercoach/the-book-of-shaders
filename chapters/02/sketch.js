// Standard sketch from https://p5js.org/tutorials/intro-to-shaders/

let myShader;
function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('02/shader.vert', '02/shader.frag');
}
function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(400, 400, WEBGL);
}
function draw() {
  noStroke();
  // shader() sets the active shader, which will be applied to what is drawn next
  shader(myShader);
  // apply the shader to a rectangle taking up the full canvas
  plane(width, height);
}