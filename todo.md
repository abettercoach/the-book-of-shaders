# To Do

1. Oscillators!
    - We're moving all MIDI processing into JS and out of GLSL for now.
    - No CC uniforms, but instead create oscillators and pass the value over.
        - Let's just do the zoom oscillator first, and we'll deal with the rest later.
    - Create an oscillation function (let's begin with harmonic), pass the MIDI CCs as params.
        - Linear (Harmonic) -> Sinusodial
            - Amplitude
            - Midpoint
            - Frequency
            - Offset
        - Nonlinear (Relaxation) -> Non-Sinusodial (eg. square, triangle, sawtooth)
    - Implement phase accumulation
        - https://www.gkbrk.com/phase-accumulator
        
2. MIDI Channels
    - Try to read multiple MIDI channels with WebMIDI
    - "To change the MIDI channel for listening with WebMIDI, you use the addListener method on a specific input device and filter by the channels option, passing an array like {channels: [1, 3]} to listen to specific channels (1-16), or omit it to listen to all; this involves selecting your device in the WebMIDI app and configuring its listener to pick up only the desired MIDI channel messages."

### 2026 Jan 26

a. Circle
    1. Initial Value
    2. Interpolation
b. Oscillation
    1. 

### 2026 Jan 22

1. Research Limits of MIDI
    - Close to impossible to work around
    - Perhaps better to use something like OSC
        - Could use TouchOSC with some kind of library
        - Cons: Looks like it requires setting up a web server