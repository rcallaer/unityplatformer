/*
* A script to hanlde the automatic creation of game objects.
*/

var spawnObject : GameObject; //the object that will be created
var secondsBetweenSpawns : float = 15; //time to wait between each object spawn
var spawnContinuous : boolean = true; //whether or not to continuously spawn objects
var spawnOnAwake : boolean = true; //whether or not to spawn when this object is created
var spawnRandomly : boolean = false; //whether or not to create the object at random
var addVelocity : boolean = false; //whether or not to add velocity to the object
var disableKinematic : boolean = false; //whether or not to disable any kinematic property

var randomProbability : int = 99990; // the probability variable for the random spawning
var initialVelocity : Vector3; //the initial velocity to give the object if AddVelocity is set to true

function Awake()
{
	//spawn once on creation if awake is set to true
	if(spawnOnAwake)
		Spawn();
}

function Update () 
{
	//spawn after so many seconds if continuous is set to true
	if(spawnContinuous)
		Spawn(secondsBetweenSpawns);
	//spawn randomly if random is set to true
	else if(spawnRandomly)
		SpawnRandom(randomProbability);
}

//spawn the spawn object at this object's location while waiting for
//the specified number of seconds 
function Spawn(seconds : float)
{
	spawnContinuous = false;
	
	//create the object
	var clone;
	clone = Instantiate(spawnObject,transform.position,transform.rotation);
	
	//apply any additional properties to the object
	if(addVelocity)
		clone.rigidbody.velocity = initialVelocity;
	if(disableKinematic && clone.rigidbody.isKinematic)
		clone.rigidbody.isKinematic = false;
		
	yield WaitForSeconds(seconds);
	
	spawnContinuous = true;
}

//spawn the spawn object at this object's location once
function Spawn()
{
	var clone;
	
	clone = Instantiate(spawnObject,transform.position,transform.rotation);
	
	if(addVelocity)
		clone.rigidbody.velocity = initialVelocity;
	if(disableKinematic && clone.rigidbody.isKinematic)
			clone.rigidbody.isKinematic = false;
}

//spawn an object specified by parameter
function Spawn(object : GameObject, objPosition : Vector3, objRotation : Quaternion , seconds : float)
{
	var clone;
	clone = Instantiate(object,objPosition,objRotation);
	
	if(addVelocity)
		clone.rigidbody.velocity = initialVelocity;
	if(disableKinematic && clone.rigidbody.isKinematic)
		clone.rigidbody.isKinematic = false;
}

//spawn the spawn object randomly, with the specified probability
function SpawnRandom(probability : int)
{
	var spawnChance = Random.Range(0,100000);
	var clone;
	
	if(spawnChance > probability)
	{ 
		clone = Instantiate(spawnObject,transform.position,transform.rotation);
		
		if(addVelocity)
			clone.rigidbody.velocity = initialVelocity;
		if(disableKinematic && clone.rigidbody.isKinematic)
			clone.rigidbody.isKinematic = false;
	}
}
