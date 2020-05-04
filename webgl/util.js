const createShader = function(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.log(gl.getShaderInfoLog(shader));
        alert("Failed to create shader! Press F12 for debugging.");
        gl.deleteShader(shader);
    }
}