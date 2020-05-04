const VERTEX_SOURCE = `#version 300 es

// attributes
in vec4 a_pos;

// main
void main() {

    // set up gl_position
    gl_Position = a_pos;

}

`;