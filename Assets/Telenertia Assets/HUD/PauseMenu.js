/*
* Script that allows the player to pause the game.
*/

var gamePaused : boolean = false; //currently paused
private var displayPauseMenu : boolean =false; //menu is displayed
private var customControls : GUI_Custom_Controls;
private var hud : GUI_HUD;
var customSkin: GUISkin;

function Awake() 
{
	customControls = FindObjectOfType(GUI_Custom_Controls);
	hud = FindObjectOfType(GUI_HUD);
}

//returns true if the game is paused
function isGamePaused() : boolean 
{
	return gamePaused;
}

//pauses the game by setting the time scale
function pauseGame()
{
	Time.timeScale =0;
	gamePaused = true;
	displayPauseMenu =true;
	Screen.showCursor = true;
	hud.hideHUD(); //hide HUD
	
}

//unpauses the game by setting the time scale
function resumeGame()
{
	Time.timeScale =1;
	gamePaused = false;
	displayPauseMenu =false;
	Screen.showCursor = false;
	hud.showHUD(); //show HUD again
}


function OnGUI()
{
	//only display when paused
	if(displayPauseMenu)
	{
		if(customSkin) {
			GUI.skin=customSkin;
		}
		
		//layout start
		GUI.BeginGroup(Rect(Screen.width / 2 - 150, 50, 300, 250));
		
		//the menu background box
		GUI.Box(Rect(0, 0, 300, 250), "");
		
		///////pause menu buttons
		//game resume button
		if(GUI.Button(Rect(55, 100, 180, 40), "Resume")) {
			resumeGame();
		}
		
		//main menu return button (level 0)
		if(GUI.Button(Rect(55, 150, 180, 40), "Main Menu")) {
		Time.timeScale =1;
		Application.LoadLevel("MenuScreen");
		}
		
		//quit button
		if(GUI.Button(Rect(55, 200, 180, 40), "Quit")) {
		Application.Quit();
		}
		
		//layout end
		GUI.EndGroup(); 
	}
}