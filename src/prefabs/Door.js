class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.open = false;
         //Allows being activated more than once
        this.setBodySize(20, 17).setOffset(-1.8,0);
        this.interactable;
        this.lights;
        this.checklist = scene.buttonTracker //if there are no checklist then this will create an error
        this.locked = false;
  
        this.scene = scene;

        this.check = 0;
        this.setDepth(9); //Affects render order
    }

    update(time, delta){
        
        if(!this.scene.physics.overlap(this, this.interactable) && this.check != 0){
            this.open = false;
            this.check = 0;
            //console.log('close');
            this.scene.solidLayer.putTileAtWorldXY(9,this.x, this.y-10); //top of door
            this.scene.solidLayer.putTileAtWorldXY(9,this.x, this.y);
            this.scene.solidLayer.putTileAtWorldXY(9,this.x, this.y+10); //bottom
            //visual
            this.alpha= 1;
              
        }
        //checks if checklist has been completed// then door is open and
        if(this.locked){
            if(this.checklist.completed){
                this.locked = false;
            }
        }
    }

    activate(){
        if(!this.locked){
            this.check++;
            if(this.check == 1){
            if(!this.open){
                    this.open = true;
                    //console.log("open")
                    this.scene.sound.play('sfx_Door');
                    this.scene.solidLayer.putTileAtWorldXY(0,this.x, this.y-10); //top of door
                    this.scene.solidLayer.putTileAtWorldXY(0,this.x, this.y); //top of door
                    this.scene.solidLayer.putTileAtWorldXY(0,this.x, this.y+10); //bottom
                    // just to see some change
                    this.alpha= 0.0;

                }
            }   
        }
    }
    setCollision(interactables, toggle, checklist){
        this.interactable = interactables;
        this.scene.physics.add.overlap(this, this.interactable, this.activate, null, this);
        this.locked = toggle;
        this.checklist = checklist;

        if(this.locked){
            this.setDepth(10);
        }
    }
}



