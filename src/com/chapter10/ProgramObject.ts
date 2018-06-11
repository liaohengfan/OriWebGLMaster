import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";
import TextureQuad from "../chapter5/TextureQuad";
import {Cube} from "../oriwebgl/Cube";
import {DefWebGLBuffer} from "../oriwebgl/Core";

/** * 多个着色器 */
class ProgramObject extends DrawGLContainerBase {
    //状态
    enabled: boolean = false;

    //图片-纹理
    image:HTMLImageElement;
    texture:WebGLTexture;

    //视图矩阵
    mvpMatrix: Matrix4;//模型视图投影矩阵
    normalMatrix: Matrix4;//
    modelMatrix:Matrix4;

    //视点位置
    g_eyeX: number = 3;
    g_eyeY: number = 3;
    g_eyeZ: number = 7;

    pointLength: number = 0;

    //单色着色器程序对象
    solidProgram: WebGLProgram;
    s_a_Position: number;
    s_a_Normal: number;
    s_u_MvpMatrix: WebGLUniformLocation;
    s_u_NormalMatrix: WebGLUniformLocation;

    //纹理着色器程序对象
    textureProgram: WebGLProgram;
    t_a_Position: number;
    t_a_TexCoord: number;
    t_a_Normal: number;
    t_u_Sampler: WebGLUniformLocation;
    t_u_MvpMatrix: WebGLUniformLocation;
    t_u_NormalMatrix: WebGLUniformLocation;

    //立方体对象
    cube:Cube;

    //angle
    curAngle:number=0;
    angleStep:number=.5;

    constructor(gl: any, container: HTMLElement) {
        super(gl, container);
        this.getGLSL('./assets/glsls/chapter10/', 'Solid');
        this.getGLSL('./assets/glsls/chapter10/', 'Texture');
    }

    initShader(vshader: string, fshader: string, name: string) {
        const GL: WebGLRenderingContext = this.gl;
        let program:WebGLProgram=GL.createProgram();
        let verShader: WebGLShader = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(verShader, vshader);
        GL.compileShader(verShader);
        let fragShader: WebGLShader = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(fragShader, fshader);
        GL.compileShader(fragShader);
        GL.attachShader(program,verShader);
        GL.attachShader(program,fragShader);
        GL.linkProgram(program);
        if (name == 'Solid') {
            this.solidProgram = program;
        }

        if (name=='Texture'){
            this.textureProgram=program;
        }

        if(this.solidProgram&&this.textureProgram){//着色器创建成功 加载纹理
            this.loadTextures();
        }

    }

    /**     * 加载纹理     */
    loadTextures(){
        let that:ProgramObject=this;
        let image:HTMLImageElement=this.image=new Image();
        image.onload=function(){
            that.initTexture();
        };
        image.src='assets/textures/cube/Park2/negx.jpg';
    }

    /**     * 初始化纹理     */
    initTexture() {
        const GL: WebGLRenderingContext = this.gl;
        this.texture = this.gl.createTexture();//创建纹理
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行y轴翻转
        GL.activeTexture(GL.TEXTURE0);//开启0 号纹理单元
        GL.bindTexture(GL.TEXTURE_2D, this.texture);//绑定纹理对象
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);//配置纹理参数
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);//配置纹理参数
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.MIRRORED_REPEAT);//配置纹理参数
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, this.image);//配置纹理图像

        this.init();//初始化
    }

    init(): boolean {
        const GL: WebGLRenderingContext = this.gl;

        //创建立方体
        this.cube=new Cube(this.gl);
        /*if(this.cube){
            console.log('cube:',this.cube);
            return;
        }*/

        //模型视图投影矩阵
        this.mvpMatrix = new Matrix4();
        this.mvpMatrix.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrix.lookAt(0, 0, 15, 0, 0, 0, 0, 1, 0);

        this.modelMatrix=new Matrix4();

        //法向矩阵
        this.normalMatrix=new Matrix4();
        this.normalMatrix.setInverseOf(this.mvpMatrix);
        this.normalMatrix.transpose();

        //单色cube
        this.s_a_Position = GL.getAttribLocation(this.solidProgram, 'a_Position');
        this.s_a_Normal = GL.getAttribLocation(this.solidProgram, 'a_Normal');
        this.s_u_MvpMatrix = GL.getUniformLocation(this.solidProgram, 'u_MvpMatrix');
        this.s_u_NormalMatrix = GL.getUniformLocation(this.solidProgram, 'u_NormalMatrix');

        //获取程序变量地址
        this.t_a_Position = GL.getAttribLocation(this.textureProgram, 'a_Position');
        this.t_a_Normal = GL.getAttribLocation(this.textureProgram, 'a_Normal');
        this.t_a_TexCoord = GL.getAttribLocation(this.textureProgram, 'a_TexCoord');
        this.t_u_MvpMatrix = GL.getUniformLocation(this.textureProgram, 'u_MvpMatrix');
        this.t_u_NormalMatrix = GL.getUniformLocation(this.textureProgram, 'u_NormalMatrix');
        this.t_u_Sampler = GL.getUniformLocation(this.textureProgram, 'u_Sampler');

        //开启深度测试
        GL.enable(GL.DEPTH_TEST);
        //清除颜色缓冲区 清除深度缓冲区
        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        this.enabled = true;
        return true;
    }

    /**     * 动画     */
    animate():void{
        this.curAngle+=this.angleStep;
        const GL:WebGLRenderingContext=this.gl;
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        //单色立方体配置
        GL.useProgram(this.solidProgram);
        this.initAttributeVariable(GL, this.s_a_Position, this.cube.vertexBuffer); // Vertex coordinates
        this.initAttributeVariable(GL, this.s_a_Normal, this.cube.normalBuffer);   // Normal
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer);  // Bind indices
        //绘制单色立方体
        this.drawCube(this.s_u_NormalMatrix,this.s_u_MvpMatrix,this.cube, -2, this.curAngle, this.mvpMatrix);   // Draw

        //纹理立方体配置
        GL.useProgram(this.textureProgram);

        this.initAttributeVariable(GL, this.t_a_Position, this.cube.vertexBuffer);
        this.initAttributeVariable(GL, this.t_a_Normal, this.cube.normalBuffer);
        this.initAttributeVariable(GL, this.t_a_TexCoord, this.cube.texCoordBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer);

        //激活1号纹理并绑定纹理
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        //绘制纹理立方体
        this.drawCube(this.t_u_NormalMatrix,this.t_u_MvpMatrix,this.cube, 2, this.curAngle, this.mvpMatrix);   // Draw
        this.curAngle=(this.curAngle%360);


    }

    initAttributeVariable(gl:WebGLRenderingContext, a_attribute:number, buffer:DefWebGLBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute);
    }

    /**     * 绘制盒子     */
    drawCube(u_NormalMatrix:WebGLUniformLocation,u_MvpMatrix:WebGLUniformLocation, cube:Cube, x:number, angle:number, viewProjMatrix:Matrix4) {
        const GL: WebGLRenderingContext = this.gl;

        //设置模型矩阵
        this.modelMatrix.setTranslate(x, 0.0, 0.0);
        this.modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
        this.modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

        //设置法向量
        this.normalMatrix.setInverseOf(this.modelMatrix);
        this.normalMatrix.transpose();
        GL.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        //设置视图模型矩阵
        let mvpMatrix:Matrix4=new Matrix4();
        mvpMatrix.set(viewProjMatrix);
        mvpMatrix.multiply(this.modelMatrix);
        GL.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
        GL.drawElements(GL.TRIANGLES, cube.numIndices, cube.indexBuffer.type, 0);   // Draw

    }

    /**     * 绘制     */
    draw(): void {
    }

    update(): boolean {
        if (!this.enabled) return;
        this.animate();
        return true;
    }

}
export default ProgramObject;