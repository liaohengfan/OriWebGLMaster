#version 120

attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
    gl_Position=a_Position;
    gl_PointSize=10.0;
    v_Color=a_Color;
}

varying vec4 v_Color;
void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}