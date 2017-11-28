import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4, Vector3} from "../base/Matrix";

/** * 立方体-光照-环境光 */
class PointLightedCubeAni extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    u_MVPMatrix:WebGLUniformLocation;
    u_LightColor:WebGLUniformLocation;
    u_LightPosition:WebGLUniformLocation;
    u_AmbientLight:WebGLUniformLocation;
    u_NormalMatrix:WebGLUniformLocation;
    u_ModelMatrix:WebGLUniformLocation;

    //视图矩阵
    mvpMatrix:Matrix4;//模型视图投影矩阵
    modelMatrix:Matrix4;//模型矩阵
    normalMatrix:Matrix4;//法向量矩阵

    //视点位置
    g_eyeX:number=6;
    g_eyeY:number=6;
    g_eyeZ:number=14;

    //旋转
    curAngle:number=90;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter8/','PointLightedCube');
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
            2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
            2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
            2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
            -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
            -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
            2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
        ]);

        //法向量
        let normals:Float32Array=new Float32Array([
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);

        //颜色
        let colors:Float32Array=new Float32Array([
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
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
        this.initArrayBuffer(normals,3,GL.FLOAT,'a_Normal');
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
        this.u_MVPMatrix=GL.getUniformLocation(this.glProgram,'u_MVPMatrix');
        this.u_LightColor=GL.getUniformLocation(this.glProgram,'u_LightColor');
        this.u_LightPosition=GL.getUniformLocation(this.glProgram,'u_LightPosition');
        this.u_AmbientLight=GL.getUniformLocation(this.glProgram,'u_AmbientLight');
        this.u_NormalMatrix=GL.getUniformLocation(this.glProgram,'u_NormalMatrix');
        this.u_ModelMatrix=GL.getUniformLocation(this.glProgram,'u_ModelMatrix');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer();
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }

        //模型矩阵
        this.modelMatrix=new Matrix4();
        this.modelMatrix.setRotate(this.curAngle,0,1,0);

        //法向量矩阵
        this.normalMatrix=new Matrix4();
        this.normalMatrix.setInverseOf(this.modelMatrix);//逆矩阵
        this.normalMatrix.transpose();//转置

        //模型视图投影矩阵
        this.mvpMatrix=new Matrix4();
        this.mvpMatrix.setPerspective(30,this.container.clientWidth/this.container.clientHeight,1,100);
        this.mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
        this.mvpMatrix.multiply(this.modelMatrix);

        //设置模型矩阵
        GL.uniformMatrix4fv(this.u_ModelMatrix,false,this.modelMatrix.elements);

        //设置视图模型投影
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);

        //设置法向矩阵
        GL.uniformMatrix4fv(this.u_NormalMatrix,false,this.normalMatrix.elements);

        //设置光照
        GL.uniform3f(this.u_LightColor,1.0,1.0,1.0);//白色光照
        GL.uniform3f(this.u_AmbientLight,.2,.2,.2);//环境光

        GL.uniform3f(this.u_LightPosition,2.3, 4.0, 3.5);//设置光源位置

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

    /**     * 动画     */
    animate():void{
        this.curAngle+=.2;
        const GL:WebGLRenderingContext=this.gl;
        //模型矩阵
        this.modelMatrix.setRotate(this.curAngle,0,1,0);

        //法向量矩阵
        this.normalMatrix=new Matrix4();
        this.normalMatrix.setInverseOf(this.modelMatrix);//逆矩阵
        this.normalMatrix.transpose();//转置

        //模型视图投影矩阵
        this.mvpMatrix=new Matrix4();
        this.mvpMatrix.setPerspective(30,this.container.clientWidth/this.container.clientHeight,1,100);
        this.mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
        this.mvpMatrix.multiply(this.modelMatrix);

        //设置模型矩阵
        GL.uniformMatrix4fv(this.u_ModelMatrix,false,this.modelMatrix.elements);

        //设置视图模型投影
        GL.uniformMatrix4fv(this.u_MVPMatrix,false,this.mvpMatrix.elements);

        //设置法向矩阵
        GL.uniformMatrix4fv(this.u_NormalMatrix,false,this.normalMatrix.elements);
        this.curAngle=this.curAngle%360;

        //绘制
        this.draw();//
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
        this.animate();
        return true;
    }

}
export default PointLightedCubeAni;