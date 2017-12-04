/*
* A script for playing the event of finding a new weapon.
*/
 
var playerMoves : PlayerMovement;
var pauseScreen : PauseMenu;
var displayFound = false; //whether the object has been found
var waitTime = 5; //the time to wait before

function Awake () 
{
	//get the required script components on creation
	playerMoves = GameObject.FindWithTag("Player").GetComponent("PlayerMovement");
	pauseScreen = GameObject.FindWithTag("MainCamera").GetComponent("PauseMenu");
}

function OnTriggerEnter(hit : Collider)
{
	if  (hit.transform.tag == "Player") //play the even when the player hits this trigger
	{
		//allow the character to wield the weapon
		if(transform.tag == "EnergySaber")
		{
			playerMoves.holdingSaber = true;
		}
		else if(transform.tag == "BlastGun")
		{
			playerMoves.canWieldGun = true;
		}
		
		renderer.enabled = false;

		displayFound = true; //display the GUI message before destroying the object

		yield WaitForSeconds(waitTime); 
		
		displayFound = false; //disable GUI message
		
		Destroy(gameObject); //destroy it so the player can't pick it up again
	}
}

function OnGUI()
{
	//display the found message
	if(displayFound)
	{
		var foundText;
		if(transform.tag == "EnergySaber")
		{
			foundText = "You've found an energy saber!";
		}
		else if(transform.tag == "BlastGun")
		{
			foundText = "You've found a blast gun! Switch to it with the Up/Down Arrow key!";
		}
		GUI.Box(Rect((Screen.width/2) - 50,(Screen.height/2)-100,400,30),foundText);
	}
}