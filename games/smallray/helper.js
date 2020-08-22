// Helper JS funcs.
const createShader = function(gl, type, source) {
    
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);

};

const createProgram = function(gl, vertexShader, fragmentShader) {

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.error(`Failed to link program: ${gl.getProgramInfoLog(program)}`);
    gl.deleteProgram(program);

};