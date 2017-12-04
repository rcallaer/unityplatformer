var displayFound : boolean = false;

function OnTriggerEnter(hit : Collider)
{
	if  (hit.transform.tag == "Player") 
	{
		displayFound = true;
		
		yield WaitForSeconds(5);
		
		displayFound = false;
		
		Destroy(gameObject);
	}
}

function OnGUI()
{
	if(displayFound)
	{
		var foundText;
		foundText = "Look! A teleporter in the corner of the Room!";
		GUI.Box(Rect((Screen.width/2) - 50,(Screen.height/2)-100,400,30),foundText);
	}
}