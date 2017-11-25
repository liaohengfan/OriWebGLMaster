import {DrawGLContainerBase} from "../ILearnDraw";
import {msg} from "../tools/LHFTools";

class TextureMask extends DrawGLContainerBase{
    //状态
    enabled:boolean=false;

    //GLSL属性
    a_Position:number;
    a_TextCoord:number;
    u_Sampler:WebGLUniformLocation;
    u_SamplerMask:WebGLUniformLocation;

    //纹理
    texture:WebGLTexture;
    textureMask:WebGLTexture;
    image:HTMLImageElement;
    imageMask:HTMLImageElement;
    imageTotal:number=0;
    imageCount:number=0;

    pointLength:number=0;
    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.getGLSL('./assets/glsls/chapter5/','TextureMask');
    }

    /**     * 加载纹理     */
    loadTextures(){
        this.imageTotal=2;
        this.imageCount=0;
        let imageTex:HTMLImageElement=this.image=new Image();
        imageTex.onload=()=>{
            this.judageImageLoad();
        };
        let imageMask:HTMLImageElement=this.imageMask=new Image();
        imageMask.onload=()=>{
            this.judageImageLoad();
        };
        imageTex.src='assets/textures/cube/Park2/negx.jpg';
        imageMask.src='assets/textures/mask/decal-diffuse.png';
    }

    /**     * 判断纹理是否全部加载完成     */
    judageImageLoad(){
        this.imageCount++;
        if(this.imageCount>=this.imageTotal){
            this.initTexture();
        }
    }

    /**     * 初始化纹理     */
    initTexture(){
        const GL:WebGLRenderingContext=this.gl;
        this.texture=this.gl.createTexture();//创建纹理
        this.textureMask=this.gl.createTexture();//创建纹理
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL,1);//对纹理图像进行y轴翻转
        GL.activeTexture(GL.TEXTURE0);//开启0 号纹理单元
        GL.bindTexture(GL.TEXTURE_2D,this.texture);//绑定纹理对象
        GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);//配置纹理参数
        GL.texImage2D(GL.TEXTURE_2D,0,GL.RGBA,GL.RGBA,GL.UNSIGNED_BYTE,this.image);//配置纹理图像
        GL.uniform1i(this.u_Sampler,0);//将纹理传给着色器


        GL.activeTexture(GL.TEXTURE1);//开启1 号纹理单元
        GL.bindTexture(GL.TEXTURE_2D,this.textureMask);//绑定纹理对象
        GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);//配置纹理参数
        GL.texImage2D(GL.TEXTURE_2D,0,GL.RGBA,GL.RGBA,GL.UNSIGNED_BYTE,this.imageMask);//配置纹理图像
        GL.uniform1i(this.u_SamplerMask,1);//将纹理传给着色器

        //设置顶点大小 颜色 并清空canvas
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);

        //面
        GL.drawArrays(GL.TRIANGLE_STRIP,0,this.pointLength);//三角带
        this.enabled=false;
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
        gl.vertexAttribPointer(this.a_Position,2,gl.FLOAT,false,FSIZE*step,0);
        gl.enableVertexAttribArray(this.a_Position);
        gl.vertexAttribPointer(this.a_TextCoord,2,gl.FLOAT,false,FSIZE*step,FSIZE*2);
        gl.enableVertexAttribArray(this.a_TextCoord);

        return l;
    }
    init(): boolean {
        const GL:WebGLRenderingContext=this.gl;

        //获取顶点设置位置
        this.a_Position=GL.getAttribLocation(this.glProgram,'a_Position');
        this.a_TextCoord=GL.getAttribLocation(this.glProgram,'a_TextCoord');
        this.u_Sampler=GL.getUniformLocation(this.glProgram,'u_Sampler');
        this.u_SamplerMask=GL.getUniformLocation(this.glProgram,'u_SamplerMask');

        //初始化顶点缓冲数据
        let l:number=this.initVertexBuffer(
            [//矩形
                -.5,.5,0,1,
                -.5,-.5,0,0,
                .5,.5,1,1,
                .5,-.5,1,0,
            ],
            4
        );
        //保存顶点数量
        this.pointLength=l;
        if(l<=0){
            msg('绑定顶点缓冲失败')
        }
        this.loadTextures();//加载纹理
        return true;
    }

    update(): boolean {
        if(!this.enabled)return;
        return true;
    }

}
export default TextureMask;