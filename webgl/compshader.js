const shaderSource = `#version 310 es

/* Some constants */
#define EPSILON 0.00001         /* Epsilon (used for floating point comparisons) */

layout (local_size_x = 16, local_size_y = 16, local_size_z = 1) in;
layout (rgba8, binding = 0) writeonly uniform highp image2D outputTexture;

/* Uniforms */
uniform float uTime;            /* Time (for randomness) */
uniform float uFocalLength;     /* "Focal length" of our pinhole camera */
uniform int uMaxDepth;          /* Max path depth */

/* Ray struct */
/* DIRECTION IS ASSUMED TO BE NORMALIZED! */
struct Ray {
    vec3 origin;
    vec3 direction;
};

/* Use Moller-Trumbore algorithm for fast ray-triangle intersection tests */
/* No idea how it works */
bool intersect(Ray ray, vec3 v0, vec3 v1, vec3 v2, out float t) {
    
    vec3 edge1 = v1 - v0;
    vec3 edge2 = v2 - v0;
    vec3 h = cross(ray.direction, edge2);
    float a = dot(edge1, h);
    
    if(a > -EPSILON && a < EPSILON) {
        return false;
    }

    float f = 1.0 / a;
    vec3 s = ray.origin - v0;
    float u = f * dot(s, h);
    
    if(u < 0.0 || u > 1.0) {
        return false;
    }

    vec3 q = cross(s, edge1);
    float v = f * dot(ray.direction, q);

    if(v < 0.0 || u + v > 1.0) {
        return false;
    }

    t = f * dot(edge2, q);
    if(t > EPSILON) {
        return true;
    } else {
        return false;
    }

}

/* Get point on a ray */
vec3 pointOnRay(Ray ray, float t) {
    return ray.origin + ray.direction * t;
}

/* Random number generator */
float random(vec2 pixel) {
    return fract(sin(dot(pixel * uTime, vec2(12.9898,78.233))) * 43758.5453123);
}

/* Pathtrace ray. */
vec3 shade(Ray r, vec2 pixel) {

    /* GLSL doesn't support recursion so we have to pathtrace in a loop */
    return vec3(0.0, 0.0, 0.0);

}

void main() {
    
    /* Exact x-y of output */
    ivec2 storePos = ivec2(gl_GlobalInvocationID.xy);
    ivec2 imageSize = ivec2(gl_NumWorkGroups.xy * gl_WorkGroupSize.xy);
    vec2 uv = vec2(storePos) / vec2(imageSize);

    /* Ray */
    Ray ray;
    ray.direction = normalize(vec3(uv.x - 0.5, uv.y - 0.5, uFocalLength));

    float n = random(uv);
    vec4 color = vec4(n,n,n,1.0);
    imageStore(outputTexture, storePos, color);
    
}`;