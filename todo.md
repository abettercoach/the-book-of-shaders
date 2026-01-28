# To Do

1. Oscillators!
    - What if we try to plot and visualize the values? This could be good for a presentation.
    - Let's try waiting until a value is close to zero before changing the frequency, to see if we get something smoother there
        
### 2026 Jan 27

1. bindUniformToCh
    - For oscillators
2. First try at oscillators
    - Works better, but not as well as I would like too. Somestimes the movement is smooth. Sometimes it's not.

### 2026 Jan 26

0. MIDI Channels
    - Reading multiple MIDI channels with WebMIDI
    device.addListener("controlchange", e => {
      if (e.message.channel == channel) {
        callback(e.controller.number, e.value);
      }
    });

a. Circle
    1. Initial Value
    2. Interpolation

### 2026 Jan 22

1. Research Limits of MIDI
    - Close to impossible to work around
    - Perhaps better to use something like OSC
        - Could use TouchOSC with some kind of library
        - Cons: Looks like it requires setting up a web server