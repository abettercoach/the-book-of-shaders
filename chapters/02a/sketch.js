// Standard sketch from https://p5js.org/tutorials/intro-to-shaders/

let myShader;
let midi_ccs = new Array(128).fill(0.0);

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('./shader.vert', './shader.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(windowWidth, windowHeight, WEBGL);

  // setup controls
  setupKeyControl();
  setupMIDIControl();

  setInterval(function() {
    detectKeyControl()
  }, 1000/24);
}

function draw() {
  noStroke();
  // shader() sets the active shader, which will be applied to what is drawn next
  shader(myShader);

  myShader.setUniform('u_midi', midi_ccs);
  myShader.setUniform('u_time', millis() / 1000.0);
  myShader.setUniform('u_resolution', [width, height]);

  // apply the shader to a rectangle taking up the full canvas
  plane(width, height);
}

//MIDI Handling
function setupMIDIControl() {
  WebMidi.enable().then(() => {
    let digitakt = WebMidi.getInputByName("Elektron Digitakt");
    if (!digitakt) {
      console.log("Digitakt not found");
      return;
    }

    digitakt.addListener("pitchbend", e => {
      let val = (e.value + 1) / 2;
      console.log("Pitch Bend: " + val);
      midi_ccs[0] = val;
    });
    
    digitakt.addListener("channelaftertouch", e => {
      let val = e.value;
      midi_ccs[1] = val;
    });

    digitakt.addListener("controlchange", e => {
      if (e.controller.number == 1) { // Mod Wheel
        let val = e.value;
        midi_ccs[2] = val;
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