import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";

class Translated extends DrawGLContainerBase{
    a_Position:number;
    u_FragColor:WebGLUniformLocation;
    u_Translation:WebGLUniformLocation;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter3/','translate');
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
        this.u_Translation=GL.getUniformLocation(this.glProgram,'u_Translation');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer([//三角形
            0.0,0.5,
            -0.5,-0.5,
            0.5,-0.5
        ]);

        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //偏移
        let Tx:number=.5;
        let Ty:number=.5;
        let Tz:number=0;
        GL.uniform4f(this.u_Translation,Tx,Ty,Tz,0.0);


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
export default Translated;