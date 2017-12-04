
private var customControls : GUI_Custom_Controls;
private var hud : GUI_HUD;
var customSkin: GUISkin;

function OnGUI()
{
	if(customSkin)
	{
		GUI.skin=customSkin;
	}
	
	//layout start
			Screen.showCursor=true;
	if(GUI.Button(Rect(Screen.width/2-90, Screen.height/2, 180, 40), "Main Menu")) 
	{
		Application.LoadLevel("MenuScreen");
	}
	
	GUI.EndGroup(); 
}