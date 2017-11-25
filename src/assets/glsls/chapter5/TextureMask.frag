precision mediump float;
uniform sampler2D u_Sampler;
uniform sampler2D u_SamplerMask;
varying vec2 v_TexCoord;
void main(){
    vec4 colorTex=texture2D(u_Sampler,v_TexCoord);
    vec4 colorMask=texture2D(u_SamplerMask,v_TexCoord);
    gl_FragColor=colorTex*colorMask;
}