/*
* A script that controls the HUD display.
*/

private var playerStats : PlayerStats;
private var displayHUD =true; //true if currently in game
private var customControls : GUI_Custom_Controls;
var customSkin: GUISkin;
var healthIcon : Texture2D; //health picture
var rockIcon : Texture2D;//rock ammo picture
var blastIcon : Texture2D;//blast ammo picture
var mainHeadIcon : Texture2D; //lives picture

//enum class for the type of weapon currently in use
enum WeaponControl {rock = 0, gun1 = 1}
var weapon = WeaponControl.rock;
var playerMoves : PlayerMovement;

function Awake()
{
	playerMoves = GameObject.FindWithTag("Player").GetComponent("PlayerMovement");
	playerStats = FindObjectOfType(PlayerStats);
	customControls = FindObjectOfType(GUI_Custom_Controls);
}

function Update()
{
	//set which projectile weapon is being used
	if(playerMoves.holdingGun)
		weapon = WeaponControl.gun1;
	else
		weapon = WeaponControl.rock;
}

function OnGUI()
{
	if(displayHUD)
	{
		if(customSkin) {
			GUI.skin=customSkin;
		}
		
		//Main HUD
		GUI.Box(Rect(50, 15, 30,25), playerStats.health+"");
		GUI.DrawTexture(Rect(12,15,30,30), healthIcon, ScaleMode.ScaleToFit, true, 0);
		
		// control block to decide which projectile to display on HUD
		switch(weapon)
		{
			//rock display
			case WeaponControl.rock:
			GUI.Box(Rect(50, 55, 30,25), playerStats.rockCount+"");
			
			GUI.DrawTexture(Rect(10,45,40,40), rockIcon, ScaleMode.ScaleToFit, true, 0);
			break;
			
			//gun display
			case WeaponControl.gun1:
			GUI.Box(Rect(50, 55, 30,25), playerStats.bulletCount+"");
			
			GUI.DrawTexture(Rect(8,45,50,50), blastIcon, ScaleMode.ScaleToFit, true, 0);
			break;
		}
		//lives display
		GUI.Box(Rect(50, 95, 26,25), playerStats.lives+"");
		GUI.DrawTexture(Rect(12,95,25,25), mainHeadIcon, ScaleMode.ScaleToFit, true, 0);
		
		//checkpoint display
		if(playerMoves.displayCheckpoint)
		{
			GUI.Box(Rect((Screen.width/2)-100,(Screen.height/2)-130,150,30), "Checkpoint reached!");
		}
	}
}

function hideHUD() 
{
	displayHUD = false;
}

function showHUD()
{
	displayHUD =true;
}