#version 300 es

precision mediump float;

in vec3 vColor;
in vec2 vTexCoords;

uniform sampler2D uTexture;

out vec4 fragColor;

void main(){
  fragColor = texture(uTexture, vTexCoords) * vec4(vColor, 1.0);
}