/*
* Script for the behavior of items that can be picked up.
*/

var pickedUp : boolean = false;
var itemType : String = "";
var itemCount : int = 0;
var respawnSeconds : float = 0;
var playerStats : PlayerStats;

function Awake()
{
	playerStats = FindObjectOfType(PlayerStats);
}

function OnCollisionEnter(hit : Collision) 
{
	if  (hit.transform.tag == "Enemy") 
	{
		//TODO dont want to collide with enemy
		Physics.IgnoreCollision(hit.collider,collider);
	}
	else if(hit.transform.tag == "Needle")
	{
		Physics.IgnoreCollision(hit.collider,collider);
	}

	//allow the player to pick up when hit
	else if(hit.transform.tag == "Player")
	{
		if(!isPickedUp())
		{
			audio.Play(); //sound effect
			pickUp();
			playerStats.pickUpItem(getItem(), getCount());
			
			if(respawnSeconds > 0)
				Respawn(respawnSeconds);
			else
			{	
				//disabling the renderer should disable the collider and its visibility
				renderer.enabled = false;
	
				//just to be sure you can also set the isTrigger property
				collider.isTrigger = true; 
				
				Destroy(gameObject,0.5);
			}
		}
	}
}

function Respawn(seconds : float)
{
	//disabling the renderer should disable the collider and its visibility
	renderer.enabled = false;
	
	//just to be sure you can also set the isTrigger property
	collider.isTrigger = true; 
	
	//wait for so many seconds before enabling the object again
	yield WaitForSeconds(seconds);
	
	renderer.enabled = true;
	collider.isTrigger = false;
	
	pickedUp = false;
}

function isPickedUp() 
{
	return pickedUp;
}

//which type of item this is
function getItem() 
{
	return itemType;
}

//the amount this pickup gives
function getCount() 
{
	return itemCount;
}

//set already picked up
function pickUp() 
{
	pickedUp = true;
}