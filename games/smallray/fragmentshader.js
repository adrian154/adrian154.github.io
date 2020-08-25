let fragmentShaderSrc = `#version 300 es

precision highp float;

in vec2 vOutCoord;

out vec4 fOutColor;

void main() {
    fOutColor = vec4((vOutCoord.x + 1.0) / 2.0, (vOutCoord.y + 1.0) / 2.0, 0.0, 1.0);
}
`;