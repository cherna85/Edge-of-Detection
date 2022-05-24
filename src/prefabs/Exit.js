class Exit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.open = false;
         //Allows being activated more than once
        this.setBodySize(20, 30).setOffset(-1.8,0);
        scene.physics.add.overlap(this, scene.plrSpy, this.progress, null, this);
        this.switch = false;

    }
    setNextLevel(nextLevel){
        sceneSelect = nextLevel;
    }

    update(time, delta){
        
    }
    progress(){
        this.switch = true;
    }

 
}
