// Standard sketch from https://p5js.org/tutorials/intro-to-shaders/

let font;

let myShader;
let r = 0.0;
let g = 0.0;
let b = 0.0;
let bpm = 120.0;

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('03b/shader.vert', '03b/shader.frag');
  font = loadFont('/assets/LilitaOne-Regular.ttf');
}

function setup() {
  
  // the canvas has to be created with WEBGL mode
  createCanvas(400, 400, WEBGL);
  textFont(font);

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

  myShader.setUniform('u_time', millis());
  myShader.setUniform('u_color', [r, g, b]);
  myShader.setUniform('u_tempo', bpm);
  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_mouse', [mouseX, mouseY]);


  // apply the shader to a rectangle taking up the full canvas
  plane(width, height);
  // text(bpm, 0, 0);
  // text(frameRate(), 0, 10);

}

//MIDI Handling

//Ref for calculating tempo from Midi clock msgs
//https://github.com/djipco/webmidi/discussions/177
let clockStamps = [];
let bpmStamps = [];
const MAX_STAMPS = 20;

//Util Fns for Avg difference between timestamps
//Reference: https://stackoverflow.com/questions/40236191/how-can-i-compute-the-difference-between-array-values-then-average-them
function getAverage(arr) {
  if (arr.length === 0) {
    return 0; // Handle empty array case to avoid division by zero
  }
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

function getAverageDelta(arr) {
  if (arr.length < 2) {
    return 0; // Or handle as an error, as delta requires at least two elements
  }

  const deltas = [];
  for (let i = 0; i < arr.length - 1; i++) {
    deltas.push(arr[i + 1] - arr[i]);
  }

  const sumOfDeltas = deltas.reduce((sum, delta) => sum + delta, 0);

  return sumOfDeltas / deltas.length;
}

function setupMIDIControl() {
  WebMidi.enable().then(() => {
    let digitakt = WebMidi.getInputByName("Elektron Digitakt");
    if (!digitakt) return;
    digitakt.addListener("pitchbend", e => {
      let val = (e.value + 1) / 2;
      r = val;
    })
    digitakt.addListener("channelaftertouch", e => {
      let val = e.value;
      g = val;
    })
    digitakt.addListener("controlchange", e => {
      if (e.controller.number == 1) {
        let val = e.value;
        b = val;
      }
    })
    digitakt.addListener("controlchange", e => {
      if (e.controller.number == 71) {
        let val = e.value;
        bpm = val * 300;
      }
    })

    //Doesn't work with Elektron Digitakt under 50BPM for unknown reason!
    // digitakt.addListener("clock", e => {
    //   if (clockStamps.length == MAX_STAMPS) {
    //     clockStamps.shift();
    //   }
    //   clockStamps.push(e.timestamp);
    //   let avgClockDelta = getAverageDelta(clockStamps);
    //   let calcBPM = Math.round((1000 / avgClockDelta / 24) * 60 * 10) / 10;

    //    if (bpmStamps.length == MAX_STAMPS) {
    //     bpmStamps.shift();
    //   }
    //   bpmStamps.push(calcBPM);
    //   let avgBPM = Math.round(getAverage(bpmStamps) * 10) / 10;
    //   bpm = avgBPM ? avgBPM : bpm;
    //   // console.log(bpm)
    // });
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
    } else if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4") {
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
    } else if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4") {
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
        r = r < 1 ? r + 0.01 : 1;
      }
      if (arrowKeys["ArrowDown"]) {
        r = r > 0 ? r - 0.01 : 0;
      }
      break;
    case "2":
      if (arrowKeys["ArrowUp"]) {
        g = g < 1 ? g + 0.01 : 1;
      }
      if (arrowKeys["ArrowDown"]) {
        g = g > 0 ? g - 0.01 : 0;
      }
      break;
    case "3":
      if (arrowKeys["ArrowUp"]) {
        b = b < 1 ? b + 0.01 : 1;
      }
      if (arrowKeys["ArrowDown"]) {
        b = b > 0 ? b - 0.01 : 0;
      }
      break;
    case "4":
      if (arrowKeys["ArrowUp"]) {
        bpm = bpm < 300 ? bpm + 1 : 300;
      }
      if (arrowKeys["ArrowDown"]) {
        bpm = bpm > 30 ? bpm - 1 : 30;
      }
      break;
    default:
      break;
  }
}