import * as d3 from 'd3';
import {getWebGLContext} from './com/base/Utils';
import './common.css';
import VertexBuffer from "./com/chapter3/VertexBuffer";
import Translated from "./com/chapter3/Translated";
import Rotated from "./com/chapter3/Rotated";
import Matrix from "./com/chapter3/Matrix";
import RotatedMatrix4 from "./com/chapter4/RotatedMatrix4";
import RotatedTranslated from "./com/chapter4/RotatedTranslated";
import {DrawGLContainerBase} from "./com/ILearnDraw";
import MultiAttributeSize from "./com/chapter5/MultiAttributeSize";
import MultiAttriSizeInterleaved from "./com/chapter5/MultiAttriSizeInterleaved";
import MultiAttributeColor from "./com/chapter5/MultiAttributeColor";
import ViewFragmentColor from "./com/chapter5/ViewFragmentColor";
import TextureQuad from "./com/chapter5/TextureQuad";
import TextureMask from "./com/chapter5/TextureMask";
import LookAtTriangles from "./com/chapter7/LookAtTriangles";
import LookAtRotatedTriangles from "./com/chapter7/LookAtRotatedTriangles";
import LookAtRotateTriangleMVMatrix from "./com/chapter7/LookAtRotateTriangleMVMatrix";
import LookAtTriangleWithKeys from "./com/chapter7/LookAtTriangleWithKeys";
import OrthoVisualSpace from "./com/chapter7/OrthoVisualSpace";
import LookAtTriangleWithKeysView from "./com/chapter7/LookAtTriangleWithKeysView";
import PerspectiveView from "./com/chapter7/PerspectiveView";
import PerspectiveViewMVP from "./com/chapter7/PerspectiveViewMVP";
import ModelViewPersMatrix from "./com/chapter7/ModelViewPersMatrix";
import PerspectiveDepth from "./com/chapter7/PerspectiveDepth";
import ZFighting from "./com/chapter7/ZFighting";
import HelloCube from "./com/chapter7/HelloCube";
import ColoredCube from "./com/chapter7/ColoredCube";
import LightedCube from "./com/chapter8/LightedCube";
import LightedCubeAmbient from "./com/chapter8/LightedCubeAmbient";
import LightedTranlatedRotateCube from "./com/chapter8/LightedTranlatedRotateCube";
import PointLightedCube from "./com/chapter8/PointLightedCube";
import PointLightedCubeAni from "./com/chapter8/PointLightCubeAni";
class Demo{
    container:HTMLElement;
    canvas:HTMLCanvasElement;
    gl:WebGLRenderingContext=null;

    curDrawBase:DrawGLContainerBase=null;

    constructor(){
        console.log("Hello typescript webpack ori WebGL!!!!");
        //develop from liaohengfan home pc
        this.init();
    }

    eidtorWebGL(){
        const GL:WebGLRenderingContext=this.gl;

        //章节2
        //new DrawAPoint(GL,this.container); //绘制一个点
        //new ClickedPoints(GL,this.container);//鼠标点击绘制点

        //章节3
        //new VertexBuffer(GL,this.container);//顶点缓冲对象
        //new Translated(GL,this.container);//变化
        //new Rotated(GL,this.container);//旋转
        //new Matrix(GL,this.container);//矩阵操作

        //章节4
        //new RotatedMatrix4(GL,this.container);//Matrix4 操作
        //this.curDrawBase=new RotatedTranslated(GL,this.container);//Matrix4 操作 平移旋转

        //章节5
        //new MultiAttributeSize(GL,this.container);//多个缓冲
        //new MultiAttriSizeInterleaved(GL,this.container);//数组多项顶点数据
        //new MultiAttributeColor(GL,this.container);//多顶点颜色
        //new ViewFragmentColor(GL,this.container);//片元着色器相对屏幕位置调整颜色
        //new TextureQuad(GL,this.container);//纹理
        //new TextureMask(GL,this.container);//纹理遮罩-相乘

        //章节7
        //new LookAtTriangles(GL,this.container);// 视角观看三角形
        //new LookAtRotatedTriangles(GL,this.container);// 视角观看旋转三角形
        //new LookAtRotateTriangleMVMatrix(GL,this.container);// 模型视图矩阵 外部计算
        //new LookAtTriangleWithKeys(GL,this.container);// 键盘控制视点
        //new OrthoVisualSpace(GL,this.container);// 正交可视空间
        //new LookAtTriangleWithKeysView(GL,this.container);// 正交可视空间  模型矩阵
        //new PerspectiveView(GL,this.container);// 透视可视空间
        //new PerspectiveViewMVP(GL,this.container);// 透视可视空间-顶点偏移
        //new ModelViewPersMatrix(GL,this.container);// 模型视图 投影矩阵
        //new PerspectiveDepth(GL,this.container);// 模型视图  深度测试
        //new ZFighting(GL,this.container);// 模型视图  深度冲突
        //new HelloCube(GL,this.container);// Hello Cube  初试 立方体
        //new ColoredCube(GL,this.container);// Cube  各面颜色不同立方体
        //new LightedCube(GL,this.container);// Cube  光照
        //new LightedCubeAmbient(GL,this.container);// Cube  光照-环境光
        //new LightedTranlatedRotateCube(GL,this.container);// Cube  光照-环境光-旋转 偏移 盒子 计算光照
        //new PointLightedCube(GL,this.container);// Cube  光照-环境光-点光源
        this.curDrawBase=new PointLightedCubeAni(GL,this.container);// Cube  光照-环境光-点光源-旋转

    }


    init(){
        const THAT:Demo = this;
        let container_:any=d3.select("#webgl_div");
        this.container = container_.node() as HTMLElement;
        let canvas_:any=container_.append('canvas');
        this.canvas=canvas_.node();

        /**         * 添加窗口大小更改事件         */
        window.addEventListener("resize",()=>{
            this.windowResize();
        });
        this.windowResize();

        //
        let gl:WebGLRenderingContext =this.gl= getWebGLContext(this.canvas);
        if(!gl){
            console.log('Failed get rendering context for WebGL!');
            return;
        }

        this.eidtorWebGL();

        /**     * 动画     */
        function enterframe(){
            THAT.update();
            requestAnimationFrame(enterframe);
        }
        enterframe();
    }

    /**     * 更新     */
    update():void{
        if(this.curDrawBase){
            this.curDrawBase.update();
        }
    }

    /**     * 窗口大小变化     */
    private windowResize(){
        var width_:number=this.container.clientWidth;
        var height_:number=this.container.clientHeight;
        this.canvas.width=width_;
        this.canvas.height=height_;
    }

}
window.onload=function(){
    new Demo();
};