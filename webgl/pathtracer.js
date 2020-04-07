const OUTPUT_WIDTH = 512;
const OUTPUT_HEIGHT = 512;

const meshes = [
    /* Meshes go here */
];

const init = function () {

    // set up canvas
    const canvas = document.getElementById("output-canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    // init webgl context
    const context = canvas.getContext("webgl2-compute", {antialias: false});
    if(!context) {
        alert("Couldn't initialize WebGL 2 compute context.");
        return;
    }

    // create shader
    const computeShader = context.createShader(context.COMPUTE_SHADER);
    context.shaderSource(computeShader, shaderSource);
    context.compileShader(computeShader);
    if(!context.getShaderParameter(computeShader, context.COMPILE_STATUS)) {
        alert("Couldn't compile shader (" + context.getShaderInfoLog(computeShader) + ")");
        return;
    }

    // create program
    const computeProgram = context.createProgram();
    context.attachShader(computeProgram, computeShader);
    context.linkProgram(computeProgram);
    if(!context.getProgramParameter(computeProgram, context.LINK_STATUS)) {
        alert("Couldn't link program (" + context.getProgramInfoLog(computeShader) + ")");
        return;
    }

    // set up uniforms
    const uTime = context.getUniformLocation(computeProgram, "uTime");
    const uFocalLength = context.getUniformLocation(computeProgram, "uFocalLength");
    const uMaxDepth = context.getUniformLocation(computeProgram, "uMaxDepth");




    /*
    // put mesh data...

    // first, face indices
    const triangles = [];
    let indexPos = 0;           // indexes are all in the same array so we need to update face indices

    // add all faces to mesh 
    for(let mesh of meshes) {
        for(let i = 0; i < mesh.faces.length; i++) {
            let face = mesh.faces[i];
            
            // offset faces so they point to the right vertices
            face[0] += indexPos;
            face[1] += indexPos;
            face[2] += indexPos;

            triangles = triangles.concat(mesh.face);
        }
        indexPos += mesh.faces.length;
    }

    // create and bind SSBO for triangles
    const trianglesBuffer = new Int32Array(triangles);
    const trianglesBufferID = context.createBuffer();
    context.bindBuffer(context.SHADER_STORAGE_BUFFER, trianglesBufferID);
    context.bufferData(context.SHADER_STORAGE_BUFFER, trianglesBuffer.length * 4, context.STATIC_DRAW);
    context.bufferSubData(context.SHADER_STORAGE_BUFFER, 0, trianglesBuffer);
    */



    // create texture for output and bind
    const texture = context.createTexture();
    context.bindTexture(context.TEXTURE_2D, texture);
    context.texStorage2D(context.TEXTURE_2D, 1, context.RGBA8, OUTPUT_WIDTH, OUTPUT_HEIGHT);   
    context.bindImageTexture(0, texture, 0, false, 0, context.WRITE_ONLY, context.RGBA8);

    // create frame
    const frameBuffer = context.createFramebuffer();
    context.bindFramebuffer(context.READ_FRAMEBUFFER, frameBuffer);
    context.framebufferTexture2D(context.READ_FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0);

    // execute ComputeShader
    context.useProgram(computeProgram);

    const animate = function() {

        /* Update uniforms. */
        context.uniform1f(uTime, window.performance.now() % 100);
        context.uniform1f(uFocalLength, 2.0);
        context.uniform1f(uMaxDepth, 5);

        context.dispatchCompute(OUTPUT_WIDTH / 16, OUTPUT_HEIGHT / 16, 1);
        context.memoryBarrier(context.SHADER_IMAGE_ACCESS_BARRIER_BIT);

        // display texture
        context.blitFramebuffer(
            0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT,
            0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT,
            context.COLOR_BUFFER_BIT, context.NEAREST
        );

        requestAnimationFrame(animate);

    };

    animate();

};

init();