/*
* A simple script for handling collisions with needles shot by the Silvi 
* enemy.
*/
var bigNeedle = false; //make needles really big just for fun

function Start()
{
	if(bigNeedle)
	{
		transform.localScale = Vector3(1,1,1);
	}
}

function FixedUpdate()
{
	transform.position.z = 0; //fix the z-axis position
}

function OnCollisionEnter(hit : Collision) 
{
	//needle should ignore collisions with other needles
	if(hit.transform.tag == "Needle")
	{
		Physics.IgnoreCollision(collider, hit.collider);
	}
	//needles and projectiles should cancel each other out
	else if(hit.transform.tag == "Projectile")
	{
		Destroy(hit.gameObject);
		Destroy(gameObject);
	}
	//needle should be destroyed if it collides with anything else
	else
	{
		Destroy(gameObject);
	}
}

function OnCollisionStay(hit : Collision)
{
	//needle should ignore collisions with other needles
	if(hit.transform.tag == "Needle")
	{
		Physics.IgnoreCollision(collider, hit.collider);
	}
}

function OnTriggerEnter(hit : Collider)
{
	//melee weapon should block needles
	if(hit.transform.tag == "SwingWeapon"|| hit.transform.tag == "SwingSaber")
	{
		Destroy(gameObject);
	}
}