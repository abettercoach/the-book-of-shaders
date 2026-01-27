// by iris enrique
// Midi Controlled Shader
// Elektron Digitakt | Proj "Shaders" Bnk A 
// Circle: Ch 1 


let myShader;
let uniforms = {};

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('./shader.vert', './shader.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(windowWidth, windowHeight, WEBGL);

  // setup controls
  // setupKeyControl();

  // Circle – Midi Ch01

  shader(myShader);

  let u_radius = bindUniform('u_radius', 20.0);
  onMIDI(1, (cc, value) => {
    let radius = value * 50;
    u_radius.setTarget(radius);
  });

  myShader.setUniform('u_resolution', [width, height]);

  setInterval(function() {
    detectKeyControl()
  }, 1000/24);
}

function draw() {
  noStroke();

  myShader.setUniform('u_time', millis() / 1000.0);

  for (let [k,v] of Object.entries(uniforms)) {
    let u = uniforms[k];
    u.update();
  }

  // apply the shader to a rectangle taking up the full canvas
  plane(width, height);
}

function bindUniform(name, initialValue=0.0) {
  uniforms[name] = {
    current: initialValue,
    value: initialValue,
    setTarget: function(v) {
      this.value = v;
    },
    update: function() {
      this.current += (this.value - this.current) * 0.1;
      myShader.setUniform(name, this.current);
    }
  }; 
  return uniforms[name];
}

//MIDI Handling
function onMIDI(channel, callback) {
  WebMidi.enable().then(() => {
    let digitakt = WebMidi.getInputByName("Elektron Digitakt");
    if (!digitakt) {
      console.log("Digitakt not found");
      return;
    }
    console.log(`Listening to Digitakt on channel ${channel}`);
    digitakt.addListener("controlchange", e => {
      if (e.message.channel == channel) {
        callback(e.controller.number, e.value);
      }
    });
  });
}

//Key Handling
//Keycode Reference: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
//Reference: https://stackoverflow.com/questions/29118791/how-to-move-an-element-via-arrow-keys-continuously-smoothly
//https://stackoverflow.com/questions/35394937/keyboardevent-keycode-deprecated-what-does-this-mean-in-practice
let arrowKeys = {};
let colorKeys = [];

function setupKeyControl() {
  document.addEventListener('keydown', function(e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
      arrowKeys[e.key] = true;
    } else if (e.key == "1" || e.key == "2" || e.key == "3") {
      let index = colorKeys.indexOf(e.key); 

      if (index !== -1) {
          let removedElement = colorKeys.splice(index, 1)[0]; 
          colorKeys.push(removedElement); 
      } else {
          colorKeys.push(e.key);
      }
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
      arrowKeys[e.key] = false;
    } else if (e.key == "1" || e.key == "2" || e.key == "3") {
      let index = colorKeys.indexOf(e.key); 

      if (index !== -1) {
          colorKeys.splice(index, 1)[0]; 
      }
    }
  });
}

function detectKeyControl() {
  let currentColor = colorKeys[colorKeys.length - 1];
  switch (currentColor) {
    case "1":
      if (arrowKeys["ArrowUp"]) {
        r += 0.01;
      }
      if (arrowKeys["ArrowDown"]) {
        r -= 0.01;
      }
      break;
    case "2":
      if (arrowKeys["ArrowUp"]) {
        g += 0.01;
      }
      if (arrowKeys["ArrowDown"]) {
        g -= 0.01;
      }
      break;
    case "3":
      if (arrowKeys["ArrowUp"]) {
        b += 0.01;
      }
      if (arrowKeys["ArrowDown"]) {
        b -= 0.01;
      }
      break;
    default:
      break;
  }
}