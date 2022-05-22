/* An object the player can interact with to activate (such as a button) - Santiago*/
class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tileX, tileY,sizeW=10 ,sizeH=30, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerRef = this.scene.plrSpy
        this.open = false;
         //Allows being activated more than once
        this.body.allowGravity = false;
        this.setBodySize(sizeW, sizeH);
        this.scene = scene;
        this.tileX = tileX;
        this.tileY = tileY;

        
    }

    update(time, delta){
        //Can be interacted with if either not activated, or can be activated multiple times
        if(this.scene.physics.overlap(this, this.playerRef)){
            if(Phaser.Input.Keyboard.JustDown(keyInteract)){
                this.scene.sound.play('sfx_select');
                this.activate();
            }
        }
    }

    activate(){
        if(this.open){
            this.open = false;
            console.log("closed door");
            this.scene.objectLayer.putTileAt(9,this.tileX, this.tileY-1);
            this.scene.objectLayer.putTileAt(13,this.tileX, this.tileY);
            

        }else{
            this.open = true;
            console.log("open door");
            this.scene.objectLayer.putTileAt(0,this.tileX, this.tileY-1);
            this.scene.objectLayer.putTileAt(0,this.tileX, this.tileY);
        }
        this.emit('objactivated');
        // so the tile gets updated the the raycaster needs to updat
        this.scene.enemy1.enemyLOS.updateObjects();
    }
}



