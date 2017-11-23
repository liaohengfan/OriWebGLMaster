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
class Demo{
    container:HTMLElement;
    canvas:HTMLCanvasElement;
    gl:WebGLRenderingContext=null;

    curDrawBase:DrawGLContainerBase=null;

    constructor(){
        console.log("Hello typescript webpack ori WebGL!!!!");
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
        this.curDrawBase=new RotatedTranslated(GL,this.container);//Matrix4 操作 平移旋转
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