import {initShaders} from './../../libs/oriwebgl/Utils';
import {GLSLTools} from './../../libs/oriwebgl/GLSLTools';
import ILearnDraw from "../ILearnDraw";
/**
 * 章2 - 1
 * 绘制一个点
 * @param gl
 * @constructor
 */
class DrawAPoint implements ILearnDraw{
    gl: any;
    container: HTMLElement;
    constructor(gl:any,container:HTMLElement){
        this.gl=gl;
        this.container=container;
        GLSLTools.getGLSL('./assets/glsls/chapter2/','DrawAPoint',(vshader:string,fshader:string)=>{
            this.init(vshader,fshader);
        });
    }

    init(vshader: string, fshader: string): boolean {
        let gl:any=this.gl;
        if(!initShaders(gl,vshader,fshader)){
            console.log('Filed to init shaders!');
            return;
        }
        let a_Position:any=gl.getAttribLocation(gl.program,'a_Position');
        let a_PointSize:any=gl.getAttribLocation(gl.program,'a_PointSize');
        let a_Color:any=gl.getAttribLocation(gl.program,'a_Color');
        gl.vertexAttrib3f(a_Position,0.0,0.0,0.0); //center
        gl.vertexAttrib1f(a_PointSize,100.0);
        gl.vertexAttrib3f(a_Color,0.0,0.0,1.0);
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS,0,1);
        return undefined;
    }

    update(): boolean {
        return undefined;
    }
}
export default DrawAPoint;