/*
* Script that creates a restriction of movement way point
* based on the four cardinal directions.
*/

//enum class holding the type of restriction
enum WayPointRestriction{left = 0, right = 1, up = 2, down = 3}

//this object's restriction type
var restriction : WayPointRestriction = WayPointRestriction.left;

//return the type of restriction this object has
function getRestrictionType()
{
	return restriction;
}

//set the type of restriciton of this object to something else
function setRestrictionType(direction : String)
{
	if(direction == "left")
		restriction = WayPointRestriction.left;
	else if(direction == "right")
		restriction = WayPointRestriction.right;
	else if(direction == "up")
		restriction = WayPointRestriction.up;
	else if(direction == "down")
		restriction = WayPointRestriction.down;

}