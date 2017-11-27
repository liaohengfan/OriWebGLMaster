import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

class ModelViewPersMatrix extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_Color:number;
    u_MVPMatrix:WebGLUniformLocation;

    //视图矩阵
    modelMatrix:Matrix4;//模型
    viewMatrix:Matrix4;//视图
    projMatrix:Matrix4;//投影
    mvpMatrix:Matrix4;//模型视图投影矩阵

    //视点位置
    g_eyeX:number=0.0;
    g_eyeY:number=0.0;
    g_eyeZ:number=5;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter7/','ModelViewPersMatrix');
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
        this.u_MVPMatrix=GL.getUniformLocation(this.glProgram,'u_MVPMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer(
            [//三角形
                //右侧三角形
                //顶点            //颜色
                0.0,  1.0, -4.0,  0.4,1.0,0.4,//绿色
                -0.5, -1.0, -4.0,  0.4,1.0,0.4,
                0.5, -1.0, -4.0,  1.0,0.4,0.4,

                0.0,  1.0, -2.0,  1.0,1.0,0.4,//黄色
                -0.5, -1.0, -2.0,  1.0,1.0,0.4,
                0.5, -1.0, -2.0,  1.0,0.4,0.4,

                0.0,  1.0,  0.0,  0.4,0.4,1.0,//蓝色
                -0.5, -1.0,  0.0,  0.4,0.4,1.0,
                0.5, -1.0,  0.0,  1.0,0.4,0.4,

            ],
            6
        );
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //视图矩阵
        this.viewMatrix=new Matrix4();
        this.viewMatrix.setLookAt(this.g_eyeX,this.g_eyeY,this.g_eyeZ,0,0,0,0,1,0);//

        //模型矩阵
        this.modelMatrix=new Matrix4();

        //可视空间-透视投影
        this.projMatrix=new Matrix4();
        this.projMatrix.setPerspective(30,this.container.clientWidth/this.container.clientHeight,1,100);

        //模型视图投影矩阵
        this.mvpMatrix=new Matrix4();
        this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix).multiply(this.modelMatrix);

        //设置顶点大小 颜色 并清空canvas
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);

        //添加键盘监听
        this.createHandler();

        this.draw();
        this.enabled=true;
        return true;
    }

    /**     * 事件监听     */
    createHandler():void{
        document.addEventListener('keydown',(e:KeyboardEvent)=>{
            if(e.keyCode==39){
                this.g_eyeX+=.01;
            }else if(e.keyCode==37){
                this.g_eyeX-=.01;
            }else{
                return;
            }
            this.updateViewModelMatrix();//更新视图模型矩阵
        });
    }

    /**    * 更新视图模型矩阵     */
    updateViewModelMatrix():void{
        msg('updateViewModelMatrix');
        this.viewMatrix.setLookAt(this.g_eyeX,this.g_eyeY,this.g_eyeZ,0,0,0,0,1,0);//
        this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix).multiply(this.modelMatrix);
        this.gl.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);
        this.draw();
    }

    /**     * 绘制     */
    draw():void{
        const GL:WebGLRenderingContext=this.gl;

        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //绘制右侧
        this.modelMatrix.setTranslate(0.75,0,0);
        this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix).multiply(this.modelMatrix);
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);
        GL.drawArrays(GL.TRIANGLES,0,this.pointLength);//三角形

        //绘制左侧
        this.modelMatrix.setTranslate(-0.75,0,0);
        this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix).multiply(this.modelMatrix);
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);
        GL.drawArrays(GL.TRIANGLES,0,this.pointLength);//三角形
        //GL.drawArrays(GL.LINE_STRIP,0,this.pointLength);//三角形
        //GL.drawArrays(GL.LINE_LOOP,0,this.pointLength);//三角形
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default ModelViewPersMatrix;