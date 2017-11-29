import {DrawGLContainerBase} from "../ILearnDraw";
import {initShaders} from "../base/Utils";
import {msg} from "../tools/LHFTools";

/** * 绘制一个圆形的点 */
class DrawRoundPoint extends DrawGLContainerBase{

    a_Position:number;
    a_PointSize:number;
    a_Color:number;

    vertexShader:WebGLShader;
    fragmentShader:WebGLShader;

    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter10/','DrawRoundPoint');
    }
    /**
     * 初始化 着色器
     * @param {string} vshader
     * @param {string} fshader
     */
    initShader(vshader:string,fshader:string):void{
        const GL:WebGLRenderingContext=this.gl;

        this.vertexShader=GL.createShader(GL.VERTEX_SHADER);//顶点着色器
        this.fragmentShader=GL.createShader(GL.FRAGMENT_SHADER);//片元着色器
        GL.shaderSource(this.vertexShader,vshader);//填充顶点着色器
        GL.shaderSource(this.fragmentShader,fshader);//填充片元着色器

        let status:boolean=true;
        //编译顶点着色器
        GL.compileShader(this.vertexShader);
        status=GL.getShaderParameter(this.vertexShader,GL.COMPILE_STATUS);
        if(!status){//输出 顶点着色器编译出错输出错误信息
            msg('vertex shader compile error: ');
            msg(GL.getShaderInfoLog(this.vertexShader));
        }else{
            msg('vertex shader compile success ');
        }

        //编译 片元着色器
        GL.compileShader(this.fragmentShader);
        status=GL.getShaderParameter(this.fragmentShader,GL.COMPILE_STATUS);
        if(!status){//输出 顶点着色器编译出错输出错误信息
            msg('fragment shader compile error: ');
            msg(GL.getShaderInfoLog(this.fragmentShader));
        }else{
            msg('fragment shader compile success ');
        }

        //创建程序对象
        this.glProgram=GL.createProgram();
        GL.attachShader(this.glProgram,this.vertexShader);//为程序对象绑定顶点着色器
        GL.attachShader(this.glProgram,this.fragmentShader);//为程序对象绑定片元着色器
        GL.linkProgram(this.glProgram);//连接着色器 让两个着色器关联

        //查询程序对象 连接是否成功
        status=GL.getProgramParameter(this.glProgram,GL.LINK_STATUS);
        if(!status){//输出 程序对象着色器连接失败 输出错误信息
            msg('fragment vertex program link error: ');
            msg(GL.getProgramInfoLog(this.glProgram));//获取错误信息
        }else{
            msg('fragment vertex program link success');
        }

        //指定 WebGL 使用的程序对象
        GL.useProgram(this.glProgram);

        //初始化 舞台信息
        this.init();

        //绘制
        this.draw();
    }

    /**     * 绘制     */
    draw():void{
        const GL:WebGLRenderingContext=this.gl;

        //清除颜色缓冲区 清除深度缓冲区
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);

        //绘制三角形1
        GL.drawArrays(GL.POINTS,0,1);
    }

    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_PointSize=GL.getAttribLocation(this.glProgram,'a_PointSize');
        this.a_Color=GL.getAttribLocation(this.glProgram,'a_Color');

        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.vertexAttrib4f(this.a_Color,1.0,0.0,0.0,1.0);
        GL.vertexAttrib1f(this.a_PointSize,20);

        return true;
    }

    update(): boolean {
        return true;
    }
}

export default DrawRoundPoint;