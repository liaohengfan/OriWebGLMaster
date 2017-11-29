/** * 案例demo 接口 */
import {GLSLTools} from "./base/GLSLTools";
import {initShaders} from "./base/Utils";
import {msg} from "./tools/LHFTools";

interface ILearnDraw{
    gl:any;
    container:HTMLElement;
    init():boolean;
    update():boolean;
    resize():boolean;
}
class DrawGLContainerBase implements ILearnDraw{

    gl: any;
    glProgram:WebGLProgram;
    container: HTMLElement;
    constructor(gl:any,container:HTMLElement){
        this.gl=gl;
        this.glProgram=gl.program;
        this.container=container;
    }

    /**
     * 获取
     * @param {string} url
     * @param {string} name
     */
    getGLSL(url:string,name:string){
        GLSLTools.getGLSL(url,name,(vshader:string,fshader:string)=> {
            this.initShader(vshader,fshader);
        });
    }

    /**
     * 初始化 着色器
     * @param {string} vshader
     * @param {string} fshader
     */
    protected initShader(vshader:string,fshader:string):void{
        if (!initShaders(this.gl, vshader, fshader)) {
            msg('Filed to init shaders!');
            return;
        }
        this.glProgram=this.gl.program;
        this.init();
    }

    init(): boolean {
        throw new Error("Method not implemented.");
    }
    resize(): boolean {
        throw new Error("Method not implemented.");
    }

    update(): boolean {
        throw new Error("Method not implemented.");
    }
}
export {ILearnDraw,DrawGLContainerBase};
export default ILearnDraw;