/*
* Move the Flying Fish enemy.
*/
var jumpTime : float = 0.5; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame

var jumping : boolean = false; // currently jumping or not
var canJump : boolean = true;//possible to jump

var stats : Stats;

function FixedUpdate()
{
	transform.position.z = 0;
}


function Update() 
{ 
	//jump if possible
	if(canJump)
	{
		CheckMovement();
	}
	
	//prevent falling too fast
	if(rigidbody.velocity.y < -10)
	{
		rigidbody.velocity.y = -10;
	}
	transform.position.z = 0; // Fix movement to x-y axis
	
}

function ChangeFrame() // Start animation function
{
	while (true) 
	{ 
		curFrame = 0;//always keep same
	}
}

//check type of movement
function CheckMovement()
{
	//fish can only jump
	canJump = false;
	rigidbody.AddForce(-Physics.gravity.y*Vector3.up * jumpTime, ForceMode.Impulse);
}


function OnCollisionEnter(hit : Collision) 
{
	//take damage if hit
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
	{
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
		
		stats.takeDamage();
		stats.blink(10, "");
	}
	 if (hit.transform.tag == "Platform" || hit.transform.tag == "InstantDeath") 
	{
		canJump = true;
		jumping = false; // Make it possible to jump again
	}
}

function OnCollisionExit(hit : Collision)
{
	//When you leave a platform, make it think you're jumping
	if (hit.transform.tag == "Platform") 
	{ 
		jumping = true; 
	}
}

function OnTriggerEnter(hit : Collider)
{
	//take damage if hit by sword
	if  (hit.transform.tag == "SwingWeapon" || hit.transform.tag == "SwingSaber") 
	{
		stats = GetComponent("Stats");
	
		stats.takeDamage();
		stats.blink(10, "");
	}
}