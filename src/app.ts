import * as d3 from 'd3';
import {getWebGLContext} from './libs/oriwebgl/Utils';
import './common.css';
import DrawAPoint from "./com/chapter2/DrawAPoint";
import ClickedPoints from "./com/chapter2/ClickedPoints";
class Demo{
    container:HTMLElement;
    canvas:HTMLCanvasElement;
    gl:WebGLRenderingContext=null;
    constructor(){
        console.log("Hello typescript webpack ori WebGL!!!!");
        this.init();
    }

    eidtorWebGL(){
        const GL:WebGLRenderingContext=this.gl;
        new DrawAPoint(GL,this.container); //绘制一个点
        //new ClickedPoints(GL,this.container);//鼠标点击绘制点
    }


    init(){
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
            requestAnimationFrame(enterframe);
        }
        enterframe();
    }

    /**     * 窗口大小变化     */
    private windowResize(){
        var width_:number=this.container.clientWidth;
        var height_:number=this.container.clientHeight;
        this.canvas.width=width_;
        this.canvas.height=height_;
        //this.canvas.width=400;
        //this.canvas.height=400;
    }

}
window.onload=function(){
    new Demo();
};