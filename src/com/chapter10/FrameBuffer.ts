import {DrawGLContainerBase} from "../ILearnDraw";
import {Matrix4} from "../base/Matrix";
import {DefWebGLBuffer} from "../oriwebgl/Core";
import {Cube} from "../oriwebgl/Cube";
import {Plane} from "../oriwebgl/Plane";


const OFFSCREEN_WIDTH: number = 256;
const OFFSCREEN_HEIGHT: number = 256;

/** * 多个着色器 */
class FrameBuffer extends DrawGLContainerBase {
    //状态
    enabled: boolean = false;

    //图片-纹理
    image: HTMLImageElement;
    texture: WebGLTexture;

    //视图矩阵
    mvpMatrix: Matrix4;//模型视图投影矩阵
    modelMatrix: Matrix4;

    //单色着色器程序对象
    program: WebGLProgram;

    //glsl 变量
    a_Position: number;
    a_TexCoord: number;
    u_MvpMatrix: WebGLUniformLocation;

    //帧缓冲视图模型矩阵
    mvpMatrixFBO: Matrix4;//帧缓冲视图模型矩阵
    //帧缓冲对象
    frameBuffer: WebGLFramebuffer;
    depthBuffer: WebGLRenderbuffer;
    frameTexture: WebGLTexture;

    //立方体对象
    cube: Cube;
    plane: Plane;

    //angle
    curAngle: number = 0;
    angleStep: number = .5;

    constructor(gl: any, container: HTMLElement) {
        super(gl, container);
        this.getGLSL('./assets/glsls/chapter10/', 'FrameBuffer');
    }

    initShader(vshader: string, fshader: string) {
        const GL: WebGLRenderingContext = this.gl;
        let program: WebGLProgram = GL.createProgram();
        let verShader: WebGLShader = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(verShader, vshader);
        GL.compileShader(verShader);
        let fragShader: WebGLShader = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(fragShader, fshader);
        GL.compileShader(fragShader);
        GL.attachShader(program, verShader);
        GL.attachShader(program, fragShader);
        GL.linkProgram(program);
        this.program = program;
        this.loadTextures();
    }

    /**     * 加载纹理     */
    loadTextures() {
        let that: FrameBuffer = this;
        let image: HTMLImageElement = this.image = new Image();
        image.onload = function () {
            that.initTexture();
        };
        image.src = 'assets/textures/cube/Park2/negx.jpg';
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
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.image);//配置纹理图像

        this.init();//初始化
    }

    init(): boolean {
        const GL: WebGLRenderingContext = this.gl;

        //创建立方体
        this.cube = new Cube(this.gl);
        this.plane = new Plane(this.gl);

        //创建帧缓冲对象
        this.initFrameBufferObject();

        //模型视图投影矩阵
        this.mvpMatrix = new Matrix4();
        this.mvpMatrix.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrix.lookAt(0, 0, 7, 0, 0, 0, 0, 1, 0);

        //帧缓冲对象视图模型矩阵
        this.mvpMatrixFBO = new Matrix4();
        this.mvpMatrixFBO.setPerspective(30, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
        this.mvpMatrixFBO.lookAt(0, 2, 7, 0, 0, 0, 0, 1, 0);

        this.modelMatrix = new Matrix4();

        //获取对象
        this.u_MvpMatrix = GL.getUniformLocation(this.program, 'u_MvpMatrix');
        this.a_Position = GL.getAttribLocation(this.program, 'a_Position');
        this.a_TexCoord = GL.getAttribLocation(this.program, 'a_TexCoord');

        this.initAttributeVariable(GL, this.a_Position, this.cube.vertexBuffer);
        this.initAttributeVariable(GL, this.a_TexCoord, this.cube.texCoordBuffer);

        //使用的着色器程序
        GL.useProgram(this.program);

        //开启深度测试
        GL.enable(GL.DEPTH_TEST);
        //清除颜色缓冲区 清除深度缓冲区
        GL.clearColor(0.0, 0.0, 0.0, 1.0);

        //程序准备好了。
        this.enabled = true;
        return true;
    }

    /**     * 创建帧缓冲对象     */
    private initFrameBufferObject(): void {
        const gl: WebGLRenderingContext = this.gl;

        //创建帧缓冲对象
        this.frameBuffer = gl.createFramebuffer();
        if (!this.frameBuffer) {
            console.log('创建帧缓冲对象失败');
            return;
        }

        //创建保存帧缓冲对象结果的纹理-并设置参数
        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture); //绑定该纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        //创建渲染缓冲对象 设置其尺寸
        this.depthBuffer = gl.createRenderbuffer();
        if (!this.depthBuffer) {
            console.log('创建渲染缓冲失败');
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);//绑定渲染缓冲对象
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

        //绑定渲染缓冲对象 和 纹理对象 到帧缓冲对象上
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);

        //检查缓冲区对象配置是否成功
        let e: number = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (gl.FRAMEBUFFER_COMPLETE !== e) {
            console.log('缓冲区对象配置失败: ' + e.toString());
        }

        //取消缓冲区对象绑定
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    }

    /**     * 动画     */
    animate(): void {
        this.curAngle += this.angleStep;
        this.curAngle = (this.curAngle % 360);
        this.draw();

    }

    /**
     * 绑定并开启缓冲区对象
     * @param {WebGLRenderingContext} gl
     * @param {number} a_attribute
     * @param {DefWebGLBuffer} buffer
     */
    initAttributeVariable(gl: WebGLRenderingContext, a_attribute: number, buffer: DefWebGLBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute);
    }

    /**     * 绘制     */
    draw(): void {
        const gl: WebGLRenderingContext = this.gl;

        //绑定缓冲区对象 把结果渲染到缓冲区对象上
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
        gl.clearColor(0.2, 0.2, 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //设置绘制盒子的时候旋转矩阵
        this.modelMatrix.setTranslate(0, 0.0, 0.0);
        this.modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
        this.modelMatrix.rotate(this.curAngle, 0.0, 1.0, 0.0);

        //绘制盒子  此时绘制结果被保存到缓冲区对象上 窗口上不会显示结果
        this.drawGeometry(this.cube, this.texture, this.mvpMatrix);

        //取消缓冲区对象绑定
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.container.clientWidth, this.container.clientHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //设置绘制平面的时候旋转矩阵-与盒子旋转方向相反
        this.modelMatrix.setTranslate(0, 0.0, 0.0);
        this.modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
        this.modelMatrix.rotate(-(this.curAngle * .2), 0.0, 1.0, 0.0);
        //绘制平面，此时因为缓冲区对象被取消， 渲染结果可以直接体现在窗体上
        this.drawGeometry(this.plane, this.frameTexture, this.mvpMatrixFBO);
    }

    /**
     * 绘制几何体
     * @param {Cube | Plane} geo
     * @param {WebGLTexture} texture
     * @param {Matrix4} viewProjMatrix
     */
    drawGeometry(geo: Cube | Plane, texture: WebGLTexture, viewProjMatrix: Matrix4) {
        const GL: WebGLRenderingContext = this.gl;

        //激活该 网格的缓冲区 并绑定对象
        this.initAttributeVariable(GL, this.a_Position, geo.vertexBuffer);
        this.initAttributeVariable(GL, this.a_TexCoord, geo.texCoordBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, geo.indexBuffer);  // Bind indices

        // 绑定该网格的纹理
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);

        // 设置模型矩阵
        let mvpMatrix: Matrix4 = new Matrix4();
        mvpMatrix.set(viewProjMatrix);
        mvpMatrix.multiply(this.modelMatrix);
        GL.uniformMatrix4fv(this.u_MvpMatrix, false, mvpMatrix.elements);
        GL.drawElements(GL.TRIANGLES, geo.numIndices, geo.indexBuffer.type, 0);
    }

    update(): boolean {
        if (!this.enabled) return;
        this.animate();
        return true;
    }

}

export default FrameBuffer;