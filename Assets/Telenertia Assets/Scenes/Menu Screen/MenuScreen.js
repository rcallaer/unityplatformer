private var gamePaused : boolean = false;
private var displayMenu : boolean =true;
private var displayLevelScreen : boolean =false;
private var customControls : GUI_Custom_Controls;
private var hud : GUI_HUD;
var customSkin: GUISkin;

function OnGUI()
{
	if(displayMenu)
	{
		if(customSkin) {
			GUI.skin=customSkin;
		}
		
		//layout start
		GUI.BeginGroup(Rect(Screen.width / 2 - 150,75, 300, 300));
	
		if(GUI.Button(Rect(55, 100, 180, 40), "New Game")) {
			//resumeGame();
			Application.LoadLevel("Story");
		}
		
		if(GUI.Button(Rect(55, 150, 180, 40), "Show Controls")) {
			Application.LoadLevel("Controls Screen");
		}
		
		//main menu return button (level 0)
		if(GUI.Button(Rect(55, 200, 180, 40), "Select Level")) {
			displayMenu=false;
			displayLevelScreen =true;
		}
		
		//quit button
		if(GUI.Button(Rect(55, 250, 180, 40), "Quit")) {
		Application.Quit();
		}
		
		//layout end
		GUI.EndGroup(); 
	}
	
	if(displayLevelScreen)
	{
		if(customSkin) {
			GUI.skin=customSkin;
		}
		
		//layout start
		GUI.BeginGroup(Rect(Screen.width / 2 - 150,75, 300, 300));
	
		if(GUI.Button(Rect(55, 100, 180, 40), "Level 1")) {
			//resumeGame();
			Application.LoadLevel("testSky2");
			
		}
		
		if(GUI.Button(Rect(55, 150, 180, 40), "Level 2")) {
			Application.LoadLevel("TestUnderground");
		}
		
		//main menu return button (level 0)
		if(GUI.Button(Rect(55, 200, 180, 40), "Level 3")) {
			Application.LoadLevel("TestLandLevel1");
		}
		
		//back button
		if(GUI.Button(Rect(55, 250, 180, 40), "Back to Main Menu")) {
			displayMenu=true;
			displayLevelScreen =false;
		}
		
		//layout end
		GUI.EndGroup(); 
	}
}