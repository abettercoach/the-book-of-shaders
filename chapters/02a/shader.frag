// Author iris fernández

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;

uniform float u_midi[128];
uniform float u_radius;

float random (float n) {
    return fract(sin(n) * 43758.5453123);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 brickTile(vec2 _st, float offset){

    float minGrid = u_midi[3] * 10.0;
    float maxGrid = u_midi[4] * 100.0;
    float maxSpeed = u_midi[2];

    float t = u_time * maxSpeed * 3.0 + offset;

    float zoomSpeed = t;
    float normWave = (sin(t / max(0.001,maxGrid)) + 1.0) / 2.0;


    float zoom = minGrid + normWave * maxGrid;//(normWave * (maxGrid - minGrid)) + minGrid;

    _st *= zoom;
    
    float x = _st.x;
    float y = _st.y;
    

    // Here is where the offset is happening
    _st.x += step(1., mod(y, 2.0)) * 
        (max(0.0,min(1.0, sin(t)  + .5)));
    _st.x += step(1., mod(y + 1.,2.0)) * 
        (max(0.0,min(1.0,1.0 - (sin(t)  + .5))));
    
     _st.y += step(1., mod(x ,2.0)) *
         (max(0.0,min(1.0,cos(t)  + .5)));
     _st.y += step(1., mod(x+1. ,2.0)) *
        (max(0.0,min(1.0,1.0 - (cos(t)  + .5))));

    return fract(_st);
}

vec2 brickTileOp(vec2 _st, float _zoom){
    _st *= _zoom;
    
    float x = _st.x;
    float y = _st.y;
    
    float t = u_time * 3. * u_midi[2];

    // Here is where the offset is happening
    _st.x += step(1., mod(y + 1., 2.0)) * 
        (max(0.0,min(1.0, sin(t)  + .5)));
    _st.x += step(1., mod(y,2.0)) * 
        (max(0.0,min(1.0,1.0 - (sin(t)  + .5))));
    
     _st.y += step(1., mod(x+1.,2.0)) *
         (max(0.0,min(1.0,cos(t)  + .5)));
     _st.y += step(1., mod(x,2.0)) *
        (max(0.0,min(1.0,1.0 - (cos(t)  + .5))));

    return fract(_st);
}

float circle(in vec2 _st, in vec2 pos, in float _radius){
    vec2 l = _st-pos;
    return 1.0-smoothstep(_radius-(_radius*.001),
                         _radius+(_radius*.001),
                         dot(l,l)*8.0);
}

float circle_fuzz(in vec2 _st, in vec2 pos, in float _radius){
    vec2 l = _st-pos;
    return 1.0-smoothstep(_radius-(_radius*.1),
                         _radius+(_radius*.5),
                         dot(l,l)*8.0);
}

void main()
{
    vec2 st = vTexCoord.xy;

    // Normalize coordinates to [-1,1] and correct for aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    st = (st - 0.5) * 2.0;
    st.x *= aspect;
    
    vec3 color = vec3(0.0);


    // //Big circle
    float pct = circle(st, vec2(0.0), u_radius);
        
    gl_FragColor = vec4(pct,0.0,0.0,1.0);
}
