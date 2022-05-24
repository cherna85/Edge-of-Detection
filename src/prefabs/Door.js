/* An object the player can interact with to activate (such as a button) - Santiago*/
class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.open = false;
         //Allows being activated more than once
        this.setBodySize(6, 17).setOffset(5,0);
        this.interactable;
  
        this.scene = scene;

        this.check = 0;

        
        //this.locked = locked;

    }

    update(time, delta){
        
        if(!this.scene.physics.overlap(this, this.interactable) && this.check != 0){
            this.open = false;
            this.check = 0;
            //this.scene.objectLayer.putTileAt(9,this.tileX, this.tileY-1); //top of door
            //this.scene.objectLayer.putTileAt(13,this.tileX, this.tileY); // handle 
            console.log('close');
              
        }
        // //checks if checklist has been completed// then door is open and
        // if(this.checklist.completed){
        //     this.locked = false;

        //}
    }

    activate(){
        // if(!this.locked){
        this.check++;
        if(this.check == 1){
           if(!this.open){
                this.open = true;
                console.log("open")
                //heres where you put the open door sprite
            }
        }   
        // }
    }
    setCollision(interactables){
        this.interactable = interactables;
        this.scene.physics.add.overlap(this, this.interactable, this.activate, null, this);
        console.log("hey");
    }
}



