#version 300 es 
precision mediump float;

in vec2 vTexCoords;
in vec3 vColor;

out vec4 fragColor;

uniform sampler2D uTexture;

void main()
{
    fragColor = texture(uTexture, vTexCoords) * vec4(vColor, 1.0);
}
