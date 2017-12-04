var displayWin : boolean = false;

function OnTriggerEnter(hit : Collider)
{
	if(hit.transform.tag == "Player")
	{
		displayWin = true;
		
		yield WaitForSeconds(8);
		
		displayWin = false;
		
		Application.LoadLevel("MenuScreen");
	}
}

function OnGUI()
{
	if(displayWin)
	{
		var foundText;
		foundText = "You Win! That's the end. Thanks for playing!";
		GUI.Box(Rect((Screen.width/2) - 50,(Screen.height/2)-100,400,30),foundText);
	}
}