class Endscreen extends Phaser.Scene {
    constructor() {
        super('endscreenScene');
    }


    create() {
        let EndConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
            fontFamily:  'PressStart2P', 
            fontSize: '38px',
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
        this.add.text(game.config.width/2, game.config.height/2-64, 'Congratulations', EndConfig).setOrigin(0.5);
        EndConfig.fontSize = '16px';
        EndConfig.shadow.color = '#000000';
        this.add.text(game.config.width/2, game.config.height/2+32, 'Press [' + PDisguiseT + '] to go to Main Menu', EndConfig).setOrigin(0.5);
        keyDisguise = this.input.keyboard.addKey(PDisguise);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyDisguise)) {
            this.scene.start('menuScene');    
        }
    }

}