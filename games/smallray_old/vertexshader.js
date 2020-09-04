let vertexShaderSrc = `#version 300 es

in vec4 vInPos;
in vec2 vInCoord;

out vec2 vOutCoord;

void main() {
    gl_Position = vInPos;
    vOutCoord = vInCoord;
}
`;