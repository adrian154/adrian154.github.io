const OUTPUT_WIDTH = 512;
const OUTPUT_HEIGHT = 512;

const spheres = [
    {
        center: {
            x: 0.5,
            y: 0.75,
            z: 3.0
        },
        radius: 0.8,
        materialIndex: 0
    }
];

const createSphereBuffer = function(context, program) {

    const sphereBuffer = new ArrayBuffer(spheres.length * 48);

    // two ways to fill data
    const sphereInt32Data = new Int32Array(sphereBuffer);
    const sphereFloat32Data = new Float32Array(sphereBuffer);
        
    // On a GPU the sphere looks like: (WRONG!!!)
    // float radius         4 bytes     0
    // padding              12 bytes    1,2,3
    // int materialIndex    4 bytes     4
    // padding              12 bytes    5,6,7
    // vec3 center          12 bytes    8,9,10
    // padding              4 bytes     11

    // size of Sphere in 4 byte chunks
    const paddedSizex4 = 12;

    for(let i = 0; i < spheres.length; i++) {

        let sphere = spheres[i];

        // radius
        sphereFloat32Data[i * paddedSizex4] = sphere.radius

        // material index
        sphereInt32Data[i * paddedSizex4 + 4] = sphere.materialIndex;

        // center
        sphereFloat32Data[i * paddedSizex4 + 8] = sphere.materialIndex;
        sphereFloat32Data[i * paddedSizex4 + 9] = sphere.materialIndex;
        sphereFloat32Data[i * paddedSizex4 + 10] = sphere.materialIndex;

    }

    const sphereBufferID = context.createBuffer();
    context.bindBuffer(context.SHADER_STORAGE_BUFFER, sphereBufferID);
    context.bufferData(context.SHADER_STORAGE_BUFFER, sphereBuffer, context.STATIC_DRAW);
    context.bindBufferBase(context.SHADER_STORAGE_BUFFER, 0, sphereBufferID);

    let index = context.getProgramResourceIndex(program, context.SHADER_STORAGE_BLOCK, "Spheres");
    let bind = context.getProgramResource(program, context.SHADER_STORAGE_BLOCK, index, [context.BUFFER_BINDING])[0];
    context.bindBufferBase(context.SHADER_STORAGE_BUFFER, bind, sphereBufferID);

};

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

    // attach sphere data
    createSphereBuffer(context, computeProgram);

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