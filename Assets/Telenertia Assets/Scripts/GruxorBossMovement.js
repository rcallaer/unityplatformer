/*
* A script that animates and controls the Gruxor Boss
* of Kandar Cavern.
*/
var moveSpeed : float = 5; // Move speed per second
var jumpTime : float = 0.5; // Time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // Current animation frame
var frameTime : float = .25; // Time to spend per frame
var attackDistance : float = 10.0;
var hitCounter : int = 0; //track the number of times the boss is hit

var altTextures : Texture[]; // Holder of the right-facing textures
var mainTextures : Texture[]; // Holder of the left-facing textures

//enum class for boss control status
enum BossAIStatus {Idle = 0, Patrol = 1, MovingInPlace = 2, Rampaging = 3, BackingUp = 4}
private var status = BossAIStatus.Idle; //bosses current status
var jumping : boolean = false; // whether or not this object is jumping
var canJump : boolean = true; // whether or not this object is able to jump
var moving : boolean = true; // whether or not this object is moving
var facingLeft : boolean = true; //the facing direction of the object

var stats : Stats;
var weaponDamage : WeaponDamage;
var player : GameObject;
var eye : GameObject;
var legs : GameObject;
var body : GameObject;
var back : GameObject;
var stop : GameObject;
var bossControl : GameObject;

function Awake()
{
	//load all the boss parts on creation
	player = GameObject.FindWithTag("Player");
	eye = GameObject.FindWithTag("BossEye");
	body = GameObject.FindWithTag("BossBody");
	legs = GameObject.FindWithTag("BossLegs");
	back = GameObject.FindWithTag("BossBack");
	bossControl = GameObject.FindWithTag("BossWithControl");
	stop = GameObject.FindWithTag("BossStop");
	
	weaponDamage = GetComponent("WeaponDamage");
	
	var bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatform");
	
	//prevent control object from colliding with platforms
	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
	
	bossplatforms = GameObject.FindGameObjectsWithTag("BossPlatformTop");
	
	//prevent control object from colliding with platform tops
	for(var plat in bossplatforms)
	{
		Physics.IgnoreCollision(collider, plat.collider);
	}
}

function Start() 
{
	ChangeFrame(); // Run the animation function on creation
}

function FixedUpdate()
{
	transform.position.z = 0;
}

function Update() 
{ 
	//move the boss in specific ways based on its current status
	switch(status)
	{
		//while patrolling only move left or right
		case BossAIStatus.Patrol:
		if(moving && facingLeft)
		{
			centerCollidersLeft();
			BossMoveLeft();
		}
		else if(moving)
		{
			centerCollidersRight();
			BossMoveRight();
		}
		else
		{
			BossMoveIdle();
		}
		
		var facingDirection;
		var hit : RaycastHit;
			
		//raycast to prevent sticking to walls
		if(facingLeft)
			facingDirection = transform.right;
		else
			facingDirection = -transform.right;
		if (Physics.Raycast (transform.position, facingDirection, hit, 1)) 
		{
			if(hit.transform.tag == "Vertical")
			{
				TurnAround();
			}
		}
		break;
		
		//if boss is idle don't move
		case BossAIStatus.Idle:
		rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
		break;
		
		//if boss is moving in place change the textures only
		case BossAIStatus.MovingInPlace:
		moveTextures();
		break;
		
		//if boss is rampaging increase his speed
		case BossAIStatus.Rampaging:
		BossMoveRampage();
		break;
	}
	transform.position.z = 0; // Fix movement to x-y axis
}

//shift all the boss colliders for facing left
function centerCollidersLeft()
{
	eye.collider.center.x = 0.2;
	eye.collider.center.y = 0;
	legs.collider.center.x = 0;
	body.collider.center.x = 0.6;
	back.collider.center.x = -1.04;
	bossControl.collider.center.x = -0.8;
	stop.collider.center.x = -0.1;
}

//shift all the boss colliders for facing right
function centerCollidersRight()
{
	eye.collider.center.x = 9.5;
	eye.collider.center.y = 0.4;
	legs.collider.center.x = -1.5;
	body.collider.center.x = -0.43;
	back.collider.center.x = 1.3;
	bossControl.collider.center.x = 0.76;
	stop.collider.center.x = 12.5;
}

//make the boss start moving
function BeginMoving()
{
	status = BossAIStatus.Patrol;
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
	yield WaitForSeconds(0.2);
}

//move left
function BossMoveLeft()
{
	rigidbody.velocity = Vector3(-moveSpeed, rigidbody.velocity.y, 0); // Move to the left
	renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
}

//move left without turning
function BossMoveLeftBackwards()
{
	rigidbody.velocity = Vector3(-moveSpeed, rigidbody.velocity.y, 0); // Move to the left
	renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
}

//move right
function BossMoveRight()
{
	rigidbody.velocity = Vector3(moveSpeed, rigidbody.velocity.y, 0); // Move to the left
	renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
}

//move right without turning
function BossMoveRightBackwards()
{
	rigidbody.velocity = Vector3(moveSpeed, rigidbody.velocity.y, 0); // Move to the left
	renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
}

//stop moving
function BossMoveIdle()
{
	rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
	moveTextures();
}

//rampage move
function BossMoveRampage()
{
	//only increase speed every other hit
	if(hitCounter % 8 == 0 && hitCounter < 28)
	{
		moveSpeed *= 2;
	}
	
	status = BossAIStatus.MovingInPlace;
	
	yield WaitForSeconds(1.5); //allow moving in place for a bit
	
	BeginMoving(); //start moving again
}

//change the textures but don't move
function moveTextures()
{
	if (facingLeft) 
	{
		renderer.material.mainTexture = mainTextures[curFrame]; // Reset to the left frame
	}
	else 
	{ 
		renderer.material.mainTexture = altTextures[curFrame]; // Reset to the right frame
	}
}

//take damage from a hit
function TakeDamage(hit : Collider)
{
	Debug.Log("Something");
	stats = GetComponent("Stats");
		
	stats.takeDamage();
	stats.recoil("Projectile", hit,10,100,facingLeft);
	stats.blink(10, "");
}

function ChangeFrame() // animation function
{
	while (true) 
	{ 
		if(moving && status != BossAIStatus.Idle)
		{
			curFrame += 1; // increase the frame number
			
			// if the last frame has been reached
			if (curFrame >= altTextures.length) 
			{ 
				curFrame = 0; // move back to the first frame
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
	var damageAmount : int;
	for (var contact : ContactPoint in hit.contacts) 
	{
		//only hurt the boss if the projectile hits his eye
		if(contact.thisCollider.name == "GruxBossEye")
		{
			if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
			{
				hitCounter += 1;
				Destroy(hit.gameObject);
				stats = GetComponent("Stats");
				
				damageAmount = weaponDamage.returnDamage(hit.transform.tag);
				
				stats.takeDamage(damageAmount);
				stats.recoil("Projectile", hit,10,100,facingLeft);
				stats.blink(10, "");
			
				status = BossAIStatus.Rampaging;
			}
		}
		//make it turn around if you hit its back
		else if(contact.thisCollider.name == "GruxBossBack")
		{
			if (hit.transform.tag == "Projectile" || hit.transform.tag == "SwingWeapon")
			{
				TurnAround();
			}
		}
		Debug.DrawRay(contact.point, contact.normal, Color.white);
	}
	
	//turn around if he hits something
	if(hit.transform.tag == "Vertical" || hit.transform.tag == "Untagged")
	{
		TurnAround();
	}
	else if(hit.transform.tag == "Player")
	{
		TurnAround();
	}

}

//wait for a while before changing direction
function TurnAround()
{
	status = BossAIStatus.Idle;
	yield WaitForSeconds(2);
	ChangeDirection();
	yield WaitForSeconds(2);
	status = BossAIStatus.Patrol;
}

//move backwards for a bit
function BackUp()
{
	status = BossAIStatus.BackingUp;
	yield WaitForSeconds(1);
}

function OnTriggerEnter(hit : Collider) 
{
	//only the saber can damage the boss
	if(hit.transform.tag == "SwingSaber")
	{
		hitCounter += 4;
		stats = GetComponent("Stats");
		var damageAmount = weaponDamage.returnDamage(hit.transform.tag);
				
		stats.takeDamage(damageAmount);
		stats.recoil("Enemy", hit,10,100,facingLeft);
		stats.blink(10, "");
		
		status = BossAIStatus.Rampaging;
	}
}

//when the boss is dead play the victory script
function OnDestroy()
{
	GameObject.FindWithTag("BossSpawnPoint").GetComponent("BossVictory").bossIsDead = true;
}