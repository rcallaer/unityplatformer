/*
* Transports you to the surface level.
*/
function OnTriggerEnter(hit : Collider)
{
	if(hit.transform.tag == "Player")
	{
		Application.LoadLevel("TestLandLevel1");
	}
}