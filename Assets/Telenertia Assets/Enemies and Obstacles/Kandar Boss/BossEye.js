/*
* Script to control collisions at the boss' eye.
*/
var bossControl : GruxorBossMovement;

function Awake()
{
	bossControl = transform.parent.GetComponent("GruxorBossMovement");
	var bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatform");

	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
	
	bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatformTop");
	
	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	if (hit.transform.tag == "Projectile")
	{
		Debug.Log("do something");
		SendMessageUpwards("TakeDamage",collider);
	}
	else if(hit.transform.tag == "Vertical" || hit.transform.tag == "Untagged")
	{
		SendMessageUpwards("TurnAround");
	}
}

function OnTriggerEnter(hit : Collider) // If the sprite hits a special trigger
{
	if (hit.transform.tag == "SwingWeapon") 
	{
		Debug.Log("do something 2");
		SendMessageUpwards("TakeDamage",collider);
	}
}