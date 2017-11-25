precision mediump float;
varying vec4 v_Color;
uniform float u_Width;
uniform float u_Heihgt;
void main(){
    //gl_FragColor = v_Color;
    gl_FragColor = vec4(gl_FragCoord.x/u_Width,0.0,gl_FragCoord.y/u_Heihgt,1.0);
    //gl_FragColor = vec4(1.0,1.0,0.0,1.0);
}