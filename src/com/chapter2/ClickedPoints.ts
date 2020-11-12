import {initShaders} from '../base/Utils';
import {GLSLTools} from '../base/GLSLTools';
import {DrawGLContainerBase} from "../ILearnDraw";
class ClickedPoints extends DrawGLContainerBase{
    a_Position:number;
    a_PointSize:number;
    u_FragColor:number;

    containerRect:ClientRect;//容器大小
    centerPoint:any={x:0,y:0};
    mouseClickPoints:any[]=[];

    constructor(gl:any,container:HTMLElement){
        super(gl,container);
        this.resize();
        this.getGLSL('./assets/glsls/chapter2/','uniformVar');

    }
    init():boolean{
        let GL:any=this.gl;
        this.a_Position=GL.getAttribLocation(GL.program,'a_Position');
        this.a_PointSize=GL.getAttribLocation(GL.program,'a_PointSize');
        this.u_FragColor=GL.getUniformLocation(GL.program,'u_FragColor');
        this.draw();
        this.createClickEvents();
        return true;
    }

    clickHandler(ev:MouseEvent){
        let x:number=ev.clientX;
        let y:number=ev.clientY;
        x-=this.containerRect.left;
        y-=this.containerRect.top;
        x=x/this.centerPoint.x;
        y=y/this.centerPoint.y;
        x-=1;
        y-=1;
        y=-y;
        this.mouseClickPoints.push({
            x:x,
            y:y
        });
        this.drawClickPoints();
    }

    createClickEvents(){
        this.container.addEventListener('click',(ev:MouseEvent)=>{
            this.clickHandler(ev);

        });
    }

    drawClickPoints(){
        const GL:any=this.gl;
        const a_Position:number=this.a_Position;
        GL.clear(GL.COLOR_BUFFER_BIT);//清除
        let i:number=0;
        let l:number=this.mouseClickPoints.length;
        let point:any=null;
        for (i = 0; i < l; i++) {
            point= this.mouseClickPoints[i];
            GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
            GL.vertexAttrib3f(a_Position,point.x||0,point.y||0,0.0);
            GL.drawArrays(GL.POINTS,0,1);
        }

    }

    draw(){
        const GL:any=this.gl;
        GL.vertexAttrib3f(this.a_Position,0.0,0.0,0.0);
        GL.vertexAttrib1f(this.a_PointSize,10);
        //GL.uniform4f(this.u_FragColor,1.0,0.0,0.0,1.0);
        GL.clearColor(0.0,0.0,0.0,1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);
        //GL.drawArrays(GL.POINTS,0,1);
    }

    resize():boolean{
        this.containerRect=this.container.getBoundingClientRect();
        this.centerPoint.x=this.containerRect.width/2;
        this.centerPoint.y=this.containerRect.height/2;
        return true;
    }

    update(): boolean {
        return true;
    }
}
export default ClickedPoints;