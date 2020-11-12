import * as d3 from 'd3';


interface IGLSL {
    vertexShader: string;
    fragmentShader: string;
    enable:boolean;
}

/** * GLSL工具 */
class GLSLTools {
    constructor() {
    }

    /**
     * 获取 glsl
     * @param name
     * @param callBack
     */
    static getGLSL(url: string, name: string): Promise<IGLSL> {
        return new Promise((resolve, reject) => {
            let glsl:IGLSL = {
                vertexShader:'',
                fragmentShader:'',
                enable:false
            }
            d3.text(url + name + '.vext').then(vshader => {
                glsl.vertexShader = vshader;
                d3.text(url + name + '.frag').then(fshader => {
                    glsl.fragmentShader = fshader;
                    resolve(glsl);
                }).catch(err=>{
                    reject(err);
                });
            }).catch(error=>{
                reject(error);
            });
        });
    }
}

export {GLSLTools, IGLSL};