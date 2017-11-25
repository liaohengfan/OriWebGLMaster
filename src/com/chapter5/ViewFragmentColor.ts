import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";

class ViewFragmentColor extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_PointSize:number;
    a_Color:number;
    u_Width:WebGLUniformLocation;
    u_Height:WebGLUniformLocation;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter5/','ViewFragmentColor');
    }

    initVertexBuffer(vertSizes:Array<number>,step:number=3):number{
        let l:number=0;
        let gl:WebGLRenderingContext=this.gl;
        let verticeSizes:Float32Array=new Float32Array(vertSizes);
        l=verticeSizes.length/step;
        let FSIZE:number=verticeSizes.BYTES_PER_ELEMENT;
        let vertexBuffer:WebGLBuffer=gl.createBuffer();
        if(!vertexBuffer){
            msg('创建缓冲对象失败');
            return -1;
        }

        //顶点位置 缓冲对象
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticeSizes,gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.a_Position,2,gl.FLOAT,false,FSIZE*step,0);
        gl.enableVertexAttribArray(this.a_Position);

        //顶点大小缓冲对象
        gl.vertexAttribPointer(this.a_PointSize,1,gl.FLOAT,false,FSIZE*step,FSIZE*2);
        gl.enableVertexAttribArray(this.a_PointSize);

        //顶点颜色缓冲
        gl.vertexAttribPointer(this.a_Color,3,gl.FLOAT,false,FSIZE*step,FSIZE*3);
        gl.enableVertexAttribArray(this.a_Color);

        return l;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_PointSize=GL.getAttribLocation(this.glProgram,'a_PointSize');
        this.a_Color=GL.getAttribLocation(this.glProgram,'a_Color');
        this.u_Width=GL.getUniformLocation(this.glProgram,'u_Width');
        this.u_Height=GL.getUniformLocation(this.glProgram,'u_Height');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer(
            [//三角形
                0.0,0.3,5,1,0,0,
                -0.3,-0.3,10,0,1,0,
                0.3,-0.3,20,0,0,1
            ],
            6
        );
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //设置顶点大小 颜色 并清空canvas
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.uniform1f(this.u_Width,GL.drawingBufferWidth);
        GL.uniform1f(this.u_Height,GL.drawingBufferHeight);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //点
        //GL.drawArrays(GL.POINTS,0,l);

        //面
        GL.drawArrays(GL.TRIANGLES,0,l);//三角形
        this.enabled=false;
        return true;
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default ViewFragmentColor;