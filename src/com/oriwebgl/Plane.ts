import {Geometry} from "./Geometry";

class Plane extends Geometry{
    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.init();
    }
    init():void{
        this.vertices= new Float32Array([
            1.0, 1.0, 0.0,  -1.0, 1.0, 0.0,  -1.0,-1.0, 0.0,   1.0,-1.0, 0.0    // v0-v1-v2-v3
        ]);
        this.normals=new Float32Array([]);
        this.texCoords=new Float32Array([1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0]);
        this.indices= new Uint8Array([0, 1, 2,   0, 2, 3]);
        this.numIndices=this.indices.length;


        this.vertexBuffer = this.initArrayBufferForLaterUse(this.gl, this.vertices, 3, this.gl.FLOAT);
        this.normalBuffer = this.initArrayBufferForLaterUse(this.gl, this.normals, 3, this.gl.FLOAT);
        this.texCoordBuffer = this.initArrayBufferForLaterUse(this.gl, this.texCoords, 2, this.gl.FLOAT);
        this.indexBuffer = this.initElementArrayBufferForLaterUse(this.gl, this.indices, this.gl.UNSIGNED_BYTE);
    }
}
export {Plane};