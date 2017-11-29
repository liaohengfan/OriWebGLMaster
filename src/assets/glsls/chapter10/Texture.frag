#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
varying float v_NdotL;
void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    gl_FragColor = vec4(color.rgb * v_NdotL, color.a);
}