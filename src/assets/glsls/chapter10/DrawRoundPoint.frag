precision mediump float;
varying vec4 v_Color;
void main(){
    float dist = distance(gl_PointCoord,vec2(0.5,0.5));
    if(dist<0.5){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }else{
        discard;
    }
    gl_FragColor = v_Color;
}