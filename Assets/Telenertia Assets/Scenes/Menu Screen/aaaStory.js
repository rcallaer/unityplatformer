
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
	GUI.BeginGroup(Rect(Screen.width / 2,550, 300, 300));

	if(GUI.Button(Rect(0, 0, 150, 40), "Start Game")) 
	{
		//resumeGame();
		Application.LoadLevel("testSky2");
	}
	
	GUI.EndGroup(); 
}