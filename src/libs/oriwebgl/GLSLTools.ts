import * as d3 from 'd3';
/** * GLSL工具 */
class GLSLTools{
    constructor(){}
    /**
     * 获取 glsl
     * @param name
     * @param callBack
     */
    static getGLSL(url:string,name:string,callBack:Function){
        if(typeof callBack =="undefined"){
            callBack=function (vertexShader:string,
                fragmentShader:string) {
                console.log('callback undefined!!');
            }
        }
        let vertexShader:string=null;
        let fragmentShader:string=null;
        d3.text(url+name+'.vext',function (vshader:string) {
           vertexShader=vshader;
            if(fragmentShader){
                callBack(vertexShader,fragmentShader);
            }
        });
        d3.text(url+name+'.frag',function (fshader:string) {
            fragmentShader=fshader;
            if(vertexShader){
                callBack(vertexShader,fragmentShader);
            }
        });
    }
}
export {GLSLTools};