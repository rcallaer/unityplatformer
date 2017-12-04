var moveSpeed : float = 20; // Move speed per second
var jumpTime : float = 0.5; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame
var attackDistance : float = 10.0;

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures

//enum EnemyAIStatus {Idle = 0, Patrol = 1, Attacking = 2}
private var status = EnemyAIStatus.Patrol;
var jumping : boolean = false; // Whether or not we're jumping
var canJump : boolean = true;
var canAttack : boolean = true;
var moving : boolean = true; // Whether or not we're jumping
var facingLeft : boolean = true;

var stats : Stats;
var weaponDamage : WeaponDamage;
var player : GameObject;

function Awake()
{
	player = GameObject.FindWithTag("Player");
	weaponDamage = GetComponent("WeaponDamage");
}

function Start() // This function is run on object creation
{
	ChangeFrame(); // Run the animation function
}

function FixedUpdate()
{
	//transform.position.z = -0.4;
}

function Update() 
{ 
	CheckStatus();
	
	switch(status)
	{
		case EnemyAIStatus.Patrol:
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
		break;
		
		case EnemyAIStatus.Idle:
		rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
		break;
		
		case EnemyAIStatus.Attacking:
		break;
	}
	transform.position.z = 0; // Fix movement to x-y axis
}

function CheckMovement()
{
	var movement = Random.Range(0,1000);
	var idle = Random.Range(0,1000);
	var jump = Random.Range(0,1000);
	
	/*if(facingLeft)
		facingDirection = transform.right;
	else
		facingDirection = -transform.right;
	if (Physics.Raycast (transform.position, facingDirection, 1)) 
	{
		ChangeDirection();
    }*/
	
	/*if(movement > 995)
	{
		ChangeDirection();
	}*/
	
	/*if(idle > 990)
	{
		//status = EnemyAIStatus.Idle;
		moving = false;
		yield WaitForSeconds(3);
		moving = true;
	}*/
	
	if(jump > 993)
	{
		jumping = true;
	}
	//status = EnemyAIStatus.Moving;
	//moving = true;
}

function CheckStatus()
{
	var dist = (player.transform.position - transform.position).magnitude;
	
	if (dist < attackDistance && player.transform.position.x <= transform.position.x+1  && player.transform.position.x >= transform.position.x-1 && player.transform.position.y > transform.position.y)
	{
		status = EnemyAIStatus.Patrol;
	}
	else if(dist < attackDistance && canAttack)
	{
		status = EnemyAIStatus.Patrol;
	}
	else 
	{
		status = EnemyAIStatus.Patrol;
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
	yield WaitForSeconds(0.2);
}

function Attack()
{
	var speedTowardsPlayer = moveSpeed;
	
	if(player.transform.position.x < transform.position.x)
	{
		facingLeft = true;
		speedTowardsPlayer = -speedTowardsPlayer;
		renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
	}
	else
	{
		facingLeft = false;
		renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
	}
		
	rigidbody.velocity = Vector3(speedTowardsPlayer, rigidbody.velocity.y, 0); // Move to the left
}


function ChangeFrame() // Start animation function
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

function ToggleAttack()
{
	canAttack = false;
	yield WaitForSeconds(0.5);
	canAttack = true;
}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun" )
	{
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
		
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.recoil("Projectile", hit,10,100,facingLeft);
		stats.blink(10, "");
		
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
	}
	
	else if (hit.transform.tag == "Enemy")
	{
		Physics.IgnoreCollision(hit.collider,collider);
	}
	
	else if (hit.transform.tag == "Turn Around" || hit.transform.tag == "SwingWeapon" || hit.transform.tag == "SwingSaber" )
	{
		ChangeDirection();
	}
	
	else if(hit.transform.tag == "Needle")
	{//hit.rigidbody.velocity = Vector3(0, 0, 0); // Stop  moving
		stats = GetComponent("Stats");
		
		stats.takeDamage();
		stats.recoil("Enemy", hit,50,1000,facingLeft);
		stats.blink(10, "");
		
		hit.transform.parent = transform;
		
		Destroy(hit.gameObject);
	}
	else if(hit.transform.tag == "Enemy" || hit.transform.tag == "Vertical" 
			|| hit.transform.tag == "Untagged" || hit.transform.tag == "Player")
	{
		ChangeDirection();
	}
	else if(hit.transform.tag == "Player")
	{
		ChangeDirection();
	}
	else if (hit.transform.tag == "InstantDeath" || hit.transform.tag == "BossDoor")
	{
		Destroy(gameObject);
	}

}

function OnCollisionStay(hit : Collision)
{
	if(hit.transform.tag == "Enemy" || hit.transform.tag == "Vertical" 
	|| hit.transform.tag == "Untagged" || hit.transform.tag == "Player")
	{
		canAttack = false;
	}
}

function OnTriggerEnter(hit : Collider) // If the sprite hits a special trigger
{
	var damageAmount : int;
	if  (hit.transform.tag == "SwingWeapon") 
	{
		stats = GetComponent("Stats");
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.recoil("Enemy", hit,50,300,facingLeft);
		stats.blink(10, "");
	}
	if  (hit.transform.tag == "SwingSaber") 
	{
		stats = GetComponent("Stats");
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
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
		//ChangeDirection();
	}
}

function OnTriggerStay(hit : Collider)
{
	if(hit.transform.tag == "WayPoint")
	{
		var waypoint : WayPoint = hit.GetComponent("WayPoint");
		
		var rtype = waypoint.getRestrictionType();
		
		//left restriction
		if(rtype == WayPointRestriction.right)
			facingLeft = true;
		//right restriction
		else if(rtype == WayPointRestriction.left)
			facingLeft = false;
			
		yield WaitForSeconds(1);
	}
}

function OnCollisionExit(hit : Collision)
{
	//When you leave a platform, make it think you're jumping
	if (hit.transform.tag == "Platform") 
	{ 
		jumping = true; 
	}
	else if(hit.transform.tag == "Enemy" || hit.transform.tag == "Vertical" 
		  || hit.transform.tag == "Untagged" || hit.transform.tag == "Player")
	{
		yield WaitForSeconds(0.2);
		canAttack = true;
	}
}