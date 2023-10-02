uniform vec2 tilemapSize;
uniform vec2 tilesetSize;
varying vec2 vuv0;
varying vec2 vuv1;
void main(){
	vuv0 = uv;
	vuv1 = vuv0 * (tilemapSize/16.0);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}'