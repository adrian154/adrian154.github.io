const shaderSource = `#version 310 es

/* A lot of the code in this raytracer is from oktomus's toy raytracer. */

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

/* Sphere */
struct Sphere {
    float radius;
    int materialIndex;
    vec3 center;
};

/* Material */
struct Material {
    vec3 albedo;
    vec3 emission;
    float diffuseness;
    float roughness;
};

/* Buffers */
layout (std430, binding = 1) readonly buffer Spheres {
    Sphere spheres[];
}; 

layout (std430, binding = 2) readonly buffer Materials {
    Material materials[];
};

/* Get point on a ray */
vec3 pointOnRay(Ray ray, float t) {
    return ray.origin + ray.direction * t;
}

/* Raytrace sphere */
bool traceRaySphere(Ray ray, Sphere sphere, inout float t, inout vec3 normal) {

    vec3 center = sphere.center - ray.origin;

    float b = -2.0 * dot(ray.direction, center);
    float c = dot(center, center) - sphere.radius * sphere.radius;

    float discrim = b * b - 4.0 * c; 
    if(discrim < 0.0) {
        return false;
    }

    discrim = sqrt(discrim);
    t = (-b + discrim) / 2.0;
    if(t < EPSILON) {
        t = (-b - discrim) / 2.0;
    }

    if(t < EPSILON) {
        return false;
    }

    vec3 point = pointOnRay(ray, t);
    normal = normalize(point - sphere.center);
    
    return true;

}

/* Do ray-geometry tests for everything. */
bool traceRay(Ray ray, inout float t, inout vec3 normal) {

    bool hit = false;
    float minT;

    /* Do tests... etc */
    for(int i = 0; i < spheres.length(); i++) {
        
        if(traceRaySphere(ray, spheres[i], t, normal) && t < minT) {
            minT = t;
            hit = true;
        }

    }

    if(hit) {
        t = minT;
    }

    return hit;

}

/* Random number generator; use time for some additional randomness between frames */
float random(vec2 pixel) {
    return fract(sin(dot(pixel * uTime, vec2(12.9898,78.233))) * 43758.5453123);
}

/* Pathtrace ray. */
vec3 shade(Ray ray, vec2 pixel) {

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

    Sphere sphere;
    sphere.center = vec3(0.5, 0.0, 5.0);
    sphere.radius = 0.5;

    vec4 color;
    float t; vec3 n;

    /*
    if(traceRay(ray, t, n)) {
        color = vec4(n.x, n.y, n.z, 1.0);
    } else {
        color = vec4(0.0, 0.0, 0.0, 1.0);
    }
    */

    t = float(spheres.length() * 255);
    color = vec4(t, t, t, 1.0);


    imageStore(outputTexture, storePos, color);
    
}`;