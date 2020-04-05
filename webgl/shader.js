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

/* Mesh */
struct Mesh {
    int offset;             /* Start of triangles in triangles buffer */
    int numTriangles;       /* Number of triangles in mesh */
    int materialIndex;
};

/* Material */
struct Material {
    vec3 albedo;
    vec3 emission;
    float diffuseness;
    float roughness;
};

/* Buffers */
layout (std430, binding = 1) readonly buffer Vertices {
    vec3 vertices[];
}; 

layout (std430, binding = 2) readonly buffer Triangles {
    int triangles[];
};

layout (std430, binding = 3) readonly buffer Meshes {
    Mesh meshes[];
};

layout (std430, binding = 4) readonly buffer Materials {
    Material materials;
};

/* Use Moller-Trumbore algorithm for fast ray-triangle intersection tests */
/* No idea how it works */
bool traceRayTriangle(Ray ray, vec3 v0, vec3 v1, vec3 v2, out float t) {
    
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

/* Intersection test with mesh. */
bool traceRayMesh(Ray ray, Mesh mesh, inout float t, inout vec3 normal) {

    bool hit = false;
    float minT;

    for(int i = 0; i < mesh.numTriangles; i++) {
        
        vec3 v0 = vertices[triangles[mesh.offset + i]];
        vec3 v1 = vertices[triangles[mesh.offset + i + 1]];
        vec3 v2 = vertices[triangles[mesh.offset + i + 2]];

        if(traceRayTriangle(ray, v0, v1, v2, t) && t < minT && t >= EPSILON) {
            minT = t;
            hit = true;
        }

        /* Compute normal */
        normal = cross(v1 - v0, v2 - v0);

    }

    if(hit) {
        t = minT;
    }

    return hit;

}

/* Do ray-geometry tests for everything. */
bool traceRay(Ray ray, inout float t, inout vec3 normal) {

    bool hit = false;
    float minT;

    /* Do tests... etc */
    for(int i = 0; i < meshes.length(); i++) {
        
        if(traceRayMesh(ray, meshes[i], t, normal) && t < minT && t >= EPSILON) {
            minT = t;
            hit = true;
        }

    }

    if(hit) {
        t = minT;
    }

    return hit;

}

/* Get point on a ray */
vec3 pointOnRay(Ray ray, float t) {
    return ray.origin + ray.direction * t;
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

    float n = random(uv);
    vec4 color = vec4(n,n,n,1.0);
    imageStore(outputTexture, storePos, color);
    
}`;