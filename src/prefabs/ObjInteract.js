/* An object the player can interact with to activate (such as a button) - Santiago*/
class ObjInteract extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        let dressedTextConfig = {
            fontSize: '9px',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }
        this.instructions = scene.add.text(this.x, this.y + 24, 'X: Activate', dressedTextConfig).setOrigin(0.5);
        this.instructions.alpha = 0;

        this.playerRef = this.scene.plrSpy
        this.activated = false;
        this.repeatable = false; //Allows being activated more than once
        this.body.allowGravity = false;
        this.activeTint = 0x444444;
    }

    update(time, delta){
        this.instructions.x = this.x;
        this.instructions.y = this.y + 24;
        //Can be interacted with if either not activated, or can be activated multiple times
        if(this.scene.physics.overlap(this, this.playerRef) && (!this.activated || this.repeatable)){
            this.instructions.alpha = 1;
            if(Phaser.Input.Keyboard.JustDown(keyInteract)){
                this.scene.sound.play('sfx_select');
                this.activate();
            }
        }
        else{
            this.instructions.alpha = 0;
        }
    }

    activate(){
        this.activated = true;
        this.setTint(this.activeTint);
        this.emit('objactivated');
    }
}