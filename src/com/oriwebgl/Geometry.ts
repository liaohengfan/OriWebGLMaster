import {DefWebGLBuffer} from "./Core";

class Geometry{
    normals: Float32Array;
    vertices: Float32Array;
    texCoords: Float32Array;
    indices: Uint8Array;

    //缓冲对象
    vertexBuffer:DefWebGLBuffer;
    normalBuffer:DefWebGLBuffer;
    texCoordBuffer:DefWebGLBuffer;
    indexBuffer:DefWebGLBuffer;
    numIndices:number;
    gl:WebGLRenderingContext;
    constructor(gl:WebGLRenderingContext) {
        this.gl=gl;
    }
    initElementArrayBufferForLaterUse(gl:WebGLRenderingContext, data:any, type:number) {
        let buffer:DefWebGLBuffer = gl.createBuffer();   // Create a buffer object
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return null;
        }
        // Write date into the buffer object
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        buffer.type = type;

        return buffer;
    }

    initArrayBufferForLaterUse(gl:WebGLRenderingContext, data:any, num:number, type:number):DefWebGLBuffer {
        let buffer:DefWebGLBuffer = gl.createBuffer();   // Create a buffer object
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return null;
        }
        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // Keep the information necessary to assign to the attribute variable later
        buffer.num = num;
        buffer.type = type;

        return buffer;
    }
}
export {Geometry};