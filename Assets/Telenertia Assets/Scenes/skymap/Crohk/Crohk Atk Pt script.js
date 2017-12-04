var spawnObject : GameObject;
var howHigh : int;
private var shouldSpawn : boolean = true;


function OnTriggerEnter(other:Collider)
{
	if(other.CompareTag("Player"))
	{
		if(shouldSpawn)
		{
			Instantiate(spawnObject,Vector3(transform.position.x,transform.position.y+howHigh,transform.position.z),transform.rotation);
			shouldSpawn =false;
			renderer.enabled = false;
			yield WaitForSeconds(8);
			renderer.enabled = true;
			shouldSpawn = true; 
		}
		
	}
}

function OnCollisionEnter(hit : Collision)
{  
	/*
	if(hit.transform.tag == "Player")
	{
		Instantiate(spawnObject,Vector3(transform.position.x,transform.position.y+howHigh,transform.position.z),transform.rotation);
		Destroy(gameObject);
		
		//make a crohk
		//kill self wait 10 sec respawn.
		
		
	} */
	
	if(hit.transform.tag == "Enemy" || hit.transform.tag == "projectile")
	{
		Physics.IgnoreCollision(hit.collider, collider);
	}
	
	
	
}