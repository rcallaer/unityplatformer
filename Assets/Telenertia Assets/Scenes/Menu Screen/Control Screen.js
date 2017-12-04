
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
	GUI.BeginGroup(Rect(2.4*Screen.width / 4,0, 300, 300));

	if(GUI.Button(Rect(55, 25, 180, 40), "Next")) 
	{
		//resumeGame();
		Application.LoadLevel("Interactions Screen");
	}
	
	GUI.EndGroup(); 
}