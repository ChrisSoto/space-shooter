#version 300 es
// This is the vertex shader
//

precision mediump float;

layout(location=0) in vec3 aVertexPosition; 
// Vertex shader expects one vertex position

void main() {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = vec4(aVertexPosition, 1.0);
}
