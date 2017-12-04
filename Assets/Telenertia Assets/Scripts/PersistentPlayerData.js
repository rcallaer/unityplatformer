/*
* A script to attack to a persistent object that will survive
* through multiple levels and hold the player's current stats
* and weapon pickup data.
*/

var playerFoundGun : boolean = false; //whether player has found the blast gun
var playerFoundSaber : boolean = false; //whether player has found the energy saber
var playerCurrentLives : int = 5; //the lives the player currently has
var playerHealth : int = 50; //the player's current health
var playerRockCount : int = 10; //player's rock ammo
var playerBulletCount : int = 15; //player's blast gun ammo

var playerStats : PlayerStats;
var playerMoves : PlayerMovement;

function Awake()
{
	//this line allows the object to persist between levels
	DontDestroyOnLoad(transform.gameObject);
	
	playerStats = GameObject.FindWithTag("Player").GetComponent("PlayerStats");
	playerMoves = GameObject.FindWithTag("Player").GetComponent("PlayerMovement");
	
}

function Update()
{
	//every frame keep a record of the data to persist and store it in this script
	playerCurrentLives = playerStats.lives;
	playerFoundGun = playerMoves.canWieldGun;
	playerFoundSaber = playerMoves.holdingSaber;
	playerHealth = playerStats.health;
	playerRockCount = playerStats.rockCount;
	playerBulletCount = playerStats.bulletCount;
}