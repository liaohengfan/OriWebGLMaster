import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

class MultiAttributeSize extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_PointSize:number;
    u_FragColor:WebGLUniformLocation;

    //当前旋转角度
    curAngle:number=0;
    angleSpeed:number=45;
    lastUpdateTime:number=0;

    //模型矩阵
    modelMatrix:Matrix4;
    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter5/','MultiAttributeSize');
    }

    initVertexBuffer(verts:Array<number>,size:Array<number>,step:number=2):number{
        let l:number=0;
        let gl:WebGLRenderingContext=this.gl;
        let vertices:Float32Array=new Float32Array(verts);
        l=vertices.length/step;
        let vertexBuffer:WebGLBuffer=gl.createBuffer();
        if(!vertexBuffer){
            msg('创建缓冲对象失败');
            return -1;
        }

        //顶点位置 缓冲对象
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.a_Position,step,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this.a_Position);

        //顶点大小缓冲对象
        let sizes:Float32Array=new Float32Array(size);
        let sizeBuffer:WebGLBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.a_PointSize,1,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this.a_PointSize);

        return l;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_PointSize=GL.getAttribLocation(this.glProgram,'a_PointSize');
        this.u_FragColor=GL.getUniformLocation(this.glProgram,'u_FragColor');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer(
            [//三角形
                0.0,0.3,
                -0.3,-0.3,
                0.3,-0.3
            ],
            [
                5,10,20
            ]
        );
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //设置顶点大小 颜色 并清空canvas
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //面
        GL.drawArrays(GL.POINTS,0,l);//三角形
        this.enabled=false;
        return true;
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default MultiAttributeSize;