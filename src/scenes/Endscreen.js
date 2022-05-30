class Endscreen extends Phaser.Scene {
    constructor() {
        super('endscreenScene');
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'Congratulations').setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2+32, 'Press Z to go to Main Menu').setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(PUp);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}