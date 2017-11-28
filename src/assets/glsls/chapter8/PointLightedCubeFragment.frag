precision mediump float;
uniform vec3 u_LightColor;
uniform vec3 u_AmbientLight;
uniform vec3 u_LightPosition;
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
void main(){
    vec3 normal=normalize(v_Normal);//法向归一化

    //光线方向
    vec3 lightDirection = normalize(u_LightPosition-v_Position);

    //点积
    float nDotL=max(dot(lightDirection,normal),0.0);

    vec3 diffuse = u_LightColor*v_Color.rgb*nDotL;
    vec3 amibient = u_AmbientLight * v_Color.rgb;

    gl_FragColor = vec4(diffuse+amibient,v_Color.a);
}