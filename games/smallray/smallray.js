const canvas = document.getElementById("output");
const gl = canvas.getContext("webgl2");

if(!gl) {
    alert("Failed to acquire WebGL2 context. This likely means that your browser does not support WebGL2.");
}

// --- create shaders and program
const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
gl.useProgram(program);


// --- bind some crap 

// get attribute locations
const inPosAttrLoc = gl.getAttribLocation(program, "inPos");

// create and bind buffers
const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

// create other stuff
// vertex array object (VAO) stores vertexes out of the vertex shader
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// enable attributes
gl.enableVertexAttribArray(inPosAttrLoc);

// tell OpenGL how to pull data out of the buffer
gl.vertexAttribPointer(
    inPosAttrLoc,   // where it starts
    2,              // two components...
    gl.FLOAT,       // ...of type float
    false,          // don't normalize data
    0,              // no stride (sequential)
    0               // no offset
);

// set up viewport size so clip coords can be mapped appropriately
gl.viewport(0, 0, canvas.width, canvas.height)

// screenspace quad data
let positions = [
    -1, -1,
    1, -1,
    -1, 1,
    1, -1,
    -1, 1,
    1, 1
];

const draw = function() {

    // clear canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.drawArrays(
        gl.TRIANGLES,           // draw triangles
        0,                      // no offset
        positions.length / 2    // however many triangles there are in positions
    )

};

draw();