class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'CREDITS').setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(PInteract);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}