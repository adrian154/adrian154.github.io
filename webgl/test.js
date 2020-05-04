const canvas, gl;

const initContext = function() {
    canvas = document.getElementById("output");
    gl = canvas.getContext("webgl2");

    if(!gl) {
        alert("Failed to initialize WebGL 2 context. Your browser/computer may not support it, or it may be disabled.");
    }
};



initContext();