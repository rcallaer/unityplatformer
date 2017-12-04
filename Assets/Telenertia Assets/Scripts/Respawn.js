var canPickUp = true;

function Update () 
{
	if(pickedUp())
	{
		Respawn(30);
	}
}

function pickedUp()
{
	return canPickUp;
}

function Respawn(seconds : int)
{
	renderer.enabled = false;
	collider.isTrigger = true;
	
	yield WaitForSeconds(seconds);
	
	renderer.enabled = true;
	collider.isTrigger = false;
}