uniform vec2 tilemapSize;
uniform sampler2D tileset;
uniform sampler2D tileindex;
varying vec2 vuv0;
varying vec2 vuv1;
void main(){
	float index = floor(texture2D( tileindex, vuv0 ).x * 256.0);
	if( index == 0.0){ discard; }
	vec2 offset = vec2(
		index - floor(index / 16.0),
		floor(index / 16.0)
	) / 16.0;
	vec4 color = texture2D( tileset, ( fract(vuv1 * 16.0) + offset * 16.0)/16.0 );
	gl_FragColor = color;
}