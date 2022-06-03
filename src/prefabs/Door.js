class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,texture, frame) {
        super(scene, x, y, texture, frame);

        //Create open/close animations
        this.anims.create({
            key: 'open_wood',
            frames: this.anims.generateFrameNames('doors_atlas', {
                prefix: 'wood_',
                start: 2,
                end: 3,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: 'close_wood',
            frames: this.anims.generateFrameNames('doors_atlas', {
                prefix: 'wood_',
                start: 2,
                end: 1,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: 'open_metal',
            frames: this.anims.generateFrameNames('doors_atlas', {
                prefix: 'metal_',
                start: 2,
                end: 3,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: 'close_metal',
            frames: this.anims.generateFrameNames('doors_atlas', {
                prefix: 'metal_',
                start: 2,
                end: 1,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: 0,
        });

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
  
        this.isMetal = false;
        if(this.frame == 'metal_01'){
            this.isMetal = true;
        }

        this.scene = scene;

        this.check = 0;
        this.setDepth(9); //Affects render order
    }

    update(time, delta){
        //If not overlapping with interactable objects...
        if(!this.scene.physics.overlap(this, this.interactable) && this.check != 0){
            this.open = false;
            this.check = 0;
            // this places the solid door... back so raycasting is blocked
            this.scene.solidLayer.putTileAtWorldXY(47,this.x, this.y-10); //top of door
            this.scene.solidLayer.putTileAtWorldXY(47,this.x, this.y); // middle... if applicable
            this.scene.solidLayer.putTileAtWorldXY(47,this.x, this.y+10); //bottom
            //Play the door closed animation
            if(this.isMetal)
                this.anims.play('close_metal', true);
            else
                this.anims.play('close_wood', true);
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
                    //this replaces the solid door eith an invisible tile, 
                    //lets the raycaster go through
                    this.scene.solidLayer.putTileAtWorldXY(148,this.x, this.y-10); //top of door
                    this.scene.solidLayer.putTileAtWorldXY(148,this.x, this.y); //top of door
                    this.scene.solidLayer.putTileAtWorldXY(148,this.x, this.y+10); //bottom
                    if(this.isMetal)
                        this.anims.play('open_metal', true);
                    else
                        this.anims.play('open_wood', true);

                }
            }  
        }
    }

    setCollision(interactables, toggle, checklist){
        this.interactable = interactables;
        this.scene.physics.add.overlap(this, this.interactable, this.activate, null, this);
        //Function attached to overlap plays once when the objects overlap

        this.locked = toggle;
        this.checklist = checklist;

        if(this.locked){
            this.setDepth(10);
        }
    }
}



