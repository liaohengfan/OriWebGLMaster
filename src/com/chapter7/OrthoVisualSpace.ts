import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

class OrthoVisualSpace extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_Color:number;
    u_ProjMatrix:WebGLUniformLocation;

    //视图矩阵
    orthoMatrix:Matrix4;

    g_near:number=0;
    g_far:number=.5;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter7/','OrthoVisualSpace');
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
        gl.vertexAttribPointer(this.a_Position,3,gl.FLOAT,false,FSIZE*step,0);
        gl.enableVertexAttribArray(this.a_Position);

        //顶点颜色缓冲
        gl.vertexAttribPointer(this.a_Color,3,gl.FLOAT,false,FSIZE*step,FSIZE*3);
        gl.enableVertexAttribArray(this.a_Color);

        return l;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_Color=GL.getAttribLocation(this.glProgram,'a_Color');
        this.u_ProjMatrix=GL.getUniformLocation(this.glProgram,'u_ProjMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer(
            [//三角形
                0,0.5,-.4,.4,1,.4,//绿色
                -.5,-0.5,-.4,.4,1,.4,
                .5,-0.5,-.4,1,.4,.4,

                0.5,0.4,-.2,1,.4,.4,//黄色
                -.5,0.4,-.2,1,1,.4,
                0,-0.6,-.2,1,1,.4,

                0,0.5,0,.4,.4,1,//蓝色
                -.5,-0.5,0,.4,.4,1,
                .5,-0.5,0,1,.4,.4
            ],
            6
        );
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //正交可视空间
        this.orthoMatrix=new Matrix4();
        this.orthoMatrix.setOrtho(-1,1,-1,1,this.g_near,this.g_far);

        //设置顶点大小 颜色 并清空canvas
        GL.uniformMatrix4fv(this.u_ProjMatrix,false,this.orthoMatrix.elements);

        //添加键盘监听
        this.createHandler();

        this.draw();
        this.enabled=true;
        return true;
    }

    /**     * 事件监听     */
    createHandler():void{
        document.addEventListener('keydown',(e:KeyboardEvent)=>{
            switch (e.keyCode){
                case 39:
                    this.g_near+=.01;
                    break;
                case 37:
                    this.g_near-=.01;
                    break;
                case 38:
                    this.g_far+=.01;
                    break;
                case 40:
                    this.g_far-=.01;
                    break;
                default:
                    return;
            }
            this.updateViewModelMatrix();//更新视图模型矩阵
        });
    }

    /**    * 更新视图模型矩阵     */
    updateViewModelMatrix():void{
        msg('near:'+this.g_near+"  far:"+this.g_far);
        this.orthoMatrix.setOrtho(-1,1,-1,1,this.g_near,this.g_far);
        this.gl.uniformMatrix4fv(this.u_ProjMatrix,false,this.orthoMatrix.elements);
        this.draw();
    }

    /**     * 绘制     */
    draw():void{
        const GL:WebGLRenderingContext=this.gl;

        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //面
        GL.drawArrays(GL.TRIANGLES,0,this.pointLength);//三角形
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default OrthoVisualSpace;