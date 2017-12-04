var moveSpeed : float = 0; // Move speed per second
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
var deathTimeCounter : int =0;
var timeTillDeath : int =40;

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
	ChangeFrame();
	rigidbody.velocity = Vector3(0,-30,0);// Run the animation function
	transform.position.z=0;
	
}

function Update() 
{ 
	renderer.material.mainTexture = mainTextures[curFrame];
}

function ChangeFrame() // Start animation function
{
	while(true) 
	{
		if(deathTimeCounter >= timeTillDeath)
		{
			Destroy(gameObject);
		}
		curFrame += 1;
		if (curFrame >= altTextures.length) 
		{
			curFrame=0;
		}
		yield WaitForSeconds(.1);
		deathTimeCounter+=1;
		
	}
}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
{
	if (hit.transform.tag == "Projectile" || hit.transform.tag == "BlastGun")
	{
		Destroy(hit.gameObject);
		stats = GetComponent("Stats");
		
		damageAmount = weaponDamage.returnDamage(hit.transform.tag);
		
		stats.takeDamage(damageAmount);
		stats.recoil("Projectile", hit,10,100,facingLeft);
		stats.blink(10, "");
	}
	
	else if (hit.transform.tag == "Enemy")
	{
		Physics.IgnoreCollision(hit.collider,collider);
	}
	
	else if(hit.transform.tag == "Needle")
	{//hit.rigidbody.velocity = Vector3(0, 0, 0); // Stop moving
		stats = GetComponent("Stats");
		
		stats.takeDamage();
		stats.recoil("Enemy", hit,50,1000,facingLeft);
		stats.blink(10, "");
		
		hit.transform.parent = transform;
		
		Destroy(hit.gameObject);
	}

	else if (hit.transform.tag == "InstantDeath" || hit.transform.tag == "BossDoor")
	{
		Destroy(gameObject);
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