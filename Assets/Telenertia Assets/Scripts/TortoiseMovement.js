/*
* Move the tortoise enemy.
*/
var moveSpeed : float = 5; // Move speed per second
var jumpTime : float = 0.5; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures

//enum EnemyAIStatus {Idle = 0, Moving = 1, Attacking = 2}
//private var status = EnemyAIStatus.Moving;
var jumping : boolean = false; // Whether or not we're jumping
var canJump : boolean = true;
var moving : boolean = true; // Whether or not we're jumping
var facingLeft : boolean = true;

var stats : Stats;

function Start() // This function is run on object creation
{
	ChangeFrame(); // Run the animation function
}

function FixedUpdate()
{
	transform.position.z = 0;
}

function Update() 
{ 

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
	
	if(jumping && canJump)
	{
		rigidbody.velocity.y = -Physics.gravity.y * jumpTime; // Jump upwards
		canJump = false;
	}
	transform.position.z = 0; // Fix movement to x-y axis
}

//decide which way to move
function CheckMovement()
{
	//use random variables for movement
	var movement = Random.Range(0,1000);
	var idle = Random.Range(0,1000);
	var jump = Random.Range(0,1000);
	
	if(facingLeft)
		facingDirection = transform.right;
	else
		facingDirection = -transform.right;
	if (Physics.Raycast (transform.position, facingDirection, 1)) 
	{
		ChangeDirection();
    }
	
	if(movement > 995)
	{
		ChangeDirection();
	}
	
	if(idle > 990)
	{
		moving = false;
		yield WaitForSeconds(3);
		moving = true;
	}
	
	if(jump > 993)
	{
		jumping = true;
	}

}

//alter the facing direction
function ChangeDirection()
{
	if(facingLeft)
	{
		facingLeft = false;
	}
	else
	{
		facingLeft = true;
	}
}


function ChangeFrame() // animation function
{
	while (true) 
	{ 
		if(moving)
		{
			curFrame += 1; // Increase the frame number
			
			// If the last frame has been reached
			if (curFrame >= altTextures.length) 
			{ 
				curFrame = 0; // Move back to the first frame
			}
		}
		else
		{
			curFrame = 0;
		}
		yield WaitForSeconds(frameTime); // Wait for the time per frame
	}
}

function OnCollisionEnter(hit : Collision) 
{
	//take damage on collisions
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
	//take damage on sword swings
	if  (hit.transform.tag == "SwingWeapon" || hit.transform.tag == "SwingSaber") 
	{
		stats = GetComponent("Stats");
	
		stats.takeDamage();
		stats.recoil("Enemy", hit,50,300,facingLeft);
		stats.blink(10, "");
	}
	else if (hit.transform.tag == "Platform") 
	{ 
		canJump = true;
		jumping = false; // Make it possible to jump again
	}
	else if(hit.transform.tag == "WayPoint")
	{
		ChangeDirection();
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

