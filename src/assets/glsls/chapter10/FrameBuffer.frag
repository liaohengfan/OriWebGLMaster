#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}