import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

class RotatedMatrix4 extends DrawGLContainerBase{
    a_Position:number;
    u_FragColor:WebGLUniformLocation;
    u_xformMatrix:WebGLUniformLocation;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter3/','rotatedMatrix');
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
        this.u_FragColor=GL.getUniformLocation(this.glProgram,'u_FragColor');
        this.u_xformMatrix=GL.getUniformLocation(this.glProgram,'u_xformMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer([//三角形
            0.0,0.5,
            -0.5,-0.5,
            0.5,-0.5
        ]);

        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //Matrix4 矩阵
        let matrix4:Matrix4=new Matrix4();

        //旋转
        const ANGLE:number=90;
        //matrix4.setRotate(ANGLE,0,0,1);

        //平移
        let Tx:number=.5;
        let Ty:number=.5;
        let Tz:number=0;
        //matrix4.setTranslate(Tx,Ty,Tz);

        //缩放
        let Sx:number=.5;
        let Sy:number=.5;
        let Sz:number=.5;
        matrix4.setScale(Sx,Sy,Sz);



        //设置矩阵
        GL.uniformMatrix4fv(this.u_xformMatrix,false,matrix4.elements);


        //设置顶点大小 颜色 并清空canvas
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //面
        GL.drawArrays(GL.TRIANGLES,0,l);//三角形

        return true;
    }

    update(): boolean {
        throw new Error("Method not implemented.");
    }

}
export default RotatedMatrix4;