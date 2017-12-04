/*
* Script for moving the Kraw enemy.
*/

var moveSpeed : float = 10; //speed to move
var facingLeft = true; //facing direction

var stats : Stats;
var weaponDamage : WeaponDamage;

function Awake()
{
	Destroy(gameObject, 40); //destroy the enemy after 40 secs of life
	weaponDamage = GetComponent("WeaponDamage");
}

function Update () 
{
	//always move left
	rigidbody.velocity = Vector3(-moveSpeed, rigidbody.velocity.y, 0);
}

function OnCollisionEnter(hit : Collision) // If the sprite hits something
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
}

function OnTriggerEnter(hit : Collider)
{
	var damageAmount : int;
	
	//take damaage on melee hits
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
}