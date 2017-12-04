/*
* Display for the HUD.
*/

function HudButton(screenPos: Rect, numAvailable : int, itemName : String /*, itemImage: Texture,  itemtooltip: String*/ ) : boolean 
{ 
	if(GUI.Button(screenPos, /*GUIContent(itemImage, itemtooltip), */ itemName) )
	{
		return true;
	}
	
	GUI.Label( Rect(screenPos.xMax-30, screenPos.yMax-30, 20,20) , numAvailable.ToString() );
}

function HudButton(screenPos: Rect, itemName : String /*, itemImage: Texture,  itemtooltip: String*/ ) : boolean 
{ 
	if(GUI.Button(screenPos, /*GUIContent(itemImage, itemtooltip), */ itemName) )
	{
		return true;
	}
}
