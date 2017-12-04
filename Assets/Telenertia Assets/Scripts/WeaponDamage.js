/*
* A script to handle the damage amounts for each type of weapon. 
* Should be applied to any enemy in the scene so that amounts of
* damage for each enemy can vary.
*/

var rockDamage : int = 5; //rock weapon
var stickDamage : int = 6; //stick weapon
var gunDamage : int []; //gun weapon(s)
var saberDamage : int = 10; //saber weapon

//returns the amount of damage specified by the passed weapon type
function returnDamage(wType : String) : int
{
	if(wType == "Projectile")
		return rockDamage;
	else if(wType == "SwingWeapon")
		return stickDamage;
	else if(wType == "BlastGun")
		return gunDamage[0];
	else if(wType == "SwingSaber")
		return saberDamage;
}