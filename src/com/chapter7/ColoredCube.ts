import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

/** * 立方体 */
class ColoredCube extends DrawGLContainerBase{
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

    /**     * 初始化缓存区对象     */
    initArrayBuffer(data:any,num:number,type:number,attr:string):boolean{
        let buffer:WebGLBuffer=this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,data,this.gl.STATIC_DRAW);
        let a_attr:number=this.gl.getAttribLocation(this.glProgram,attr);
        this.gl.vertexAttribPointer(a_attr,num,type,false,0,0);
        this.gl.enableVertexAttribArray(a_attr);
        return true;
    }

    initVertexBuffer():number{
        const GL:WebGLRenderingContext=this.gl;
        //顶点数据
        let vertices:Float32Array=new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
            -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
            -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
        ]);

        //颜色
        let colors:Float32Array=new Float32Array([
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
            0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ]);

        //顶点索引
        let indices:Uint8Array=new Uint8Array([       // Indices of the vertices
            0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);

        //绑定缓冲区
        this.initArrayBuffer(vertices,3,GL.FLOAT,'a_Position');
        this.initArrayBuffer(colors,3,GL.FLOAT,'a_Color');

        //顶点及颜色索引
        let indexBuffer:WebGLBuffer=GL.createBuffer();//索引缓冲

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
export default ColoredCube;