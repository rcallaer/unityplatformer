/*
* Script for moving the Gruxor enemy.
*/

var moveSpeed : float = 5; // Move speed per second
var jumpTime : float = 0.5; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame
var attackDistance : float = 10.0; //distance to attack player

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures

//enum class for enemy ai moves
enum EnemyAIStatus {Idle = 0, Patrol = 1, Attacking = 2}
private var status = EnemyAIStatus.Patrol;
var jumping : boolean = false; // currently jumping or not
var canJump : boolean = true; //able to jump
var canAttack : boolean = true; //able to attack
var moving : boolean = true; // currently attacking or not
var facingLeft : boolean = true; //facing direction

var stats : Stats;
var weaponDamage : WeaponDamage;
var player : GameObject;

function Awake()
{
	player = GameObject.FindWithTag("Player");
	weaponDamage = GetComponent("WeaponDamage");
}

function Start() 
{
	ChangeFrame(); // Run the animation function on creation
}

function Update() 
{ 
	CheckStatus(); //check enemy status every frame
	
	//use status to choose between moves
	switch(status)
	{
		//if patroling move left or right, or jump
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
		
		//if idle don't move
		case EnemyAIStatus.Idle:
		rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
		break;
		
		//if attacking move towards player
		case EnemyAIStatus.Attacking:
		Attack();
		break;
	}
	transform.position.z = 0; // Fix movement to x-y axis
}

function CheckStatus()
{
	//check the distance between enemy and player
	var dist = (player.transform.position - transform.position).magnitude;
	
	//make the enemy do nothing if player's in range and directly above
	if (dist < attackDistance && player.transform.position.x <= transform.position.x+1  && player.transform.position.x >= transform.position.x-1 && player.transform.position.y > transform.position.y)
	{
		status = EnemyAIStatus.Idle;
	}
	//make the enemy attack if within range otherwise
	else if(dist < attackDistance && canAttack)
	{
		status = EnemyAIStatus.Attacking;
	}
	//otherwise continue patrolling
	else 
	{
		status = EnemyAIStatus.Patrol;
	}
}

function CheckMovement()
{
	var jump = Random.Range(0,1000);
	
	//jump at random intervals
	if(jump > 993)
	{
		jumping = true;
	}

}

//alter current facing direction
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

//make the enemy move towards the player
function Attack()
{
	var speedTowardsPlayer = moveSpeed;
	
	//if enemy is on the right side of the player move left
	if(player.transform.position.x < transform.position.x)
	{
		facingLeft = true;
		speedTowardsPlayer = -speedTowardsPlayer;
		renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
	}
	//if enemy is on the left side of the player move right
	else
	{
		facingLeft = false;
		renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
	}
		
	rigidbody.velocity = Vector3(speedTowardsPlayer, rigidbody.velocity.y, 0); // Move to the left
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

//make enemy unable to attack for a short time
function ToggleAttack()
{
	canAttack = false;
	yield WaitForSeconds(0.5);
	canAttack = true;
}

function OnCollisionEnter(hit : Collision) 
{
	var damageAmount : int;
	
	//take damage on collisions
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
	{
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
		
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
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
	//change direction if you hit a wall or enemy
	else if(hit.transform.tag == "Enemy" || hit.transform.tag == "Vertical" 
			|| hit.transform.tag == "Untagged")
	{
		canAttack = false;
		ChangeDirection();
	}
	//if the player is hit allow a bit of time to recover before attacking
	else if(hit.transform.tag == "Player")
	{
		ToggleAttack();
	}
	else if (hit.transform.tag == "InstantDeath" || hit.transform.tag == "BossDoor")
	{
		Destroy(gameObject);
	}

}

function OnCollisionStay(hit : Collision)
{
	//if touching something disallow attack
	if(hit.transform.tag == "Enemy" || hit.transform.tag == "Vertical" 
	|| hit.transform.tag == "Untagged" || hit.transform.tag == "Player")
	{
		canAttack = false;
	}
}

function OnTriggerEnter(hit : Collider) 
{
	var damageAmount : int;
	
	//take damage if the enemy hits a melee weapon
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
	else if (hit.transform.tag == "Platform") 
	{ 
		canJump = true;
		jumping = false; // Make it possible to jump again
	}
	//make sure it doesn't jump off cliffs
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
	//make sure it doesn't jump off cliffs
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