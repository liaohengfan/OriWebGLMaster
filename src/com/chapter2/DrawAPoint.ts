import {initShaders} from '../base/Utils';
import {GLSLTools} from '../base/GLSLTools';
import ILearnDraw, {DrawGLContainerBase} from "../ILearnDraw";
/**
 * 章2 - 1
 * 绘制一个点
 * @param gl
 * @constructor
 */
class DrawAPoint extends DrawGLContainerBase{
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter2/','DrawAPoint')
    }

    init(): boolean {
        let gl:any=this.gl;
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