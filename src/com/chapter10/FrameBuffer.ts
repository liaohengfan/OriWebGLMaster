import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4, Vector3} from "../base/Matrix";
import TextureQuad from "../chapter5/TextureQuad";
import {DefWebGLBuffer} from "../oriwebgl/Core";
import {Cube} from "../oriwebgl/Cube";
import {Plane} from "../oriwebgl/Plane";

/** * 多个着色器 */
class FrameBuffer extends DrawGLContainerBase {
    //状态
    enabled: boolean = false;

    //图片-纹理
    image:HTMLImageElement;
    texture:WebGLTexture;

    //视图矩阵
    mvpMatrix: Matrix4;//模型视图投影矩阵
    mvpMatrixFBO: Matrix4;//模型视图投影矩阵
    modelMatrix:Matrix4;

    //视点位置
    eyePoint:number[]=[0,0,15];

    //单色着色器程序对象
    program: WebGLProgram;

    //立方体对象
    cube:Cube;
    plane:Plane;

    //fbo
    fbo:WebGLFramebuffer;

    //angle
    curAngle:number=0;
    angleStep:number=.5;

    constructor(gl: any, container: HTMLElement) {
        super(gl, container);
        this.getGLSL('./assets/glsls/chapter10/', 'FrameBuffer');
    }

    initShader(vshader: string, fshader: string) {
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
        this.program=program;
        this.loadTextures();
    }

    /**     * 加载纹理     */
    loadTextures(){
        let that:FrameBuffer=this;
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
        this.plane=new Plane(this.gl);

        //
        this.fbo=this.gl.createFramebuffer();

        //模型视图投影矩阵
        this.mvpMatrix = new Matrix4();
        this.mvpMatrix.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrix.lookAt(0,0,7, 0, 0, 0, 0, 1, 0);

        this.mvpMatrixFBO=new Matrix4();
        this.mvpMatrixFBO.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrixFBO.lookAt(0,2,7, 0, 0, 0, 0, 1, 0);

        this.modelMatrix=new Matrix4();

        //使用的着色器程序
        GL.useProgram(this.program);

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
        this.draw();
        this.curAngle=(this.curAngle%360);

    }

    /**
     * 绑定并开启缓冲区对象
     * @param {WebGLRenderingContext} gl
     * @param {number} a_attribute
     * @param {DefWebGLBuffer} buffer
     */
    initAttributeVariable(gl:WebGLRenderingContext, a_attribute:number, buffer:DefWebGLBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute);
    }

    /**     * 绘制     */
    draw(): void {
        const GL:WebGLRenderingContext=this.gl;
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    }

    update(): boolean {
        if (!this.enabled) return;
        this.animate();
        return true;
    }

}
export default FrameBuffer;