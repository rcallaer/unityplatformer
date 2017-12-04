/* 
* This script animates a sprite sheet of textures.
* It has been slightly modified from the original found at this link:
* http://www.unifycommunity.com/wiki/index.php?title=Animating_Tiled_texture
*/

var uvAnimationTileX = 24; //Here you can place the number of columns of your sheet. 
                           //The above sheet has 24

var uvAnimationTileY = 1; //Here you can place the number of rows of your sheet. 
                          //The above sheet has 1
var framesPerSecond = 15.0;
var frameTime : float = .25; // Time to spend per frame
var playing : boolean = false;

function Update () {
	if(playing)
	{
		// Calculate index
		var index : int = Time.time * frameTime;//framesPerSecond;
		// repeat when exhausting all frames
		index = index % (uvAnimationTileX * uvAnimationTileY);
		
		// Size of every tile
		var size = Vector2 (1.0 / uvAnimationTileX, 1.0 / uvAnimationTileY);
		
		// split into horizontal and vertical index
		var uIndex = index % uvAnimationTileX;
		var vIndex = index / uvAnimationTileX;

		// build offset
		// v coordinate is the bottom of the image in opengl so we need to invert.
		var offset = Vector2 (uIndex * size.x, 1.0 - size.y - vIndex * size.y);
		
		renderer.material.SetTextureOffset ("_MainTex", offset);
		renderer.material.SetTextureScale ("_MainTex", size);
		}
}

function play()
{
	playing = true;
	//yield WaitForSeconds(frameTime)
	yield WaitForSeconds(frameTime);
	playing = false;
}