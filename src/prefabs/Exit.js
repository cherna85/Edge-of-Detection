class Exit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.lock = false;
        this.checklist = scene.buttonTracker //if there are no checklist then this will create an error

         //Allows being activated more than once
        this.setBodySize(20, 30).setOffset(-1.8,0);
        //Sets up overlap between this and player. Changes this.switch to True
        scene.physics.add.overlap(this, scene.plrSpy, this.progress, null, this);
        this.switch = false;
        this.setDepth(-4); //Affects render order
    }

    setNextLevel(nextLevel, locked, checklist){
        sceneSelect = nextLevel;
        this.lock = locked;
        this.checklist = checklist
    }

    update(time, delta){
        if(this.lock){
            if(this.checklist.completed){
                this.lock = false;
            }
        }
    }
    progress(){
        if(!this.lock){
            this.switch = true;
        }
    }

 
}
