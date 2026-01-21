// Author iris fernández

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_midi[128];
varying vec2 vTexCoord;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;
    
    float x = _st.x;
    float y = _st.y;
    
    float t = u_time * 10. * u_midi[1];

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
    
    float t = u_time * 3. * u_midi[1];

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

	float t = u_time * 0.5;

    // Apply the brick tiling
    vec2 st_r = brickTile(st,(sin(u_time) + 1.) * 2.0 + 2.) + 0.09;
    vec2 st_g = brickTileOp(st,(sin(u_time + .5) + 1.) * 2.5 + 2.) - 0.05;
    vec2 st_b = brickTile(st,(sin(u_time + .75) + 1.) * 2.6 + 2.) + 0.035;
    float r = 1.0 - circle(st_r, vec2(0.5), 0.4);
    float g = 0.95 - circle(st_g, vec2(0.5), 0.4);
    float b = 0.75 - circle(st_b, vec2(0.5), 0.4);
    
    // //Big circle
    float pct = circle(st, vec2(0.0), max(u_midi[0], 0.0000001) * 35.0);
    
    color = mix(color, vec3(r,g,b), 1.0);
    color = mix(color, vec3(1.-b,1.-r,1.-g), pct);
    
    gl_FragColor = vec4(color, 1.0);
}
