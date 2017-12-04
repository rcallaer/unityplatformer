/*
* A script that controls the player's movement and animation.
* The code used for animating 2D sprites I found in a 
* tutorial video I watched online (mostly the ChangeFrame function 
* and the idea of using an array of textures).
*/

var moveSpeed : float = 10; // move speed per second
var maxVelocity : float = 8; //maximum speed the player can move
var jumpTime : float = 2; // time spent in the air
var jumpFrame : int = 3; //frame used when jumping
var curFrame : int = 0; // current animation frame
var frameTime : float = .25; // time to spend per frame
var projectileSpeed : float = 15; //speed of projectiles
var rockSpeed : float = 15; //default speed of rocks
var gunSpeed : float = 20; //speed of gun blasts

var altTextures : Texture[]; // Holds right-facing textures
var mainTextures : Texture[]; // Holds left-facing textures
var attackTextures : Texture[];//Holds right short range attack textures
var attackLeftTextures : Texture[];//Holds left short range attack textures
var gunTextures : Texture[];//Holds right gun textures
var gunLeftTextures : Texture[];//Holds right gun textures
var saberTextures : Texture[]; //Holds right saber textures
var saberLeftTextures : Texture[]; //Holds left saber textures
var saberHalf : Texture[]; //Holds second half right saber textures
var saberHalfLeft : Texture[]; //Holds second half left saber textures
var projectile : GameObject; //projectile to create
var gunblastLeft: GameObject; //gun projectile to create, facing left
var gunblastRight: GameObject; //gun projectile to create, facing right
var attackTextureLeft : Texture;
var attackTextureRight : Texture;

var jumping : boolean = false; //currently jumping or not
var facingLeft : boolean = false; //facing left or right
var canMove : boolean = true; //player is allowed to move
var attacking : boolean = false; //player is currently attacking or not
var holdingGun : boolean = false; //using the blast gun
var holdingSaber : boolean = false; //using the energy saber
var canWieldSaber : boolean = false; //able to use the energy saber
var canWieldGun : boolean = false; //able to use the blast gun
var displayCheckpoint : boolean = false; //displaying the checkpoint message
var killSaberFlicker : boolean = false; //need to blink the saber when damaged
var killSaberFlickerLeft : boolean = false; //need to blink the saber when damaged

var canMoveLeft : boolean = true; //alowed to move left
var canMoveRight : boolean = true; //allowed to move right

var playerCheckpoint : int = 0; //the player's current checkpoint reached

//enum class for player's moves/status
enum PlayerStatus {Idle = 0, Moving = 1, Jumping = 2, Attacking = 3}
var currentStatus : int;
var playerStats : PlayerStats;
var attackScript : AnimatingTextures;
var pauseMenu : PauseMenu;
var saberSecondHalf : GameObject;
var saberSecondHalfLeft : GameObject;

function Start()
{
	//prevent cursor from being onscreen
	Screen.showCursor = false;
	pauseMenu = FindObjectOfType(PauseMenu);
	
	ChangeFrame(); // run the animation function
}

function Awake()
{
	//get necessary components/objects on creation
	playerStats = GetComponent("PlayerStats");
	saberSecondHalf = GameObject.Find("SaberHalf");
	saberSecondHalfLeft = GameObject.Find("SaberHalfLeft");
}

function FixedUpdate()
{
	transform.position.z = 0;
}

function Update() 
{
	//only allow movement if the game is not paused
	if(!pauseMenu.isGamePaused())
	{
		if(canMove)
		{
			// If the player presses left
			if (Input.GetKey(KeyCode.LeftArrow)) 
			{ 
				killSaberFlicker = killSaberFlickerLeft = true;
				saberSecondHalf.renderer.enabled = false;
				saberSecondHalfLeft.renderer.enabled = false;
				if(canMoveRight == false)
					canMoveRight = true;
					
				if(canMoveLeft)
				{
					//left/right velocity shouldn't exceed the maximum
					if(rigidbody.velocity.x > -maxVelocity)
					{
						rigidbody.AddForce(transform.right* moveSpeed, ForceMode.Impulse );
					}
					facingLeft = true; // face left
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunLeftTextures[curFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = mainTextures[curFrame]; // Get the current animation frame
				}
			}
			// If the player pressed right
			else if (Input.GetKey(KeyCode.RightArrow)) 
			{ 
				killSaberFlicker = killSaberFlickerLeft = true;
				saberSecondHalf.renderer.enabled = false;
				saberSecondHalfLeft.renderer.enabled = false;
				if(canMoveLeft == false)
					canMoveLeft = true;
				
				if(canMoveRight)
				{
					//left/right velocity shouldn't exceed the maximum
					if(rigidbody.velocity.x < maxVelocity)
					{
						//make the player move right
						rigidbody.AddForce(-transform.right * moveSpeed, ForceMode.Impulse );
					}
					facingLeft = false; // face right
					
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunTextures[curFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = altTextures[curFrame]; // Get the current animation frame
				}
			}
			// if the player's not moving or jumping, set to stationary frame
			else if(!jumping)
			{ 
				killSaberFlicker = killSaberFlickerLeft = true;
				saberSecondHalf.renderer.enabled = false;
				saberSecondHalfLeft.renderer.enabled = false;
				rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); // Stop moving
				if (facingLeft) 
				{ 
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunLeftTextures[curFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = mainTextures[curFrame]; // Reset to the left frame
				}
				else 
				{ 
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunTextures[curFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = altTextures[curFrame]; // Reset to the right frame
				}
			}
		
		
			var facingDirection;
			var hit : RaycastHit;
			
			if(facingLeft)
				facingDirection = transform.right;
			else
				facingDirection = -transform.right;
				
			//use raycast to prevent player from getting stuck on walls all the time
			if (Physics.Raycast (transform.position, facingDirection, hit, 0.5)) 
			{
				if(hit.transform.tag == "Vertical" || hit.transform.tag == "Untagged"
					&& hit.transform.name != "Crohk Attack Point")
				{
					if(facingLeft)
						canMoveLeft = false;
					else
						canMoveRight = false;
				}
			}
			else
			{
				if(facingLeft)
					canMoveLeft = true;
				else
					canMoveRight = true;
			}
			
			//if the player status is currently attacking
			if(currentStatus == PlayerStatus.Attacking)
			{
				//prevent the current frame from exceeding the length of the attacking textures
				if(curFrame > attackTextures.length - 1)
				{
					curFrame = curFrame%attackTextures.length;
				}
				
				//using the saber weapon
				if(holdingSaber)
				{
					//change the texture to the attack texture of the current frame
					if(!facingLeft)
					{
						killSaberFlicker = false;
						
						saberSecondHalf.renderer.enabled = true;
						saberSecondHalf.renderer.material.mainTexture = saberHalf[curFrame];
						renderer.material.mainTexture = saberTextures[curFrame];
					}
					else
					{
						killSaberFlickerLeft = false;
						
						saberSecondHalfLeft.renderer.enabled = true;
						saberSecondHalfLeft.renderer.material.mainTexture = saberHalfLeft[curFrame];
						renderer.material.mainTexture = saberLeftTextures[curFrame];
					}
				}
				//using the normal stick
				else
				{
					//change the texture to the attack texture of the current frame
					if(!facingLeft)
					{
						renderer.material.mainTexture = attackTextures[curFrame];
					}
					else
					{
						renderer.material.mainTexture = attackLeftTextures[curFrame];
					}
				}
				
			}
			//when player is not attacking, switch the textures back
			else
			{
				killSaberFlicker = killSaberFlickerLeft = true;
				saberSecondHalf.renderer.enabled = false;
				saberSecondHalfLeft.renderer.enabled = false;
				if(facingLeft)
				{
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunLeftTextures[curFrame];
					else
						renderer.material.mainTexture = mainTextures[curFrame];
				}
				else
				{
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunTextures[curFrame];
					else
						renderer.material.mainTexture = altTextures[curFrame];
				}
			}

			// If the player presses space, jump
			if (Input.GetKeyDown(KeyCode.Space) && !jumping) 
			{ 
				jumping = true;
				
				//allow for the different textures while jumping
				if (facingLeft) 
				{ 
					if(canWieldGun && holdingGun)
							renderer.material.mainTexture = gunLeftTextures[jumpFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = mainTextures[jumpFrame]; // show jump frame
				}
				else 
				{
					if(canWieldGun && holdingGun)
						renderer.material.mainTexture = gunTextures[curFrame]; // Get the current animation frame
					else
						renderer.material.mainTexture = altTextures[jumpFrame]; //show jump frame
				}
				rigidbody.AddForce(-Physics.gravity.y*Vector3.up * jumpTime, ForceMode.Impulse);
			}
			
			//player presses the button to use long range weapon
			if (Input.GetKeyDown(KeyCode.Z))
			{
				if(canWieldGun && holdingGun)
				{
					if(playerStats.shootBullet())
						PlayAnim("GunBlast");
				}
				else
				{
					if(playerStats.throwRock()) 
						PlayAnim("ThrowProjectile");
				}
			}
			
			//player presses the button to use short range attack
			if(Input.GetKeyDown(KeyCode.X))
			{
				if(holdingSaber)
					PlayAnim("SwingSaber");
				else
					PlayAnim("SwingWeapon");
			}
			
			//if the player can use the gun, switch between it and the rocks with Up/Down
			if(Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.DownArrow))
			{
				if(canWieldGun)
					SwitchProjectileWeapon();
			}
			
			//prevent player from falling too fast
			if(rigidbody.velocity.y < -15)
			{
				rigidbody.velocity.y = -15;
			}
			transform.position.z = 0; // fix movement to x-y axis
		}
		
		//player pauses the game
		if (Input.GetKeyDown(KeyCode.P))
		{
			if(Time.timeScale==1) 
			{
				pauseMenu.pauseGame();
			}	
			else 
			{
				pauseMenu.resumeGame();
			}
			
		}
	
	}
}

function ChangeFrame() // animation function
{
	// While the object exists
	while (true) 
	{ 
		// player is attacking
		if(currentStatus == PlayerStatus.Attacking)
		{
			curFrame += 1; // Increase the frame number
			
			// If the last attacking frame has been reached
			if (curFrame >= attackTextures.length) 
			{ 
				curFrame = 0; 
				currentStatus = PlayerStatus.Idle;
			}
		}
		// player is moving
		else if (Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.RightArrow) ) 
		{
			curFrame += 1; // Increase the frame number
			
			// If the last frame has been reached
			if (curFrame >= altTextures.length) 
			{ 
				curFrame = 0; // Move back to the first frame
			}
		}
		// the player isn't moving, jumping, or attacking
		else if(!jumping)
		{ 
			curFrame = 0; // reset to the stationary frame
		}
		yield WaitForSeconds(frameTime); // wait for the time per frame
	}
}

//switch between the gun and rock weapons
function SwitchProjectileWeapon()
{
	if(holdingGun)
	{
		holdingGun = false;
		projectileSpeed = rockSpeed;
	}
	else
	{
		holdingGun = true;
		projectileSpeed = gunSpeed;
	}
}

//switch to the saber weapon
function SwitchMeleeWeapon()
{
	if(holdingSaber)
	{
		holdingSaber = false;
	}
	else
	{
		holdingSaber = true;
	}
}

//play an animation for attacking
function PlayAnim(animType : String)
{
	//swing normal stick
	if(animType == "SwingWeapon")
	{
		curFrame = 0; //make sure the frame starts at the beginning of the animation
		currentStatus = PlayerStatus.Attacking; //use to show the textures
		var swingAudio : Transform = transform.Find("SwingSound");

		swingAudio.audio.Play();
		
		//create a cube with a collider that corresponds to the attacking texture
		var swordSwing : GameObject  = GameObject.CreatePrimitive(PrimitiveType.Cube);
		swordSwing.transform.tag = "SwingWeapon";
		swordSwing.collider.isTrigger = true;
		swordSwing.transform.localScale = Vector3(0.7,1,1); //resize
		swordSwing.renderer.material.shader = Shader.Find("Transparent/Diffuse"); //get the transparent shader
		swordSwing.renderer.material.color.a = 0; //set alpha channel to fully transparent

		//set the cube's position to match the texture
		if(facingLeft)
		{
			swordX = transform.position.x - 0.8;
			swordY = transform.position.y - 0.4;
			swordZ = transform.position.z;
		}
		else
		{
			swordX = transform.position.x + 0.8;
			swordY = transform.position.y - 0.4;
			swordZ = transform.position.z;
		}
		
		//move cube to position
		swordSwing.transform.Translate(Vector3(swordX,swordY,swordZ));
		swordSwing.transform.parent = transform; //make the cube a child of the player
				
		//destroy after so many seconds
		Destroy(swordSwing, 0.5);
	}
	//swing saber weapon
	else if(animType == "SwingSaber")
	{
		curFrame = 0; //make sure the frame starts at the beginning of the animation
		currentStatus = PlayerStatus.Attacking; //use to show the textures
		swingAudio = transform.Find("SaberHalf");

		swingAudio.audio.Play();
		
		//create a cube with a collider that corresponds to the attacking texture
		swordSwing = GameObject.CreatePrimitive(PrimitiveType.Cube);
		swordSwing.transform.tag = "SwingSaber";
		swordSwing.collider.isTrigger = true;
		swordSwing.transform.localScale = Vector3(1.4,1.5,1); //resize
		swordSwing.renderer.material.shader = Shader.Find("Transparent/Diffuse"); //get the transparent shader
		swordSwing.renderer.material.color.a = 0; //set alpha channel to fully transparent

		//set the cube's position to match the texture
		if(facingLeft)
		{
			swordX = transform.position.x - 1.4;
			swordY = transform.position.y - 0.3;
			swordZ = transform.position.z;
		}
		else
		{
			swordX = transform.position.x + 1.4;
			swordY = transform.position.y - 0.3;
			swordZ = transform.position.z;
		}
		
		//move cube to position
		swordSwing.transform.Translate(Vector3(swordX,swordY,swordZ));
		swordSwing.transform.parent = transform; //make the cube a child of the player
				
		//destroy after so many seconds
		Destroy(swordSwing, 0.5);
	}
	//throw a rock
	else if(animType == "ThrowProjectile")
	{
		var clone : GameObject;
		
		// find and play the audio for the projectile
		var throwAudio : Transform = transform.Find("ThrowSound");
		throwAudio.audio.Play();
			
		// instantiate the projectile at the position and rotation of the player
		clone = Instantiate(projectile, transform.position, transform.rotation);
		clone.rigidbody.freezeRotation = true;
		Physics.IgnoreCollision(clone.collider, transform.root.collider);
		
		// give the projectile an initial velocity
		if(facingLeft)
			clone.rigidbody.velocity = Vector3(-projectileSpeed, 0, 0);
		else
			clone.rigidbody.velocity = Vector3(projectileSpeed, 0, 0);
		
		// set the projectile to be destroyed
		Destroy(clone, 4);
	}
	//shoot the blast gun
	else if(animType == "GunBlast")
	{
		// find and play the audio for the projectile
		var gunAudio : Transform = transform.Find("GunSound");
		gunAudio.audio.Play();

		// instantiate the projectile at the position and rotation of the player
		if(facingLeft)
		{
			clone = Instantiate(gunblastLeft, transform.position, transform.rotation);
			clone.transform.Translate(Vector3(1,0,0.5));
			clone.rigidbody.velocity = Vector3(-projectileSpeed, 0, 0);
		}
		else
		{
			clone = Instantiate(gunblastRight, transform.position, transform.rotation);
			clone.transform.Translate(Vector3(-1,0,0.5));
			clone.rigidbody.velocity = Vector3(projectileSpeed, 0, 0);
		}
	}
}

function OnCollisionEnter(hit : Collision) 
{
	//if the player hits any part of the boss, take damage
	for (var contact : ContactPoint in hit.contacts) 
	{
		if  (contact.otherCollider.name == "GruxBossWithControl" || contact.otherCollider.name == "GruxBossLegs" 
			|| contact.otherCollider.name == "GruxBossEye" || contact.otherCollider.name == "GruxBossBack"  
			|| contact.otherCollider.name == "GruxBossBody") 
		{
			playerStats.takeDamage();
		
			if(jumping)
				playerStats.recoil("Enemy",hit,30,100,facingLeft);
			else
				playerStats.recoil("Enemy",hit,50,150,facingLeft);
				
			playerStats.blink(10);
			
		}
	}
		
	//if the player's jumping when he hit something, bring to a stop
	if(jumping)
	{
		rigidbody.velocity = Vector3(0, rigidbody.velocity.y, 0); 
	}
	if (hit.transform.tag == "Platform" || hit.transform.tag == "BossPlatformTop" ) 
	{ 
		jumping = false; // Make it possible to jump again
	}
	if (hit.transform.tag == "AngledPlatform") 
	{ 
		jumping = false; // Make it possible to jump again
		moveSpeed = moveSpeed*2;
	}
	//if the player hits an enemy, take damage
	else if  (hit.transform.tag == "Enemy" || hit.transform.tag == "Boss" 
			|| hit.transform.tag == "BossLegs" || hit.transform.tag == "BossEye"  ) 
	{
		playerStats.takeDamage();
		
		if(jumping)
			playerStats.recoil("Enemy",hit,30,100,facingLeft);
		else
			playerStats.recoil("Enemy",hit,50,150,facingLeft);
			
		playerStats.blink(10);
		
	}
	//if the player hits a needle, take damage
	else if(hit.transform.tag == "Needle")
	{
		hit.rigidbody.velocity = Vector3(0, hit.rigidbody.velocity.y, 0); 
		playerStats.takeDamage();
		
		if(jumping)
			playerStats.recoil("Projectile",hit,30,100,facingLeft);
		else
			playerStats.recoil("Projectile",hit,50,150,facingLeft);
			
		playerStats.blink(10);
		
		hit.transform.parent = transform;
		
		Destroy(hit.gameObject);
	}
	//if the player falls into a pit die instantly
	else if(hit.transform.tag == "InstantDeath")
	{
		playerStats.health = 0;
	}
}

function OnCollisionStay(hit : Collision)
{
	//when you you're on a platform, make sure you're not jumping
	if (hit.transform.tag == "Platform"|| hit.transform.tag == "BossPlatformTop" 
	  || hit.transform.tag == "AngledPlatform" || hit.transform.tag == "Enemy"
	  || hit.transform.tag == "Boss" || hit.transform.tag == "BossBack" 
	  || hit.transform.tag == "BossBody" || hit.transform.tag == "BossEye") 
	{ 
		jumping = false; 
	}
	//if the player stays on an enemy, take damage
	else if  (hit.transform.tag == "Enemy" || hit.transform.tag == "Boss" 
			|| hit.transform.tag == "BossLegs" || hit.transform.tag == "BossEye"  ) 
	{
		playerStats.takeDamage();
		
		if(jumping)
			playerStats.recoil("Enemy",hit,30,100,facingLeft);
		else
			playerStats.recoil("Enemy",hit,50,150,facingLeft);
			
		playerStats.blink(10);
	}
	
}

function OnCollisionExit(hit : Collision)
{
	//when you leave a platform, make it think you're jumping
	if (hit.transform.tag == "Platform" || hit.transform.tag == "BossPlatformTop" 
		|| hit.transform.tag == "Boss" || hit.transform.tag == "BossBack" 
		|| hit.transform.tag == "BossBody" || hit.transform.tag == "BossEye") 
	{ 
		jumping = true; 
	}
	//when you leave a platform, make it think you're jumping
	else if (hit.transform.tag == "AngledPlatform") 
	{ 
		jumping = true; 
		moveSpeed = moveSpeed/2;
	}
	//when you leave an enemy, make it think you're jumping
	if (hit.transform.tag == "Enemy") 
	{ 
		jumping = true; 
	}
}

function OnTriggerEnter(hit : Collider)
{
	//if the player hits an enemy take damage
	if  (hit.transform.tag == "FlyingEnemy") 
	{
		playerStats.takeDamage();
		
		if(jumping)
			playerStats.recoil("Enemy",hit,30,100,facingLeft);
		else
			playerStats.recoil("Enemy",hit,50,150,facingLeft);
			
		playerStats.blink(10);
	}
	//if the player hits a new checkpoint update his checkpoint number
	else if  (hit.transform.tag == "CheckPoint") 
	{
		var checkPointScript : CheckPoint = hit.GetComponent("CheckPoint");
		
		if(checkPointScript.checkpointNumber > playerCheckpoint)
		{
			playerCheckpoint = checkPointScript.checkpointNumber;
			displayCheckpoint = true;
			
			yield WaitForSeconds(2);
			
			displayCheckpoint = false;
		}
	}
	//if the player hits the boss trigger, play through the boss events
	else if (hit.transform.tag == "BossTrigger")
	{
		var bossDoor : SpawnPoint = GameObject.FindWithTag("BossDoorSpawn").GetComponent("SpawnPoint");
		var maps : GameObject[] = GameObject.FindGameObjectsWithTag("Map");
		
		for(var map in maps)
		{
			map.audio.Stop();
		}
		
		bossDoor.Spawn();
		hit.GetComponent("DisableBehavior").DisableTrigger();
		
		canMove = false;
		
		if(holdingGun)
			renderer.material.mainTexture = gunTextures[curFrame]; // Get the current animation frame
		else
			renderer.material.mainTexture = altTextures[curFrame];

		yield WaitForSeconds(3);
		
		var bossSpawn : SpawnPoint = GameObject.FindWithTag("BossSpawnPoint").GetComponent("SpawnPoint");
		bossSpawn.Spawn();
		
		yield WaitForSeconds(5);
		var boss : GameObject = GameObject.FindWithTag("BossWithControl");
		var bossScript : GruxorBossMovement = boss.GetComponent("GruxorBossMovement");
		
		boss.audio.Play();
		yield WaitForSeconds(boss.audio.clip.length);
		bossScript.BeginMoving();
		bossSpawn.audio.Play();
		canMove = true;
	}
}
