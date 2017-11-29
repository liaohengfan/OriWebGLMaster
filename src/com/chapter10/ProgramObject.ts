import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";
import {Matrix4} from "../base/Matrix";

/** * 多个着色器 */
class ProgramObject extends DrawGLContainerBase {
    //状态
    enabled: boolean = false;

    //GLSL属性
    a_Position: number;
    a_Color: number;
    u_MVPMatrix: WebGLUniformLocation;

    //视图矩阵
    mvpMatrix: Matrix4;//模型视图投影矩阵

    //视点位置
    g_eyeX: number = 3;
    g_eyeY: number = 3;
    g_eyeZ: number = 7;

    pointLength: number = 0;

    //单色着色器程序对象
    solidProgram: WebGLProgram;

    //纹理着色器程序对象
    textureProgram: WebGLProgram;

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

        if(this.solidProgram&&this.textureProgram){
            //this.init();
        }

    }

    initVertexBuffer(): number {
        const GL: WebGLRenderingContext = this.gl;
        //顶点数据
        let verticesColors: Float32Array = new Float32Array([
            //顶点              颜色    序号
            1.0, 1.0, 1.0, 1, 1, 1,   //v0
            -1.0, 1.0, 1.0, 1, 0, 1,   //v1
            -1.0, -1.0, 1.0, 1, 0, 0,  //v2
            1.0, -1.0, 1.0, 1, 1, 0,  //v3
            1.0, -1.0, -1.0, 0, 1, 0,  //v4
            1.0, 1.0, -1.0, 0, 1, 1,  //v5
            -1.0, 1.0, -1.0, 0, 0, 1,  //v6
            -1.0, -1.0, -1.0, 0, 0, 0   //v7
        ]);

        //顶点索引
        let indices: Uint8Array = new Uint8Array([
            0, 1, 2, 0, 2, 3,//前
            0, 3, 4, 0, 4, 5,//右
            0, 5, 6, 0, 6, 1,//上
            1, 6, 7, 1, 7, 2,//左
            7, 4, 3, 7, 3, 2,//下
            4, 7, 6, 4, 6, 5 //后
        ]);
        let vertexColorBuffer: WebGLBuffer = GL.createBuffer();//顶点 颜色缓冲
        let indexBuffer: WebGLBuffer = GL.createBuffer();//索引缓冲

        //颜色和坐标写入缓冲区
        GL.bindBuffer(GL.ARRAY_BUFFER, vertexColorBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, verticesColors, GL.STATIC_DRAW);

        let FSIZE: number = verticesColors.BYTES_PER_ELEMENT;

        //将缓冲区内顶点坐标数据分配给 a_Position并开启
        GL.vertexAttribPointer(this.a_Position, 3, GL.FLOAT, false, FSIZE * 6, 0);
        GL.enableVertexAttribArray(this.a_Position);//

        //将缓冲区顶点颜色分配个a_Color;
        GL.vertexAttribPointer(this.a_Color, 3, GL.FLOAT, false, FSIZE * 6, FSIZE * 3);
        GL.enableVertexAttribArray(this.a_Color);

        //顶点索引数据写入缓冲区对象
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);

        return indices.length;
    }

    init(): boolean {
        const GL: WebGLRenderingContext = this.gl;

        //获取顶点设置位置
        this.a_Position = GL.getAttribLocation(this.glProgram, 'a_Position');
        this.a_Color = GL.getAttribLocation(this.glProgram, 'a_Color');
        this.u_MVPMatrix = GL.getUniformLocation(this.glProgram, 'u_MVPMatrix');

        //初始化顶点缓冲数据
        let l: number = this.initVertexBuffer();
        this.pointLength = l;
        if (l <= 0) {
            msg('绑定顶点缓冲失败')
        }

        //模型视图投影矩阵
        this.mvpMatrix = new Matrix4();
        this.mvpMatrix.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

        //设置顶点大小 颜色 并清空canvas
        GL.uniformMatrix4fv(this.u_MVPMatrix, false, this.mvpMatrix.elements);

        //开启深度测试
        GL.enable(GL.DEPTH_TEST);

        //添加键盘监听
        this.createHandler();

        this.draw();
        this.enabled = true;
        return true;
    }

    /**     * 事件监听     */
    createHandler(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.keyCode == 39) {
                this.g_eyeX += 1;
            } else if (e.keyCode == 37) {
                this.g_eyeX -= 1;
            } else {
                return;
            }
            this.updateViewModelMatrix();//更新视图模型矩阵
        });
    }

    /**    * 更新视图模型矩阵     */
    updateViewModelMatrix(): void {
        this.mvpMatrix.setPerspective(30, this.container.clientWidth / this.container.clientHeight, 1, 100);
        this.mvpMatrix.lookAt(this.g_eyeX, this.g_eyeY, this.g_eyeZ, 0, 0, 0, 0, 1, 0);
        this.gl.uniformMatrix4fv(this.u_MVPMatrix, false, this.mvpMatrix.elements);
        this.draw();
    }

    /**     * 绘制     */
    draw(): void {
        const GL: WebGLRenderingContext = this.gl;

        //清除颜色缓冲区 清除深度缓冲区
        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        //绘制三角形1
        GL.drawElements(GL.TRIANGLES, this.pointLength, GL.UNSIGNED_BYTE, 0);//三角形
    }

    update(): boolean {
        if (!this.enabled) return;
        return true;
    }

}

class Cube {
    normals: Float32Array;
    vertices: Float32Array;
    indices: Uint8Array;

    constructor() {
        this.init();
    }

    init(): void {

        //顶点
        this.vertices = new Float32Array([   // Vertex coordinates
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
            1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
            1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
            -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
            1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
        ]);

        this.normals = new Float32Array([   // Normal
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,     // v7-v4-v3-v2 down
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0      // v4-v7-v6-v5 back
        ]);

        this.indices = new Uint8Array([        // Indices of the vertices
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // right
            8, 9, 10, 8, 10, 11,    // up
            12, 13, 14, 12, 14, 15,    // left
            16, 17, 18, 16, 18, 19,    // down
            20, 21, 22, 20, 22, 23     // back
        ]);

    }
}

export default ProgramObject;