// set up globals - canvas and WebGL
const canvas = document.getElementById("output");
const gl = canvas.getContext("webgl");
if(!gl) {
    alert("Your brower does not support WebGL.");
} 

const vertexShaderSrc = `
// will receive data from buffer passed by js
attribute vec4 position;

void main() {

    // special var
    // set vertex position to position passed by js
    gl_Position = position;
}
`;

const fragmentShaderSrc = `
// set precision
precision mediump float;

void main() {

    // special var
    // set vertex color to yellow
    gl_FragColor = vec4(1, 1, 0, 1);

}
`;

const createShader = function(gl, type, source) {
    
    // create shader, attach source, compile
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    // print error
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

};

const createProgram = function(gl, vertexShader, fragment) {

    // create program
    let program = gl.createProgram();

    // add shaders
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link program
    gl.linkProgram(program);

    if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    // print error
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

}

// create shaders and program
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
let program = createProgram(gl, vertexShader, fragmentShader);

// get attribute locations
let positionAttribute = gl.getAttribLocation(program, "position");

// create buffer, bind
let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// set up some 2d points, copy to buffer which will be read by shader
let positions = [
    0, 0,
    0, 0.5,
    0.7, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);






// set up GL viewport
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// clear screen w/ clear color
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// use program
gl.useProgram(program);

// enable attribute
gl.enableVertexAttribArray(positionAttribute)

// tell OpenGL how to extract data from buffer
const size = 2;             // 2 floats per point
const type = gl.FLOAT;      // data is 32 bit floats
const normalize = false;    // don't normalize
const stride = 0;           // default move forward size
const offset = 0;           // start at top
gl.vertexAttribPointer(positionAttribute, size, type, normalize, stride, offset);

// draw
const primitiveType = gl.TRIANGLES;
const count = 3;
// (offset is still zero)
gl.drawArrays(primitiveType, offset, count);