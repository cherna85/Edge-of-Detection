class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }


    create() {
        let CreditsConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
            fontFamily:  'PressStart2P', 
            fontSize: '24px',
            backgroundColor: null,
            color: '#72A046',
            shadow: {
                offsetX: -5,
                offsetY: 3,
                color: '#FFFFFF',
                blur: 25,
                stroke: true,
                fill: true
            }, padding: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50,
            },
        }
        this.add.text(game.config.width/2, game.config.height/2, 'CREDITS',CreditsConfig).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(PInteract);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}