import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

class RotatedTranslated extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    u_FragColor:WebGLUniformLocation;
    u_ModelMatrix:WebGLUniformLocation;

    //当前旋转角度
    curAngle:number=0;
    angleSpeed:number=45;
    lastUpdateTime:number=0;

    //模型矩阵
    modelMatrix:Matrix4;
    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter4/','RotatedTranslated');
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
        this.u_ModelMatrix=GL.getUniformLocation(this.glProgram,'u_ModelMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer([//三角形
            0.0,0.3,
            -0.3,-0.3,
            0.3,-0.3
        ]);
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //Matrix4 矩阵
        let modelMatrix:Matrix4=this.modelMatrix=new Matrix4();

        //设置矩阵
        GL.uniformMatrix4fv(this.u_ModelMatrix,false,modelMatrix.elements);

        //设置顶点大小 颜色 并清空canvas
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //面
        GL.drawArrays(GL.TRIANGLES,0,l);//三角形

        this.lastUpdateTime=Date.now();//上一次调用的时间
        this.enabled=true;
        return true;
    }

    /**     * 绘制     */
    draw(){
        const GL:WebGLRenderingContext=this.gl;
        const matrix:Matrix4=this.modelMatrix;
        this.modelMatrix.setRotate(this.curAngle,0,0,1);
        GL.uniformMatrix4fv(this.u_ModelMatrix,false,matrix.elements);
        GL.clear(GL.COLOR_BUFFER_BIT);
        GL.drawArrays(GL.TRIANGLES,0,this.pointLength);
    }

    /**     * 动画     */
    animate(){
        let now:number=Date.now();
        let elapsed:number=now-this.lastUpdateTime;
        this.lastUpdateTime=now;
        let newAngle:number=this.curAngle+(this.angleSpeed*elapsed)/1000;
        this.curAngle=(newAngle%=360);
    }


    update(): boolean {
        if(!this.enabled)return;
        this.animate();
        this.draw();
        return true;
    }

}
export default RotatedTranslated;