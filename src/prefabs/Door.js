/* An object the player can interact with to activate (such as a button) - Santiago*/
class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tileX, tileY, interactables, locked = false, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.open = false;
         //Allows being activated more than once
        this.body.allowGravity = false;
        this.setBodySize(18, 30);
        this.scene = scene;
        this.tileX = tileX;
        this.tileY = tileY;

        this.check = 0;

        this.interactables = interactables

        scene.physics.add.overlap(this, this.interactables, this.activate, null, this);
        this.locked = locked;
        this.checklist = scene.buttonTracker;

    }

    update(time, delta){
        
        if(!this.scene.physics.overlap(this, this.interactables) && this.check != 0){
            this.open = false;
            this.check = 0;
            this.scene.objectLayer.putTileAt(9,this.tileX, this.tileY-1); //top of door
            this.scene.objectLayer.putTileAt(13,this.tileX, this.tileY); // handle 
              
        }
        //checks if checklist has been completed// then door is open and
        if(this.checklist.completed){
            this.locked = false;

        }
    }

    activate(){
        //insert door opening noise 
        if(!this.locked){
            this.check++;
            if(this.check == 1){
                if(!this.open){
                    this.open = true;
                    //to set open door tile, replace the 0 with the proper index
                    this.scene.objectLayer.putTileAt(0,this.tileX, this.tileY-1); // top of door
                    this.scene.objectLayer.putTileAt(0,this.tileX, this.tileY); // handle 
                }
                this.emit('objactivated');
            }
        }
    }
}



