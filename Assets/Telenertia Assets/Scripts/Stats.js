/*
* A script to hold variables for and manipulations of stats
* for enemies.
*/
var maxHealth : int = 10; //maximum possible health
var health : int = 10; //total current health
var defense : int = 5; //enemy defense power
var attack : int = 3; //enemy attack power
var invincible : boolean = false; //whether the enemy can be damaged

function Update () 
{
	//if the enemy dies, destroy its game object
	if(isDead())
	{
		renderer.enabled = false;
		collider.isTrigger = true;
		Destroy(gameObject,1);
	}
}

//take a normal amount of damage
function takeDamage()
{
	if(!invincible)
	{
		if(!audio.isPlaying)
			audio.Play();
		health -= 5;
	}
}

//take a parameterized amount of damage
function takeDamage(amount : int)
{
	if(!invincible)
	{
		if(!audio.isPlaying)
			audio.Play();
		health -= amount;
	}
}

//return true if health falls at or below 0
function isDead()
{
	return health <= 0;
}

//function that makes the enemy blink when taking damage
function blink(times : int, child : String)
{
	var currentTag = transform.tag;
	SetTag("NoDamage"); //also prevent enemy from doing damage for a bit
	
	if(!isDead())
	{
		var state : boolean = false;
		invincible = true;
		while(times > 0)
		{
			state = !state;
			if(child != "")
				transform.transform.renderer.enabled = state;
			else
				renderer.enabled = state;
			yield WaitForSeconds(.07);
			times--;
		}
		invincible = false;
		renderer.enabled = true;
		
		SetTag(currentTag);
	}
	else if(currentTag == "BossWithControl" || currentTag == "Boss")
	{
		SetTag(currentTag);
	}
}

//function that makes the enemy move a bit when taking damage
function recoil(hitType : String, hit : Collision, upwardForce : int, directionForce : int, facingLeft : boolean)
{
	var recoilLeft : boolean = false; 

	if(hitType == "Enemy")
		recoilLeft = facingLeft;
	else if(hitType == "Projectile")
	{
		if(hit.rigidbody.velocity.x < 0)
			recoilLeft = true;
	}	
	
	if(recoilLeft)
	{
		rigidbody.AddForce(transform.up* upwardForce, ForceMode.Impulse );
		rigidbody.AddForce(-transform.right* directionForce, ForceMode.Impulse );
	}
	else
	{
		rigidbody.AddForce(transform.up* upwardForce, ForceMode.Impulse );
		rigidbody.AddForce(transform.right* directionForce, ForceMode.Impulse );
	}
}

//overloaded function that makes the enemy move a bit when taking damage, for Collider param
function recoil(hitType : String, hit : Collider, upwardForce : int, directionForce : int, facingLeft : boolean)
{
	var recoilLeft : boolean = false; 
	
	if(hitType == "Enemy")
		recoilLeft = facingLeft;
	else if(hitType == "Projectile")
	{
		if(hit.rigidbody.velocity.x < 0)
			recoilLeft = true;
	}	
	
	if(recoilLeft)
	{
		rigidbody.AddForce(transform.up* upwardForce, ForceMode.Impulse );
		rigidbody.AddForce(-transform.right* directionForce, ForceMode.Impulse );
	}
	else
	{
		rigidbody.AddForce(transform.up* upwardForce, ForceMode.Impulse );
		rigidbody.AddForce(transform.right* directionForce, ForceMode.Impulse );
	}
}

//sets the enemy's tag to the one specified as a parameter
function SetTag(tagName : String)
{
	transform.tag = tagName;
}
