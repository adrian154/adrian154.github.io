const OUTPUT_WIDTH = 512;
const OUTPUT_HEIGHT = 512;

const shaderSource = `#version 310 es

layout (local_size_x = 16, local_size_y = 16, local_size_z = 1) in;
layout (rgba8, binding = 0) writeonly uniform highp image2D outputTexture;

struct Ray {
    vec3 origin;
    vec3 direction;
};

vec3 pointOnRay(Ray ray, float t) {
    return ray.origin + ray.direction * t;
}

vec3 intersect(Ray ray) {

    /* Unit sphere at 0,0 */
    vec3 sphereCenter = vec3(0.0, 0.0, 3.0);
    float radius = 1.0;

    vec3 center = sphereCenter - ray.origin;

    float b = -2.0 * dot(ray.direction, center);
    float c = dot(center, center) - radius * radius;

    float disc = b * b - 4.0 * c;
    if(disc >= 0.0) {
        vec3 normal = normalize(pointOnRay(ray, min((-b-disc)/2.0, (-b+disc)/2.0)) - sphereCenter);
        float shade = dot(normal, vec3(0.0, 0.0, 0.0) - ray.direction);
        return vec3(shade, shade, shade);
    }

    return vec3(0.0, 0.0, 0.0);

} 

void main() {
    
    /* Exact x-y of output */
    ivec2 storePos = ivec2(gl_GlobalInvocationID.xy);
    ivec2 imageSize = ivec2(gl_NumWorkGroups.xy * gl_WorkGroupSize.xy);
    vec2 uv = vec2(storePos) / vec2(imageSize);

    vec4 color;
    Ray ray;
    ray.origin = vec3(0.0, 0.0, 0.0);
    ray.direction = normalize(vec3(uv.x - 0.5, uv.y - 0.5, 1.0));

    color = vec4(intersect(ray), 1.0);
    imageStore(outputTexture, storePos, color);
    
}
`;

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

    // create texture for output
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
    context.dispatchCompute(OUTPUT_WIDTH / 16, OUTPUT_HEIGHT / 16, 1);
    context.memoryBarrier(context.SHADER_IMAGE_ACCESS_BARRIER_BIT);

    // display texture
    context.blitFramebuffer(
        0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT,
        0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT,
        context.COLOR_BUFFER_BIT, context.NEAREST
    );

};

init();