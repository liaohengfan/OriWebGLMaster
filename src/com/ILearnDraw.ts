/** * 案例demo 接口 */
interface ILearnDraw{
    gl:any;
    container:HTMLElement;
    init(vshader:string,fshader:string):boolean;
    update():boolean;
}
export default ILearnDraw;