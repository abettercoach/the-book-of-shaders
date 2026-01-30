// by iris enrique
// Midi Controlled Shader
// Elektron Digitakt | Proj "Shaders" Bnk A 
// Circle: Ch 1 


let myShader;
let uniforms = {};

let phase = 0;
let velocity = 0;

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

  bindUniformToMidiCC('u_radius', 1, 1, 1.2, (value) => { 
    value = Math.pow(value, 7);
    return value * 10;
  });

  onMIDI(1, 2, (value) => {
    value = map(value, 0, 1, 0, TWO_PI);
    value = Math.pow(value, 2.0);
    velocity = value / 600.0;
  });

  myShader.setUniform('u_resolution', [width, height]);

  setInterval(function() {
    detectKeyControl()
  }, 1000/24);
}

function draw() {
  noStroke();

  phase = phase + velocity;
  if (phase > TWO_PI) {
    phase = phase - TWO_PI;
  }
  myShader.setUniform('u_phase', phase);

  myShader.setUniform('u_time', millis() / 1000.0);

  for (let [k,v] of Object.entries(uniforms)) {
    let u = uniforms[k];
    u.update();
  }

  // apply the shader to a rectangle taking up the full canvas
  plane(width, height);
}

// function bindOscillatorToMidiCh(name, channel, options={type: 'sine', frequencyCC: 1, amplitudeCC: 2, midpointCC: 3, offsetCC: 4}) {
//   let uniform = bindUniform(name, 0.0);
//   let oscillator = {
//     type: options.type || 'sine',
//     frequency: 1.0,
//     amplitude: 1.0,
//     midpoint: 0.0,
//     offset: 0.0
//   };

//   onMIDI(channel, options.frequencyCC, (value) => {
//     let v = value;
//     oscillator.targetFrequency = map(v, 0, 1, 0.01, 4.0);
//   });

//   onMIDI(channel, options.amplitudeCC, (value) => {
//     let v = value;
//     oscillator.amplitude = map(v, 0, 1, 0.0, 1.0);
//   });

//   onMIDI(channel, options.midpointCC, (value) => {
//     let v = value;
//     oscillator.midpoint = map(v, 0, 1, -1.0, 1.0);
//   });

//   onMIDI(channel, options.offsetCC, (value) => {
//     let v = value;
//     oscillator.offset = map(v, 0, 1, -440.0, 440.0);
//   });

//   let osc = (x) => {
//     let t = millis() / 1000.0;
//     switch(options.type) {
//       case 'sine':
//         return sin(TWO_PI * x * t);
//       case 'triangle':
//         return asin(sin(TWO_PI * x * t)) * (2.0 / PI);
//       case 'square':
//         return x % 1.0 < 0.5 ? 1.0 : -1.0;
//       case 'sawtooth':
//         return 2.0 * (t * x - floor(0.5 + t * x));
//       default:
//         return sin(TWO_PI * x * t);
//     }
//   }; 
  
//   setInterval(function() {
//     oscillator.frequency = oscillator.targetFrequency;

//     let {frequency, amplitude, midpoint, offset} = oscillator;
//     let value = midpoint + amplitude * osc(frequency);
    

//     uniforms[name].current = value;
//   }, 1000 / 60);
// }

function bindUniformToMidiCC(name, channel, cc, initialValue=0.0, mapper=(v) => v) {
  bindUniform(name, initialValue);
  onMIDI(channel, cc, (value) => {
    let v = mapper(value);
    uniforms[name].setTarget(v);
  });
}

function bindUniform(name, initialValue=0.0) {
  uniforms[name] = {
    current: initialValue,
    targetValue: initialValue,
    setTarget: function(v) {
      this.targetValue = v;
    },
    update: function() {
      this.current += (this.targetValue - this.current) * 0.1;
      // console.log(name, this.current);
      myShader.setUniform(name, this.current);
    }
  }; 
}

//MIDI Handling
function onMIDI(channel, cc, callback) {
  WebMidi.enable().then(() => {
    let digitakt = WebMidi.getInputByName("Elektron Digitakt");
    if (!digitakt) {
      console.log("Digitakt not found");
      return;
    }
    console.log(`Listening to Digitakt on channel ${channel}`);
    digitakt.addListener("controlchange", e => {
      if (e.message.channel == channel && e.controller.number == cc) {
        callback(e.value);
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

function easeInOutQuad(t) {
  // t is normalized time in the range [0, 1]
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}