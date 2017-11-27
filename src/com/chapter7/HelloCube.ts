import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

/** * 立方体 */
class HelloCube extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_Color:number;
    u_MVPMatrix:WebGLUniformLocation;

    //视图矩阵
    mvpMatrix:Matrix4;//模型视图投影矩阵

    //视点位置
    g_eyeX:number=3;
    g_eyeY:number=3;
    g_eyeZ:number=7;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter7/','PerspectiveDepth');
    }

    initVertexBuffer():number{
        const GL:WebGLRenderingContext=this.gl;
        //顶点数据
        let verticesColors:Float32Array=new Float32Array([
            //顶点              颜色    序号
            1.0, 1.0 , 1.0,    1,1,1,   //v0
            -1.0, 1.0 , 1.0,    1,0,1,   //v1
            -1.0,-1.0 , 1.0,    1,0,0,  //v2
            1.0,-1.0 , 1.0,    1,1,0,  //v3
            1.0,-1.0 ,-1.0,    0,1,0,  //v4
            1.0, 1.0 ,-1.0,    0,1,1,  //v5
            -1.0, 1.0 ,-1.0,    0,0,1,  //v6
            -1.0,-1.0 ,-1.0,    0,0,0   //v7
        ]);

        //顶点索引
        let indices:Uint8Array=new Uint8Array([
            0,1,2,  0,2,3,//前
            0,3,4,  0,4,5,//右
            0,5,6,  0,6,1,//上
            1,6,7,  1,7,2,//左
            7,4,3,  7,3,2,//下
            4,7,6,  4,6,5 //后
        ]);
        let vertexColorBuffer:WebGLBuffer=GL.createBuffer();//顶点 颜色缓冲
        let indexBuffer:WebGLBuffer=GL.createBuffer();//索引缓冲

        //颜色和坐标写入缓冲区
        GL.bindBuffer(GL.ARRAY_BUFFER,vertexColorBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,verticesColors,GL.STATIC_DRAW);

        let FSIZE:number=verticesColors.BYTES_PER_ELEMENT;

        //将缓冲区内顶点坐标数据分配给 a_Position并开启
        GL.vertexAttribPointer(this.a_Position,3,GL.FLOAT,false,FSIZE*6,0);
        GL.enableVertexAttribArray(this.a_Position);//

        //将缓冲区顶点颜色分配个a_Color;
        GL.vertexAttribPointer(this.a_Color,3,GL.FLOAT,false,FSIZE*6,FSIZE*3);
        GL.enableVertexAttribArray(this.a_Color);

        //顶点索引数据写入缓冲区对象
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,indexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,indices,GL.STATIC_DRAW);

        return indices.length;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_Color=GL.getAttribLocation(this.glProgram,'a_Color');
        this.u_MVPMatrix=GL.getUniformLocation(this.glProgram,'u_MVPMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer();
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //模型视图投影矩阵
        this.mvpMatrix=new Matrix4();
        this.mvpMatrix.setPerspective(30,this.container.clientWidth/this.container.clientHeight,1,100);
        this.mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

        //设置顶点大小 颜色 并清空canvas
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);

        //开启深度测试
        GL.enable(GL.DEPTH_TEST);

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
                this.g_eyeX+=1;
            }else if(e.keyCode==37){
                this.g_eyeX-=1;
            }else{
                return;
            }
            this.updateViewModelMatrix();//更新视图模型矩阵
        });
    }

    /**    * 更新视图模型矩阵     */
    updateViewModelMatrix():void{
        this.mvpMatrix.setPerspective(30,this.container.clientWidth/this.container.clientHeight,1,100);
        this.mvpMatrix.lookAt(this.g_eyeX,this.g_eyeY,this.g_eyeZ,0,0,0,0,1,0);
        this.gl.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);
        this.draw();
    }

    /**     * 绘制     */
    draw():void{
        const GL:WebGLRenderingContext=this.gl;

        //清除颜色缓冲区 清除深度缓冲区
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);

        //绘制三角形1
        GL.drawElements(GL.TRIANGLES,this.pointLength,GL.UNSIGNED_BYTE,0);//三角形
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default HelloCube;