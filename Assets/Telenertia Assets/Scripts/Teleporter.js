/*
* Teleport to the next level.
*/

var level : String = "";

function OnTriggerEnter(hit : Collider)
{
	if  (hit.transform.tag == "Player") 
	{
		Application.LoadLevel(level);
	}
}