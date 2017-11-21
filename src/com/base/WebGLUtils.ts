/**
 * Creates the HTLM for a failure message
 * @param {string} canvasContainerId id of container of th
 *        canvas.
 * @return {string} The html.
 */
const WINDOW_:any=window;
let makeFailHTML = function(msg:string='') {
    return '' +
        '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
};


/**
 * Mesasge for getting a webgl browser
 * @type {string}
 */
let GET_A_WEBGL_BROWSER = '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

/**
 * Mesasge for need better hardware
 * @type {string}
 */
let OTHER_PROBLEM = '' +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org">Click here for more information.</a>';

class WebGLUtils{

    /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
    static create3DContext(canvas:HTMLCanvasElement, opt_attribs:any) {
        let names:Array<string> = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        let context:any = null;
        let ii:number=0;
        for (ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    }

    /**
     * Creates a webgl context. If creation fails it will
     * change the contents of the container of the <canvas>
     * tag to an error message with the correct links for WebGL.
     * @param {Element} canvas. The canvas element to create a
     *     context from.
     * @param {WebGLContextCreationAttirbutes} opt_attribs Any
     *     creation attributes you want to pass in.
     * @param {function:(msg)} opt_onError An function to call
     *     if there is an error during creation.
     * @return {WebGLRenderingContext} The created context.
     */
    static setupWebGL(canvas:HTMLCanvasElement, opt_attribs:any=null, opt_onError:any=null) {
        function handleCreationError(msg:string='') {
            let container:any = document.getElementsByTagName("body")[0];
            //var container = canvas.parentNode;
            if (container) {
                let str:string = WINDOW_.WebGLRenderingContext ?
                    OTHER_PROBLEM :
                    GET_A_WEBGL_BROWSER;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML = makeFailHTML(str);
            }
        };

        opt_onError = opt_onError || handleCreationError;

        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function(event:any) {
                opt_onError(event.statusMessage);
            }, false);
        }
        let context:any = WebGLUtils.create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!WINDOW_.WebGLRenderingContext) {
                opt_onError("");
            } else {
                opt_onError("");
            }
        }

        return context;
    }
    constructor(){

    }
}

/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
if (!WINDOW_.requestAnimationFrame) {
    WINDOW_.requestAnimationFrame = (function() {
        return WINDOW_.requestAnimationFrame ||
            WINDOW_.webkitRequestAnimationFrame ||
            WINDOW_.mozRequestAnimationFrame ||
            WINDOW_.oRequestAnimationFrame ||
            WINDOW_.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback:Function, /* DOMElement Element */ element:any=null) {
                WINDOW_.setTimeout(callback, 1000/60);
            };
    })();
}

/** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
 *
 * Cancels an animation frame request.
 * Checks for cross-browser support, falls back to clearTimeout.
 * @param {number}  Animation frame request. */
if (!WINDOW_.cancelAnimationFrame) {
    WINDOW_.cancelAnimationFrame = (WINDOW_.cancelRequestAnimationFrame ||
    WINDOW_.webkitCancelAnimationFrame || WINDOW_.webkitCancelRequestAnimationFrame ||
    WINDOW_.mozCancelAnimationFrame || WINDOW_.mozCancelRequestAnimationFrame ||
    WINDOW_.msCancelAnimationFrame || WINDOW_.msCancelRequestAnimationFrame ||
    WINDOW_.oCancelAnimationFrame || WINDOW_.oCancelRequestAnimationFrame ||
    WINDOW_.clearTimeout);
}
export {WebGLUtils};