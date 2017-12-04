/*
* Move the Ollie enemy.
*/
var moveSpeed : float =5; // Move speed per second
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures

var moving : boolean = true; // Whether or not we're jumping
var facingLeft : boolean = true;

var stats : Stats;

function Update() 
{ 
	//always move either left or right
	if(moving && facingLeft)
	{
		rigidbody.velocity = Vector3(-moveSpeed, rigidbody.velocity.y, 0); // Move to the left
		renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
	}
	else if(moving)
	{
		rigidbody.velocity = Vector3(moveSpeed, rigidbody.velocity.y, 0); // Move to the left
		renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
	}
	else
	{
		rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
		if (facingLeft) 
		{
			renderer.material.mainTexture = mainTextures[curFrame]; // Reset to the left frame
		}
		else 
		{ 
			renderer.material.mainTexture = altTextures[curFrame]; // Reset to the right frame
		}
	}
	
	transform.position.z = 0; // Fix movement to x-y axis

}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
	{
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
		
		stats.takeDamage();
		stats.recoil("Projectile", hit,10,100,facingLeft);
		stats.blink(10, "");
	}
	else if(hit.transform.tag == "Needle")
	{
		stats = GetComponent("Stats");
		
		stats.takeDamage();
		stats.recoil("Enemy", hit,50,1000,facingLeft);
		stats.blink(10, "");
		
		hit.transform.parent = transform;
		
		Destroy(hit.gameObject);
	}
	else if (hit.transform.tag == "InstantDeath")
	{
		Destroy(gameObject);
	}
	

}

function OnTriggerEnter(hit : Collider)
{
	if  (hit.transform.tag == "SwingWeapon" || hit.transform.tag == "SwingSaber") 
	{
		stats = GetComponent("Stats");
	
		stats.takeDamage();
		stats.recoil("Enemy", hit,50,300,facingLeft);
		stats.blink(10, "");
	}
	
	else if(hit.transform.tag == "WayPoint")
	{
		var waypoint : WayPoint = hit.GetComponent("WayPoint");
		
		var rtype = waypoint.getRestrictionType();
		
		//left restriction
		if(rtype == 0)
			facingLeft = false;
		//right restriction
		else if(rtype == 1)
			facingLeft = true;
	}
}

function OnTriggerStay(hit : Collider)
{
	if(hit.transform.tag == "WayPoint")
	{
		var waypoint : WayPoint = hit.GetComponent("WayPoint");
		
		var rtype = waypoint.getRestrictionType();
		
		//left restriction
		if(rtype == 0)
			facingLeft = false;
		//right restriction
		else if(rtype == 1)
			facingLeft = true;
	}
}

function FixedUpdate()
{
	transform.position.z = 0;
}