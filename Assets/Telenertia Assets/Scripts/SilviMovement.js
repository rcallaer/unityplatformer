var moveSpeed : float = 5; // Move speed per second
var jumpTime : float = 2; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame
var projectileSpeed : float = 0.5f;
var attackDistance : float = 10.0;

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures
var idleTexture : Texture2D;
var needle : GameObject;
var needleRight : GameObject;

enum SilviAIStatus {Idle = 0, Attacking = 1}
private var status = SilviAIStatus.Idle;
var jumping : boolean = false; 
var moving : boolean = false; 
var facingLeft : boolean = true;
var playerInRange : boolean = true;
var testChange : boolean = true;
var canAttack : boolean = true;

var stats : Stats;
var weaponDamage : WeaponDamage;
var player : GameObject;

function Awake()
{
	player = GameObject.FindWithTag("Player");
	stats = GetComponent("Stats");
	weaponDamage = GetComponent("WeaponDamage");
}

function Start() 
{
	ChangeFrame(); // Run the animation function
}

function FixedUpdate()
{
	transform.position.z = -0.7;
}

function Update() // This function is run once per frame
{ 
	CheckStatus();
	
	switch(status)
	{
		case SilviAIStatus.Attacking:
		CheckMovement();
	
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
			{ // If we're facing left
				renderer.material.mainTexture = mainTextures[curFrame]; // Reset to the left frame
			}
			else 
			{ // If we're facing right
				renderer.material.mainTexture = altTextures[curFrame]; // Reset to the right frame
			}
		}
		break;
		
		case SilviAIStatus.Idle:
		renderer.material.mainTexture = idleTexture;
		break;
	}
	
	
	transform.position.z = 0; // Fix movement to x-y axis
}

function CheckMovement()
{
	var movement = Random.Range(0,1000);
	var idle = Random.Range(0,1000);
	var attacking = Random.Range(0,1000);
	
	if(movement > 995)
	{
		ChangeDirection();
	}
	
	if(idle > 990)
	{
		//status = SilviAIStatus.Idle;
		moving = false;
		yield WaitForSeconds(3);
		moving = true;
	}
	//status  SilviAIStatus.Moving;
	moving = true;
	
	if(playerInRange)
	{
		if(!stats.isDead())
		{
			if(attacking > 990)
			{
				ShootNeedle("left");
				ShootNeedle("right");
				yield WaitForSeconds(0.2);
				ShootNeedle("diag-left");
				ShootNeedle("diag-right");
			}
		}
	}
	//status = SilviAIStatus.Moving;
	//moving = true;
}

function CheckStatus()
{
	var dist = (player.transform.position - transform.position).magnitude;
	
	if(dist < attackDistance)
	{
		status = SilviAIStatus.Attacking;
	}
	else
	{
		status = SilviAIStatus.Idle;
	}
}

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

function ShootNeedle(direction : String)
{
	var clone : GameObject;
		
		// Instantiate the projectile at the position and rotation of this transform
		if(direction == "left")
		{
			clone = Instantiate(needle, transform.position, transform.rotation);
		}
		else if(direction == "right")
		{
			clone = Instantiate(needleRight, transform.position, transform.rotation);
		}
		else if(direction == "diag-left")
		{
			clone = Instantiate(needle, transform.position, transform.rotation);
			clone.transform.Rotate(Vector3(0,45,0));
		}
		else if(direction == "diag-right")
		{
			clone = Instantiate(needleRight, transform.position, transform.rotation);
			clone.transform.Rotate(Vector3(0,-45,0));
		}
		clone.transform.Translate(Vector3(0,0,1));
		clone.rigidbody.freezeRotation = true;
		Physics.IgnoreCollision(clone.collider, transform.collider);
		
		var needles = GameObject.FindGameObjectsWithTag ("Needle");
		for (var n in needles)
		{
			if(n != clone)
			{
				Physics.IgnoreCollision(clone.collider, n.collider);
			}
		}
		
		if(direction == "left")
		{
			clone.rigidbody.velocity = Vector3(-projectileSpeed, 0, 0);
		}
		else if(direction == "right")
		{
			clone.rigidbody.velocity = Vector3(projectileSpeed, 0, 0);
		}
		else if(direction == "diag-left")
		{
			clone.rigidbody.velocity = Vector3(-projectileSpeed/2, projectileSpeed/2, 0);
		}
		else if(direction == "diag-right")
		{
			clone.rigidbody.velocity = Vector3(projectileSpeed/2, projectileSpeed/2, 0);
		}
		
		// Set the timeout destructor
		Destroy(clone, 4);
}

function ChangeFrame() // Start animation function
{
	while (true) 
	{ // While the object exists
		if(moving)
		{
			curFrame += 1; // Increase the frame number
			
			if (curFrame >= altTextures.length) 
			{ // If the last frame has been reached
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

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	var damageAmount : int;
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
	{
		Destroy(hit.gameObject);
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.blink(10, "");
	}
	else if(hit.transform.tag == "Needle")
	{
		Physics.IgnoreCollision(hit.collider, transform.collider);
	}
	else if (hit.transform.tag == "InstantDeath")
	{
		Destroy(gameObject);
	}
}

function OnTriggerEnter(hit : Collider) // If the sprite hits a special trigger
{
	var damageAmount : int;
	if  (hit.transform.tag == "SwingWeapon") 
	{
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.blink(10, "");
	}
	if  (hit.transform.tag == "SwingSaber") 
	{
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.blink(10, "");
	}
}