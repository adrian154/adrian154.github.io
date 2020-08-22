let fragmentShaderSrc = `#version 300 es

precision highp float;

// output color
out vec4 outColor;

void main() {
    outColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;