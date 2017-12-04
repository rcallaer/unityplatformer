/*
* A simple script for projectile collisions events.
*/

function Awake()
{
	var gruxBossStop = GameObject.FindWithTag("BossStop");
	
	//the projectile should ignore the boss' stop part
	if(gruxBossStop.gameObject)
		Physics.IgnoreCollision(collider,gruxBossStop.collider);
}

function Update()
{
	transform.position.z = -0.4; //fix the projectile's z-axis
}

//destroy the projectile if it collides with anything
function OnCollisionEnter(hit : Collision)
{	
	Destroy(gameObject);
}