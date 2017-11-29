#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_FogColor; // 雾化颜色
uniform vec2 u_FogDist;  // 雾化起点与终点
varying vec4 v_Color;
varying float v_Dist;
void main() {
    //计算雾化
    float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    // 转换雾化后的颜色
    vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);
    gl_FragColor = vec4(color, v_Color.a);
}