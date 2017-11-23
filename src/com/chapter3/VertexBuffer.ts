import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";

class VertexBuffer extends DrawGLContainerBase{
    a_Position:number;
    a_PointSize:number;
    u_FragColor:WebGLUniformLocation;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter3/','vertexBuffer');
    }

    initVertexBuffer(verts:Array<number>,step:number=2):number{
        let l:number=0;
        let gl:WebGLRenderingContext=this.gl;
        let vertices:Float32Array=new Float32Array(verts);
        l=vertices.length/step;
        let vertexBuffer:WebGLBuffer=gl.createBuffer();
        if(!vertexBuffer){
            msg('创建缓冲对象失败');
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.a_Position,step,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this.a_Position);
        return l;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_PointSize=GL.getAttribLocation(this.glProgram,'a_PointSize');
        this.u_FragColor=GL.getUniformLocation(this.glProgram,'u_FragColor');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer([
            0.0,0.5,
            -0.5,-0.5,
            0.5,-0.5
        ]);
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //设置顶点大小 颜色 并清空canvas
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.vertexAttrib1f(this.a_PointSize,10);
        GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //绘制点
        //GL.drawArrays(GL.POINTS,0,l);//点

        //绘制线条
        //GL.drawArrays(GL.LINES,0,l);//线段  奇 偶绘制  单一忽略
        //GL.drawArrays(GL.LINE_STRIP,0,l);//线条
        //GL.drawArrays(GL.LINE_LOOP,0,l);//闭合线条

        //面
        //GL.drawArrays(GL.TRIANGLES,0,l);//三角形
        //GL.drawArrays(GL.TRIANGLE_STRIP,0,l);//三角带
        GL.drawArrays(GL.TRIANGLE_FAN,0,l);//扇

        return true;
    }

    update(): boolean {
        throw new Error("Method not implemented.");
    }

}
export default VertexBuffer;