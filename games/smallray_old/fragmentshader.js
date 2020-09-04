let fragmentShaderSrc = `#version 300 es

precision highp float;

// Input: screen coordinate ([-1..1], [-1..1])
in vec2 vOutCoord;

// Output: color
out vec4 fOutColor;

struct Ray {
    vec3 origin;
    vec3 direction;
};

// Intersection test for sphere
bool isectSphere(vec3 center, float radius, Ray ray, out vec3 point, out vec3 normal) {
    
    // Translate coordinate system so that origin lies on sphere center
    // This makes things easier

    vec3 rayOrigin = ray.origin - center;
    float b = 2.0 * dot(rayOrigin, ray.direction);
    float c = dot(center, center) - radius * radius;

    float discrim = b * b - 4.0 * c;
    if(discrim < 0.0) {
        return false;
    }

    float temp = sqrt(discrim);
    float t = (-b - temp) / 2.0;
    if(t < 0.0) {
        t = (-b + temp) / 2.0;
        if(t < 0.0) {
            return false;
        }
    }

    point = ray.origin + t * ray.direction;
    normal = normalize(point - center);
    return true;

}

// For debugging
vec4 dbgShadeNormal(vec3 normal) {
    return vec4((normal.x + 1.0) / 2.0, (normal.y + 1.0) / 2.0, (normal.z + 1.0) / 2.0, 1.0);
}

void main() {

    Ray cameraRay;
    cameraRay.origin = vec3(0.0, 0.0, 0.0);
    cameraRay.direction = normalize(vec3(vOutCoord.x, vOutCoord.y, 1.0));

    vec3 point, normal;
    bool isect = isectSphere(vec3(0.0, 0.0, 3.0), 1.0, cameraRay, point, normal);

    if(isect) {
        
        // shade normal
        fOutColor = dbgShadeNormal(normal);

    } else {
        fOutColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

    //fOutColor = vec4((vOutCoord.x + 1.0) / 2.0, (vOutCoord.y + 1.0) / 2.0, 0.0, 1.0);

}
`;