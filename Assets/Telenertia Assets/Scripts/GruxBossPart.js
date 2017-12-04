/*
* A script applied to each part of the boss so that the boss doesn't
* collide with the platforms in the boss area.
*/
function Awake()
{
	var bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatform");
	var player = GameObject.FindWithTag("Player");
	
	//the boss stop collider should only collide with walls, not the player
	if(gameObject.name == "GruxBossStop")
		Physics.IgnoreCollision(collider, player.collider);
	
	//ignore the bottom platforms
	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
	
	bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatformTop");
	
	//also ignore the top platforms
	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	//have the boss turn around if this part hits a wall
	if(hit.transform.tag == "Vertical" || hit.transform.tag == "Untagged")
	{
		SendMessageUpwards("TurnAround");
	}

}