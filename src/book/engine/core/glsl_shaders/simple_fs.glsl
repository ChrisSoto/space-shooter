#version 300 es
// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.

precision mediump float;
// sets the precision for floating point computation

// Color of pixel
uniform vec4 uPixelColor;

out vec4 fragColor;

void main(void) {
    // for every pixel called sets to the user specified color
    fragColor = uPixelColor;
}