let vertexShaderSrc = `#version 300 es

in vec4 inPos;

void main() {
    gl_Position = inPos;
}
`;