/*
* This script runs through several after-events once a boss
* is defeated.
*/

var bossIsDead : boolean = false;
var displayMessage1 : boolean = false;
var displayMessage2 : boolean = false;
var audioFile : AudioClip;
var bossSound : AudioClip;

//var playerStats : PlayerStats;

function Awake()
{
	//playerStats = GameObject.FindWithTag("Player").GetComponent("PlayerStats");
}

function Update()
{
	//once the boss is dead, run through the events
	//if(bossIsDead && !playerStats.isDead())
	if(bossIsDead)
	{
		Victory();
	}
}

function Victory()
{
	//stop playing the boss music
	audio.Stop();
	
	//ensure that the events don't happen again
	bossIsDead = false; 
	
	//create a new one-shot sound effect to play the boss' death groan
	var g = GameObject("Boss Audio");
	g.transform.position = transform.position;
	var source : AudioSource = g.AddComponent(AudioSource);
	source.clip = bossSound;
    source.volume = 0.9;
	source.pitch = 0.3;
    source.Play ();
	Destroy (g, bossSound.length*2); //destroy the sound effect a little bit after it finishes
	
	//wait until the sound effect has finished or so
	yield WaitForSeconds(bossSound.length);
	
	//then load and play  the victory music
	var g2 = GameObject("Victory Audio");
	g2.transform.position = transform.position;
	var source2 : AudioSource = g2.AddComponent(AudioSource);
	source2.clip = audioFile;
    source2.volume = 0.9;
    source2.Play ();
	
	yield WaitForSeconds(1);
	
	////display first message
	displayMessage1 = true;
	yield WaitForSeconds(5);
	displayMessage1 = false;
	
	//spawn the level exit
	var levelExitSpawn : SpawnPoint = GameObject.FindWithTag("LevelExitSpawn").GetComponent("SpawnPoint");
	levelExitSpawn.Spawn();
	
	yield WaitForSeconds(1.5);
	
	//display second message
	displayMessage2 = true;
	yield WaitForSeconds(1.5);
	displayMessage2 = false;
	
	Destroy (g2, audioFile.length); //destroy the music after it finishes
}

function OnGUI()
{
	var foundText;
	if(displayMessage1)
	{
		foundText = "Oh, I think that monster dropped the part that I needed! Sweet!";
		GUI.Box(Rect((Screen.width/2) - 50,(Screen.height/2)-100,400,30),foundText);
	}
	if(displayMessage2)
	{
		foundText = "Alright, let's get out of here!";
		GUI.Box(Rect((Screen.width/2) - 50,(Screen.height/2)-100,400,30),foundText);
	}
}