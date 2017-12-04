/*
* Script that stores and manipulates data about the player.
*/

var maxHealth : int = 50; //maximum possible health
var health : int = 50; //player's current health
var defense : int = 5; //player's defense
var attack : int = 3; //player's attack strength
var rockCount : int =10; //rock ammo
var maxRockCount : int = 20; //maximum rock ammo
var bulletCount : int = 15; //blast gun ammo
var maxBulletCount : int = 15; //maximum blast gun ammo
var invincible : boolean = false; // whether or not the player can be hit
var lives : int = 5; //player's current number of lives

var blinkSaber : boolean; //blink the right saber texture
var blinkSaberLeft : boolean; //blinkthe left saber texture
var isBlinking : boolean; //currently blinking or not

var playerMoves : PlayerMovement;
var persistenData : GameObject;
var persistentPlayerData : PersistentPlayerData;
var saberHalf : GameObject;
var saberHalfLeft : GameObject;
var mapAudio : AudioSource;
var bossAudio : AudioSource;
var boss : GameObject;
var bossTrigger : SpawnPoint;
var bossDoor : GameObject;

function Awake()
{
	playerMoves = GetComponent("PlayerMovement");
	persistentData = GameObject.Find("PersistentPlayerData");
	
	//if player has come from a previous leve. load all the persistent data from that level
	if(persistentData.gameObject)
	{
		persistentPlayerData = persistentData.GetComponent("PersistentPlayerData");
		health = persistentPlayerData.playerHealth;
		lives = persistentPlayerData.playerCurrentLives;
		rockCount = persistentPlayerData.playerRockCount;
		bulletCount = persistentPlayerData.playerBulletCount;

		playerMoves.canWieldGun = persistentPlayerData.playerFoundGun;
		playerMoves.holdingSaber = persistentPlayerData.playerFoundSaber;
	}
	
	saberHalf = GameObject.Find("SaberHalf");
	saberHalfLeft = GameObject.Find("SaberHalfLeft");
	
	mapAudio = GameObject.FindWithTag("Map").GetComponent(AudioSource);
	
	//only underground level has a boss
	if(Application.loadedLevel=="TestUnderground") 
	{
		bossAudio = GameObject.FindWithTag("BossSpawnPoint").GetComponent(AudioSource);
	}
}

function Update () 
{
	//if the player dies
	if(isDead())
	{
		lives-=1;//subtract from his lives count
		
		//if all lives have been used up, load permanent death screen
		if(CheckPermaDeath()) 
		{
			Application.LoadLevel("dead"); //load 
		}
		//otherwise return to the most recent checkpoint
		else
			ReturnToCheckpoint();
	}
	
	//try to kill the annoying flicker from the saber weapon if needed
	if(playerMoves.killSaberFlicker)
	{
		blinkSaber = false;
	}
	else if(playerMoves.killSaberFlicker)
	{
		blinkSaberLeft = false;
	}
	else if(!playerMoves.killSaberFlicker)
	{
		blinkSaber = true;
	}
	else if(!playerMoves.killSaberFlickerLeft)
	{
		blinkSaberLeft = true;
	}
	
}

//returns player back to the most recent checkpoint
function ReturnToCheckpoint()
{	
	var moveToCheckpoint : int = playerMoves.playerCheckpoint;
	var checkpoints = GameObject.FindGameObjectsWithTag("CheckPoint");
		
	//run through each checkpoint in the level
	for(var checkpoint in checkpoints)
	{
		var checkpointScript : CheckPoint = checkpoint.GetComponent("CheckPoint");
		
		//if the checkpoint number equals the player's checkpoint number, send him to that location
		if(moveToCheckpoint == checkpointScript.checkpointNumber)
		{
			transform.position = checkpointScript.location;
			break;
		}
	}
	
	//regain health
	health = maxHealth;
	
	//play the map audio if he died in a boss battle
	if(!mapAudio.isPlaying)
		mapAudio.Play();
	//stop the boss music and resetup all boss events if he died in a boss battle
	if(Application.loadedLevel=="TestUnderground") 
	{
		if(bossAudio.isPlaying)
		{
			//GameObject.FindWithTag("BossSpawnPoint").GetComponent("BossVictory").bossIsDead = false;
			boss = GameObject.FindWithTag("BossWithControl");
			bossDoor = GameObject.FindWithTag("BossDoor");
			bossTrigger = GameObject.FindWithTag("BossTriggerSpawn").GetComponent("SpawnPoint");

			bossAudio.Stop();
			bossTrigger.Spawn();
			Destroy(boss.gameObject);
			Destroy(bossDoor.gameObject);
		}
		if(boss.gameObject)
		{
			Destroy(boss.gameObject);
		}
		if(bossDoor.gameObject)
		{
			Destroy(bossDoor.gameObject);
		}
	}
}

//take a normal amount og damage
function takeDamage()
{
	if(!invincible)
	{
		if(!audio.isPlaying)
			audio.Play();
		health -= 5;
	}
}

//returns true if health is 0 or less
function isDead()
{
	return health <= 0;
}

//returns true if lives are less than 0
function CheckPermaDeath()
{
	return lives < 0;
}

//subtracts from rock count unless while count is greater than 0
function throwRock() : boolean
{
	if(rockCount > 0) 
	{
		rockCount -= 1;
		return true;
	}
	else return false;
}

//subtracts from bullet count unless while count is greater than 0
function shootBullet() : boolean
{
	if(bulletCount > 0) 
	{
		bulletCount -= 1;
		return true;
	}
	else return false;
}

//makes an item perform its function when picked up
function pickUpItem(itemType : String, count : int) 
{
	//a rock up adds to the rock count
	if(itemType == "Rock Up") 
	{
		rockCount += count;
		if(rockCount >= maxRockCount)
		{
			rockCount = maxRockCount;
		}
	}
	//an energy gem adds health
	else if(itemType == "Energy Gem")
	{
		health += count;
		if(health >= maxHealth)
		{
			health = maxHealth;
		}
	}
	//add jump gem makes the player jump higher
	else if(itemType == "Jump Gem")
	{	
		var playerMovement : PlayerMovement = GetComponent("PlayerMovement");
		playerMovement.jumpTime *= 1.3;
		yield WaitForSeconds(15);
		playerMovement.jumpTime /= 1.3;
	}
	//a blast up adds to the blast gun ammo
	else if(itemType == "Blast Up")
	{
		bulletCount += count;
		if(bulletCount >= maxBulletCount)
		{
			bulletCount = maxBulletCount;
		}
	}
}

//function that makes the player blink when taking damage
function blink(times : int)
{
	//blink only if you can be hit
	if(!invincible)
	{
		isBlinking = true;
		var state : boolean = false; //the current state of rendered or not rendered
		invincible = true; //make the player temporarily invincible
		while(times > 0)
		{
			state = !state; //flip the state every iteration
			
			if(blinkSaber)
				saberHalf.renderer.enabled = state;
			else if(blinkSaberLeft)
				saberHalfLeft.renderer.enabled = state;
			renderer.enabled = state; //set the renderer to display every other time
			yield WaitForSeconds(.15);
			times--;
		}
		invincible = false;
		isBlinking = false;
		renderer.enabled = true;
	}
}

//function that makes the player move a bit when taking damage
function recoil(hitType : String, hit : Collision, upwardForce : int, directionForce : int, facingLeft : boolean)
{
	//only recoil if you can be hit
	if(!invincible)
	{
		var recoilLeft : boolean = false;  //the direction to recoil
		
		if(hitType == "Enemy")
		{
			recoilLeft = facingLeft;
		}
		else if(hitType == "Projectile")
		{
			if(hit.rigidbody.velocity.x < 0)
			{
				recoilLeft = true;
			}
		}	
		
		//recoil in an appropriate direction
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
}

//overloaded function that makes the player move a bit when taking damage, for Collider param
function recoil(hitType : String, hit : Collider, upwardForce : int, directionForce : int, facingLeft : boolean)
{
	//only recoil if you can be hit
	if(!invincible)
	{
		var recoilLeft : boolean = false;  //the direction to recoil
		
		if(hitType == "Enemy")
		{
			recoilLeft = facingLeft;
		}
		else if(hitType == "Projectile")
		{
			if(hit.rigidbody.velocity.x < 0)
			{
				recoilLeft = true;
			}
		}	
		
		//recoil in an appropriate direction
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
}