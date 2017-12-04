/*
* A script for attaching to a check point game object.
*/

var checkpointNumber : int = 0; //the current checkpoint number this object represents
var location : Vector3; //the location of the checkpoint

function Awake()
{	
	location = transform.position; //load the checkpoint's location on creation
}